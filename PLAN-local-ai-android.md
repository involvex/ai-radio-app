# Plan: Local AI on Android for Audio Script Generation

## Summary

Enable local LLM inference on Android using **MediaPipe LLM Inference API** (`@mediapipe/tasks-genai`) with **Gemma 3 1B** (`.task` format). Runs in the WebView via WebGPU. Desktop sidecar is out of scope. Fallback to Web Speech API + template scripts when local AI is unavailable.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                App.svelte                   │
│         (unified generation flow)           │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│        src/lib/litert-lm.ts                 │
│   (MediaPipe LLM engine wrapper)            │
│   - initLlmInference(modelUrl)              │
│   - generateScript(params)                  │
│   - loadModelFromFile(file)                 │
│   - unloadModel()                           │
│   - checkWebGPUAvailability()               │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│    @mediapipe/tasks-genai (npm package)     │
│   - FilesetResolver.forGenAiTasks()         │
│   - LlmInference.createFromOptions()        │
│   - llmInference.generateResponse()         │
│   - WASM loaded from CDN                    │
└─────────────────────────────────────────────┘
```

**Fallback chain:**

1. MediaPipe LLM (WebGPU) → local inference on Android
2. Web Speech API + template scripts → no LLM, TTS-only fallback
3. Cloud APIs remain available as a separate provider

---

## Key Technical Details

### Package: `@mediapipe/tasks-genai`

```bash
bun add @mediapipe/tasks-genai
```

### Model: Gemma 3 1B int4 (web-optimized)

- **File**: `gemma3-1b-it-int4-web.task`
- **Source**: `https://huggingface.co/litert-community/Gemma3-1B-IT`
- **Size**: ~700 MB
- **VRAM**: ~1.3 GB GPU memory
- **Format**: `.task` (self-contained bundle: model + tokenizer + metadata)
- **Requires**: WebGPU (Chrome 113+ on Android)

### WASM Runtime

Loaded from CDN — no local WASM files needed:

```
https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai@latest/wasm
```

### Prompt Format (Gemma 3)

```
<start_of_turn>user
{system_prompt}\n\n{user_prompt}<end_of_turn>
<start_of_turn>model\n
```

### API Usage Pattern

```typescript
import {FilesetResolver, LlmInference} from '@mediapipe/tasks-genai'

// 1. Initialize WASM runtime
const genai = await FilesetResolver.forGenAiTasks(
	'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai@latest/wasm',
)

// 2. Load model from URL or file stream
const llm = await LlmInference.createFromOptions(genai, {
	baseOptions: {
		modelAssetPath: 'https://huggingface.co/.../gemma3-1b-it-int4-web.task',
		// OR modelAssetBuffer: readableStream (from file picker)
	},
	maxTokens: 500,
	topK: 40,
	temperature: 0.8,
	randomSeed: 42,
})

// 3. Generate response
const prompt =
	'<start_of_turn>user\nVerwandle das in ein Radioskript:\n\n{topic}<end_of_turn>\n<start_of_turn>model\n'
const response = await llm.generateResponse(prompt)

// 4. Cleanup
llm.close()
```

### File Picker Support

MediaPipe supports loading from a `ReadableStream` via `modelAssetBuffer`:

```typescript
const file = await filePicker.files[0]
const stream = file.stream().getReader()
const llm = await LlmInference.createFromOptions(genai, {
  baseOptions: { modelAssetBuffer: stream },
  ...
})
```

---

## Available Models for Android

| Model               | Format      | Size    | Quality    | Source                           |
| ------------------- | ----------- | ------- | ---------- | -------------------------------- |
| **Gemma 3 1B int4** | `.task`     | ~700 MB | ⭐⭐⭐⭐   | litert-community/Gemma3-1B-IT    |
| Gemma 3 1B int8     | `.task`     | ~1 GB   | ⭐⭐⭐⭐⭐ | litert-community/Gemma3-1B-IT    |
| Gemma 3n E2B        | `.litertlm` | ~2 GB   | ⭐⭐⭐⭐⭐ | google/gemma-3n-E2B-it-litert-lm |
| Gemma 3n E4B        | `.litertlm` | ~4 GB   | ⭐⭐⭐⭐⭐ | google/gemma-3n-E4B-it-litert-lm |

**Default: Gemma 3 1B int4** — smallest, fastest, good German quality.

---

## Implementation Steps

### Step 1: Install dependency

```bash
bun add @mediapipe/tasks-genai
```

Remove `@mlc-ai/web-llm` from `package.json` (no longer needed).

### Step 2: New file — `src/lib/litert-lm.ts`

Core MediaPipe LLM engine wrapper. This is the main new module.

