# Task 6: Visual Polish - Gradient Background & Animations

## Files to Modify

**Modify:**
- `src/App.svelte` (enhance CSS/styles)

## Steps

### Step 1: Add animated gradient background

In `src/App.svelte` `<style>` section:
- Add animated radial gradient background to `.app` or `:global(body)`
- Use CSS `@keyframes gradientShift` with 3+ color stops
- Animate background-position or transform for smooth movement
- Colors: dark greens (#001100, #002200, #003311, #0a0a0a) matching terminal theme
- Add subtle scanline overlay on top

### Step 2: Add entrance/exit animations

Add CSS animations:
- `@keyframes slideUp` - for panels entering
- `@keyframes fadeIn` - for content appearing
- `@keyframes pulseGlow` - for active elements
- Apply to: `.generation-progress`, `.player-section`, `.transcript-player`, `.cover-art`
- Use `animation: slideUp 0.5s ease-out, fadeIn 0.3s ease-out`

### Step 3: Add micro-interactions

Add hover/tap feedback:
- Buttons: `transform: scale(0.98)` on active, `scale(1.02)` on hover
- Cards: `box-shadow` transition on hover
- Inputs: border glow on focus
- Links: color transition

### Step 4: Add reduced motion support

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Step 5: Add scrollbar styling

Style scrollbars for `.transcript-list`, `.generation-logs`, history panel:
- Thin scrollbar (6px)
- Green thumb (#00ff41)
- Dark track (#003311)
- Hidden on mobile

### Step 6: Run tests

```bash
cd D:\repos\ai-radio\ai-radio && bun run lint && bun run typecheck
```

Expected: PASS

## Global Constraints

- No cloud dependencies
- Pure CSS animations (no JS animation libraries)
- Bundle size < 50MB
- Svelte 5 runes only
- Preserve terminal/hacker aesthetic
- Respect `prefers-reduced-motion`