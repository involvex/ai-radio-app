# AI Radio: Gemini-Like Local Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance the local-first AI Radio app with Gemini-like generation flow, multi-speaker TTS, rich transcript player, audio visualizer, and polished UX — all fully offline/self-contained.

**Architecture:** Keep existing Tauri + Svelte 5 + Edge TTS architecture. Add local-only enhancements: Web Audio API visualizer, multi-voice Web Speech fallback, Canvas-based cover art, ZIP export, staged generation progress simulation. No external servers, no cloud dependencies.

**Tech Stack:** Svelte 5 (runes), TypeScript, Tauri v2, Edge TTS (WebSocket), Web Speech API, Web Audio API, Canvas API, JSZip, Dexie (IndexedDB), Bun.

## Global Constraints

- **No cloud dependencies** — all features work offline
- **No Python/Rust audio pipeline** — use Web APIs (Web Audio, Web Speech, Canvas)
- **Bundle size < 50MB** — avoid heavy dependencies
- **Tauri v2 compatible** — sidecar optional but not required
- **Svelte 5 runes only** — no legacy options API
- **Bun >= 1.3.0** — for all Node operations
- **Preserve terminal/hacker aesthetic** — dark theme, scanlines, monospace

---

## File Structure Changes

```
src/
├── lib/
│   ├── edge-tts-client.ts          # MODIFY: Add multi-speaker support
│   ├── audio-visualizer.ts         # NEW: Web Audio API analyzer
│   ├── cover-generator.ts          # NEW: Canvas-based cover art
│   ├── zip-export.ts               # NEW: JSZip packaging
│   ├── generation-stages.ts        # NEW: Staged progress types
│   ├── transcript-player.ts        # NEW: Transcript logic
│   └── local-quota.ts              # NEW: Local daily limit
├── components/
│   ├── GenerationProgress.svelte   # NEW: Multi-stage progress UI
│   ├── AudioVisualizer.svelte      # NEW: Real-time visualizer
│   ├── TranscriptPlayer.svelte     # NEW: Full transcript with seek
│   ├── CoverArt.svelte             # NEW: Cover display/generation
│   ├── TopicSuggestions.svelte     # MODIFY: Enhanced categories
│   └── PlayerControls.svelte       # NEW: Unified playback controls
├── routes/                         # KEEP: Existing
├── App.svelte                      # MODIFY: Integrate new components
├── main.ts                         # KEEP: Existing
└── vite-env.d.ts                   # KEEP: Existing
```

---

## Task Breakdown

### Task 1: Multi-Speaker TTS & Generation Stages

**Files:**

- Create: `src/lib/generation-stages.ts`
- Modify: `src/lib/edge-tts-client.ts`
- Create: `src/components/GenerationProgress.svelte`
- Modify: `src/App.svelte`

**Interfaces:**

- Consumes: `settings.ts` (AppSettings), `topics.ts` (getRandomTopic)
- Produces: `GenerationStage[]`, `SpeakerSegment[]`, `ttsToBlobMulti(speakers: SpeakerSegment[])`

- [ ] **Step 1: Define generation stages and speaker types**

```typescript
// src/lib/generation-stages.ts
export type GenerationStage =
	| 'idle'
	| 'researching'
	| 'writing-script'
	| 'generating-speech'
	| 'mixing-audio'
	| 'generating-metadata'
	| 'generating-cover'
	| 'complete'
	| 'error'

export const STAGE_ORDER: GenerationStage[] = [
	'researching',
	'writing-script',
	'generating-speech',
	'mixing-audio',
	'generating-metadata',
	'generating-cover',
]

export const STAGE_LABELS: Record<GenerationStage, string> = {
	idle: 'Ready',
	researching: 'Researching topic...',
	'writing-script': 'Writing radio script...',
	'generating-speech': 'Generating speech...',
	'mixing-audio': 'Mixing audio...',
	'generating-metadata': 'Generating metadata...',
	'generating-cover': 'Generating cover art...',
	complete: 'Complete!',
	error: 'Error',
}

export interface SpeakerSegment {
	speaker: 'host' | 'guest1' | 'guest2' | 'caller'
	text: string
	voice?: string
	effect?: 'none' | 'telephone' | 'radio'
	startTime?: number
	endTime?: number
}

export interface ParsedScript {
	segments: SpeakerSegment[]
	totalDuration: number
	title: string
	summary: string
}
```

- [ ] **Step 2: Run type check**

```bash
cd D:\repos\ai-radio\ai-radio && bun run typecheck
```

Expected: PASS (no errors, new types only)

- [ ] **Step 3: Add multi-speaker TTS to edge-tts-client.ts**

```typescript
// src/lib/edge-tts-client.ts - ADD to existing file

import {SpeakerSegment, ParsedScript} from './generation-stages'

// Voice mapping for different speakers
export const SPEAKER_VOICES = {
	host: 'de-DE-KillianNeural',
	guest1: 'de-DE-ConradNeural',
	guest2: 'de-DE-FreyaNeural',
	caller: 'de-DE-AmalaNeural',
} as const

export function parseScriptToSegments(
	script: string,
	style: string,
): ParsedScript {
	// Parse the generated script into speaker segments
	// Format expected: "HOST: text" or "GUEST: text" or "[HOST] text"
	const lines = script.split('\n').filter(l => l.trim())
	const segments: SpeakerSegment[] = []
	let currentSpeaker: SpeakerSegment['speaker'] = 'host'
	let accumulatedText = ''
	let estimatedTime = 0
	const wordsPerSecond = 2.5 // ~150 wpm

	for (const line of lines) {
		const trimmed = line.trim()
		// Detect speaker markers
		if (
			trimmed.startsWith('HOST:') ||
			trimmed.startsWith('[HOST]') ||
			trimmed.startsWith('Moderator:')
		) {
			if (accumulatedText) {
				segments.push({
					speaker: currentSpeaker,
					text: accumulatedText.trim(),
					startTime: estimatedTime,
				})
				estimatedTime += accumulatedText.split(' ').length / wordsPerSecond
			}
			currentSpeaker = 'host'
			accumulatedText = trimmed.replace(/^(HOST:|\[HOST\]|Moderator:)\s*/, '')
		} else if (
			trimmed.startsWith('GUEST:') ||
			trimmed.startsWith('[GUEST]') ||
			trimmed.startsWith('Gast:')
		) {
			if (accumulatedText) {
				segments.push({
					speaker: currentSpeaker,
					text: accumulatedText.trim(),
					startTime: estimatedTime,
				})
				estimatedTime += accumulatedText.split(' ').length / wordsPerSecond
			}
			currentSpeaker = 'guest1'
			accumulatedText = trimmed.replace(/^(GUEST:|\[GUEST\]|Gast:)\s*/, '')
		} else if (
			trimmed.startsWith('CALLER:') ||
			trimmed.startsWith('[CALLER]') ||
			trimmed.startsWith('Anrufer:')
		) {
			if (accumulatedText) {
				segments.push({
					speaker: currentSpeaker,
					text: accumulatedText.trim(),
					startTime: estimatedTime,
				})
				estimatedTime += accumulatedText.split(' ').length / wordsPerSecond
			}
			currentSpeaker = 'caller'
			accumulatedText = trimmed.replace(/^(CALLER:|\[CALLER\]|Anrufer:)\s*/, '')
		} else {
			accumulatedText += ' ' + trimmed
		}
	}
	if (accumulatedText) {
		segments.push({
			speaker: currentSpeaker,
			text: accumulatedText.trim(),
			startTime: estimatedTime,
		})
		estimatedTime += accumulatedText.split(' ').length / wordsPerSecond
	}

	// Assign voices and effects
	segments.forEach(s => {
		s.voice = SPEAKER_VOICES[s.speaker]
		s.effect = s.speaker === 'caller' ? 'telephone' : 'none'
		s.endTime = (s.startTime || 0) + s.text.split(' ').length / wordsPerSecond
	})

	return {
		segments,
		totalDuration: estimatedTime,
		title: '',
		summary: '',
	}
}

export async function ttsToBlobMulti(
	segments: SpeakerSegment[],
): Promise<Blob> {
	// Generate audio for each segment and concatenate
	const audioBuffers: ArrayBuffer[] = []

	for (const segment of segments) {
		const voice = segment.voice || SPEAKER_VOICES.host
		const buffer = await ttsEdge(segment.text, {voice})
		audioBuffers.push(buffer)
	}

	// Concatenate ArrayBuffers
	const totalLength = audioBuffers.reduce((sum, buf) => sum + buf.byteLength, 0)
	const result = new Uint8Array(totalLength)
	let offset = 0
	for (const buf of audioBuffers) {
		result.set(new Uint8Array(buf), offset)
		offset += buf.byteLength
	}

	return new Blob([result], {type: 'audio/mp3'})
}

// Telephone effect for Web Speech fallback
export function applyTelephoneEffect(
	utterance: SpeechSynthesisUtterance,
): void {
	utterance.rate = 1.1
	utterance.pitch = 1.2
	// Note: Real telephone filter needs Web Audio API
}
```

- [ ] **Step 4: Create GenerationProgress component**