```typescript
import { FilesetResolver, LlmInference } from '@mediapipe/tasks-genai'

const WASM_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai@latest/wasm'

export const AVAILABLE_MODELS = {
  'gemma3-1b-int4': {
    name: 'Gemma 3 1B (Recommended)',
    url: 'https://huggingface.co/litert-community/Gemma3-1B-IT/resolve/main/gemma3-1b-it-int4-web.task',
    sizeBytes: 700_000_000,
    description: 'Best for Android — fast, good German',
  },
  'gemma3-1b-int8': {
    name: 'Gemma 3 1B (High Quality)',
    url: 'https://huggingface.co/litert-community/Gemma3-1B-IT/resolve/main/gemma3-1b-it-int8-web.task',
    sizeBytes: 1_000_000_000,
    description: 'Higher quality, larger download',
  },
} as const

let llmInference: LlmInference | null = null
let currentModelKey: string = ''

export async function checkWebGPUAvailability(): Promise<{
  supported: boolean
  reason?: string
}> { ... }

export async function loadModelFromUrl(
  modelKey: string,
  onProgress?: (progress: number) => void
): Promise<void> { ... }

export async function loadModelFromFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<void> { ... }

export async function generateScript(params: {
  topic: string
  quality: string
  style: string
  linkContent?: string
  mode?: string
}): Promise<string> { ... }

export async function unloadModel(): Promise<void> { ... }

export function isModelReady(): boolean { ... }
```

**Key implementation details:**

- `loadModelFromUrl()`: Downloads `.task` file from HuggingFace CDN, creates `LlmInference` instance
- `loadModelFromFile()`: Accepts a `File` from file picker, reads as `ReadableStream`, creates `LlmInference`
- `generateScript()`: Builds Gemma 3 prompt format, calls `llm.generateResponse()`, returns text
- `unloadModel()`: Calls `llm.close()` to free GPU memory
- Prompt builder uses the same `build_system_prompt()` logic as existing Rust code (quality/style)
- Max tokens: 500 (normal), 200 (short), 800 (long), 1000 (chill)
- Temperature: 0.8 (normal), 0.9 (short), 0.7 (long), 0.6 (chill)

### Step 3: New file — `src/lib/webgpu-check.ts`

WebGPU availability detection:

```typescript
export async function checkWebGPU(): Promise<{
	supported: boolean
	reason?: string
}> {
	if (!navigator.gpu) {
		return {supported: false, reason: 'WebGPU not available in this browser'}
	}
	try {
		const adapter = await navigator.gpu.requestAdapter()
		if (!adapter) {
			return {supported: false, reason: 'No GPU adapter found'}
		}
		return {supported: true}
	} catch (e) {
		return {supported: false, reason: `WebGPU check failed: ${e}`}
	}
}
```

### Step 4: Update `src/lib/settings.ts`

**Changes:**

1. **Remove Android auto-switch** (lines 77-82):

```typescript
// DELETE this block:
if (/android/i.test(navigator.userAgent) && loaded.apiProvider === 'local') {
	loaded.apiProvider = 'kilo'
}
```

2. **Add `localModelKey` to `AppSettings`**:

```typescript
export interface AppSettings {
	apiKey: string
	apiProvider: 'kilo' | 'opencode' | 'gemini' | 'local' | 'none'
	localModelPath?: string
	localModelKey?: string // ← NEW: e.g. 'gemma3-1b-int4'
	defaultVoice: string
	autoPlay: boolean
	playbackSpeed: number
	quality: 'short' | 'normal' | 'long' | 'chill'
	style: 'tech' | 'casual' | 'academic' | 'entertaining' | 'news' | 'podcast'
}
```

3. **Update `invokeGenerateScript()`** to use MediaPipe on Android:

```typescript
if (settings.apiProvider === 'local') {
  const isAndroid = /android/i.test(navigator.userAgent)
  if (isAndroid) {
    const { generateScript } = await import('./litert-lm')
    return generateScript({
      topic: effectiveTopic,
      quality: settings.quality,
      style: settings.style,
      linkContent: linkContent || undefined,
      mode: mode || undefined,
    })
  }
  // Desktop: use Tauri sidecar (existing code)
  try {
    return await invoke<string>('generate_script_local', { ... })
  } catch (err) { ... }
}
```

### Step 5: Update `src/lib/local-llm.ts`

**Changes:**

- Keep existing desktop Tauri commands (for future use)
- Add re-exports from `litert-lm.ts` for convenience
- Add platform-aware `generateScriptLocal()`:

```typescript
export async function generateScriptLocal(params: {
	topic: string
	quality: string
	style: string
	linkContent?: string
	mode?: string
}): Promise<string> {
	const isAndroid = /android/i.test(navigator.userAgent)
	if (isAndroid) {
		const {generateScript} = await import('./litert-lm')
		return generateScript(params)
	}
	// Desktop: use Tauri invoke (existing)
	return invoke<string>('generate_script_local', {
		topic: params.topic,
		quality: params.quality,
		style: params.style,
		linkContent: params.linkContent ?? null,
		mode: params.mode ?? null,
	})
}
```

### Step 6: Rewrite `src/components/ModelManager.svelte`

**Complete rewrite.** This becomes the UI for managing local models on Android.

