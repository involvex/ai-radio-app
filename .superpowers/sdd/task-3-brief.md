# Task 3: Transcript Player with Click-to-Seek & Bookmarks

## Files to Create/Modify

**Create:**

- `src/lib/transcript-player.ts`
- `src/components/TranscriptPlayer.svelte`

**Modify:**

- `src/lib/db.ts` (add bookmark fields)
- `src/App.svelte` (integrate transcript player)

## Interfaces

**Consumes:** `speakerSegments: SpeakerSegment[]`, `currentTime: number`, `audioElement`
**Produces:** `activeSegmentIndex`, `bookmarks: Bookmark[]`

## Steps

### Step 1: Define transcript types and bookmark storage

Create `src/lib/transcript-player.ts` with:

- `TranscriptLine` interface (index, speaker, text, startTime, endTime, isBookmarked)
- `Bookmark` interface (id, episodeId, episodeTitle, segmentIndex, speaker, text, timestamp, createdAt)
- `segmentsToTranscript(segments: SpeakerSegment[]): TranscriptLine[]` - converts speaker segments to transcript lines
- `formatSpeakerName(speaker): string` - formats speaker for display
- `formatTime(seconds): string` - formats time as MM:SS
- `findActiveSegment(transcript, currentTime): number` - finds active segment index

### Step 2: Add bookmark functions to db.ts

Modify `src/lib/db.ts`:

- Add `Bookmark` interface to Dexie schema
- Add `bookmarks: '++id, episodeId, segmentIndex, timestamp'` table
- Add functions:
  - `addBookmark(bookmark): Promise<number>`
  - `removeBookmark(episodeId, segmentIndex): Promise<void>`
  - `getBookmarks(episodeId?): Promise<Bookmark[]>`
  - `toggleBookmark(bookmark): Promise<void>`

### Step 3: Create TranscriptPlayer component

Create `src/components/TranscriptPlayer.svelte` with:

- Props: `transcript`, `currentTime`, `duration`, `audioElement`, `episodeId`, `episodeTitle`
- State: `bookmarks`, `activeIndex`, `showBookmarksOnly`
- On mount: load bookmarks and mark transcript lines
- `$: activeIndex = findActiveSegment(transcript, currentTime)`
- `handleSeek(line)` - seeks audio to line.startTime
- `handleBookmark(line)` - toggles bookmark via db.ts
- Render transcript list with speaker badges, timecodes, text, bookmark buttons
- Filter toggle for "Nur Bookmarks"
- CSS: terminal aesthetic, active line highlight, bookmarked border

### Step 4: Integrate into App.svelte

Modify `src/App.svelte`:

- Import `TranscriptPlayer` and `segmentsToTranscript`
- Add `transcriptLines` state
- In `tuneIn`, after parsing segments: `transcriptLines = segmentsToTranscript(speakerSegments)`
- In `playEpisode`: `transcriptLines = segmentsToTranscript(episode.speakerSegments || [])`
- In player section, add `<TranscriptPlayer ... />` below AudioVisualizer

### Step 5: Run tests

```bash
cd D:\repos\ai-radio\ai-radio && bun run lint && bun run typecheck
```

Expected: PASS

## Global Constraints

- No cloud dependencies — all features work offline
- Use IndexedDB (Dexie) for bookmark persistence
- Bundle size < 50MB
- Tauri v2 compatible
- Svelte 5 runes only
- Bun >= 1.3.0
- Preserve terminal/hacker aesthetic
