# Task 2 Report: Model Manager (Download, Cache, Select)

## What I Implemented

- `src-tauri/src/model_manager.rs` — 4 Tauri commands:
  - `list_local_models` — Scans app data `models/` dir for `.gguf` files, returns name/filename/path/size
  - `download_model` — Downloads a GGUF from a URL with progress events, skips if already cached
  - `delete_model` — Removes a model file by filename
  - `pick_model_file` — Opens a native file picker filtered to `.gguf` files

- `src-tauri/Cargo.toml` — Added `dirs`, `futures-util`, `tauri-plugin-dialog`, and `stream` feature for reqwest
- `src-tauri/src/lib.rs` — Registered `mod model_manager`, added 4 commands to invoke_handler, registered `tauri_plugin_dialog::init()` plugin

## What I Tested

- `cargo check` in `src-tauri/` — **passes cleanly**

## Files Changed

| File                             | Change                                                                        |
| -------------------------------- | ----------------------------------------------------------------------------- |
| `src-tauri/Cargo.toml`           | Added `dirs`, `futures-util`, `tauri-plugin-dialog`, reqwest `stream` feature |
| `src-tauri/src/model_manager.rs` | New file — 4 commands                                                         |
| `src-tauri/src/lib.rs`           | Added `mod model_manager`, 4 commands to handler, dialog plugin               |

## Self-Review Findings

1. **reqwest `stream` feature** — The brief didn't mention adding `stream` to reqwest features, but `bytes_stream()` requires it. Added it to fix compilation.
2. **Trait imports** — `tauri::Emitter` and `tauri::Manager` are needed in `model_manager.rs` for `emit()` and `path()` respectively. Added them.

## Issues / Concerns

- None. All compiles clean.

---

## Task 2 Code Review Fixes (Round 2)

### Critical Fixes

1. **Path traversal in `delete_model` and `download_model`** — Both now canonicalize the resolved path and verify it starts with the models directory root before proceeding.

2. **`download_model` HTTP response status check** — After `.send()`, now checks `response.status().is_success()` and returns an error with the HTTP status code on failure.

3. **Partial file cleanup on download failure** — Download loop is wrapped in an `async` block that returns `Result`. On error, the partially-written file is removed before returning.

### Important Fixes

4. **`blocking_pick_file()` blocks Tokio runtime** — Wrapped in `tokio::task::spawn_blocking` to avoid blocking the async runtime.

5. **`models_dir` panics on missing path** — Changed from `expect()` to `Result<PathBuf, String>` with `map_err`. All callers updated to propagate with `?`.

6. **`filename.replace(".gguf", "")` replaces all occurrences** — Changed to `strip_suffix(".gguf")` which only removes the trailing `.gguf`.

7. **Removed unused `dirs` dependency** — Removed `dirs = "5.0"` from `src-tauri/Cargo.toml`.

### Verification

- `cargo check` in `src-tauri/` — **passes cleanly**
