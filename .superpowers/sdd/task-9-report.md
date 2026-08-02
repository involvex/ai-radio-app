# Task 9: Integration Testing & Polish - Report

## What Was Tested

1. **Full pre-build check** (`bun run check`): format + lint:fix + typecheck
2. **Lint** (`bun run lint`): standalone lint pass
3. **Rust compilation** (`cargo check`): verify Tauri backend compiles

## Test Results

### `bun run check`

- **Format (Prettier):** All files formatted, no changes needed
- **Lint (ESLint):** No errors or warnings
- **TypeCheck (tsc --noEmit):** No type errors
- **Result: PASS**

### `bun run lint`

- **Result: PASS** — clean output, no issues

### `cargo check`

- **Result: PASS** — compiled in 5.97s, no warnings or errors

## Fixes Applied

**None required.** All checks passed on first run.

## Files Changed

No files were changed during this task.

## Conclusion

The codebase is clean and ready for build. All lint, type-check, formatting, and Rust compilation checks pass without issues.

---

## Critical Issues Fixed (Post-Review)

### 1. Path traversal guard in `model_manager.rs`

**Problem:** String prefix check (`starts_with`) on raw paths is unsafe — an attacker could bypass it via path manipulation.

**Fix:** Replaced with `canonicalize()` comparisons:

- `download_model`: Canonicalizes the parent directory of the destination and compares against the canonical models dir.
- `delete_model`: Canonicalizes the existing file path and checks `starts_with` against the canonical models dir.

### 2. Dialog permissions in `capabilities/default.json`

**Problem:** `pick_model_file` command uses `tauri_plugin_dialog::DialogExt` but dialog permissions were missing from capabilities.

**Fix:** Added `dialog:allow-open`, `dialog:allow-save`, `dialog:allow-ask`, `dialog:allow-message` to the permissions list.

### 3. Sidecar crash detection in `local_llm.rs`

**Problem:** No feedback when the llama-server sidecar crashes — the app would appear stuck.

**Fix:**

- Captures the `Receiver<CommandEvent>` from `spawn()` instead of discarding it.
- Spawns a tokio task that listens for `Terminated` events on the receiver.
- Emits `local-llm-error` with exit code when the process terminates unexpectedly.
- Aborts the monitor task if startup times out.

## Post-Fix Verification

| Check               | Result                    |
| ------------------- | ------------------------- |
| `cargo check`       | PASS — compiled in 25.69s |
| `bun run typecheck` | PASS — no type errors     |

## Files Changed

| File                                  | Change                                                      |
| ------------------------------------- | ----------------------------------------------------------- |
| `src-tauri/src/model_manager.rs`      | Canonicalized path traversal guards                         |
| `src-tauri/capabilities/default.json` | Added dialog permissions                                    |
| `src-tauri/src/local_llm.rs`          | Added sidecar crash monitoring via `Receiver<CommandEvent>` |
