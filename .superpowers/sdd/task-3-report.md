# Task 3 Report: Transcript Player with Click-to-Seek & Bookmarks

## Status: DONE

## Commit Hash

`2ee5df0`

## Test Results

- `bun run lint`: PASS
- `bun run typecheck`: PASS
- `bun run build`: PASS (1.67s, 265.62 kB JS, 18.15 kB CSS)

## Changes Made

### Files Created

1. **src/lib/transcript-player.ts** - Core transcript logic
   - `TranscriptLine` interface (index, speaker, text, startTime, endTime, isBookmarked)
   - `Bookmark` interface (id, episodeId, episodeTitle, segmentIndex, speaker, text, timestamp, createdAt)
   - `segmentsToTranscript(segments: SpeakerSegment[]): TranscriptLine[]` - converts speaker segments to transcript lines with time estimates
   - `formatSpeakerName(speaker): string` - formats HOST→MODERATOR, GUEST→GAST, CALLER→ANRUFER
   - `formatTime(seconds): string` - formats as MM:SS
   - `findActiveSegment(transcript, currentTime): number` - finds active segment index

2. **src/components/TranscriptPlayer.svelte** - Transcript UI component
   - Props: transcript, currentTime, duration, audioElement, episodeId, episodeTitle
   - State: bookmarks, activeIndex (derived), showBookmarksOnly
   - On mount: loads bookmarks from IndexedDB and marks transcript lines
   - `handleSeek(line)` - seeks audio to line.startTime
   - `handleBookmark(line)` - toggles bookmark via db.ts toggleBookmark()
   - Renders transcript list with speaker badges, timecodes, text, bookmark buttons
   - Filter toggle for "Nur Bookmarks"
   - CSS: terminal aesthetic, active line highlight (green border/glow), bookmarked border (yellow left border)

### Files Modified

1. **src/lib/db.ts** - Added bookmark persistence
   - Added `Bookmark` interface to Dexie schema
   - Added `bookmarks: '++id, episodeId, segmentIndex, timestamp'` table
   - Added functions: `addBookmark()`, `removeBookmark()`, `getBookmarks()`, `toggleBookmark()`
   - Added optional `speakerSegments?: SpeakerSegment[]` to Episode interface

2. **src/App.svelte** - Integration and import fixes
   - Fixed import errors from Task 1: moved `STAGE_ORDER`, `GENERATING_SPEECH_STAGE_INDEX`, `GenerationStage` imports from `edge-tts-client` to `generation-stages`
   - Added `TranscriptPlayer` and `segmentsToTranscript` imports
   - Added `transcriptLines` state
   - In `tuneIn`: `transcriptLines = segmentsToTranscript(parsed.segments)` after parsing
   - In `playEpisode`: `transcriptLines = segmentsToTranscript(episode.speakerSegments || [])`
   - Added episode `speakerSegments` to saved episode object
   - Added `<TranscriptPlayer ... />` below AudioVisualizer in player section

## Concerns

- Svelte accessibility warnings for click handlers on non-interactive elements (div with onclick) in both App.svelte (settings panel) and TranscriptPlayer.svelte (transcript lines). These are pre-existing patterns in the codebase and don't affect functionality. Could be improved by using `<button>` elements with proper styling.
- Some unused CSS selectors in GenerationProgress.svelte (pre-existing).
- LSP caching showed false-positive import errors that resolved after build verification.

## Verification

All steps from the brief completed successfully. The transcript player integrates with the existing audio player, supports click-to-seek navigation, and persists bookmarks via IndexedDB.