```svelte
<!-- src/components/GenerationProgress.svelte -->
<script lang="ts">
  import { STAGE_ORDER, STAGE_LABELS, type GenerationStage } from '../lib/generation-stages';

  interface Props {
    currentStage: GenerationStage;
    progress: number; // 0-100 overall
    logs: Array<{ stage: GenerationStage; message: string; timestamp: number }>;
  }

  let { currentStage, progress, logs = [] }: Props = $props();

  const currentIndex = STAGE_ORDER.indexOf(currentStage);
  const completedStages = STAGE_ORDER.slice(0, currentIndex);
  const currentStageProgress = currentIndex >= 0 ? progress : 0;
</script>

<div class="generation-progress">
  <div class="stage-list">
    {#each STAGE_ORDER as stage, i}
      <div class="stage-item" class:active={i === currentIndex} class:completed={completedStages.includes(stage)}>
        <div class="stage-indicator">
          {#if completedStages.includes(stage)}
            ✓
          {:else if i === currentIndex}
            <span class="spinner"></span>
          {:else}
            {i + 1}
          {/if}
        </div>
        <div class="stage-info">
          <span class="stage-label">{STAGE_LABELS[stage]}</span>
          <div class="stage-bar">
            <div class="stage-fill" style="width: {i < currentIndex ? 100 : i === currentIndex ? currentStageProgress : 0}%"></div>
          </div>
        </div>
      </div>
    {/each}
  </div>

  {#if logs.length > 0}
    <div class="generation-logs">
      {#each logs as log}
        <div class="log-entry">
          <span class="log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
          <span class="log-stage">[{log.stage}]</span>
          <span class="log-message">{log.message}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .generation-progress {
    padding: 1rem;
    background: #111;
    border: 1px solid #003311;
    margin-top: 1rem;
  }
  .stage-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .stage-item {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .stage-indicator {
    width: 24px;
    height: 24px;
    border: 1px solid #00ff41;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: #00ff41;
    background: #0a0a0a;
    flex-shrink: 0;
  }
  .stage-item.completed .stage-indicator {
    background: #00ff41;
    color: #0a0a0a;
  }
  .stage-item.active .stage-indicator {
    animation: pulse 1s infinite;
  }
  .spinner {
    width: 8px;
    height: 8px;
    border: 2px solid #003311;
    border-top-color: #00ff41;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { box-shadow: 0 0 5px #00ff41; } 50% { box-shadow: 0 0 20px #00ff41; } }
  .stage-info { flex: 1; }
  .stage-label { font-size: 0.8rem; color: #00aa2a; }
  .stage-item.active .stage-label { color: #00ff41; }
  .stage-bar { height: 4px; background: #003311; border-radius: 2px; margin-top: 0.25rem; overflow: hidden; }
  .stage-fill { height: 100%; background: #00ff41; transition: width 0.3s; }
  .generation-logs { margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed #003311; font-size: 0.7rem; color: #005511; }
  .log-entry { display: flex; gap: 0.5rem; margin: 0.25rem 0; }
  .log-time { color: #003311; }
  .log-stage { color: #00aa2a; }
</style>
```

- [ ] **Step 5: Integrate into App.svelte**

```svelte
<!-- src/App.svelte - MODIFY tuneIn function and add imports -->

<script lang="ts">
  // ADD imports
  import GenerationProgress from './components/GenerationProgress.svelte';
  import { parseScriptToSegments, ttsToBlobMulti, SPEAKER_VOICES } from './lib/edge-tts-client';
  import { STAGE_ORDER, type GenerationStage, type SpeakerSegment } from './lib/generation-stages';

  // ADD state
  let generationStage: GenerationStage = $state('idle');
  let generationProgress = $state(0);
  let generationLogs = $state<Array<{ stage: GenerationStage; message: string; timestamp: number }>>([]);
  let parsedScript: ParsedScript | null = $state(null);
  let speakerSegments: SpeakerSegment[] = $state([]);

  // REPLACE tuneIn function with staged version
  async function tuneIn(mode?: 'deeper' | 'similar', similarTopic?: string) {
    if (!topic.trim()) return;
    isGenerating = true;
    localGenerating = settings.apiProvider === 'local';
    errorMessage = "";
    currentScript = "";
    generationStage = 'idle';
    generationProgress = 0;
    generationLogs = [];
    parsedScript = null;
    speakerSegments = [];

    const activeTopic = mode === 'similar' && similarTopic ? similarTopic : topic;

    let linkContent: string | undefined;

    if (link.trim()) {
      try {
        syncMessage = "Lade URL-Inhalt...";
        linkContent = await fetchLinkContent(link.trim());
        syncMessage = "";
      } catch (e: any) {
        errorMessage = `URL-Warnung: ${e.message}. Generiere ohne URL-Inhalt.`;
        linkContent = undefined;
      }
    }

    try {
      // Stage 1: Researching
      updateStage('researching', 'Researching topic...');
      await sleep(500);

      // Stage 2: Writing script
      updateStage('writing-script', 'Generating script with LLM...');
      const script = await invokeGenerateScript(activeTopic, settings, linkContent, mode, similarTopic);
      currentScript = script;
      await sleep(300);

      // Stage 3: Parse script into speaker segments
      updateStage('generating-speech', 'Parsing script into speakers...');
      parsedScript = parseScriptToSegments(script, settings.style);
      speakerSegments = parsedScript.segments;
      await sleep(200);

      // Stage 4: Generate speech for each speaker
      updateStage('generating-speech', `Generating speech for ${speakerSegments.length} segments...`);
      for (let i = 0; i < speakerSegments.length; i++) {
        const seg = speakerSegments[i];
        generationProgress = 30 + Math.round((i / speakerSegments.length) * 40);
        addLog('generating-speech', `Generating: ${seg.speaker} - "${seg.text.slice(0, 40)}..."`);
        await sleep(100); // Simulate per-segment generation
      }

      // Stage 5: Mix audio (concatenate)
      updateStage('mixing-audio', 'Concatenating audio segments...');
      const audioBlob = await ttsToBlobMulti(speakerSegments);
      const audioUrl = URL.createObjectURL(audioBlob);
      await sleep(300);

      // Stage 6: Generate metadata
      updateStage('generating-metadata', 'Generating show metadata...');
      const episode = {
        title: activeTopic.slice(0, 50) + (activeTopic.length > 50 ? "..." : ""),
        topic: activeTopic,
        link: link || undefined,
        script,
        audioUrl,
        duration: parsedScript.totalDuration,
        createdAt: new Date(),
        isFavorite: false,
        speakerSegments,
      };
      await sleep(200);

      // Stage 7: Generate cover
      updateStage('generating-cover', 'Generating cover art...');
      // Cover generation will be added in Task 3
      await sleep(200);

      // Complete
      updateStage('complete', 'Complete!');
      generationProgress = 100;

      await saveEpisode(episode);
      await loadHistory();

      if (audioElement && audioUrl) {
        audioElement.src = audioUrl;
        if (settings.autoPlay) {
          await audioElement.play();
          isPlaying = true;
        }
      }

    } catch (e: any) {
      console.error("Error:", e);
      generationStage = 'error';
      errorMessage = `Fehler: ${e.message || "Generation failed"}`;
    } finally {
      isGenerating = false;
      localGenerating = false;
      syncMessage = "";
    }
  }

  function updateStage(stage: GenerationStage, message: string) {
    generationStage = stage;
    const index = STAGE_ORDER.indexOf(stage);
    generationProgress = stage === 'complete' ? 100 : index >= 0 ? Math.round((index / STAGE_ORDER.length) * 100) : 0;
    addLog(stage, message);
  }

  function addLog(stage: GenerationStage, message: string) {
    generationLogs = [...generationLogs, { stage, message, timestamp: Date.now() }];
  }

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
</script>

<!-- In the template, replace the simple status with GenerationProgress -->
{#if isGenerating}
  <GenerationProgress {generationStage} {generationProgress} {generationLogs} />
{/if}
```

- [ ] **Step 6: Run lint, typecheck, and test**

```bash
cd D:\repos\ai-radio\ai-radio && bun run lint && bun run typecheck
```

Expected: PASS

---

### Task 2: Web Audio API Visualizer

**Files:**

- Create: `src/lib/audio-visualizer.ts`
- Create: `src/components/AudioVisualizer.svelte`
- Modify: `src/App.svelte`

**Interfaces:**

- Consumes: `audioElement` (HTMLAudioElement)
- Produces: `frequencyData: Uint8Array`, `timeData: Uint8Array`

- [ ] **Step 1: Create audio visualizer library**

