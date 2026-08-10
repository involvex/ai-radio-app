# Task 10: Final Integration & E2E Testing

## Files to Verify/Modify

**Verify all features work together:**

- Multi-speaker TTS generation with staged progress
- Audio visualizer during playback
- Transcript player with click-to-seek and bookmarks
- Cover art generation and display
- ZIP export with audio, cover, show notes
- Visual polish (animations, gradients, reduced motion)
- Topic suggestions with categories and similar flow
- Local quota tracking and limits
- Settings persistence, migration, export/import

**Modify if needed:**

- `src/App.svelte` - fix any integration issues
- `package.json` - verify all dependencies

## Steps

### Step 1: Run full test suite

```bash
cd D:\repos\ai-radio\ai-radio && bun run check
```

Expected: PASS (format + lint + typecheck)

### Step 2: Build production

```bash
cd D:\repos\ai-radio\ai-radio && bun run build
```

Expected: Successful build, bundle size < 50MB

### Step 3: Verify Tauri build

```bash
cd D:\repos\ai-radio\ai-radio && bun run tauri build
```

Expected: Successful Tauri build for desktop

### Step 4: Manual E2E checklist

Test the following flows:

1. **Fresh start**: Open app, enter topic, click "Einschalten" → generates episode with multi-speaker TTS, shows staged progress, plays audio with visualizer, shows transcript with click-to-seek, displays cover art
2. **History**: Play previous episode → loads transcript, bookmarks, cover
3. **Bookmarks**: Click bookmark on transcript line → persists across reloads
4. **ZIP Export**: Click ZIP export → downloads .zip with mp3, cover.png, show_notes.json
5. **Topic suggestions**: Select category → shows filtered topics, click "Würfel" → random topic, click "Similar" → generates related episode
6. **Quota**: Generate multiple episodes → quota decreases, shows warning at limit
7. **Settings**: Change settings → persist across reloads, export/import works, reset works
8. **Visual**: Animations play, reduced motion respected, scrollbars styled
9. **Offline**: Disconnect network → all features still work

### Step 5: Final commit

```bash
git add -A
git commit -m "feat: complete Gemini-like local enhancements (Tasks 1-10)"
```

## Success Criteria

- All 10 tasks integrated and working
- `bun run check` passes
- `bun run build` passes
- `bun run tauri build` passes
- Manual E2E checklist complete
- Bundle size < 50MB
- No console errors in browser

## Global Constraints

- No cloud dependencies
- All features work offline
- Bundle size < 50MB
- Tauri v2 compatible
- Svelte 5 runes only
- Bun >= 1.3.0
- Preserve terminal/hacker aesthetic
