# Task 5: ZIP Export (Audio + Cover + Show Notes)

## Files to Create/Modify

**Create:**

- `src/lib/zip-export.ts`

**Modify:**

- `src/App.svelte` (add export button and handler)

## Interfaces

**Consumes:** `episode: Episode & { coverDataUrl?: string; speakerSegments?: SpeakerSegment[] }`, `coverDataUrl?: string`
**Produces:** `Blob` (ZIP file)

## Steps

### Step 1: Create ZIP export library

Create `src/lib/zip-export.ts` with:

- `ShowNotes` interface (show_title, show_duration, two_sentence_summary, date_of_generation, timecoded_transcript)
- `createShowZip(episode, coverDataUrl?): Promise<Blob>` - main function
- Uses JSZip (dynamic import) to create ZIP
- Adds: audio file (ai_radio.mp3), cover image (cover.png), show_notes.json
- `fetchBlob(url): Promise<Blob>` - handles data:, blob:, and http URLs
- `generateShowNotes(episode): ShowNotes` - creates show notes from episode
- `formatSpeakerName(speaker): string` - formats speaker for JSON
- `formatTimecode(seconds): string` - formats as MM:SS
- `downloadZip(blob, filename)` - triggers browser download

### Step 2: Add export button to App.svelte

Modify `src/App.svelte`:

- Import `createShowZip`, `downloadZip` from `./lib/zip-export`
- Add `handleDownloadZip(episode)` async function:
  - Shows syncMessage "Erstelle ZIP-Archiv..."
  - Calls createShowZip(episode, coverDataUrl)
  - Generates filename from episode title
  - Calls downloadZip
  - Shows success/error message
- In player section, add export button next to play/download buttons
- Button: "📦 ZIP Export" with click handler

### Step 3: Add JSZip dependency

```bash
cd D:\repos\ai-radio\ai-radio && bun add jszip
```

### Step 4: Run tests

```bash
cd D:\repos\ai-radio\ai-radio && bun run lint && bun run typecheck
```

Expected: PASS

## Global Constraints

- No cloud dependencies — all features work offline
- Use JSZip for ZIP creation
- Bundle size < 50MB
- Tauri v2 compatible
- Svelte 5 runes only
- Bun >= 1.3.0
- Preserve terminal/hacker aesthetic