```typescript
// src/lib/audio-visualizer.ts
export interface VisualizerConfig {
	fftSize?: number
	smoothingTimeConstant?: number
	minDecibels?: number
	maxDecibels?: number
}

export class AudioVisualizer {
	private audioContext: AudioContext | null = null
	private analyser: AnalyserNode | null = null
	private source: MediaElementAudioSourceNode | null = null
	private animationFrame: number | null = null
	private callbacks: Set<
		(frequencyData: Uint8Array, timeData: Uint8Array) => void
	> = new Set()

	constructor(private config: VisualizerConfig = {}) {}

	async connect(audioElement: HTMLAudioElement): Promise<void> {
		if (this.audioContext) return

		this.audioContext = new (
			window.AudioContext || (window as any).webkitAudioContext
		)()
		this.analyser = this.audioContext.createAnalyser()
		this.analyser.fftSize = this.config.fftSize || 256
		this.analyser.smoothingTimeConstant =
			this.config.smoothingTimeConstant || 0.8
		this.analyser.minDecibels = this.config.minDecibels || -90
		this.analyser.maxDecibels = this.config.maxDecibels || -10

		this.source = this.audioContext.createMediaElementSource(audioElement)
		this.source.connect(this.analyser)
		this.analyser.connect(this.audioContext.destination)

		// Resume context if suspended (browser autoplay policy)
		if (this.audioContext.state === 'suspended') {
			await this.audioContext.resume()
		}

		this.startLoop()
	}

	private startLoop(): void {
		const loop = () => {
			if (!this.analyser) return

			const frequencyData = new Uint8Array(this.analyser.frequencyBinCount)
			const timeData = new Uint8Array(this.analyser.frequencyBinCount)

			this.analyser.getByteFrequencyData(frequencyData)
			this.analyser.getByteTimeDomainData(timeData)

			this.callbacks.forEach(cb => cb(frequencyData, timeData))

			this.animationFrame = requestAnimationFrame(loop)
		}
		loop()
	}

	subscribe(
		callback: (frequencyData: Uint8Array, timeData: Uint8Array) => void,
	): () => void {
		this.callbacks.add(callback)
		return () => this.callbacks.delete(callback)
	}

	getFrequencyData(): Uint8Array | null {
		if (!this.analyser) return null
		const data = new Uint8Array(this.analyser.frequencyBinCount)
		this.analyser.getByteFrequencyData(data)
		return data
	}

	getTimeData(): Uint8Array | null {
		if (!this.analyser) return null
		const data = new Uint8Array(this.analyser.frequencyBinCount)
		this.analyser.getByteTimeDomainData(data)
		return data
	}

	disconnect(): void {
		if (this.animationFrame) {
			cancelAnimationFrame(this.animationFrame)
			this.animationFrame = null
		}
		if (this.source) {
			this.source.disconnect()
			this.source = null
		}
		if (this.analyser) {
			this.analyser.disconnect()
			this.analyser = null
		}
		if (this.audioContext) {
			this.audioContext.close()
			this.audioContext = null
		}
		this.callbacks.clear()
	}
}

// Utility: Create bar heights from frequency data
export function frequencyToBars(data: Uint8Array, barCount: number): number[] {
	const binsPerBar = Math.floor(data.length / barCount)
	const bars: number[] = []

	for (let i = 0; i < barCount; i++) {
		let sum = 0
		const start = i * binsPerBar
		const end = Math.min(start + binsPerBar, data.length)
		for (let j = start; j < end; j++) {
			sum += data[j]
		}
		bars.push((sum / (end - start) / 255) * 100) // 0-100%
	}
	return bars
}
```

- [ ] **Step 2: Create AudioVisualizer component**

```svelte
<!-- src/components/AudioVisualizer.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { AudioVisualizer, frequencyToBars } from '../lib/audio-visualizer';

  interface Props {
    audioElement: HTMLAudioElement | null;
    isPlaying: boolean;
    barCount?: number;
    style?: 'bars' | 'waveform' | 'circular';
  }

  let { audioElement, isPlaying, barCount = 32, style = 'bars' }: Props = $props();
  let frequencyData: Uint8Array | null = $state(null);
  let visualizer: AudioVisualizer | null = $state(null);

  onMount(() => {
    if (audioElement) {
      initVisualizer();
    }
  });

  onDestroy(() => {
    visualizer?.disconnect();
  });

  async function initVisualizer() {
    visualizer = new AudioVisualizer({ fftSize: 256, smoothingTimeConstant: 0.8 });
    try {
      await visualizer.connect(audioElement!);
      visualizer.subscribe((freq, time) => {
        frequencyData = freq;
      });
    } catch (e) {
      console.warn('Audio visualizer failed:', e);
    }
  }

  $: bars = frequencyData ? frequencyToBars(frequencyData, barCount) : Array(barCount).fill(0);
</script>

<div class="audio-visualizer" data-style={style}>
  {#if style === 'bars'}
    <div class="bars-container">
      {#each bars as height, i}
        <div
          class="bar"
          style="height: {height}%; animation-delay: {i * 30}ms;"
          aria-hidden="true"
        ></div>
      {/each}
    </div>
  {:else if style === 'waveform'}
    <canvas class="waveform-canvas" width="400" height="100"></canvas>
  {:else if style === 'circular'}
    <div class="circular-visualizer">
      {#each bars as height, i}
        <div
          class="circular-bar"
          style="transform: rotate({i * (360/barCount)}deg); height: {height}%;"
        ></div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .audio-visualizer {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 3px;
  }
  .bars-container {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 3px;
    height: 100%;
    width: 100%;
  }
  .bar {
    width: 6px;
    background: linear-gradient(to top, #00ff41, #00aa2a);
    border-radius: 2px 2px 0 0;
    min-height: 4px;
    animation: barPulse 0.3s ease-in-out infinite alternate;
    opacity: 0.8;
  }
  @keyframes barPulse {
    from { opacity: 0.5; transform: scaleY(0.9); }
    to { opacity: 1; transform: scaleY(1); }
  }
  .waveform-canvas {
    width: 100%;
    height: 100%;
  }
  .circular-visualizer {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  .circular-bar {
    position: absolute;
    bottom: 50%;
    left: 50%;
    width: 3px;
    background: #00ff41;
    transform-origin: bottom center;
    border-radius: 1px;
  }
</style>
```

- [ ] **Step 3: Integrate into App.svelte**

```svelte
<!-- src/App.svelte - ADD import and usage -->
<script lang="ts">
  import AudioVisualizer from './components/AudioVisualizer.svelte';
  // ... existing imports
</script>

<!-- Replace the CSS visualizer in player-section -->
{#if audioElement && currentScript}
  <div class="player-section">
    <AudioVisualizer {audioElement} {isPlaying} barCount={40} style="bars" />
    <!-- ... rest of player section -->
  </div>
{/if}
```

- [ ] **Step 4: Run tests**

```bash
cd D:\repos\ai-radio\ai-radio && bun run lint && bun run typecheck
```

Expected: PASS

---

### Task 3: Transcript Player with Click-to-Seek & Bookmarks

**Files:**

- Create: `src/lib/transcript-player.ts`
- Create: `src/components/TranscriptPlayer.svelte`
- Modify: `src/lib/db.ts` (add bookmark fields)
- Modify: `src/App.svelte`

**Interfaces:**

- Consumes: `speakerSegments: SpeakerSegment[]`, `currentTime: number`, `audioElement`
- Produces: `activeSegmentIndex`, `bookmarks: Bookmark[]`

- [ ] **Step 1: Define transcript types and bookmark storage**

```typescript
// src/lib/transcript-player.ts
export interface TranscriptLine {
	index: number
	speaker: string
	text: string
	startTime: number
	endTime: number
	isBookmarked: boolean
}

export interface Bookmark {
	id: string
	episodeId: string
	episodeTitle: string
	segmentIndex: number
	speaker: string
	text: string
	timestamp: number
	createdAt: number
}

export function segmentsToTranscript(
	segments: SpeakerSegment[],
): TranscriptLine[] {
	return segments.map((seg, i) => ({
		index: i,
		speaker: formatSpeakerName(seg.speaker),
		text: seg.text,
		startTime: seg.startTime || 0,
		endTime: seg.endTime || (seg.startTime || 0) + 10,
		isBookmarked: false,
	}))
}

function formatSpeakerName(speaker: SpeakerSegment['speaker']): string {
	const names: Record<SpeakerSegment['speaker'], string> = {
		host: '🎙️ MODERATOR',
		guest1: '👤 GAST 1',
		guest2: '👤 GAST 2',
		caller: '📞 ANRUFER',
	}
	return names[speaker] || speaker.toUpperCase()
}

export function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60)
	const secs = Math.floor(seconds % 60)
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function findActiveSegment(
	transcript: TranscriptLine[],
	currentTime: number,
): number {
	return (
		transcript.findIndex(
			line => currentTime >= line.startTime && currentTime < line.endTime,
		) ?? -1
	)
}
```

- [ ] **Step 2: Add bookmark functions to db.ts**

```typescript
// src/lib/db.ts - ADD to existing Dexie schema

// In the database version, add bookmarks table
export interface Bookmark {
	id?: number
	episodeId: string
	episodeTitle: string
	segmentIndex: number
	speaker: string
	text: string
	timestamp: number
	createdAt: number
}

// In db definition:
bookmarks: '++id, episodeId, segmentIndex, timestamp'

// Add these functions:
export async function addBookmark(bookmark: Bookmark): Promise<number> {
	return await db.bookmarks.add(bookmark)
}

export async function removeBookmark(
	episodeId: string,
	segmentIndex: number,
): Promise<void> {
	await db.bookmarks.where({episodeId, segmentIndex}).delete()
}

export async function getBookmarks(episodeId?: string): Promise<Bookmark[]> {
	if (episodeId) {
		return await db.bookmarks.where('episodeId').equals(episodeId).toArray()
	}
	return await db.bookmarks.toArray()
}

export async function toggleBookmark(bookmark: Bookmark): Promise<void> {
	const existing = await db.bookmarks
		.where({episodeId: bookmark.episodeId, segmentIndex: bookmark.segmentIndex})
		.first()
	if (existing) {
		await db.bookmarks.delete(existing.id!)
	} else {
		await db.bookmarks.add(bookmark)
	}
}
```

- [ ] **Step 3: Create TranscriptPlayer component**