**New UI structure:**

```
═══ LOCAL LLM ═══

WebGPU: ✅ AVAILABLE / ❌ NOT AVAILABLE

STATUS: NOT RUNNING / LOADING... / READY / ERROR
Loading: ██████████░░░░░░ 65% — Downloading model...

[ ▶ START ]  [ ⏹ STOP ]

> SELECT MODEL
  ○ Gemma 3 1B (Recommended) — 700MB — Fast, good German
  ○ Gemma 3 1B (High Quality) — 1GB — Better quality

> CUSTOM MODEL
  [ 📁 PICK .TASK FILE ]

> LOADED MODEL
  gemma3-1b-it-int4-web.task — 700MB
  [ 🗑 UNLOAD ]
```

**Key behavior:**

1. **On mount**: Check WebGPU availability, show status
2. **Model selection**: Radio buttons for pre-defined models
3. **Download button**: Downloads `.task` from HuggingFace, shows progress
4. **File picker**: Opens Android file picker for `.task` files, loads via `modelAssetBuffer`
5. **Start/Stop**: Loads/unloads model into GPU memory
6. **Status**: Shows loading progress, ready state, errors

**On Android**: Show MediaPipe model browser with download/file picker
**On Desktop**: Show existing GGUF model manager (unchanged behavior)

### Step 7: Update `src/App.svelte`

**Changes:**

1. **Remove Android restriction** (line 51):

```typescript
// REMOVE:
const canUseLocalLLM = !isAndroid
// REPLACE WITH:
const canUseLocalLLM = true
```

2. **Remove auto-switch in onMount** (lines 57-60):

```typescript
// REMOVE:
if (isAndroid && settings.apiProvider === 'local') {
	settings.apiProvider = 'kilo'
	saveSettings(settings)
}
```

3. **Update settings panel** (around line 555-565):

- Remove `disabled={!canUseLocalLLM}` on local radio option
- Remove "Desktop only" warning
- Keep `<ModelManager />` component (will now show MediaPipe models on Android)

4. **Update $effect for local LLM status** (lines 76-90):

- The `onLocalLLMReady` / `onLocalLLMError` are Tauri events (desktop only)
- On Android, status is managed by the MediaPipe engine directly
- Add a `$derived` for `localStatus` that checks `isModelReady()` when on Android

### Step 8: No Rust changes needed

The Rust sidecar code stays as-is (desktop only). Android inference is 100% in the WebView via MediaPipe.

### Step 9: No build.gradle.kts changes needed

MediaPipe runs in the WebView — no native Android dependencies required.

---

## File Change Summary

| File                                 | Action     | Description                                                                      |
| ------------------------------------ | ---------- | -------------------------------------------------------------------------------- |
| `src/lib/litert-lm.ts`               | **CREATE** | MediaPipe LLM engine wrapper (Android local AI)                                  |
| `src/lib/webgpu-check.ts`            | **CREATE** | WebGPU availability detection                                                    |
| `package.json`                       | **MODIFY** | Add `@mediapipe/tasks-genai`, remove `@mlc-ai/web-llm`                           |
| `src/lib/settings.ts`                | **MODIFY** | Remove Android auto-switch, add `localModelKey`, update `invokeGenerateScript()` |
| `src/lib/local-llm.ts`               | **MODIFY** | Add platform-aware `generateScriptLocal()`, re-export MediaPipe functions        |
| `src/components/ModelManager.svelte` | **MODIFY** | Show MediaPipe models on Android, add WebGPU status, file picker                 |
| `src/App.svelte`                     | **MODIFY** | Remove Android restrictions, update local provider handling                      |

---

## Testing Checklist

1. **WebGPU detection**: Verify `checkWebGPU()` returns correct results on Android
2. **Model download**: Verify Gemma 3 1B `.task` file downloads from HuggingFace
3. **File picker**: Verify `.task` file can be loaded from device storage
4. **Model loading**: Verify model loads and initializes MediaPipe engine
5. **Script generation**: Verify radio scripts are generated with correct style/quality
6. **Fallback**: Verify Web Speech API fallback works when WebGPU is unavailable
7. **Settings persistence**: Verify `localModelKey` persists in localStorage
8. **Progress indicator**: Verify download progress is shown in ModelManager
9. **Memory management**: Verify model can be unloaded to free GPU memory

---

## Risks and Mitigations

| Risk                                          | Mitigation                                                   |
| --------------------------------------------- | ------------------------------------------------------------ |
| WebGPU not available on older Android devices | Fallback to Web Speech API + template scripts                |
| Large model download (~700MB) on mobile       | Show clear progress indicator; user explicitly taps Download |
| High GPU memory usage (~1.3GB)                | Offer smaller model or unload when not in use                |
| Slow inference on low-end devices             | Limit max_tokens, use int4 quantization                      |
| MediaPipe WASM fails to load                  | Catch error, show message, fallback to Web Speech API        |
| HuggingFace rate limiting                     | Cache model in browser after first download                  |
