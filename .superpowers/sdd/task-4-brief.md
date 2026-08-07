# Task 4: Canvas Cover Art Generator

## Files to Create/Modify

**Create:**

- `src/lib/cover-generator.ts`
- `src/components/CoverArt.svelte`

**Modify:**

- `src/App.svelte` (integrate cover art)

## Interfaces

**Consumes:** `title: string`, `topic: string`, `style: string`, `width?: number`, `height?: number`, `seed?: number`
**Produces:** `dataURL: string` (base64 PNG), `HTMLCanvasElement`

## Steps

### Step 1: Create cover generator library

Create `src/lib/cover-generator.ts` with:

- `CoverOptions` interface (title, topic, style, width=512, height=512, seed)
- `STYLE_THEMES` object mapping style to colors/patterns (tech, casual, academic, entertaining, news, podcast, chill)
- `generateCoverCanvas(options: CoverOptions): HTMLCanvasElement` - main function
- `canvasToDataURL(canvas, type='image/png'): string` - converts canvas to data URL
- `downloadCover(canvas, filename)` - triggers download
- Pattern functions: `drawCircuitPattern`, `drawWavePattern`, `drawGridPattern`, `drawStarPattern`, `drawLinePattern`, `drawSoundwavePattern`, `drawCloudPattern`
- Helper functions: `drawScanlines`, `drawTitle`, `drawTopic`, `drawRadioIcon`, `wrapText`, `hashString`, `seededRandom`

### Step 2: Create CoverArt component

Create `src/components/CoverArt.svelte` with:

- Props: `title`, `topic`, `style`, `size=300`, `onGenerated?: (dataUrl: string) => void`
- On mount: generate cover, call onGenerated callback
- Click handler to download cover
- Render: img with dataUrl or placeholder
- Overlay with download hint on hover
- CSS: terminal aesthetic, border glow on hover, aspect-ratio 1:1

### Step 3: Integrate into App.svelte

Modify `src/App.svelte`:

- Import `CoverArt`, `generateCoverCanvas`, `canvasToDataURL`
- Add `coverDataUrl` state
- In `tuneIn`, after episode creation: generate cover, set `coverDataUrl`, add to episode
- In `playEpisode`: set `coverDataUrl` from episode
- In player section: add `<CoverArt />` component in player-header layout
- Add CSS for `.player-header` (flex, gap) and `.player-main` (flex: 1)

### Step 4: Run tests

```bash
cd D:\repos\ai-radio\ai-radio && bun run lint && bun run typecheck
```

Expected: PASS

## Global Constraints

- No cloud dependencies — all features work offline
- Use Canvas API for cover generation
- Bundle size < 50MB
- Tauri v2 compatible
- Svelte 5 runes only
- Bun >= 1.3.0
- Preserve terminal/hacker aesthetic