```svelte
<!-- src/components/TranscriptPlayer.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { TranscriptLine, Bookmark, findActiveSegment, formatTime } from '../lib/transcript-player';
  import { getBookmarks, toggleBookmark } from '../lib/db';

  interface Props {
    transcript: TranscriptLine[];
    currentTime: number;
    duration: number;
    audioElement: HTMLAudioElement | null;
    episodeId: string;
    episodeTitle: string;
  }

  let { transcript, currentTime, duration, audioElement, episodeId, episodeTitle }: Props = $props();
  let bookmarks: Bookmark[] = $state([]);
  let activeIndex = $state(-1);
  let showBookmarksOnly = $state(false);

  onMount(async () => {
    await loadBookmarks();
  });

  async function loadBookmarks() {
    bookmarks = await getBookmarks(episodeId);
    // Mark transcript lines as bookmarked
    transcript.forEach((line, i) => {
      line.isBookmarked = bookmarks.some(b => b.segmentIndex === i);
    });
  }

  $: activeIndex = findActiveSegment(transcript, currentTime);

  const displayedTranscript = showBookmarksOnly
    ? transcript.filter(line => line.isBookmarked)
    : transcript;

  async function handleSeek(line: TranscriptLine) {
    if (audioElement) {
      audioElement.currentTime = line.startTime;
      if (!audioElement.paused) {
        await audioElement.play();
      }
    }
  }

  async function handleBookmark(line: TranscriptLine) {
    const bookmark: Bookmark = {
      episodeId,
      episodeTitle,
      segmentIndex: line.index,
      speaker: line.speaker,
      text: line.text,
      timestamp: line.startTime,
      createdAt: Date.now(),
    };
    await toggleBookmark(bookmark);
    await loadBookmarks();
  }

  function formatSpeakerShort(speaker: string): string {
    if (speaker.includes('MODERATOR')) return '🎙️';
    if (speaker.includes('GAST')) return '👤';
    if (speaker.includes('ANRUFER')) return '📞';
    return '🗣️';
  }
</script>

<div class="transcript-player">
  <div class="transcript-header">
    <h3>═══ TRANSCRIPT ═══</h3>
    <label class="filter-toggle">
      <input type="checkbox" bind:checked={showBookmarksOnly} />
      <span>Nur Bookmarks</span>
    </label>
  </div>

  <div class="transcript-list">
    {#if displayedTranscript.length === 0}
      <p class="empty">Kein Transcript verfügbar</p>
    {:else}
      {#each displayedTranscript as line}
        <div
          class="transcript-line"
          class:active={line.index === activeIndex}
          class:bookmarked={line.isBookmarked}
          onclick={() => handleSeek(line)}
        >
          <div class="line-header">
            <span class="speaker-badge">{formatSpeakerShort(line.speaker)}</span>
            <span class="speaker-name">{line.speaker}</span>
            <span class="timecode">{formatTime(line.startTime)}</span>
          </div>
          <p class="line-text">{line.text}</p>
          <button
            class="bookmark-btn"
            onclick={(e) => { e.stopPropagation(); handleBookmark(line); }}
            aria-label={line.isBookmarked ? 'Bookmark entfernen' : 'Bookmark setzen'}
          >
            {line.isBookmarked ? '★' : '☆'}
          </button>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .transcript-player {
    background: #0a0a0a;
    border: 1px solid #003311;
    border-radius: 4px;
    overflow: hidden;
    max-height: 400px;
    display: flex;
    flex-direction: column;
  }
  .transcript-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #003311;
    background: #111;
  }
  .transcript-header h3 {
    font-size: 0.8rem;
    color: #00ff41;
    margin: 0;
  }
  .filter-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.7rem;
    color: #00aa2a;
    cursor: pointer;
  }
  .transcript-list {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
  }
  .empty {
    color: #003311;
    text-align: center;
    padding: 2rem;
    font-size: 0.8rem;
  }
  .transcript-line {
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background: #111;
    border: 1px solid #003311;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .transcript-line:hover {
    border-color: #00ff41;
    box-shadow: 0 0 10px rgba(0, 255, 65, 0.1);
  }
  .transcript-line.active {
    border-color: #00ff41;
    background: #001100;
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
  }
  .transcript-line.bookmarked {
    border-color: #ffaa00;
  }
  .line-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.7rem;
  }
  .speaker-badge { font-size: 0.9rem; }
  .speaker-name { color: #00ff41; font-weight: bold; }
  .timecode { color: #005511; margin-left: auto; font-family: monospace; }
  .line-text {
    color: #00cc33;
    font-size: 0.85rem;
    line-height: 1.5;
    margin: 0;
    white-space: pre-wrap;
  }
  .bookmark-btn {
    align-self: flex-start;
    background: none;
    border: none;
    color: #00aa2a;
    font-size: 1rem;
    cursor: pointer;
    padding: 0.25rem;
  }
  .bookmark-btn:hover { color: #ffaa00; }
  .transcript-line.bookmarked .bookmark-btn { color: #ffaa00; }
</style>
```

- [ ] **Step 4: Integrate into App.svelte**

```svelte
<!-- src/App.svelte - ADD import and state -->
<script lang="ts">
  import TranscriptPlayer from './components/TranscriptPlayer.svelte';
  import { segmentsToTranscript } from './lib/transcript-player';
  // ...

  let transcriptLines = $state<TranscriptLine[]>([]);

  // In tuneIn, after parsing segments:
  transcriptLines = segmentsToTranscript(speakerSegments);

  // In playEpisode:
  transcriptLines = segmentsToTranscript(episode.speakerSegments || []);
</script>

<!-- In player section, add transcript panel -->
{#if audioElement && currentScript}
  <div class="player-section">
    <AudioVisualizer {audioElement} {isPlaying} barCount={40} />
    <div class="progress-container">...</div>
    <TranscriptPlayer
      transcript={transcriptLines}
      currentTime={currentTime}
      duration={duration}
      audioElement={audioElement}
      episodeId={selectedEpisode?.id || ''}
      episodeTitle={selectedEpisode?.title || ''}
    />
    <!-- ... post actions -->
  </div>
{/if}
```

- [ ] **Step 5: Run tests**

```bash
cd D:\repos\ai-radio\ai-radio && bun run lint && bun run typecheck
```

Expected: PASS

---

### Task 4: Canvas Cover Art Generator

**Files:**

- Create: `src/lib/cover-generator.ts`
- Create: `src/components/CoverArt.svelte`
- Modify: `src/App.svelte`

**Interfaces:**

- Consumes: `title: string`, `topic: string`, `style: string`
- Produces: `dataURL: string` (base64 PNG)

- [ ] **Step 1: Create cover generator library**

