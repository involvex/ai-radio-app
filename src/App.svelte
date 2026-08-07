<script lang="ts">
import { onMount } from "svelte";
import { ttsToBlob, VOICES, parseScriptToSegments, ttsToBlobMulti, ttsEdge, ttsHttpFallback, ttsWebSpeech, type SpeakerSegment } from "./lib/edge-tts-client";
import { STAGE_ORDER, GENERATING_SPEECH_STAGE_INDEX, type GenerationStage } from "./lib/generation-stages";
import { loadSettings, saveSettings, invokeGenerateScript, type AppSettings } from "./lib/settings";
import { getAllEpisodes, saveEpisode, deleteEpisode as dbDeleteEpisode, toggleFavorite as dbToggleFavorite, type Episode } from "./lib/db";
import { exportData, downloadSyncFile, importData } from "./lib/sync";
import { createShowZip, downloadZip } from "./lib/zip-export";
import { getRandomTopic, getCategories, getRandomTopicByCategory, getTopicsByCategory, getAllCategories, type TopicCategory } from "./lib/topics";
import { fetchLinkContent } from "./lib/scraper";
import { onLocalLLMReady, onLocalLLMError } from "./lib/local-llm";
import { generateCoverCanvas, canvasToDataURL, type CoverOptions } from "./lib/cover-generator";
import ModelManager from "./components/ModelManager.svelte";
import GenerationProgress from "./components/GenerationProgress.svelte";
import AudioVisualizer from "./components/AudioVisualizer.svelte";
import TranscriptPlayer from "./components/TranscriptPlayer.svelte";
import CoverArt from "./components/CoverArt.svelte";
import { segmentsToTranscript } from "./lib/transcript-player";
import { getUsage, checkQuota, incrementUsage, getQuotaDisplay, resetQuota, formatQuotaDisplay, getQuotaColors } from "./lib/local-quota";

  let topic = $state("");
  let link = $state("");
  let isGenerating = $state(false);
  let isPlaying = $state(false);
  let audioElement: HTMLAudioElement | null = $state(null);
  let currentScript = $state("");
  let currentTime = $state(0);
  let duration = $state(0);
  let showHistory = $state(false);
  let showSettings = $state(false);
  let showTopicSuggestions = $state(false);
  let episodeHistory: Episode[] = $state([]);
  let settings: AppSettings = $state(loadSettings());
  let errorMessage = $state("");
  let syncMessage = $state("");
  let isSyncing = $state(false);
  let localGenerating = $state(false);
  let localStatus: 'NOT RUNNING' | 'READY' | 'ERROR' = $state('NOT RUNNING');

  let generationStage: GenerationStage = $state('idle');
  let generationProgress = $state(0);
  let generationLogs: {timestamp: string; stage: GenerationStage; message: string}[] = $state([]);
  let parsedScript: ReturnType<typeof parseScriptToSegments> | null = $state(null);
  let speakerSegments: SpeakerSegment[] = $state([]);
  let transcriptLines = $state<import("./lib/transcript-player").TranscriptLine[]>([]);
  let coverDataUrl = $state<string | null>(null);
  let currentEpisode = $state<Episode | null>(null);
  let isTransitioning = $state(false);

  let quotaDisplay = $state(getQuotaDisplay());
  let quotaColors = $state(getQuotaColors());

  function refreshQuota() {
    quotaDisplay = getQuotaDisplay();
    quotaColors = getQuotaColors();
  }

  let selectedCategory = $state<TopicCategory | 'all'>('all');
  let categories = $derived(getCategories());
  let allCategoryIds = $derived(getAllCategories());
  let filteredTopics = $derived(selectedCategory === 'all'
    ? allCategoryIds.flatMap((c: TopicCategory) => getTopicsByCategory(c))
    : getTopicsByCategory(selectedCategory));

  let apiKeyInput = $state<string>("");
  let selectedProvider = $state<AppSettings['apiProvider']>('none');
  let selectedVoice = $state<string>("");
  let selectedQuality = $state<AppSettings['quality']>('normal');
  let selectedStyle = $state<AppSettings['style']>('tech');
  let fileInput = $state<HTMLInputElement | null>(null);

  const isAndroid = /android/i.test(navigator.userAgent);

  onMount(() => {
    (async () => {
      settings = loadSettings();
      apiKeyInput = settings.apiKey;
      selectedProvider = settings.apiProvider;
      selectedVoice = settings.defaultVoice;
      selectedQuality = settings.quality;
      selectedStyle = settings.style;
      await loadHistory();
    })();

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  });

  $effect(() => {
    if (settings.apiProvider !== 'local') return;

    const unsubReady = onLocalLLMReady(() => {
      localStatus = 'READY';
    });
    const unsubError = onLocalLLMError((_error: string) => {
      localStatus = 'ERROR';
    });

    return () => {
      unsubReady.then((unsub) => unsub());
      unsubError.then((unsub) => unsub());
    };
  });

  function handlePopState(_event: PopStateEvent) {
    if (showHistory) {
      showHistory = false;
    } else if (showSettings) {
      showSettings = false;
    }
  }

  async function loadHistory() {
    try {
      episodeHistory = await getAllEpisodes();
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  function updateStage(stage: GenerationStage, message: string) {
    generationStage = stage
    const stageIndex = STAGE_ORDER.indexOf(stage)
    generationProgress = Math.round(((stageIndex + 1) / STAGE_ORDER.length) * 100)
    addLog(stage, message)
  }

  function addLog(stage: GenerationStage, message: string) {
    generationLogs = [
      ...generationLogs,
      {timestamp: new Date().toISOString(), stage, message},
    ]
  }

async function tuneIn(mode?: 'deeper' | 'similar', similarTopic?: string) {
  if (!topic.trim()) return

  const activeTopic = mode === 'similar' && similarTopic ? similarTopic : topic

  const generationQuota = checkQuota('generation', 1);
  if (!generationQuota.allowed) {
    errorMessage = `Tageslimit erreicht: Maximale ${generationQuota.limit} Generationen pro Tag.`;
    return;
  }

  const estimatedChars = activeTopic.length * 500;
  const characterQuota = checkQuota('character', estimatedChars);
  if (!characterQuota.allowed) {
    errorMessage = `Zeichenlimit erreicht: Noch ${characterQuota.remaining.toLocaleString()} Zeichen verfügbar.`;
    return;
  }

  isGenerating = true
  localGenerating = settings.apiProvider === 'local'
  errorMessage = ""
  currentScript = ""
  generationStage = 'idle'
  generationProgress = 0
  generationLogs = []
  parsedScript = null
  speakerSegments = []

  let linkContent: string | undefined

  try {
    updateStage('researching', 'Starting research phase...')
    await sleep(500)

    if (link.trim()) {
      try {
        syncMessage = 'Lade URL-Inhalt...'
        addLog('researching', 'Fetching link content...')
        linkContent = await fetchLinkContent(link.trim())
        syncMessage = ''
        addLog('researching', 'Link content fetched successfully')
      } catch (e: any) {
        errorMessage = `URL-Warnung: ${e.message}. Generiere ohne URL-Inhalt.`
        addLog('researching', `Link fetch failed: ${e.message}`)
        linkContent = undefined
      }
    }

    updateStage('writing-script', 'Generating radio script...')
    addLog('writing-script', `Invoking LLM for topic: ${activeTopic}`)
    const script = await invokeGenerateScript(activeTopic, settings, linkContent, mode, similarTopic)
    currentScript = script
    addLog('writing-script', 'Script generated successfully')
    await sleep(300)

    updateStage('generating-speech', 'Parsing script into segments...')
    addLog('generating-speech', 'Analyzing script structure...')
    const parsed = parseScriptToSegments(script, settings.style)
    parsedScript = parsed
    speakerSegments = parsed.segments
    transcriptLines = segmentsToTranscript(parsed.segments)
    addLog('generating-speech', `Parsed ${parsed.segments.length} speaker segments`)
    await sleep(200)

    updateStage('generating-speech', 'Generating audio for each segment...')
    const audioBuffers: ArrayBuffer[] = []
    for (let i = 0; i < speakerSegments.length; i++) {
      const segment = speakerSegments[i]
      const segmentProgress = Math.round(((i + 1) / speakerSegments.length) * 100)
      generationProgress = Math.round((GENERATING_SPEECH_STAGE_INDEX / STAGE_ORDER.length) * 100 + (segmentProgress / 100) * (100 / STAGE_ORDER.length))
      addLog('generating-speech', `Generating audio for ${segment.speaker} (${i + 1}/${speakerSegments.length})`)
      try {
        const buffer = await ttsEdge(segment.text, {
          voice: segment.voice,
          rate: '+0%',
          pitch: '+0Hz',
          volume: '+0%',
        })
        audioBuffers.push(buffer)
      } catch (edgeErr) {
        console.error(`Edge TTS failed for segment ${i}:`, edgeErr)
        try {
          const httpBlob = await ttsHttpFallback(segment.text, segment.voice)
          const arrayBuffer = await httpBlob.arrayBuffer()
          audioBuffers.push(arrayBuffer)
          addLog('generating-speech', `HTTP fallback succeeded for ${segment.speaker}`)
        } catch (httpErr) {
          console.error(`HTTP TTS fallback failed for segment ${i}:`, httpErr)
          if (!window.speechSynthesis) {
            throw new Error(
              `TTS unavailable for segment ${i} (Edge: ${edgeErr instanceof Error ? edgeErr.message : 'unknown error'}; HTTP: ${httpErr instanceof Error ? httpErr.message : 'unknown error'})`,
              {cause: httpErr},
            )
          }
          await ttsWebSpeech(segment.text, {
            voice: segment.voice,
            rate: '+0%',
            pitch: '+0Hz',
          })
          audioBuffers.push(new ArrayBuffer(0))
          addLog('generating-speech', `Web Speech fallback used for ${segment.speaker}`)
        }
      }
    }
    await sleep(200)

    updateStage('mixing-audio', 'Mixing audio segments...')
    addLog('mixing-audio', 'Concatenating audio buffers...')
    const totalLength = audioBuffers.reduce((sum, buf) => sum + buf.byteLength, 0)
    const result = new Uint8Array(totalLength)
    let offset = 0
    for (const buf of audioBuffers) {
      result.set(new Uint8Array(buf), offset)
      offset += buf.byteLength
    }
    const audioBlob = new Blob([result], {type: 'audio/mp3'})
    const audioUrl = URL.createObjectURL(audioBlob)
    addLog('mixing-audio', 'Audio mixed successfully')
    await sleep(300)

    updateStage('generating-metadata', 'Generating episode metadata...')
    addLog('generating-metadata', 'Creating episode entry...')
    await sleep(200)

    updateStage('generating-cover', 'Generating cover art...')
    addLog('generating-cover', 'Generating cover art...')
    const coverCanvas = generateCoverCanvas({
      title: parsed.title || activeTopic.slice(0, 50),
      topic: activeTopic,
      style: settings.style,
      width: 512,
      height: 512,
    });
    coverDataUrl = canvasToDataURL(coverCanvas);
    await sleep(200)

    if (audioElement) {
      audioElement.src = audioUrl
      if (settings.autoPlay) {
        await audioElement.play()
        isPlaying = true
      }
    }

    const episode = {
      title: parsed.title || activeTopic.slice(0, 50) + (activeTopic.length > 50 ? '...' : ''),
      topic: activeTopic,
      link: link || undefined,
      script,
      audioUrl,
      duration: audioElement?.duration || 0,
      createdAt: new Date(),
      isFavorite: false,
      speakerSegments: parsed.segments,
      coverDataUrl: coverDataUrl || undefined,
    }

    const episodeId = await saveEpisode(episode)
    await loadHistory()
    currentEpisode = {...episode, id: episodeId}

    incrementUsage('generation', 1);
    incrementUsage('character', script.length);
    const durationMinutes = Math.ceil((audioElement?.duration || 0) / 60);
    incrementUsage('audio', durationMinutes);
    refreshQuota();

    updateStage('complete', 'Generation complete!')
    generationProgress = 100
  } catch (e: any) {
    console.error('Error:', e)
    errorMessage = `Fehler: ${e.message || 'Generation failed'}`
    generationStage = 'error'
    addLog('error', errorMessage)
  } finally {
    isGenerating = false
    localGenerating = false
    syncMessage = ''
  }
}

async function handleDeeper() {
  await tuneIn('deeper');
}

async function handleReroll() {
  await tuneIn();
}

async function handleSimilar() {
  isTransitioning = true;
  try {
    if (settings.apiProvider === 'none' || !settings.apiKey) {
      topic = getRandomTopic();
      await tuneIn('similar', topic);
      return;
    }
    syncMessage = "Suche ähnliches Thema...";
    try {
      const { suggestRelatedTopic } = await import("./lib/settings");
      const related = await suggestRelatedTopic(topic, settings);
      if (related) {
        topic = related;
        await tuneIn('similar', topic);
      } else {
        topic = getRandomTopic();
        await tuneIn('similar', topic);
      }
    } catch {
      topic = getRandomTopic();
      await tuneIn('similar', topic);
    } finally {
      syncMessage = "";
    }
  } finally {
    // Brief delay for transition animation
    await new Promise(r => setTimeout(r, 150));
    isTransitioning = false;
  }
}

  function togglePlayPause() {
    if (!audioElement) return;
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    isPlaying = !isPlaying;
  }

  function formatTime(seconds: number): string {
    if (!seconds || !isFinite(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  function handleTimeUpdate() {
    if (audioElement) {
      currentTime = audioElement.currentTime;
    }
  }

  function handleLoadedMetadata() {
    if (audioElement) {
      duration = audioElement.duration;
    }
  }

  async function playEpisode(episode: Episode) {
    currentScript = episode.script;
    transcriptLines = segmentsToTranscript(episode.speakerSegments || [])
    coverDataUrl = episode.coverDataUrl || null;
    currentEpisode = episode;
    if (audioElement && episode.audioUrl) {
      audioElement.src = episode.audioUrl;
      await audioElement.play();
      isPlaying = true;
    }
    showHistory = false;
    if (window.history.state?.panel) window.history.back();
  }

  async function deleteEpisode(id: string) {
    try {
      await dbDeleteEpisode(id);
      await loadHistory();
    } catch (e) {
      console.error("Failed to delete:", e);
    }
  }

  async function toggleFavorite(episode: Episode) {
    try {
      await dbToggleFavorite(episode.id, !episode.isFavorite);
      await loadHistory();
    } catch (e) {
      console.error("Failed to toggle favorite:", e);
    }
  }

  function openSettings() {
    apiKeyInput = settings.apiKey;
    selectedProvider = settings.apiProvider;
    selectedVoice = settings.defaultVoice;
    selectedStyle = settings.style;
    showSettings = true;
    window.history.pushState({panel: 'settings'}, '');
  }

  function closeSettings() {
    showSettings = false;
    if (window.history.state?.panel) {
      window.history.back();
    }
  }

  function saveSettingsAndClose() {
    settings = {
      ...settings,
      apiKey: apiKeyInput,
      apiProvider: selectedProvider,
      defaultVoice: selectedVoice,
      quality: selectedQuality,
      style: selectedStyle,
    };
    saveSettings(settings);
    showSettings = false;
  }

  function clearApiKey() {
    apiKeyInput = "";
    selectedProvider = "none";
  }

  function getRandomTopicFromCategory(categoryId: string) {
    topic = getRandomTopicByCategory(categoryId as keyof typeof import("./lib/topics").TOPICS);
    showTopicSuggestions = false;
  }

  function getRandomTopicHandler() {
    topic = getRandomTopic();
    showTopicSuggestions = false;
  }

  function getRandomTopicForCategory() {
    if (selectedCategory === 'all') {
      topic = getRandomTopic();
    } else {
      topic = getRandomTopicByCategory(selectedCategory);
    }
    showTopicSuggestions = false;
  }

  async function handleSimilarTopic(suggestedTopic: string) {
    topic = suggestedTopic;
    showTopicSuggestions = false;
    await handleSimilar();
  }

  async function handleExport() {
    try {
      isSyncing = true;
      syncMessage = "Exportiere Daten...";
      const data = await exportData();
      downloadSyncFile(data);
      syncMessage = `Export erfolgreich! ${data.episodes.length} Episoden exportiert.`;
    } catch (e: any) {
      syncMessage = `Export fehlgeschlagen: ${e.message}`;
    } finally {
      isSyncing = false;
    }
  }

  async function handleDownloadZip(episode: Episode) {
    try {
      isSyncing = true;
      syncMessage = "Erstelle ZIP-Archiv...";
      const blob = await createShowZip(episode, episode.coverDataUrl);
      const safeTitle = episode.title.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 50);
      const filename = `ai-radio_${safeTitle}_${new Date(episode.createdAt).toISOString().split('T')[0]}.zip`;
      downloadZip(blob, filename);
      syncMessage = "ZIP-Export erfolgreich!";
    } catch (e: any) {
      syncMessage = `ZIP-Export fehlgeschlagen: ${e.message}`;
    } finally {
      isSyncing = false;
    }
  }

  function triggerImport() {
    if (fileInput) {
      fileInput.click();
    }
  }

  async function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    try {
      isSyncing = true;
      syncMessage = "Importiere Daten...";
      const result = await importData(file);
      syncMessage = `Import erfolgreich! ${result.episodesImported} Episoden importiert.`;
      if (result.settingsImported) {
        settings = loadSettings();
      }
      await loadHistory();
    } catch (e: any) {
      syncMessage = `Import fehlgeschlagen: ${e.message}`;
    } finally {
      isSyncing = false;
      if (fileInput) fileInput.value = "";
    }
  }
</script>

<div class="scanlines"></div>

<main class="terminal" class:transitioning={isTransitioning}>
  <header class="header">
    <h1>📡 AI_RADIO_v1.0.0</h1>
    <div class="header-actions">
      <button class="icon-btn" onclick={openSettings} title="Settings">⚙</button>
      {#if settings.apiProvider === 'local'}
        <span class="local-badge" class:ready={localStatus === 'READY'} class:error={localStatus === 'ERROR'}>
          LOCAL AI: {localStatus}
        </span>
      {/if}
      <span class="status-indicator">
        {isGenerating ? (localGenerating ? "LOCAL GENERATING..." : "GENERATING...") : "READY"}
        {#if settings.apiProvider === "none"}
          <span class="badge">OFFLINE</span>
        {/if}
      </span>
    </div>
    <div class="quota-display">
      <span style="color: {quotaColors.generations}">▣ Gen: {quotaDisplay.generations.used}/{quotaDisplay.generations.limit}</span>
      <span style="color: {quotaColors.characters}">▣ Char: {quotaDisplay.characters.used.toLocaleString()}/{quotaDisplay.characters.limit.toLocaleString()}</span>
      <span style="color: {quotaColors.audio}">▣ Audio: {quotaDisplay.audio.used}/{quotaDisplay.audio.limit}min</span>
    </div>
  </header>

  <div class="content">
    {#if errorMessage}
      <div class="error-banner">{errorMessage}</div>
    {/if}

    <div class="input-group">
      <label for="topic">> TOPIC:</label>
      <div class="topic-input-row">
        <input
          id="topic"
          type="text"
          bind:value={topic}
          placeholder="Enter topic or paste link..."
          disabled={isGenerating}
        />
        <button
          class="btn-dice"
          onclick={() => showTopicSuggestions = !showTopicSuggestions}
          title="Topic vorschlagen"
        >🎲</button>
      </div>

      {#if showTopicSuggestions}
        <div class="topic-suggestions">
          <div class="suggestions-header">
            <span>Kategorie:</span>
            <div class="category-tabs">
              <button
                class="category-tab"
                class:active={selectedCategory === 'all'}
                onclick={() => selectedCategory = 'all'}
              >
                Alle
              </button>
              {#each categories as cat}
                <button
                  class="category-tab"
                  class:active={selectedCategory === cat.id}
                  onclick={() => selectedCategory = cat.id}
                >
                  {cat.name.split(' ')[0]}
                </button>
              {/each}
            </div>
          </div>
          <div class="topic-list">
            {#each filteredTopics as t}
              <div class="topic-item">
                <button class="topic-btn" onclick={() => { topic = t; showTopicSuggestions = false; }}>
                  {t}
                </button>
                <button class="btn-similar" onclick={() => handleSimilarTopic(t)} title="Ähnliches Thema finden">🔄</button>
              </div>
            {/each}
          </div>
          <div class="suggestions-footer">
            <button class="btn-random" onclick={getRandomTopicForCategory}>🎲 Würfel</button>
          </div>
        </div>
      {/if}
    </div>

    <div class="input-group">
      <label for="link">> LINK:</label>
      <input
        id="link"
        type="url"
        bind:value={link}
        placeholder="Optional: Paste URL for content..."
        disabled={isGenerating}
      />
    </div>

    <div class="controls">
      <button
        class="btn-primary"
        onclick={() => tuneIn()}
        disabled={isGenerating || !topic.trim()}
      >
        {isGenerating ? "[ GENERATING... ]" : "[ ▶ TUNE IN ]"}
      </button>

      {#if audioElement && currentScript}
        <button class="btn-secondary" onclick={togglePlayPause}>
          {isPlaying ? "[ ⏸ PAUSE ]" : "[ ▶ PLAY ]"}
        </button>
      {/if}

      {#if currentEpisode}
        <button class="btn-secondary" onclick={() => handleDownloadZip(currentEpisode!)} disabled={isSyncing}>
          {isSyncing ? "[ 📦 EXPORTING... ]" : "[ 📦 ZIP EXPORT ]"}
        </button>
      {/if}

      <button class="btn-history" onclick={() => {
        showHistory = !showHistory;
        if (showHistory) window.history.pushState({panel: 'history'}, '');
        else if (window.history.state?.panel) window.history.back();
      }}>
        [ 📜 HISTORY ]
      </button>
    </div>

    {#if isGenerating}
      <GenerationProgress
        currentStage={generationStage}
        progress={generationProgress}
        logs={generationLogs}
      />
    {/if}

    {#if audioElement && currentScript}
      <div class="player-section">
        <div class="player-header">
          <CoverArt
            title={parsedScript?.title || topic.slice(0, 50)}
            topic={topic}
            style={settings.style}
            size={200}
          />
          <div class="player-main">
            <AudioVisualizer {audioElement} {isPlaying} barCount={40} style="bars" />

            <div class="progress-container">
              <span class="time">{formatTime(currentTime)}</span>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  style="width: {duration ? (currentTime / duration) * 100 : 0}%"
                ></div>
              </div>
              <span class="time">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      {#if transcriptLines.length > 0}
        <TranscriptPlayer
          transcript={transcriptLines}
          currentTime={currentTime}
          duration={duration}
          audioElement={audioElement}
          episodeId={episodeHistory.find(e => e.script === currentScript)?.id || ''}
          episodeTitle={episodeHistory.find(e => e.script === currentScript)?.title || 'Current Episode'}
        />
      {/if}

      <div class="script-preview">
        <p>{currentScript.slice(0, 300)}{currentScript.length > 300 ? "..." : ""}</p>
      </div>

      <div class="post-actions">
        <button class="btn-action" onclick={handleDeeper} disabled={isGenerating}>
          [ 🔍 MEHR DAZU ]
        </button>
        <button class="btn-action" onclick={handleReroll} disabled={isGenerating}>
          [ 🔄 NEU ]
        </button>
        <button class="btn-action" onclick={handleSimilar} disabled={isGenerating}>
          [ 🎲 ÄHNLICH ]
        </button>
      </div>
    {/if}
  </div>

  {#if showHistory}
    <div class="history-panel">
      <div class="history-header">
        <h2>═══ HISTORY ═══</h2>
        <button onclick={() => {
          showHistory = false;
          if (window.history.state?.panel) window.history.back();
        }}>[ ✕ ]</button>
      </div>

      <div class="history-list">
        {#if episodeHistory.length === 0}
          <p class="empty">No episodes yet...</p>
        {:else}
          {#each episodeHistory as episode}
            <div class="episode-card">
              <div class="episode-info">
                <span class="episode-title">
                  {episode.isFavorite ? "⭐ " : ""}{episode.title}
                </span>
                <span class="episode-meta">
                  {formatTime(episode.duration)} | {new Date(episode.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div class="episode-actions">
                <button onclick={() => playEpisode(episode)}>[ ▶ ]</button>
                <button onclick={() => handleDownloadZip(episode)} disabled={isSyncing}>
                  {isSyncing ? "[ 📦... ]" : "[ 📦 ]"}
                </button>
                <button onclick={() => toggleFavorite(episode)}>
                  [{episode.isFavorite ? "⭐" : "☆"}]
                </button>
                <button onclick={() => deleteEpisode(episode.id!)}>[ 🗑 ]</button>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  {/if}

{#if showSettings}
<div
  class="settings-overlay"
  onclick={closeSettings}
  onkeydown={(e) => { if (e.key === 'Escape') closeSettings() }}
  role="dialog"
  aria-modal="true"
  tabindex="-1"
>
      <div class="settings-panel" onclick={(e) => e.stopPropagation()} role="document">
        <div class="settings-header">
          <h2>═══ SETTINGS ═══</h2>
          <button onclick={closeSettings}>[ ✕ ]</button>
        </div>

        <div class="settings-content">
          <div class="settings-section">
            <h3>LLM API (Optional)</h3>
            <p class="hint">Kostenlose APIs: Kilo, OpenCode, Gemini</p>

            <div class="api-providers">
              <label class="provider-option">
                <input type="radio" bind:group={selectedProvider} value="none" />
                <span>Keine API (Fallback)</span>
              </label>
              <label class="provider-option">
                <input type="radio" bind:group={selectedProvider} value="kilo" />
                <span>Kilo Gateway (empfohlen)</span>
              </label>
              <label class="provider-option">
                <input type="radio" bind:group={selectedProvider} value="opencode" />
                <span>OpenCode AI</span>
              </label>
              <label class="provider-option">
                <input type="radio" bind:group={selectedProvider} value="gemini" />
                <span>Google Gemini</span>
              </label>
              <label class="provider-option">
                <input type="radio" bind:group={selectedProvider} value="local" />
                <span>Local LLM (Offline)</span>
              </label>
            </div>

            <div class="input-group">
              <label for="apiKey">API Key:</label>
              <input
                id="apiKey"
                type="password"
                bind:value={apiKeyInput}
                placeholder="Enter API key..."
              />
            </div>

            {#if selectedProvider === 'none'}
              <p class="hint warning">
                ⚠️ Ohne API wird ein einfacher Fallback-Text generiert.
              </p>
            {/if}

            {#if selectedProvider === 'local'}
              <ModelManager />
            {/if}
          </div>

          <div class="settings-section">
            <h3>Stimme</h3>
            <div class="voice-select">
              <select bind:value={selectedVoice}>
                <optgroup label="Deutsch">
                  {#each VOICES.german as voice}
                    <option value={voice.id}>{voice.name} ({voice.gender})</option>
                  {/each}
                </optgroup>
                <optgroup label="English">
                  {#each VOICES.english as voice}
                    <option value={voice.id}>{voice.name} ({voice.gender})</option>
                  {/each}
                </optgroup>
              </select>
            </div>
          </div>

          <div class="settings-section">
            <h3>Script-Qualität</h3>
            <div class="quality-select">
              <select bind:value={selectedQuality}>
                <option value="short">Kurz (30s)</option>
                <option value="normal">Normal (90s)</option>
                <option value="long">Lang (3min)</option>
                <option value="chill">Chill (4min, ausführlich)</option>
              </select>
            </div>
          </div>

          <div class="settings-section">
            <h3>Sprechstil</h3>
            <div class="style-select">
              <select bind:value={selectedStyle}>
                <option value="tech">💻 Tech-Fokus</option>
                <option value="casual">😎 Locker & Frei</option>
                <option value="academic">🎓 Akademisch</option>
                <option value="entertaining">🎭 Unterhaltsam</option>
                <option value="news">📺 Nachrichten</option>
                <option value="podcast">🎙️ Podcast</option>
              </select>
            </div>
            <p class="hint">beeinflusst den Tonfall und Stil des Radio-Beitrags</p>
          </div>

          <div class="settings-section">
            <label class="checkbox-option">
              <input type="checkbox" bind:checked={settings.autoPlay} />
              <span>Automatisch abspielen</span>
            </label>
          </div>

          <div class="settings-section">
            <h3>Sync (Geräteübergreifend)</h3>
            <p class="hint">Exportiere deine Daten als JSON-Datei, um sie auf einem anderen Gerät zu importieren.</p>

            <input
              type="file"
              accept=".json"
              bind:this={fileInput}
              onchange={handleFileSelect}
              style="display: none;"
            />

            <div class="sync-buttons">
              <button class="btn-secondary" onclick={handleExport} disabled={isSyncing}>
                [ 📤 EXPORT ]
              </button>
              <button class="btn-secondary" onclick={triggerImport} disabled={isSyncing}>
                [ 📥 IMPORT ]
              </button>
            </div>

            {#if syncMessage}
              <p class="sync-message" class:error={syncMessage.includes("fehl") || syncMessage.includes("Fehler")}>
                {syncMessage}
              </p>
            {/if}
          </div>
        </div>

<div class="settings-footer">
          <button class="btn-secondary" onclick={clearApiKey}>API Key löschen</button>
          <button class="btn-secondary" onclick={() => { resetQuota(); refreshQuota(); }}>[ 🔄 RESET QUOTA ]</button>
          <button class="btn-primary" onclick={saveSettingsAndClose}>[ SPEICHERN ]</button>
        </div>
      </div>
    </div>
  {/if}
</main>

<audio
  bind:this={audioElement}
  ontimeupdate={handleTimeUpdate}
  onloadedmetadata={handleLoadedMetadata}
  onended={() => isPlaying = false}
></audio>

<style>
  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes pulseGlow {
    0%, 100% {
      box-shadow: 0 0 5px rgba(0, 255, 65, 0.3);
    }
    50% {
      box-shadow: 0 0 20px rgba(0, 255, 65, 0.6), 0 0 30px rgba(0, 255, 65, 0.4);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  :global(body) {
    font-family: "Courier New", monospace;
    background: #0a0a0a;
    color: #00ff41;
    min-height: 100vh;
    margin: 0;
    background-image: 
      radial-gradient(ellipse at 20% 20%, #001100 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, #002200 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, #003311 0%, transparent 60%),
      radial-gradient(ellipse at 0% 100%, #0a0a0a 0%, transparent 40%);
    background-size: 200% 200%;
    animation: gradientShift 20s ease infinite;
  }

  .scanlines {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15),
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
    z-index: 9999;
  }

  .terminal {
    max-width: 900px;
    margin: 0 auto;
    padding: 1.5rem;
    min-height: 100vh;
    position: relative;
    animation: slideUp 0.5s ease-out, fadeIn 0.3s ease-out;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #003311;
    padding-bottom: 1rem;
    margin-bottom: 2rem;
    animation: slideUp 0.5s ease-out 0.1s both, fadeIn 0.3s ease-out 0.1s both;
  }

  .header h1 {
    font-size: 1.5rem;
    font-weight: bold;
    text-shadow: 0 0 10px #00ff41;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .quota-display {
    display: flex;
    gap: 1.5rem;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px dashed #003311;
    font-size: 0.75rem;
    font-family: inherit;
    flex-wrap: wrap;
  }

  .icon-btn {
    background: none;
    border: 1px solid #003311;
    color: #00ff41;
    padding: 0.5rem;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.2s ease;
  }

  .icon-btn:hover {
    background: #003311;
    transform: scale(1.05);
  }

  .icon-btn:active {
    transform: scale(0.95);
  }

  .status-indicator {
    color: #00aa2a;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .badge {
    background: #003311;
    color: #00ff41;
    padding: 0.125rem 0.5rem;
    font-size: 0.625rem;
    border-radius: 2px;
  }

  .local-badge {
    background: #1a1a00;
    color: #00aa2a;
    padding: 0.125rem 0.5rem;
    font-size: 0.625rem;
    border-radius: 2px;
    border: 1px solid #003311;
  }

  .local-badge.ready {
    color: #00ff41;
    border-color: #00ff41;
    text-shadow: 0 0 5px #00ff41;
  }

  .local-badge.error {
    color: #ff3333;
    border-color: #ff3333;
  }

  .error-banner {
    background: #330000;
    border: 1px solid #ff3333;
    color: #ff3333;
    padding: 0.75rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    animation: slideUp 0.5s ease-out 0.2s both, fadeIn 0.3s ease-out 0.2s both;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    animation: slideUp 0.4s ease-out calc(0.25s + var(--i, 0) * 0.1s) both, fadeIn 0.3s ease-out calc(0.25s + var(--i, 0) * 0.1s) both;
  }

  .input-group label {
    color: #00aa2a;
    font-size: 0.875rem;
  }

  .input-group input {
    background: #111111;
    border: 1px solid #003311;
    color: #00ff41;
    padding: 0.75rem 1rem;
    font-family: inherit;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .input-group input:focus {
    border-color: #00ff41;
    box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
  }

  .input-group input::placeholder {
    color: #005511;
  }

  .input-group input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .controls {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    animation: slideUp 0.5s ease-out 0.3s both, fadeIn 0.3s ease-out 0.3s both;
  }

  .btn-primary, .btn-secondary, .btn-history, .btn-dice, .btn-random, .btn-action, .category-btn {
    transition: all 0.2s ease;
  }

  .btn-primary, .btn-secondary, .btn-history {
    background: #003311;
    border: 1px solid #00ff41;
    color: #00ff41;
    padding: 0.75rem 1.5rem;
    font-family: inherit;
    font-size: 1rem;
    cursor: pointer;
  }

  .btn-primary:hover:not(:disabled), .btn-secondary:hover, .btn-history:hover, .btn-dice:hover, .btn-random:hover {
    background: #00ff41;
    color: #0a0a0a;
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.4);
    transform: scale(1.02);
  }

  .btn-primary:active:not(:disabled), .btn-secondary:active, .btn-history:active, .btn-dice:active, .btn-random:active {
    transform: scale(0.98);
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .player-section {
    margin-top: 1rem;
    padding: 1.5rem;
    background: #111111;
    border: 1px solid #003311;
    animation: slideUp 0.5s ease-out 0.1s both, fadeIn 0.3s ease-out 0.1s both;
  }

  .player-header {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
  }

  .player-main {
    flex: 1;
    min-width: 0;
  }

  .progress-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .time {
    color: #00aa2a;
    font-size: 0.875rem;
    min-width: 50px;
  }

  .progress-bar {
    flex: 1;
    height: 4px;
    background: #003311;
  }

  .progress-fill {
    height: 100%;
    background: #00ff41;
    transition: width 0.1s;
  }

  .script-preview {
    margin-top: 1rem;
    padding: 1rem;
    background: #0a0a0a;
    border: 1px dashed #003311;
    color: #00aa2a;
    font-size: 0.875rem;
    line-height: 1.6;
  }

  .history-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 350px;
    height: 100vh;
    background: #0a0a0a;
    border-left: 2px solid #003311;
    z-index: 100;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.4s ease-out, fadeIn 0.3s ease-out;
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #003311;
  }

  .history-header h2 {
    font-size: 1rem;
  }

  .history-header button {
    background: none;
    border: none;
    color: #00ff41;
    cursor: pointer;
    font-family: inherit;
  }

  .history-list {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .empty {
    color: #005511;
    text-align: center;
    padding: 2rem;
  }

  .episode-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border: 1px solid #003311;
    margin-bottom: 0.5rem;
    background: #111111;
    transition: all 0.2s ease;
  }

  .episode-card:hover {
    border-color: #00ff41;
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.15);
    transform: translateX(4px);
  }

  .episode-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .episode-title {
    font-size: 0.875rem;
  }

  .episode-meta {
    font-size: 0.75rem;
    color: #00aa2a;
  }

  .episode-actions {
    display: flex;
    gap: 0.5rem;
  }

  .episode-actions button {
    background: none;
    border: none;
    color: #00ff41;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.875rem;
    padding: 0.25rem;
  }

  .episode-actions button:hover {
    text-shadow: 0 0 10px #00ff41;
  }

  .settings-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .settings-panel {
    background: #0a0a0a;
    border: 2px solid #003311;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.4s ease-out, fadeIn 0.3s ease-out;
  }

  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #003311;
  }

  .settings-header h2 {
    font-size: 1rem;
  }

  .settings-header button {
    background: none;
    border: none;
    color: #00ff41;
    cursor: pointer;
    font-family: inherit;
  }

  .settings-content {
    padding: 1rem;
  }

  .settings-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px dashed #003311;
  }

  .settings-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .settings-section h3 {
    font-size: 0.875rem;
    color: #00ff41;
    margin-bottom: 0.75rem;
  }

  .hint {
    font-size: 0.75rem;
    color: #00aa2a;
    margin-bottom: 0.75rem;
  }

  .hint.warning {
    color: #ffaa00;
  }

  .api-providers {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .provider-option, .checkbox-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .provider-option.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .provider-option input, .checkbox-option input {
    accent-color: #00ff41;
  }

  .provider-option.disabled input {
    accent-color: #555;
  }

  /* Scrollbar styling */
  .history-list::-webkit-scrollbar,
  .generation-logs::-webkit-scrollbar,
  .settings-panel::-webkit-scrollbar,
  .transcript-list::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .history-list::-webkit-scrollbar-track,
  .generation-logs::-webkit-scrollbar-track,
  .settings-panel::-webkit-scrollbar-track,
  .transcript-list::-webkit-scrollbar-track {
    background: #003311;
  }

  .history-list::-webkit-scrollbar-thumb,
  .generation-logs::-webkit-scrollbar-thumb,
  .settings-panel::-webkit-scrollbar-thumb,
  .transcript-list::-webkit-scrollbar-thumb {
    background: #00ff41;
    border-radius: 3px;
  }

  .history-list::-webkit-scrollbar-thumb:hover,
  .generation-logs::-webkit-scrollbar-thumb:hover,
  .settings-panel::-webkit-scrollbar-thumb:hover,
  .transcript-list::-webkit-scrollbar-thumb:hover {
    background: #00cc33;
  }

  /* Hide scrollbar on mobile */
  @media (max-width: 600px) {
    .history-list,
    .generation-logs,
    .settings-panel,
    .transcript-list {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .history-list::-webkit-scrollbar,
    .generation-logs::-webkit-scrollbar,
    .settings-panel::-webkit-scrollbar,
    .transcript-list::-webkit-scrollbar {
      display: none;
    }
  }

  /* Focus styles for links and buttons */
  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  select:focus-visible {
    outline: 2px solid #00ff41;
    outline-offset: 2px;
  }

  /* Pulse glow for active elements */
  .cover-art,
  .player-section:has(audio[playing]) {
    animation: pulseGlow 2s ease-in-out infinite;
  }

  /* Generation progress animation */
  .generation-progress {
    animation: slideUp 0.4s ease-out, fadeIn 0.3s ease-out;
  }

  /* Transcript player animation */
  .transcript-player {
    animation: slideUp 0.4s ease-out 0.1s both, fadeIn 0.3s ease-out 0.1s both;
  }

  .voice-select select {
    width: 100%;
    background: #111111;
    border: 1px solid #003311;
    color: #00ff41;
    padding: 0.5rem;
    font-family: inherit;
    font-size: 0.875rem;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .voice-select select:focus {
    border-color: #00ff41;
    box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
    outline: none;
  }

  .settings-footer {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    border-top: 1px solid #003311;
  }

  .settings-footer .btn-primary {
    background: #00ff41;
    color: #0a0a0a;
  }

  @media (max-width: 600px) {
    .history-panel {
      width: 100%;
    }
  }

  .sync-buttons {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
  }

  .sync-buttons .btn-secondary {
    flex: 1;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .sync-message {
    font-size: 0.75rem;
    color: #00ff41;
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: #111111;
    border: 1px solid #003311;
  }

  .sync-message.error {
    color: #ff3333;
    border-color: #330000;
  }

  .topic-input-row {
    display: flex;
    gap: 0.5rem;
  }

  .topic-input-row input {
    flex: 1;
  }

  .btn-dice {
    background: #003311;
    border: 1px solid #00ff41;
    color: #00ff41;
    padding: 0.75rem 1rem;
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-dice:hover {
    background: #00ff41;
    color: #0a0a0a;
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.4);
  }

  .topic-suggestions {
    margin-top: 0.75rem;
    padding: 1rem;
    background: #111111;
    border: 1px solid #003311;
  }

  .suggestions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .suggestions-header span {
    color: #00aa2a;
    font-size: 0.875rem;
  }

  .btn-random {
    background: #003311;
    border: 1px solid #00ff41;
    color: #00ff41;
    padding: 0.5rem 0.75rem;
    font-family: inherit;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .btn-random:hover {
    background: #00ff41;
    color: #0a0a0a;
  }

  .category-btn {
    background: #0a0a0a;
    border: 1px dashed #003311;
    color: #00ff41;
    padding: 0.5rem 1rem;
    margin: 0.25rem;
    font-family: inherit;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .category-btn:hover {
    border-style: solid;
    background: #003311;
    transform: scale(1.02);
  }

  .category-btn:active {
    transform: scale(0.98);
  }

  .post-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }

  .btn-action {
    background: #111111;
    border: 1px solid #003311;
    color: #00aa2a;
    padding: 0.5rem 1rem;
    font-family: inherit;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-action:hover:not(:disabled) {
    background: #003311;
    border-color: #00ff41;
    color: #00ff41;
    box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
    transform: scale(1.02);
  }

  .btn-action:active:not(:disabled) {
    transform: scale(0.98);
  }

  .btn-action:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .style-select select {
    width: 100%;
    background: #111111;
    border: 1px solid #003311;
    color: #00ff41;
    padding: 0.5rem;
    font-family: inherit;
    font-size: 0.875rem;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .style-select select:focus {
    border-color: #00ff41;
    box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
    outline: none;
  }

  .category-tabs {
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  .category-tab {
    background: #0a0a0a;
    border: 1px solid #003311;
    color: #00aa2a;
    padding: 0.375rem 0.75rem;
    font-family: inherit;
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .category-tab:hover {
    border-color: #00ff41;
    color: #00ff41;
    background: #001100;
  }

  .category-tab.active {
    background: #00ff41;
    color: #0a0a0a;
    border-color: #00ff41;
    box-shadow: 0 0 10px rgba(0, 255, 65, 0.4);
  }

  .topic-list {
    max-height: 300px;
    overflow-y: auto;
    margin: 0.75rem 0;
  }

  .topic-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: #0a0a0a;
    border: 1px solid #001100;
    margin-bottom: 0.375rem;
    transition: all 0.2s ease;
  }

  .topic-item:hover {
    border-color: #003311;
    background: #111111;
  }

  .topic-btn {
    flex: 1;
    background: none;
    border: none;
    color: #00ff41;
    padding: 0;
    font-family: inherit;
    font-size: 0.8rem;
    cursor: pointer;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.2s ease;
  }

  .topic-btn:hover {
    color: #00cc33;
    text-shadow: 0 0 5px rgba(0, 255, 65, 0.5);
  }

  .btn-similar {
    background: #003311;
    border: 1px solid #003311;
    color: #00aa2a;
    padding: 0.25rem 0.5rem;
    font-family: inherit;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .btn-similar:hover {
    background: #00ff41;
    color: #0a0a0a;
    border-color: #00ff41;
    transform: rotate(180deg);
  }

  .suggestions-footer {
    display: flex;
    justify-content: center;
    padding-top: 0.75rem;
    border-top: 1px dashed #003311;
  }

  .suggestions-footer .btn-random {
    padding: 0.5rem 1.5rem;
    font-size: 0.875rem;
  }

  .terminal.transitioning .player-section,
  .terminal.transitioning .post-actions {
    opacity: 0.5;
    transform: scale(0.98);
    transition: all 0.15s ease;
  }
</style>