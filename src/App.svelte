<script lang="ts">
  import { onMount } from "svelte";
  import { ttsToBlob, VOICES } from "./lib/edge-tts-client";
  import { loadSettings, saveSettings, generateScript, type AppSettings } from "./lib/settings";
  import { getAllEpisodes, saveEpisode, deleteEpisode as dbDeleteEpisode, toggleFavorite as dbToggleFavorite, type Episode } from "./lib/db";
  import { exportData, downloadSyncFile, importData } from "./lib/sync";

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
  let history: Episode[] = $state([]);
  let settings: AppSettings = $state(loadSettings());
  let errorMessage = $state("");
  let syncMessage = $state("");
  let isSyncing = $state(false);

  let apiKeyInput = $state(settings.apiKey);
  let selectedProvider = $state(settings.apiProvider);
  let selectedVoice = $state(settings.defaultVoice);
  let fileInput: HTMLInputElement | null = $state(null);

  onMount(async () => {
    settings = loadSettings();
    apiKeyInput = settings.apiKey;
    selectedProvider = settings.apiProvider;
    selectedVoice = settings.defaultVoice;
    await loadHistory();
  });

  async function loadHistory() {
    try {
      history = await getAllEpisodes();
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }

  async function tuneIn() {
    if (!topic.trim()) return;
    isGenerating = true;
    errorMessage = "";
    currentScript = "";

    try {
      const script = await generateScript(topic, settings);
      currentScript = script;

      const audioBlob = await ttsToBlob(script, { voice: selectedVoice });
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioElement) {
        audioElement.src = audioUrl;
        if (settings.autoPlay) {
          await audioElement.play();
          isPlaying = true;
        }
      }

      const episode = {
        title: topic.slice(0, 50) + (topic.length > 50 ? "..." : ""),
        topic,
        link: link || undefined,
        script,
        audioUrl,
        duration: audioElement?.duration || 0,
        createdAt: new Date(),
        isFavorite: false,
      };

      await saveEpisode(episode);
      await loadHistory();
    } catch (e: any) {
      console.error("Error:", e);
      errorMessage = `Fehler: ${e.message || "Generation failed"}`;
    } finally {
      isGenerating = false;
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
    if (audioElement && episode.audioUrl) {
      audioElement.src = episode.audioUrl;
      await audioElement.play();
      isPlaying = true;
    }
    showHistory = false;
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
    showSettings = true;
  }

  function closeSettings() {
    showSettings = false;
  }

  function saveSettingsAndClose() {
    settings = {
      ...settings,
      apiKey: apiKeyInput,
      apiProvider: selectedProvider,
      defaultVoice: selectedVoice,
    };
    saveSettings(settings);
    showSettings = false;
  }

  function clearApiKey() {
    apiKeyInput = "";
    selectedProvider = "none";
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

<main class="terminal">
  <header class="header">
    <h1>📡 AI_RADIO_v1.0.0</h1>
    <div class="header-actions">
      <button class="icon-btn" onclick={openSettings} title="Settings">⚙</button>
      <span class="status-indicator">
        {isGenerating ? "GENERATING..." : "READY"}
        {#if settings.apiProvider === "none"}
          <span class="badge">OFFLINE</span>
        {/if}
      </span>
    </div>
  </header>

  <div class="content">
    {#if errorMessage}
      <div class="error-banner">{errorMessage}</div>
    {/if}

    <div class="input-group">
      <label for="topic">> TOPIC:</label>
      <input
        id="topic"
        type="text"
        bind:value={topic}
        placeholder="Enter topic or paste link..."
        disabled={isGenerating}
      />
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
        onclick={tuneIn}
        disabled={isGenerating || !topic.trim()}
      >
        {isGenerating ? "[ GENERATING... ]" : "[ ▶ TUNE IN ]"}
      </button>

      {#if audioElement && currentScript}
        <button class="btn-secondary" onclick={togglePlayPause}>
          {isPlaying ? "[ ⏸ PAUSE ]" : "[ ▶ PLAY ]"}
        </button>
      {/if}

      <button class="btn-history" onclick={() => showHistory = !showHistory}>
        [ 📜 HISTORY ]
      </button>
    </div>

    {#if audioElement && currentScript}
      <div class="player-section">
        <div class="visualizer">
          {#each Array(20) as _, i}
            <div
              class="bar"
              style="animation-delay: {i * 50}ms; height: {isPlaying ? Math.random() * 100 : 20}%"
            ></div>
          {/each}
        </div>

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

      <div class="script-preview">
        <p>{currentScript.slice(0, 300)}{currentScript.length > 300 ? "..." : ""}</p>
      </div>
    {/if}
  </div>

  {#if showHistory}
    <div class="history-panel">
      <div class="history-header">
        <h2>═══ HISTORY ═══</h2>
        <button onclick={() => showHistory = false}>[ ✕ ]</button>
      </div>

      <div class="history-list">
        {#if history.length === 0}
          <p class="empty">No episodes yet...</p>
        {:else}
          {#each history as episode}
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
    <div class="settings-overlay" onclick={closeSettings} role="dialog" aria-modal="true">
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
  :global(body) {
    font-family: "Courier New", monospace;
    background: #0a0a0a;
    color: #00ff41;
    min-height: 100vh;
    margin: 0;
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
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #003311;
    padding-bottom: 1rem;
    margin-bottom: 2rem;
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

  .icon-btn {
    background: none;
    border: 1px solid #003311;
    color: #00ff41;
    padding: 0.5rem;
    cursor: pointer;
    font-size: 1.2rem;
  }

  .icon-btn:hover {
    background: #003311;
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
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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
    transition: border-color 0.2s;
  }

  .input-group input:focus {
    border-color: #00ff41;
    box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
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
  }

  .btn-primary, .btn-secondary, .btn-history {
    background: #003311;
    border: 1px solid #00ff41;
    color: #00ff41;
    padding: 0.75rem 1.5rem;
    font-family: inherit;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary:hover:not(:disabled), .btn-secondary:hover, .btn-history:hover {
    background: #00ff41;
    color: #0a0a0a;
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.4);
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
  }

  .visualizer {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 4px;
    height: 60px;
    margin-bottom: 1rem;
  }

  .bar {
    width: 8px;
    background: #00ff41;
    animation: pulse 0.5s ease-in-out infinite alternate;
    min-height: 4px;
  }

  @keyframes pulse {
    from { opacity: 0.5; }
    to { opacity: 1; }
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

  .provider-option input, .checkbox-option input {
    accent-color: #00ff41;
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
  }

  .voice-select select:focus {
    border-color: #00ff41;
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
</style>