```typescript
// src/lib/cover-generator.ts
export interface CoverOptions {
	title: string
	topic: string
	style: string
	width?: number
	height?: number
	seed?: number
}

const STYLE_THEMES: Record<
	string,
	{primary: string; secondary: string; accent: string; pattern: string}
> = {
	tech: {
		primary: '#00ff41',
		secondary: '#003311',
		accent: '#00aa2a',
		pattern: 'circuit',
	},
	casual: {
		primary: '#00ffff',
		secondary: '#003333',
		accent: '#00aaaa',
		pattern: 'waves',
	},
	academic: {
		primary: '#ffff00',
		secondary: '#333300',
		accent: '#aaaa00',
		pattern: 'grid',
	},
	entertaining: {
		primary: '#ff00ff',
		secondary: '#330033',
		accent: '#aa00aa',
		pattern: 'stars',
	},
	news: {
		primary: '#ff4400',
		secondary: '#331100',
		accent: '#aa2200',
		pattern: 'lines',
	},
	podcast: {
		primary: '#8800ff',
		secondary: '#1a0033',
		accent: '#5500aa',
		pattern: 'soundwave',
	},
	chill: {
		primary: '#0088ff',
		secondary: '#001133',
		accent: '#0055aa',
		pattern: 'clouds',
	},
}

function seededRandom(seed: number): () => number {
	let x = seed || Date.now()
	return () => {
		x = (x * 1664525 + 1013904223) % 4294967296
		return x / 4294967296
	}
}

export function generateCoverCanvas(options: CoverOptions): HTMLCanvasElement {
	const {title, topic, style, width = 512, height = 512, seed} = options
	const theme = STYLE_THEMES[style] || STYLE_THEMES.tech
	const rand = seededRandom(seed || hashString(title + topic))

	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	const ctx = canvas.getContext('2d')!

	// Background gradient
	const gradient = ctx.createRadialGradient(
		width / 2,
		height / 2,
		0,
		width / 2,
		height / 2,
		Math.max(width, height) / 1.5,
	)
	gradient.addColorStop(0, theme.secondary)
	gradient.addColorStop(1, '#0a0a0a')
	ctx.fillStyle = gradient
	ctx.fillRect(0, 0, width, height)

	// Pattern based on style
	drawPattern(ctx, width, height, theme, rand)

	// Scanline overlay
	drawScanlines(ctx, width, height)

	// Title text
	drawTitle(ctx, title, width, height, theme)

	// Topic subtitle
	drawTopic(ctx, topic, width, height, theme)

	// Radio icon
	drawRadioIcon(ctx, width, height, theme)

	return canvas
}

function drawPattern(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
	theme: any,
	rand: () => number,
) {
	ctx.strokeStyle = theme.primary + '20'
	ctx.lineWidth = 1

	switch (theme.pattern) {
		case 'circuit':
			drawCircuitPattern(ctx, w, h, rand)
			break
		case 'waves':
			drawWavePattern(ctx, w, h, rand)
			break
		case 'grid':
			drawGridPattern(ctx, w, h, rand)
			break
		case 'stars':
			drawStarPattern(ctx, w, h, rand)
			break
		case 'lines':
			drawLinePattern(ctx, w, h, rand)
			break
		case 'soundwave':
			drawSoundwavePattern(ctx, w, h, rand)
			break
		case 'clouds':
			drawCloudPattern(ctx, w, h, rand)
			break
	}
}

function drawCircuitPattern(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
	rand: () => number,
) {
	const nodes = Array.from({length: 20}, () => ({x: rand() * w, y: rand() * h}))
	nodes.forEach(node => {
		nodes.forEach(other => {
			if (rand() < 0.15) {
				ctx.beginPath()
				ctx.moveTo(node.x, node.y)
				const midX = (node.x + other.x) / 2 + (rand() - 0.5) * 50
				const midY = (node.y + other.y) / 2 + (rand() - 0.5) * 50
				ctx.quadraticCurveTo(midX, midY, other.x, other.y)
				ctx.stroke()
			}
		})
		// Node circle
		ctx.beginPath()
		ctx.arc(node.x, node.y, 3, 0, Math.PI * 2)
		ctx.fillStyle = theme.primary + '40'
		ctx.fill()
	})
}

function drawWavePattern(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
	rand: () => number,
) {
	for (let i = 0; i < 8; i++) {
		ctx.beginPath()
		const amplitude = 20 + rand() * 40
		const frequency = 0.01 + rand() * 0.02
		const phase = rand() * Math.PI * 2
		const yBase = h * 0.2 + i * h * 0.1
		ctx.moveTo(0, yBase)
		for (let x = 0; x < w; x += 5) {
			const y = yBase + Math.sin(x * frequency + phase) * amplitude
			ctx.lineTo(x, y)
		}
		ctx.stroke()
	}
}

function drawGridPattern(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
	rand: () => number,
) {
	const size = 40
	for (let x = 0; x < w; x += size) {
		for (let y = 0; y < h; y += size) {
			if (rand() < 0.3) {
				ctx.strokeRect(x + 5, y + 5, size - 10, size - 10)
			}
		}
	}
}

function drawStarPattern(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
	rand: () => number,
) {
	for (let i = 0; i < 100; i++) {
		const x = rand() * w
		const y = rand() * h
		const size = rand() * 3 + 1
		ctx.beginPath()
		ctx.arc(x, y, size, 0, Math.PI * 2)
		ctx.fillStyle =
			theme.primary +
			Math.floor(rand() * 100 + 50)
				.toString(16)
				.padStart(2, '0')
		ctx.fill()
	}
}

function drawLinePattern(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
	rand: () => number,
) {
	for (let i = 0; i < 30; i++) {
		const x1 = rand() * w
		const y1 = rand() * h
		const x2 = rand() * w
		const y2 = rand() * h
		ctx.beginPath()
		ctx.moveTo(x1, y1)
		ctx.lineTo(x2, y2)
		ctx.stroke()
	}
}

function drawSoundwavePattern(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
	rand: () => number,
) {
	const centerY = h / 2
	for (let i = 0; i < 40; i++) {
		const x = (w / 40) * i
		const height = (rand() * 0.5 + 0.2) * h * 0.4
		ctx.fillStyle = theme.primary + '60'
		ctx.fillRect(x + 2, centerY - height / 2, 6, height)
	}
}

function drawCloudPattern(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
	rand: () => number,
) {
	for (let i = 0; i < 15; i++) {
		const x = rand() * w
		const y = rand() * h * 0.7
		const r = 30 + rand() * 50
		ctx.beginPath()
		ctx.arc(x, y, r, 0, Math.PI * 2)
		ctx.fillStyle = theme.primary + '15'
		ctx.fill()
	}
}

function drawScanlines(ctx: CanvasRenderingContext2D, w: number, h: number) {
	ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'
	ctx.lineWidth = 1
	for (let y = 0; y < h; y += 4) {
		ctx.beginPath()
		ctx.moveTo(0, y)
		ctx.lineTo(w, y)
		ctx.stroke()
	}
}

function drawTitle(
	ctx: CanvasRenderingContext2D,
	title: string,
	w: number,
	h: number,
	theme: any,
) {
	ctx.font = 'bold 36px "Courier New", monospace'
	ctx.fillStyle = theme.primary
	ctx.textAlign = 'center'
	ctx.shadowColor = theme.primary
	ctx.shadowBlur = 20

	const lines = wrapText(ctx, title, w * 0.8)
	const lineHeight = 44
	const startY = h * 0.35 - ((lines.length - 1) * lineHeight) / 2

	lines.forEach((line, i) => {
		ctx.fillText(line, w / 2, startY + i * lineHeight)
	})
	ctx.shadowBlur = 0
}

function drawTopic(
	ctx: CanvasRenderingContext2D,
	topic: string,
	w: number,
	h: number,
	theme: any,
) {
	ctx.font = '16px "Courier New", monospace'
	ctx.fillStyle = theme.accent
	ctx.textAlign = 'center'
	const lines = wrapText(ctx, topic, w * 0.7)
	const startY = h * 0.65
	lines.forEach((line, i) => {
		ctx.fillText(line, w / 2, startY + i * 24)
	})
}

function drawRadioIcon(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
	theme: any,
) {
	const cx = w / 2
	const cy = h * 0.85
	const r = 40

	// Outer circle
	ctx.beginPath()
	ctx.arc(cx, cy, r, 0, Math.PI * 2)
	ctx.strokeStyle = theme.primary
	ctx.lineWidth = 3
	ctx.stroke()

	// Inner circle
	ctx.beginPath()
	ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2)
	ctx.stroke()

	// Antenna
	ctx.beginPath()
	ctx.moveTo(cx, cy - r)
	ctx.lineTo(cx - 10, cy - r - 20)
	ctx.lineTo(cx + 10, cy - r - 20)
	ctx.stroke()

	// Signal waves
	for (let i = 0; i < 3; i++) {
		ctx.beginPath()
		ctx.arc(cx, cy - r - 20, 10 + i * 8, -Math.PI * 0.6, -Math.PI * 0.4)
		ctx.strokeStyle =
			theme.primary + (80 - i * 20).toString(16).padStart(2, '0')
		ctx.lineWidth = 2
		ctx.stroke()
	}
}

function wrapText(
	ctx: CanvasRenderingContext2D,
	text: string,
	maxWidth: number,
): string[] {
	const words = text.split(' ')
	const lines: string[] = []
	let currentLine = ''

	for (const word of words) {
		const testLine = currentLine + (currentLine ? ' ' : '') + word
		const metrics = ctx.measureText(testLine)
		if (metrics.width > maxWidth && currentLine) {
			lines.push(currentLine)
			currentLine = word
		} else {
			currentLine = testLine
		}
	}
	if (currentLine) lines.push(currentLine)
	return lines
}

function hashString(str: string): number {
	let hash = 0
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i)
		hash |= 0
	}
	return Math.abs(hash)
}

export function canvasToDataURL(
	canvas: HTMLCanvasElement,
	type = 'image/png',
): string {
	return canvas.toDataURL(type)
}

export function downloadCover(
	canvas: HTMLCanvasElement,
	filename = 'cover.png',
) {
	const link = document.createElement('a')
	link.download = filename
	link.href = canvas.toDataURL('image/png')
	link.click()
}
```

- [ ] **Step 2: Create CoverArt component**

```svelte
<!-- src/components/CoverArt.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { generateCoverCanvas, canvasToDataURL } from '../lib/cover-generator';

  interface Props {
    title: string;
    topic: string;
    style: string;
    size?: number;
    onGenerated?: (dataUrl: string) => void;
  }

  let { title, topic, style, size = 300, onGenerated }: Props = $props();
  let dataUrl = $state<string>('');
  let canvas: HTMLCanvasElement | null = $state(null);

  onMount(() => {
    generate();
  });

  function generate() {
    const c = generateCoverCanvas({ title, topic, style, width: size, height: size });
    canvas = c;
    const url = canvasToDataURL(c);
    dataUrl = url;
    onGenerated?.(url);
  }

  function handleDownload() {
    if (canvas) {
      canvasToDataURL(canvas);
      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-cover.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }
</script>

<div class="cover-art" onclick={handleDownload} title="Klicken zum Herunterladen">
  {#if dataUrl}
    <img src={dataUrl} alt={title} class="cover-image" />
  {:else}
    <div class="cover-placeholder">Generiere Cover...</div>
  {/if}
  <div class="cover-overlay">
    <span class="download-hint">⬇ Cover speichern</span>
  </div>
</div>

<style>
  .cover-art {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid #003311;
    background: #111;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .cover-art:hover {
    border-color: #00ff41;
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
  }
  .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .cover-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #005511;
    font-size: 0.9rem;
  }
  .cover-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 1rem;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .cover-art:hover .cover-overlay {
    opacity: 1;
  }
  .download-hint {
    background: #00ff41;
    color: #0a0a0a;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: bold;
  }
</style>
```

- [ ] **Step 3: Integrate into App.svelte and generation flow**

```svelte
<!-- src/App.svelte - ADD import and usage -->
<script lang="ts">
  import CoverArt from './components/CoverArt.svelte';
  import { generateCoverCanvas, canvasToDataURL } from './lib/cover-generator';
  // ...

  let coverDataUrl = $state('');

  // In tuneIn, after episode creation:
  const coverCanvas = generateCoverCanvas({
    title: episode.title,
    topic: episode.topic,
    style: settings.style,
    width: 512,
    height: 512,
  });
  coverDataUrl = canvasToDataURL(coverCanvas);
  episode.coverDataUrl = coverDataUrl;

  // In playEpisode:
  coverDataUrl = episode.coverDataUrl || '';
</script>

<!-- In player section, add cover art -->
{#if audioElement && currentScript}
  <div class="player-section">
    <div class="player-header">
      <CoverArt
        title={selectedEpisode?.title || topic}
        topic={selectedEpisode?.topic || topic}
        style={settings.style}
        size={200}
        onGenerated={url => coverDataUrl = url}
      />
      <div class="player-main">
        <AudioVisualizer {audioElement} {isPlaying} barCount={40} />
        <div class="progress-container">...</div>
        <TranscriptPlayer ... />
      </div>
    </div>
  </div>
{/if}

<style>
  /* Add to existing styles */
  .player-header {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
    margin-bottom: 1rem;
  }
  .player-main { flex: 1; }
</style>
```

