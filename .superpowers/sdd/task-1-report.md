# Task 1 Report: Multi-Speaker TTS & Generation Stages

## Status

DONE (with review fixes applied)

## Commit Hash

6e607e0 (fixes applied on top of d51c9de)

## Summary

Successfully implemented multi-speaker TTS and generation stages pipeline as specified in the brief. All review findings addressed.

## Files Created

- `src/lib/generation-stages.ts` - Type definitions for GenerationStage, SpeakerSegment, ParsedScript
- `src/components/GenerationProgress.svelte` - Visual progress component with stage indicators and logs

## Files Modified

- `src/lib/edge-tts-client.ts` - Added SPEAKER_VOICES, parseScriptToSegments, ttsToBlobMulti (with fallback chain), _applyTelephoneEffect, exports for ttsEdge, ttsWebSpeech, STAGE_ORDER, GENERATING_SPEECH_STAGE_INDEX
- `src/App.svelte` - Integrated staged generation pipeline with 7 stages, moved TTS calls into segment loop for accurate progress
- `src/components/GenerationProgress.svelte` - Now imports STAGE_ORDER/STAGE_LABELS from generation-stages.ts (deduplicated)
- `eslint.config.ts` - Added rule to allow underscore-prefixed unused vars

## Test Results

- `bun run lint` - PASS
- `bun run typecheck` - PASS
- `bun run check` (format + lint:fix + typecheck) - PASS

## Implementation Details

### Generation Stages (7 stages + idle/error/complete)

1. **researching** (500ms) - Link content fetching
2. **writing-script** (300ms after LLM) - Script generation via invokeGenerateScript
3. **generating-speech** - Parse script into segments (200ms), then per-segment audio generation with progress updates (actual TTS calls now in loop)
4. **mixing-audio** (300ms) - Concatenate audio buffers
5. **generating-metadata** (200ms) - Episode metadata creation
6. **generating-cover** (200ms) - Placeholder for Task 3
7. **complete** - Final state with progress=100

### Multi-Speaker TTS

- `SPEAKER_VOICES` maps HOST→KillianNeural, GUEST→FreyaNeural, CALLER→ConradNeural
- `parseScriptToSegments` parses HOST:/GUEST:/CALLER: markers from script (removed unused `_style` param)
- `ttsToBlobMulti` generates and concatenates audio for each segment with full fallback chain: Edge TTS → HTTP → Web Speech
- `_applyTelephoneEffect` for Web Speech fallback (prefixed for future use)

### GenerationProgress Component

- Visual stage list with indicators (✓ completed, ⟳ active spinner, number pending)
- Per-stage progress bars
- Timestamped log entries with stage and message
- Overall progress bar at top
- Imports STAGE_ORDER/STAGE_LABELS from generation-stages.ts (single source of truth)

## Fixes Applied (per review)

### Important (must fix):

1. **`edge-tts-client.ts`** - `ttsToBlobMulti` now has full fallback chain (Edge TTS → HTTP → Web Speech) matching `ttsToBlob`
2. **`App.svelte`** - Segment generation loop now performs actual TTS calls with fallback, progress accurately reflects generation. `mixing-audio` stage now only concatenates pre-generated buffers.

### Minor (should fix):

3. **`generation-stages.ts` / `GenerationProgress.svelte`** - Deduplicated `STAGE_ORDER`/`STAGE_LABELS`. Exported from `generation-stages.ts`, imported in `GenerationProgress.svelte`.
4. **`App.svelte`** - Replaced magic number `3` with `GENERATING_SPEECH_STAGE_INDEX` constant (exported from generation-stages.ts).
5. **`edge-tts-client.ts`** - Removed unused `_style` parameter from `parseScriptToSegments`.

## Concerns

- `_applyTelephoneEffect` is defined but not yet used - reserved for Web Speech API fallback implementation
- Stage progress calculation during segment generation is approximate; could be refined with actual audio duration feedback
- Cover generation is a placeholder (200ms sleep) as noted for Task 3
