# Task 1: Multi-Speaker TTS & Generation Stages

## Files to Create/Modify

**Create:**

- `src/lib/generation-stages.ts`
- `src/components/GenerationProgress.svelte`

**Modify:**

- `src/lib/edge-ts-client.ts` (add multi-speaker functions)
- `src/App.svelte` (integrate staged generation)

## Interfaces

**Consumes:**

- `settings.ts` (AppSettings)
- `topics.ts` (getRandomTopic)

**Produces:**

- `GenerationStage[]` type
- `SpeakerSegment[]` type
- `ParsedScript` type
- `ttsToBlobMulti(speakers: SpeakerSegment[])`
- `parseScriptToSegments(script: string, style: string)`

## Steps

### Step 1: Define generation stages and speaker types

Create `src/lib/generation-stages.ts` with:

- `GenerationStage` type (idle, researching, writing-script, generating-speech, mixing-audio, generating-metadata, generating-cover, complete, error)
- `STAGE_ORDER` array
- `STAGE_LABELS` record
- `SpeakerSegment` interface (speaker, text, voice, effect, startTime, endTime)
- `ParsedScript` interface (segments, totalDuration, title, summary)

### Step 2: Add multi-speaker TTS to edge-tts-client.ts

Add to existing file:

- `SPEAKER_VOICES` constant mapping speakers to Edge TTS voices
- `parseScriptToSegments(script, style)` function - parses HOST:/GUEST:/CALLER: markers
- `ttsToBlobMulti(segments)` function - generates and concatenates audio for each segment
- `applyTelephoneEffect(utterance)` for Web Speech fallback

### Step 3: Create GenerationProgress component

Create `src/components/GenerationProgress.svelte` with:

- Props: currentStage, progress (0-100), logs array
- Visual stage list with indicators (completed=✓, active=spinner, pending=number)
- Progress bars per stage
- Log entries with timestamp, stage, message

### Step 4: Integrate into App.svelte

Modify `src/App.svelte`:

- Add imports for GenerationProgress, parseScriptToSegments, ttsToBlobMulti, STAGE_ORDER, GenerationStage, SpeakerSegment
- Add state: generationStage, generationProgress, generationLogs, parsedScript, speakerSegments
- Replace `tuneIn` function with staged version:
  - Stage 1: researching (500ms)
  - Stage 2: writing-script (invokeGenerateScript + 300ms)
  - Stage 3: generating-speech - parse script into segments (200ms)
  - Stage 4: generating-speech - generate per-segment audio (loop with progress)
  - Stage 5: mixing-audio - ttsToBlobMulti (300ms)
  - Stage 6: generating-metadata (200ms)
  - Stage 7: generating-cover (200ms, placeholder for Task 3)
  - Complete: updateStage('complete'), progress=100
- Helper functions: updateStage(stage, message), addLog(stage, message), sleep(ms)
- In template: show GenerationProgress when isGenerating

### Step 5: Run lint, typecheck

```bash
cd D:\repos\ai-radio\ai-radio && bun run lint && bun run typecheck
```

Expected: PASS

## Global Constraints

- No cloud dependencies — all features work offline
- No Python/Rust audio pipeline — use Web APIs (Web Audio, Web Speech, Canvas)
- Bundle size < 50MB — avoid heavy dependencies
- Tauri v2 compatible — sidecar optional but not required
- Svelte 5 runes only — no legacy options API
- Bun >= 1.3.0 — for all Node operations
- Preserve terminal/hacker aesthetic — dark theme, scanlines, monospace