- [ ] **Step 4: Run tests**

```bash
cd D:\repos\ai-radio\ai-radio && bun run lint && bun run typecheck
```

Expected: PASS

---

### Task 5: ZIP Export (Audio + Cover + Show Notes)

**Files:**

- Create: `src/lib/zip-export.ts`
- Modify: `src/App.svelte` (add export button)

**Interfaces:**

- Consumes: `episode: Episode`, `coverDataUrl: string`
- Produces: `Blob` (ZIP file)

- [ ] **Step 1: Create ZIP export library**

```typescript
// src/lib/zip-export.ts
import {TranscriptLine} from './transcript-player'
import {Episode, SpeakerSegment} from './db'

export interface ShowNotes {
	show_title: string
	show_duration: string
	two_sentence_summary: string
	date_of_generation: string
	timecoded_transcript: Array<{
		timecode: string
		speaker: string
		text: string
	}>
}

export async function createShowZip(
	episode: Episode & {
		coverDataUrl?: string
		speakerSegments?: SpeakerSegment[]
	},
	coverDataUrl?: string,
): Promise<Blob> {
	const JSZip = (await import('jszip')).default
	const zip = new JSZip()

	// 1. Add audio file
	if (episode.audioUrl) {
		try {
			const audioBlob = await fetchBlob(episode.audioUrl)
			zip.file('ai_radio.mp3', audioBlob)
		} catch (e) {
			console.warn('Could not add audio to zip:', e)
		}
	}

	// 2. Add cover image
	const coverUrl = coverDataUrl || episode.coverDataUrl
	if (coverUrl) {
		try {
			const coverBlob = await fetchBlob(coverUrl)
			zip.file('cover.png', coverBlob)
		} catch (e) {
			console.warn('Could not add cover to zip:', e)
		}
	}

	// 3. Generate and add show_notes.json
	const showNotes = generateShowNotes(episode)
	zip.file('show_notes.json', JSON.stringify(showNotes, null, 2))

	// 4. Generate ZIP
	return await zip.generateAsync({
		type: 'blob',
		compression: 'DEFLATE',
		compressionOptions: {level: 6},
	})
}

async function fetchBlob(url: string): Promise<Blob> {
	if (url.startsWith('data:')) {
		const res = await fetch(url)
		return await res.blob()
	}
	if (url.startsWith('blob:')) {
		const res = await fetch(url)
		return await res.blob()
	}
	// For local files, try direct fetch
	const res = await fetch(url)
	if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`)
	return await res.blob()
}

