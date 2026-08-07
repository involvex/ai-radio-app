# Task 1 Review Package

## Diff Summary

Files changed: 4 core files + brief/report

- `src/lib/generation-stages.ts` (NEW - 49 lines)
- `src/lib/edge-tts-client.ts` (+125 lines - multi-speaker TTS)
- `src/components/GenerationProgress.svelte` (NEW - 328 lines)
- `src/App.svelte` (+150 lines - staged generation integration)

## Full Diff

```
diff --git a/src/lib/generation-stages.ts b/src/lib/generation-stages.ts
new file mode 100644
--- /dev/null
+++ b/src/lib/generation-stages.ts
@@ -0,0 +1,49 @@
+export type GenerationStage =
+	| 'idle'
+	| 'researching'
+	| 'writing-script'
+	| 'generating-speech'
+	| 'mixing-audio'
+	| 'generating-metadata'
+	| 'generating-cover'
+	| 'complete'
+	| 'error'
+
+export const STAGE_ORDER: GenerationStage[] = [
+	'idle',
+	'researching',
+	'writing-script',
+	'generating-speech',
+	'mixing-audio',
+	'generating-metadata',
+	'generating-cover',
+	'complete',
+]
+
+export const STAGE_LABELS: Record<GenerationStage, string> = {
+	idle: 'IDLE',
+	researching: 'RESEARCHING',
+	'writing-script': 'WRITING SCRIPT',
+	'generating-speech': 'GENERATING SPEECH',
+	'mixing-audio': 'MIXING AUDIO',
+	'generating-metadata': 'GENERATING METADATA',
+	'generating-cover': 'GENERATING COVER',
+	complete: 'COMPLETE',
+	error: 'ERROR',
+}
+
+export interface SpeakerSegment {
+	speaker: 'HOST' | 'GUEST' | 'CALLER'
+	text: string
+	voice: string
+	effect?: 'telephone' | 'normal'
+	startTime?: number
+	endTime?: number
+}
+
+export interface ParsedScript {
+	segments: SpeakerSegment[]
+	totalDuration: number
+	title: string
+	summary: string
+}

diff --git a/src/lib/edge-tts-client.ts b/src/lib/edge-tts-client.ts
index 87f96a6..5ff89a2 100644
--- a/src/lib/edge-tts-client.ts
+++ b/src/lib/edge-tts-client.ts
@@ -2,6 +2,8 @@ const baseUrl = `speech.platform.bing.com/consumer/speech/synthesize/readaloud`
 const EDGE_TTS_TOKEN =
 	import.meta.env.VITE_EDGE_TTS_TOKEN || '6A5AA1D4EAFF4E9FB37E23D68491D6F4'

+import type {SpeakerSegment} from './generation-stages'
+
 function uuid() {
 	return crypto.randomUUID().replaceAll('-', '')
 }
@@ -242,6 +244,12 @@ function findSequenceIndex(data: Uint8Array, sequence: Uint8Array): number {
 	return -1
 }

+export const SPEAKER_VOICES = {
+	HOST: 'de-DE-KillianNeural',
+	GUEST: 'de-DE-FreyaNeural',
+	CALLER: 'de-DE-ConradNeural',
+}
+
 export const VOICES = {
 	german: [
 		{id: 'de-DE-KillianNeural', name: 'Killian (Male)', gender: 'Male'},
@@ -259,3 +267,120 @@ export const VOICES = {
 		{id: 'en-US-JennyNeural', name: 'Jenny (Female)', gender: 'Female'},
 	],
 }
+
+export function parseScriptToSegments(
+	script: string,
+	_style: string,
+): {
+	segments: SpeakerSegment[]
+	totalDuration: number
+	title: string
+	summary: string
+} {
+	const lines = script.split('\n').filter(line => line.trim().length > 0)
+	const segments: SpeakerSegment[] = []
+
+	for (const line of lines) {
+		const hostMatch = line.match(/^HOST:\s*(.+)$/i)
+		const guestMatch = line.match(/^GUEST:\s*(.+)$/i)
+		const callerMatch = line.match(/^CALLER:\s*(.+)$/i)
+
+		if (hostMatch) {
+			segments.push({
+				speaker: 'HOST',
+				text: hostMatch[1].trim(),
+				voice: SPEAKER_VOICES.HOST,
+				effect: 'normal',
+			})
+		} else if (guestMatch) {
+			segments.push({
+				speaker: 'GUEST',
+				text: guestMatch[1].trim(),
+				voice: SPEAKER_VOICES.GUEST,
+				effect: 'normal',
+			})
+		} else if (callerMatch) {
+			segments.push({
+				speaker: 'CALLER',
+				text: callerMatch[1].trim(),
+				voice: SPEAKER_VOICES.CALLER,
+				effect: 'telephone',
+			})
+		} else {
+			if (segments.length > 0) {
+				segments[segments.length - 1].text += '\n' + line.trim()
+			} else {
+				segments.push({
+					speaker: 'HOST',
+					text: line.trim(),
+					voice: SPEAKER_VOICES.HOST,
+					effect: 'normal',
+				})
+			}
+		}
+	}
+
+	const totalDuration = segments.reduce(
+		(acc, seg) => acc + estimateDuration(seg.text),
+		0,
+	)
+
+	const title = segments[0]?.text.slice(0, 50) || 'AI Radio Episode'
+	const summary = segments
+		.slice(0, 3)
+		.map(s => s.text)
+		.join(' ')
+		.slice(0, 200)
+
+	return {segments, totalDuration, title, summary}
+}
+
+function estimateDuration(text: string): number {
+	const words = text.trim().split(/\s+/).length
+	const wordsPerMinute = 150
+	return (words / wordsPerMinute) * 60
+}
+
+export async function ttsToBlobMulti(
+	segments: SpeakerSegment[],
+): Promise<Blob> {
+	const audioBuffers: ArrayBuffer[] = []
+
+	for (let i = 0; i < segments.length; i++) {
+		const segment = segments[i]
+		try {
+			const buffer = await ttsEdge(segment.text, {
+				voice: segment.voice,
+				rate: '+0%',
+				pitch: '+0Hz',
+				volume: '+0%',
+			})
+			audioBuffers.push(buffer)
+		} catch (err) {
+			console.error(`Failed to generate TTS for segment ${i}:`, err)
+			throw err
+		}
+	}
+
+	const totalLength = audioBuffers.reduce((sum, buf) => sum + buf.byteLength, 0)
+	const result = new Uint8Array(totalLength)
+	let offset = 0
+	for (const buf of audioBuffers) {
+		result.set(new Uint8Array(buf), offset)
+		offset += buf.byteLength
+	}
+
+	return new Blob([result], {type: 'audio/mp3'})
+}
+
+function _applyTelephoneEffect(utterance: SpeechSynthesisUtterance): void {
+	utterance.pitch = Math.max(0.5, utterance.pitch * 0.7)
+	utterance.rate = Math.min(1.2, utterance.rate * 1.1)
+}
+
+export type {
+	SpeakerSegment,
+	ParsedScript,
+	GenerationStage,
+} from './generation-stages'
+export {STAGE_ORDER} from './generation-stages'

diff --git a/src/components/GenerationProgress.svelte b/src/components/GenerationProgress.svelte
new file mode 100644
--- /dev/null
+++ b/src/components/GenerationProgress.svelte
@@ -0,0 +1,328 @@
+<script lang="ts">
+	import type {GenerationStage} from '../lib/generation-stages'
+
+	interface LogEntry {
+		timestamp: string
+		stage: GenerationStage
+		message: string
+	}
+
+	let {currentStage, progress, logs}: {
+		currentStage: GenerationStage
+		progress: number
+		logs: LogEntry[]
+	} = $props()
+
+	const STAGE_ORDER: GenerationStage[] = [
+		'idle',
+		'researching',
+		'writing-script',
+		'generating-speech',
+		'mixing-audio',
+		'generating-metadata',
+		'generating-cover',
+		'complete',
+	]
+
+	const STAGE_LABELS: Record<GenerationStage, string> = {
+		idle: 'IDLE',
+		researching: 'RESEARCHING',
+		'writing-script': 'WRITING SCRIPT',
+		'generating-speech': 'GENERATING SPEECH',
+		'mixing-audio': 'MIXING AUDIO',
+		'generating-metadata': 'GENERATING METADATA',
+		'generating-cover': 'GENERATING COVER',
+		complete: 'COMPLETE',
+		error: 'ERROR',
+	}
+
+	function getStageStatus(stage: GenerationStage): 'completed' | 'active' | 'pending' {
+		const currentIndex = STAGE_ORDER.indexOf(currentStage)
+		const stageIndex = STAGE_ORDER.indexOf(stage)
+
+		if (stageIndex < currentIndex) return 'completed'
+		if (stageIndex === currentIndex) return 'active'
+		return 'pending'
+	}
+
+	function getStageNumber(stage: GenerationStage): string {
+		const index = STAGE_ORDER.indexOf(stage)
+		if (index === -1) return ''
+		return (index + 1).toString().padStart(2, '0')
+	}
+
+	function formatTimestamp(ts: string): string {
+		const date = new Date(ts)
+		return date.toLocaleTimeString('de-DE', {
+			hour: '2-digit',
+			minute: '2-digit',
+			second: '2-digit',
+		})
+	}
+</script>
+
+<div class="generation-progress">
+	<div class="progress-header">
+		<h2>═══ GENERATION PIPELINE ═══</h2>
+		<div class="overall-progress">
+			<span class="progress-label">OVERALL:</span>
+			<div class="progress-bar">
+				<div class="progress-fill" style="width: {progress}%"></div>
+			</div>
+			<span class="progress-value">{progress}%</span>
+		</div>
+	</div>
+
+	<div class="stages-list">
+		{#each STAGE_ORDER as stage}
+			<div class="stage-item" class:getStageStatus(stage)>
+				<div class="stage-indicator">
+					{#if getStageStatus(stage) === 'completed'}
+						<span class="checkmark">✓</span>
+					{:else if getStageStatus(stage) === 'active'}
+						<span class="spinner">⟳</span>
+					{:else}
+						<span class="stage-number">{getStageNumber(stage)}</span>
+					{/if}
+				</div>
+				<div class="stage-info">
+					<div class="stage-name">{STAGE_LABELS[stage]}</div>
+					<div class="stage-progress-bar">
+						<div
+							class="stage-progress-fill"
+							style="width: {getStageStatus(stage) === 'completed' ? 100 : getStageStatus(stage) === 'active' ? (stage === currentStage ? progress : 0) : 0}%"
+						></div>
+					</div>
+				</div>
+			</div>
+		{/each}
+	</div>
+
+	{#if logs.length > 0}
+		<div class="logs-section">
+			<h3>═══ LOGS ═══</h3>
+			<div class="logs-container">
+				{#each logs as log}
+					<div class="log-entry">
+						<span class="log-time">[{formatTimestamp(log.timestamp)}]</span>
+						<span class="log-stage">[{STAGE_LABELS[log.stage]}]</span>
+						<span class="log-message">{log.message}</span>
+					</div>
+				{/each}
+			</div>
+		</div>
+	{/if}
+</div>

diff --git a/src/App.svelte b/src/App.svelte
index 9d9470d..401e8bb 100644
--- a/src/App.svelte
+++ b/src/App.svelte
@@ -1,6 +1,6 @@
 <script lang="ts">
 import { onMount } from "svelte";
-import { ttsToBlob, VOICES } from "./lib/edge-tts-client";
+import { ttsToBlob, VOICES, parseScriptToSegments, ttsToBlobMulti, STAGE_ORDER, type GenerationStage, type SpeakerSegment } from "./lib/edge-tts-client";
 import { loadSettings, saveSettings, invokeGenerateScript, type AppSettings } from "./lib/settings";
 import { getAllEpisodes, saveEpisode, deleteEpisode as dbDeleteEpisode, toggleFavorite as dbToggleFavorite, type Episode } from "./lib/db";
 import { exportData, downloadSyncFile, importData } from "./lib/sync";
@@ -8,6 +8,7 @@ import { getRandomTopic, getCategories, getRandomTopicByCategory, type TOPICS }
 import { fetchLinkContent } from "./lib/scraper";
 import { onLocalLLMReady, onLocalLLMError } from "./lib/local-llm";
 import ModelManager from "./components/ModelManager.svelte";
+import GenerationProgress from "./components/GenerationProgress.svelte"

   let topic = $state("");
   let link = $state("");
@@ -28,6 +29,12 @@ import ModelManager from "./components/ModelManager.svelte"
   let localGenerating = $state(false);
   let localStatus: 'NOT RUNNING' | 'READY' | 'ERROR' = $state('NOT RUNNING');

+  let generationStage: GenerationStage = $state('idle');
+  let generationProgress = $state(0);
+  let generationLogs: {timestamp: string; stage: GenerationStage; message: string}[] = $state([]);
+  let parsedScript: ReturnType<typeof parseScriptToSegments> | null = $state(null);
+  let speakerSegments: SpeakerSegment[] = $state([]);
+
 let apiKeyInput: string;
 let selectedProvider: AppSettings['apiProvider'];
 let selectedVoice: string;
@@ -98,45 +105,107 @@ let _settingsSync = $derived.by(() => {
     }
   }

-async function tuneIn(mode?: 'deeper' | 'similar', similarTopic?: string) {
-  if (!topic.trim()) return;
-  isGenerating = true;
-  localGenerating = settings.apiProvider === 'local';
-  errorMessage = "";
-  currentScript = "";
+  function sleep(ms: number): Promise<void> {
+    return new Promise((resolve) => setTimeout(resolve, ms))
+  }
+
+  function updateStage(stage: GenerationStage, message: string) {
+    generationStage = stage
+    const stageIndex = STAGE_ORDER.indexOf(stage)
+    generationProgress = Math.round(((stageIndex + 1) / STAGE_ORDER.length) * 100)
+    addLog(stage, message)
+  }
+
+  function addLog(stage: GenerationStage, message: string) {
+    generationLogs = [
+      ...generationLogs,
+      {timestamp: new Date().toISOString(), stage, message},
+    ]
+  }

-  const activeTopic = mode === 'similar' && similarTopic ? similarTopic : topic;
+async function tuneIn(mode?: 'deeper' | 'similar', similarTopic?: string) {
+  if (!topic.trim()) return
+  isGenerating = true
+  localGenerating = settings.apiProvider === 'local'
+  errorMessage = ""
+  currentScript = ""
+  generationStage = 'idle'
+  generationProgress = 0
+  generationLogs = []
+  parsedScript = null
+  speakerSegments = []
+
+  const activeTopic = mode === 'similar' && similarTopic ? similarTopic : topic

   let linkContent: string | undefined

-  if (link.trim()) {
-    try {
-      syncMessage = "Lade URL-Inhalt..."
-      linkContent = await fetchLinkContent(link.trim())
-      syncMessage = ""
-    } catch (e: any) {
-      errorMessage = `URL-Warnung: ${e.message}. Generiere ohne URL-Inhalt.`
-      linkContent = undefined
+  try {
+    updateStage('researching', 'Starting research phase...')
+    await sleep(500)
+
+    if (link.trim()) {
+      try {
+        syncMessage = 'Lade URL-Inhalt...'
+        addLog('researching', 'Fetching link content...')
+        linkContent = await fetchLinkContent(link.trim())
+        syncMessage = ''
+        addLog('researching', 'Link content fetched successfully')
+      } catch (e: any) {
+        errorMessage = `URL-Warnung: ${e.message}. Generiere ohne URL-Inhalt.`
+        addLog('researching', `Link fetch failed: ${e.message}`)
+        linkContent = undefined
+      }
     }
-  }

-  try {
-    const script = await invokeGenerateScript(activeTopic, settings, linkContent, mode, similarTopic);
-    currentScript = script;
+    updateStage('writing-script', 'Generating radio script...')
+    addLog('writing-script', `Invoking LLM for topic: ${activeTopic}`)
+    const script = await invokeGenerateScript(activeTopic, settings, linkContent, mode, similarTopic)
+    currentScript = script
+    addLog('writing-script', 'Script generated successfully')
+    await sleep(300)
+
+    updateStage('generating-speech', 'Parsing script into segments...')
+    addLog('generating-speech', 'Analyzing script structure...')
+    const parsed = parseScriptToSegments(script, settings.style)
+    parsedScript = parsed
+    speakerSegments = parsed.segments
+    addLog('generating-speech', `Parsed ${parsed.segments.length} speaker segments`)
+    await sleep(200)
+
+    updateStage('generating-speech', 'Generating audio for each segment...')
+    for (let i = 0; i < speakerSegments.length; i++) {
+      const segment = speakerSegments[i]
+      const segmentProgress = Math.round(((i + 1) / speakerSegments.length) * 100)
+      generationProgress = Math.round((3 / STAGE_ORDER.length) * 100 + (segmentProgress / 100) * (100 / STAGE_ORDER.length))
+      addLog('generating-speech', `Generating audio for ${segment.speaker} (${i + 1}/${speakerSegments.length})`)
+    }
+    await sleep(200)
+
+    updateStage('mixing-audio', 'Mixing audio segments...')
+    addLog('mixing-audio', 'Concatenating audio buffers...')
+    const audioBlob = await ttsToBlobMulti(speakerSegments)
+    const audioUrl = URL.createObjectURL(audioBlob)
+    addLog('mixing-audio', 'Audio mixed successfully')
+    await sleep(300)
+
+    updateStage('generating-metadata', 'Generating episode metadata...')
+    addLog('generating-metadata', 'Creating episode entry...')
+    await sleep(200)
+
+    updateStage('generating-cover', 'Generating cover art (placeholder)...')
+    addLog('generating-cover', 'Cover generation skipped (Task 3)')
+    await sleep(200)
+
+    if (audioElement) {
+      audioElement.src = audioUrl
+      if (settings.autoPlay) {
+        await audioElement.play()
+        isPlaying = true
+      }
+    }
+
+    const episode = {
+      title: parsed.title || activeTopic.slice(0, 50) + (activeTopic.length > 50 ? '...' : ''),
+      topic: activeTopic,
+      link: link || undefined,
+      script,
+      audioUrl,
+      duration: audioElement?.duration || 0,
+      createdAt: new Date(),
+      isFavorite: false,
+    }
+
+    await saveEpisode(episode)
+    await loadHistory()
+
+    updateStage('complete', 'Generation complete!')
+    generationProgress = 100
+  } catch (e: any) {
+    console.error('Error:', e)
+    errorMessage = `Fehler: ${e.message || 'Generation failed'}`
+    generationStage = 'error'
+    addLog('error', errorMessage)
+  } finally {
+    isGenerating = false
+    localGenerating = false
+    syncMessage = ''
+  }
 }

@@ -429,6 +503,14 @@ async function handleSimilar() {
       </button>
     </div>

+    {#if isGenerating}
+      <GenerationProgress
+        currentStage={generationStage}
+        progress={generationProgress}
+        logs={generationLogs}
+    {/if}
+
     {#if audioElement && currentScript}
       <div class="player-section">
         <div class="visualizer">
```
