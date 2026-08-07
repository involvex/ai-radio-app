# Task 2: Web Audio API Visualizer

## Files to Create/Modify

**Create:**

- `src/lib/audio-visualizer.ts`
- `src/components/AudioVisualizer.svelte`

**Modify:**

- `src/App.svelte` (integrate visualizer)

## Interfaces

**Consumes:** `audioElement` (HTMLAudioElement)
**Produces:** `frequencyData: Uint8Array`, `timeData: Uint8Array`

## Steps

### Step 1: Create audio visualizer library

Create `src/lib/audio-visualizer.ts` with:

- `VisualizerConfig` interface (fftSize, smoothingTimeConstant, minDecibels, maxDecibels)
- `AudioVisualizer` class:
  - `connect(audioElement: HTMLAudioElement): Promise<void>` - creates AudioContext, AnalyserNode, MediaElementAudioSourceNode
  - `subscribe(callback: (freq: Uint8Array, time: Uint8Array) => void): () => void` - returns unsubscribe
  - `getFrequencyData(): Uint8Array | null`
  - `getTimeData(): Uint8Array | null`
  - `disconnect(): void` - cleanup
  - Private `startLoop()` with requestAnimationFrame
- `frequencyToBars(data: Uint8Array, barCount: number): number[]` utility - converts frequency bins to bar heights (0-100%)

### Step 2: Create AudioVisualizer component

Create `src/components/AudioVisualizer.svelte` with:

- Props: `audioElement`, `isPlaying`, `barCount=32`, `style='bars'|'waveform'|'circular'`
- On mount: create AudioVisualizer, connect to audioElement, subscribe to updates
- On destroy: disconnect visualizer
- Reactive `bars` from frequencyToBars
- Render based on style:
  - `bars`: flex container with divs for each bar, height = bar%, animation-delay = index*30ms
  - `waveform`: canvas with time domain data
  - `circular`: polar bars around circle
- CSS: green gradient bars, pulse animation, responsive

### Step 3: Integrate into App.svelte

Modify `src/App.svelte`:

- Import AudioVisualizer
- Replace CSS visualizer in player-section with `<AudioVisualizer {audioElement} {isPlaying} barCount={40} style="bars" />`

### Step 4: Run tests

```bash
cd D:\repos\ai-radio\ai-radio && bun run lint && bun run typecheck
```

Expected: PASS

## Global Constraints

- No cloud dependencies — all features work offline
- Use Web Audio API (AnalyserNode)
- Bundle size < 50MB
- Tauri v2 compatible
- Svelte 5 runes only
- Bun >= 1.3.0
- Preserve terminal/hacker aesthetic