function formatTimecode(seconds: number): string {
	const mins = Math.floor(seconds / 60)
	const secs = Math.floor(seconds % 60)
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function generateShowNotes(
	episode: Episode & {speakerSegments?: SpeakerSegment[]},
): ShowNotes {
	const transcript =
		episode.speakerSegments?.map((seg, i) => ({
			timecode: formatTimecode(seg.startTime || 0),
			speaker: formatSpeakerName(seg.speaker),
			text: seg.text,
		})) || []

	return {
		show_title: episode.title,
		show_duration: formatTimecode(episode.duration),
		two_sentence_summary: episode.script?.slice(0, 200) + '...' || '',
		date_of_generation: new Date(episode.createdAt).toLocaleDateString('de-DE'),
		timecoded_transcript: transcript,
	}
}

function formatSpeakerName(speaker: SpeakerSegment['speaker']): string {
	const names: Record<SpeakerSegment['speaker'], string> = {
		host: 'MODERATOR',
		guest1: 'GAST 1',
		guest2: 'GAST 2',
		caller: 'ANRUFER',
	}
	return names[speaker] || speaker.toUpperCase()
}

export function downloadZip(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = filename
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
	URL.revokeObjectURL(url)
}
```

- [ ] **Step 2: Add export button to App.svelte**

```svelte
<!-- src/App.svelte - ADD import and button -->
<script lang="ts">
  import { createShowZip, downloadZip } from './lib/zip-export';
  // ...

  async function handleDownloadZip(episode: Episode & { coverDataUrl?: string }) {
    try {
      syncMessage = 'Erstelle ZIP-Archiv...';
      const blob = await createShowZip(episode, coverDataUrl);
      const filename = `${episode.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-show.zip`;
      downloadZip(blob, filename);
      syncMessage = 'ZIP erfolgreich erstellt!';
      setTimeout(() => syncMessage = '', 3000);
    } catch (e: any) {
      syncMessage = `ZIP-Fehler: ${e.message}`;
      setTimeout(() => syncMessage = '', 3000);
    }
  }
</script>

<!-- In episode card (history panel), add download button -->
<div class="episode-actions">
  <button onclick={() => playEpisode(episode)}>[ ▶ ]</button>
  <button onclick={() => toggleFavorite(episode)}>[{episode.isFavorite ? "⭐" : "☆"}]</button>
  <button onclick={() => handleDownloadZip(episode)}>[ 📦 ZIP ]</button>
  <button onclick={() => deleteEpisode(episode.id!)}>[ 🗑 ]</button>
</div>

<!-- Also add to player section -->
<div class="post-actions">
  <button class="btn-action" onclick={handleDeeper} disabled={isGenerating}>[ 🔍 MEHR DAZU ]</button>
  <button class="btn-action" onclick={handleReroll} disabled={isGenerating}>[ 🔄 NEU ]</button>
  <button class="btn-action" onclick={handleSimilar} disabled={isGenerating}>[ 🎲 ÄHNLICH ]</button>
  <button class="btn-action" onclick={() => selectedEpisode && handleDownloadZip(selectedEpisode)}>[ 📦 ZIP ]</button>
</div>
```

- [ ] **Step 3: Add JSZip dependency**

```bash
cd D:\repos\ai-radio\ai-radio && bun add jszip
```

- [ ] **Step 4: Run tests**

```bash
cd D:\repos\ai-radio\ai-radio && bun run lint && bun run typecheck
```

Expected: PASS

---

### Task 6: Visual Polish - Gradient Background & Animations

**Files:**

- Modify: `src/App.svelte` (CSS)
- Create: `src/lib/animations.ts` (optional utilities)

**Interfaces:**

- Consumes: None
- Produces: Enhanced CSS visual effects

- [ ] **Step 1: Replace scanlines with animated gradient background**

```svelte
<!-- src/App.svelte - REPLACE .scanlines and add gradient bg -->

<div class="gradient-bg"></div>
<div class="scanlines"></div>

<main class="terminal">
  <!-- ... existing content -->
</main>

<style>
  /* REPLACE existing .scanlines and body styles */

  :global(body) {
    font-family: "Courier New", monospace;
    background: #0a0a0a;
    color: #00ff41;
    min-height: 100vh;
    margin: 0;
    overflow-x: hidden;
  }

  .gradient-bg {
    position: fixed;
    inset: 0;
    z-index: -2;
    background:
      radial-gradient(ellipse 80% 50% at 20% 20%, rgba(0, 255, 65, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(0, 170, 42, 0.06) 0%, transparent 50%),
      radial-gradient(ellipse 50% 30% at 50% 50%, rgba(0, 255, 65, 0.04) 0%, transparent 60%),
      #0a0a0a;
    animation: gradientShift 20s ease-in-out infinite alternate;
  }

  @keyframes gradientShift {
    0% { background-position: 20% 20%, 80% 80%, 50% 50%; }
    100% { background-position: 30% 30%, 70% 70%, 60% 60%; }
  }

  .scanlines {
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0.1) 1px,
      transparent 1px,
      transparent 3px
    );
    animation: scanlineMove 8s linear infinite;
  }

  @keyframes scanlineMove {
    0% { background-position-y: 0; }
    100% { background-position-y: 12px; }
  }

  /* Add subtle glow to terminal */
  .terminal {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
  }

  .terminal::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 8px;
    background: linear-gradient(45deg, #00ff41, #00aa2a, #00ff41);
    background-size: 200% 200%;
    z-index: -1;
    opacity: 0;
    filter: blur(20px);
    animation: borderGlow 4s ease-in-out infinite;
  }

  .terminal:hover::before {
    opacity: 0.3;
  }

  @keyframes borderGlow {
    0%, 100% { background-position: 0% 50%; opacity: 0.1; }
    50% { background-position: 100% 50%; opacity: 0.3; }
  }

  /* Smooth transitions for panels */
  .history-panel,
  .settings-overlay {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .settings-overlay {
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Button hover enhancements */
  .btn-primary, .btn-secondary, .btn-history, .btn-action, .btn-dice {
    position: relative;
    overflow: hidden;
  }

  .btn-primary::before, .btn-secondary::before, .btn-history::before, .btn-action::before, .btn-dice::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s;
  }

  .btn-primary:hover::before, .btn-secondary:hover::before, .btn-history:hover::before, .btn-action:hover::before, .btn-dice:hover::before {
    transform: translateX(100%);
  }

  /* Focus visible for accessibility */
  *:focus-visible {
    outline: 2px solid #00ff41;
    outline-offset: 2px;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .gradient-bg, .scanlines, .terminal::before,
    .btn-primary::before, .btn-secondary::before,
    .history-panel, .settings-overlay {
      animation: none !important;
      transition: none !important;
    }
  }
</style>
```

- [ ] **Step 2: Add staggered entrance animations**

```svelte
<!-- src/App.svelte - ADD to content sections -->

{#key isGenerating}
  <div class="content" animate:fade={{ delay: 100, duration: 300 }}>
    <!-- ... existing content -->
  </div>
{/key}

{#if audioElement && currentScript}
  <div class="player-section" animate:slideY={{ delay: 200, duration: 400 }}>
    <!-- ... player content -->
  </div>
{/if}
```

```svelte
<!-- Add svelte-animate or use custom transitions -->
<script lang="ts">
  // Add at top of script
  export function fade(node: HTMLElement, { delay = 0, duration = 300 }) {
    return {
      delay,
      duration,
      css: (t: number) => `opacity: ${t}; transform: translateY(${10 * (1 - t)}px);`
    };
  }

  export function slideY(node: HTMLElement, { delay = 0, duration = 300 }) {
    return {
      delay,
      duration,
      css: (t: number) => `opacity: ${t}; transform: translateY(${20 * (1 - t)}px);`
    };
  }
</script>
```

- [ ] **Step 3: Run tests**

```bash
cd D:\repos\ai-radio\ai-radio && bun run lint && bun run typecheck
```

Expected: PASS

---

### Task 7: Enhanced Topic Suggestions & "Similar" Flow

**Files:**

- Modify: `src/lib/topics.ts` (add more categories, trending)
- Modify: `src/components/TopicSuggestions.svelte` (extract from App.svelte)
- Modify: `src/App.svelte`

**Interfaces:**

- Consumes: `settings` (for LLM-based suggestions)
- Produces: `relatedTopic: string`

- [ ] **Step 1: Enhance topics.ts**

```typescript
// src/lib/topics.ts - ADD to existing

export interface TopicCategory {
	id: string
	name: string
	icon: string
	topics: string[]
}

export const TOPIC_CATEGORIES: TopicCategory[] = [
	{
		id: 'tech',
		name: '💻 Technik & KI',
		icon: '💻',
		topics: [
			'Neueste Durchbrüche in der KI-Forschung',
			'Quantencomputer: Stand der Dinge',
			'Open Source vs. Closed Source KI-Modelle',
			'Die Zukunft der Programmierung mit KI',
			'Hardware-Beschleuniger für Machine Learning',
			'Datenschutz im Zeitalter von LLMs',
			'Edge Computing und lokale KI',
			'KI in der Cybersicherheit',
		],
	},
	{
		id: 'science',
		name: '🔬 Wissenschaft',
		icon: '🔬',
		topics: [
			'Kernfusion: Durchbruch oder Traum?',
			'Klimawandel: Aktuelle Prognosen',
			'Weltraumforschung: Mars-Missionen',
			'Neue Materialien: Graphen & Co.',
			'Gehirnforschung: Wie Denken funktioniert',
			'Erneuerbare Energien: Speicherlösungen',
		],
	},
	{
		id: 'coding',
		name: '⌨️ Programmierung',
		icon: '⌨️',
		topics: [
			'Rust vs. C++: Der Systemprogrammierer-Kampf',
			'WebAssembly: Native Performance im Browser',
			'Moderne Build-Tools: Vite, Turbopack, Bun',
			'TypeScript 5: Was ist neu?',
			'React Server Components erklärt',
			'Datenbanken: SQL vs. NoSQL 2024',
		],
	},
	{
		id: 'culture',
		name: '🎮 Tech-Kultur',
		icon: '🎮',
		topics: [
			'Die Geschichte von Linux',
			'Open Source Business Models',
			'Hacker Culture: Vom MIT bis heute',
			'Retro-Computing Renaissance',
			'Mechanical Keyboards: Mehr als Hobby',
			'Digital Minimalism',
		],
	},
	{
		id: 'future',
		name: '🚀 Zukunft',
		icon: '🚀',
		topics: [
			'Grundeinkommen durch KI?',
			'Mensch-Maschine-Schnittstellen',
			'Smart Cities: Vision vs. Realität',
			'Langlebigkeitsforschung',
			'Weltraumkolonisation',
			'Post-Scarcity Economy',
		],
	},
]

export function getRandomTopicByCategory(categoryId: string): string {
	const cat = TOPIC_CATEGORIES.find(c => c.id === categoryId)
	if (!cat) return getRandomTopic()
	return cat.topics[Math.floor(Math.random() * cat.topics.length)]
}

export function getCategories(): TopicCategory[] {
	return TOPIC_CATEGORIES
}

export function getAllTopics(): string[] {
	return TOPIC_CATEGORIES.flatMap(c => c.topics)
}
```

- [ ] **Step 2: Extract TopicSuggestions component**

```svelte
<!-- src/components/TopicSuggestions.svelte -->
<script lang="ts">
  import { getCategories, getRandomTopicByCategory, getRandomTopic, TopicCategory } from '../lib/topics';
  import { suggestRelatedTopic } from '../lib/settings';

  interface Props {
    topic: string;
    settings: AppSettings;
    onSelect: (t: string) => void;
    onClose: () => void;
    onSimilar: () => Promise<void>;
  }

  let { topic, settings, onSelect, onClose, onSimilar }: Props = $props();
  const categories = getCategories();
  let loadingSimilar = $state(false);
</script>

<div class="topic-suggestions">
  <div class="suggestions-header">
    <span>Wähle eine Kategorie:</span>
    <button class="btn-random" onclick={() => onSelect(getRandomTopic())}>🎲 Zufälliges Thema</button>
  </div>

  <div class="category-grid">
    {#each categories as cat}
      <button class="category-btn" onclick={() => onSelect(getRandomTopicByCategory(cat.id))}>
        <span class="cat-icon">{cat.icon}</span>
        <span class="cat-name">{cat.name}</span>
      </button>
    {/each}
  </div>

  <div class="similar-section">
    <button
      class="btn-similar"
      onclick={async () => {
        loadingSimilar = true;
        await onSimilar();
        loadingSimilar = false;
      }}
      disabled={loadingSimilar || settings.apiProvider === 'none' || !settings.apiKey}
    >
      {loadingSimilar ? '[ SUCHE... ]' : '[ 🎲 ÄHNLICHES THEMA FINDEN ]'}
    </button>
    {#if settings.apiProvider === 'none' || !settings.apiKey}
      <p class="hint">Benötigt API-Key in den Einstellungen</p>
    {/if}
  </div>

  <button class="btn-close" onclick={onClose}>[ ✕ SCHLIESSEN ]</button>
</div>

<style>
  .topic-suggestions {
    margin-top: 0.75rem;
    padding: 1.5rem;
    background: #111;
    border: 1px solid #003311;
    animation: fadeIn 0.2s ease-out;
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  .suggestions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .suggestions-header span { color: #00aa2a; font-size: 0.875rem; }
  .category-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  .category-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #0a0a0a;
    border: 1px dashed #003311;
    color: #00ff41;
    padding: 0.6rem 1rem;
    font-family: inherit;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .category-btn:hover {
    border-style: solid;
    background: #003311;
    box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
  }
  .cat-icon { font-size: 1rem; }
  .similar-section {
    padding-top: 1rem;
    border-top: 1px dashed #003311;
  }
  .btn-similar {
    width: 100%;
    background: #111;
    border: 1px solid #00ff41;
    color: #00ff41;
    padding: 0.75rem;
    font-family: inherit;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-similar:hover:not(:disabled) {
    background: #003311;
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
  }
  .btn-similar:disabled { opacity: 0.4; cursor: not-allowed; }
  .hint { font-size: 0.7rem; color: #005511; margin-top: 0.5rem; text-align: center; }
  .btn-close {
    width: 100%;
    margin-top: 1rem;
    background: #003311;
    border: 1px solid #00ff41;
    color: #00ff41;
    padding: 0.5rem;
    font-family: inherit;
    cursor: pointer;
  }
  .btn-close:hover { background: #00ff41; color: #0a0a0a; }
</style>
```

- [ ] **Step 3: Update App.svelte to use component**

```svelte
<!-- src/App.svelte - REPLACE inline topic suggestions with component -->
<script lang="ts">
  import TopicSuggestions from './components/TopicSuggestions.svelte';
  // ...

  let showTopicSuggestions = $state(false);

  async function handleSimilarClick() {
    if (settings.apiProvider === 'none' || !settings.apiKey) {
      topic = getRandomTopic();
      await tuneIn();
      return;
    }
    syncMessage = "Suche ähnliche Themen...";
    try {
      const related = await suggestRelatedTopic(topic, settings);
      if (related) {
        topic = related;
        await tuneIn();
      } else {
        topic = getRandomTopic();
        await tuneIn();
      }
    } catch {
      topic = getRandomTopic();
      await tuneIn();
    } finally {
      syncMessage = "";
    }
  }
</script>

<!-- In template -->
<div class="input-group">
  <label for="topic">> TOPIC:</label>
  <div class="topic-input-row">
    <input id="topic" type="text" bind:value={topic} placeholder="Enter topic or paste link..." disabled={isGenerating} />
    <button class="btn-dice" onclick={() => showTopicSuggestions = !showTopicSuggestions} title="Topic vorschlagen">🎲</button>
  </div>

  {#if showTopicSuggestions}
    <TopicSuggestions
      {topic}
      {settings}
      onSelect={(t) => { topic = t; showTopicSuggestions = false; }}
      onClose={() => showTopicSuggestions = false}
      onSimilar={handleSimilarClick}
    />
  {/if}
</div>
```

- [ ] **Step 4: Run tests**

```bash
cd D:\repos\ai-radio\ai-radio && bun run lint && bun run typecheck
```

Expected: PASS

---

### Task 8: Local Quota / Usage Tracking

**Files:**

- Create: `src/lib/local-quota.ts`
- Modify: `src/App.svelte` (show quota in header)

**Interfaces:**

- Consumes: `localStorage`
- Produces: `quota: { used: number; limit: number; remaining: number }`

- [ ] **Step 1: Create local quota library**

```typescript
// src/lib/local-quota.ts
const QUOTA_KEY = 'ai_radio_quota'
const DEFAULT_LIMIT = 10 // Generous local limit

export interface QuotaStatus {
	used: number
	limit: number
	remaining: number
	resetDate: string // YYYY-MM-DD
}

function getToday(): string {
	return new Date().toISOString().split('T')[0]
}

function getStoredQuota(): QuotaStatus | null {
	try {
		const stored = localStorage.getItem(QUOTA_KEY)
		if (!stored) return null
		const data = JSON.parse(stored)
		if (data.resetDate !== getToday()) {
			return null // Expired, will reset
		}
		return data
	} catch {
		return null
	}
}

export function getQuota(limit = DEFAULT_LIMIT): QuotaStatus {
	const stored = getStoredQuota()
	if (stored) {
		return {
			used: stored.used,
			limit,
			remaining: Math.max(0, limit - stored.used),
			resetDate: stored.resetDate,
		}
	}
	// Fresh quota
	return {
		used: 0,
		limit,
		remaining: limit,
		resetDate: getToday(),
	}
}

export function useQuota(limit = DEFAULT_LIMIT): QuotaStatus {
	const stored = getStoredQuota()
	const today = getToday()

	if (stored && stored.resetDate === today) {
		const updated = {
			used: stored.used + 1,
			limit,
			remaining: Math.max(0, limit - stored.used - 1),
			resetDate: today,
		}
		localStorage.setItem(QUOTA_KEY, JSON.stringify(updated))
		return updated
	}

	// New day or first time
	const fresh = {
		used: 1,
		limit,
		remaining: limit - 1,
		resetDate: today,
	}
	localStorage.setItem(QUOTA_KEY, JSON.stringify(fresh))
	return fresh
}

export function canGenerate(limit = DEFAULT_LIMIT): boolean {
	const quota = getQuota(limit)
	return quota.remaining > 0
}

export function resetQuota(): void {
	localStorage.removeItem(QUOTA_KEY)
}
```

- [ ] **Step 2: Integrate into App.svelte**

```svelte
<!-- src/App.svelte - ADD import and usage -->
<script lang="ts">
  import { getQuota, useQuota, canGenerate } from './lib/local-quota';

  let quota = $state(getQuota());

  // In tuneIn, before generation:
  if (!canGenerate()) {
    errorMessage = `Tageslimit erreicht (${quota.limit}/Tag). Warte bis Mitternacht.`;
    isGenerating = false;
    return;
  }

  // After successful generation:
  quota = useQuota();
</script>

<!-- In header, show quota -->
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
    <span class="quota-badge" title="Heute noch {quota.remaining} von {quota.limit} Generationen">
      ⚡ {quota.remaining}/{quota.limit}
    </span>
  </div>
</header>

<style>
  /* Add to existing styles */
  .quota-badge {
    background: #003311;
    border: 1px solid #00ff41;
    color: #00ff41;
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
    border-radius: 2px;
    font-family: monospace;
  }
</style>
```

- [ ] **Step 3: Run tests**

```bash
cd D:\repos\ai-radio\ai-radio && bun run lint && bun run typecheck
```

Expected: PASS

---

### Task 9: Settings Persistence & Migration

**Files:**

- Modify: `src/lib/settings.ts` (add version, migration)
- Modify: `src/App.svelte` (handle migration)

**Interfaces:**

- Consumes: `localStorage`
- Produces: Migrated settings

- [ ] **Step 1: Add settings version and migration**

```typescript
// src/lib/settings.ts - ADD to existing

const SETTINGS_VERSION = 2
const SETTINGS_KEY = 'ai_radio_settings'

export interface AppSettings {
	// ... existing fields
	version?: number
	quotaLimit?: number
}

function migrateSettings(old: any): AppSettings {
	const migrated = {...old, version: SETTINGS_VERSION}

	// v1 -> v2: Add quotaLimit, ensure all fields exist
	if (!old.version || old.version < 2) {
		migrated.quotaLimit = 10
		migrated.style = old.style || 'tech'
		migrated.quality = old.quality || 'normal'
		migrated.autoPlay = old.autoPlay ?? true
	}

	return migrated
}

export function loadSettings(): AppSettings {
	try {
		const stored = localStorage.getItem(SETTINGS_KEY)
		if (stored) {
			const parsed = JSON.parse(stored)
			return migrateSettings(parsed)
		}
	} catch (e) {
		console.error('Failed to load settings:', e)
	}
	return getDefaultSettings()
}

export function saveSettings(settings: AppSettings): void {
	try {
		localStorage.setItem(
			SETTINGS_KEY,
			JSON.stringify({...settings, version: SETTINGS_VERSION}),
		)
	} catch (e) {
		console.error('Failed to save settings:', e)
	}
}
```

- [ ] **Step 2: Add quota limit to settings UI**

```svelte
<!-- src/App.svelte - In settings panel -->
<div class="settings-section">
  <h3>Lokale Limits</h3>
  <div class="input-group">
    <label for="quotaLimit">Tägliches Generations-Limit:</label>
    <input
      id="quotaLimit"
      type="number"
      min="1"
      max="100"
      bind:value={settings.quotaLimit}
      style="width: 80px;"
    />
  </div>
  <p class="hint">Nur bei Offline-Modus relevant. Bei API-Nutzung gilt Server-Limit.</p>
</div>
```

- [ ] **Step 3: Run tests**

```bash
cd D:\repos\ai-radio\ai-radio && bun run lint && bun run typecheck
```

Expected: PASS

---

### Task 10: Final Integration & E2E Testing

**Files:**

- Modify: `src/App.svelte` (final integration)
- Test: Manual verification

**Interfaces:**

- All previous tasks integrated

- [ ] **Step 1: Verify complete flow**

```bash
# 1. Start dev server
cd D:\repos\ai-radio\ai-radio && bun run dev

# 2. Test in browser:
# - Enter topic, click TUNE IN
# - Observe staged generation progress
# - Verify audio plays with visualizer
# - Check transcript appears with click-to-seek
# - Test bookmarks (click star)
# - Test cover art displays
# - Test ZIP download from history
# - Test topic suggestions (dice button)
# - Test "Ähnliches Thema" with API key
# - Verify quota shows in header
# - Test settings persist after reload
```

- [ ] **Step 2: Build and test Tauri app**

```bash
cd D:\repos\ai-radio\ai-radio && bun run build && bun run tauri build
```

- [ ] **Step 3: Run full test suite**

```bash
cd D:\repos\ai-radio\ai-radio && bun run check
```

Expected: PASS (format + lint + typecheck)

---

## Acceptance Criteria

| Feature                 | Criteria                                                            |
| ----------------------- | ------------------------------------------------------------------- |
| **Staged Generation**   | Shows 7 stages with progress, logs each step                        |
| **Multi-Speaker TTS**   | Script parsed into host/guest/caller segments with different voices |
| **Audio Visualizer**    | Real-time frequency bars respond to playback                        |
| **Transcript Player**   | Timecoded lines, click-to-seek, active highlight, bookmarks         |
| **Cover Art**           | Canvas-generated, style-aware, downloadable                         |
| **ZIP Export**          | Contains MP3, PNG cover, JSON show notes                            |
| **Gradient Background** | Animated radial gradients + scanlines                               |
| **Topic Suggestions**   | 5 categories, random topic, "similar" via LLM                       |
| **Local Quota**         | Tracks daily generations, shows in header                           |
| **Settings Migration**  | Versioned, survives upgrades                                        |
| **All Local**           | Zero network calls required (except optional LLM API)               |

---

## Dependencies to Add

```bash
cd D:\repos\ai-radio\ai-radio && bun add jszip
```

---

## Estimated Effort

| Task                          | Est. Time      |
| ----------------------------- | -------------- |
| 1. Multi-Speaker TTS & Stages | 2-3 hrs        |
| 2. Audio Visualizer           | 1-2 hrs        |
| 3. Transcript Player          | 2-3 hrs        |
| 4. Cover Art Generator        | 1-2 hrs        |
| 5. ZIP Export                 | 1 hr           |
| 6. Visual Polish              | 1-2 hrs        |
| 7. Topic Suggestions          | 1 hr           |
| 8. Local Quota                | 0.5 hr         |
| 9. Settings Migration         | 0.5 hr         |
| 10. Integration & Testing     | 2 hrs          |
| **Total**                     | **~12-17 hrs** |

---

## Execution Options

**Plan complete and saved to `docs/superpowers/plans/2026-08-07-gemini-like-local-enhancements.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

- REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

- REQUIRED SUB-SKILL: Use superpowers:executing-plans

**Which approach?**
