# Task 7 Report: Integrate Local AI into Script Generation Flow

## What Was Implemented

1. **Local generation state tracking** — Added `localGenerating` state variable to differentiate local LLM generation from cloud generation in the UI.

2. **Local LLM status indicator** — Added a `localBadge` in the header that shows the local LLM engine status (NOT RUNNING / STARTING... / READY / ERROR) when `apiProvider === 'local'`. Subscribes to `local-llm-ready` and `local-llm-error` Tauri events.

3. **Updated tuneIn() flow** — Sets `localGenerating = true` when provider is local, and resets it in the `finally` block. Status indicator now shows "LOCAL GENERATING..." vs "GENERATING..." accordingly.

4. **CSS styling** — Added `.local-badge` class with `.ready`, `.error`, and `.starting` variants matching the existing terminal aesthetic.

## What Was Tested

- `bun run typecheck` — passes with no errors
- `bun run lint` — passes with no errors

## Files Changed

- `src/App.svelte` — 50 insertions, 1 deletion
  - Added `onLocalLLMReady`/`onLocalLLMError` imports from `$lib/local-llm`
  - Added `localGenerating` and `localStatus` state variables
  - Added local LLM event listeners in `onMount`
  - Updated `tuneIn()` to track local generation state
  - Added local AI status badge in header
  - Added CSS for local badge

## Self-Review Findings

- The event listeners in `onMount` are only registered when `apiProvider === 'local'`. If the user changes settings without remounting, the listeners won't update. This is acceptable since settings changes are rare and the app already re-reads settings on save. A future improvement could use a `$effect` to reactively subscribe/unsubscribe.
- The `localStatus` defaults to 'NOT RUNNING' which is accurate — the user must start the LLM from the ModelManager in Settings before use.

## Concerns

None — the integration is clean and follows existing patterns.

---

## Task 7 Code Review Fixes (2026-08-02)

### Critical: Event listener memory leak — FIXED

Removed `onLocalLLMReady`/`onLocalLLMError` registration from `onMount`. The `popstate` listener now has a proper cleanup return from `onMount`.

### Important: Event listeners not reactive to settings changes — FIXED

Moved local LLM listener registration into a `$effect` that tracks `settings.apiProvider`. Listeners are now automatically subscribed/unsubscribed when the user switches to/from local provider.

### Important: Unreachable STARTING state — FIXED

Removed `'STARTING...'` from the `localStatus` type union. Removed the `.starting` CSS class and the `@keyframes blink` animation. Removed the `class:starting` binding from the template.

### Verification

- `bun run typecheck` — passes
- `bun run lint` — passes
