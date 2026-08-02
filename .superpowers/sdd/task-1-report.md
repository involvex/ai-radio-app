# Task 1: Prebuilt Binaries & Sidecar Setup (Desktop) - Report

## What I Implemented

1. **Downloaded llama.cpp b10223 Windows x64 CPU binary** from GitHub releases
   - URL: `https://github.com/ggml-org/llama.cpp/releases/download/b10223/llama-b10223-bin-win-cpu-x64.zip`
   - Extracted `llama-server.exe` and all required DLL dependencies

2. **Placed binaries in `src-tauri/binaries/`**:
   - `llama-server-x86_64-pc-windows-msvc.exe` (renamed with Tauri target triple)
   - 21 DLL files (ggml-_, llama-_, libomp, mtmd)

3. **Modified `src-tauri/tauri.conf.json`**:
   - Added `externalBin: ["binaries/llama-server"]` to bundle config

4. **Created `src-tauri/capabilities/default.json`**:
   - Shell permissions for sidecar execution
   - `shell:allow-execute` with sidecar flag for `binaries/llama-server`
   - `shell:allow-spawn` and `shell:allow-kill` permissions

5. **Added `test_sidecar` command to `src-tauri/src/lib.rs`**:
   - Temporary command to verify sidecar can be spawned
   - Uses `tauri_plugin_shell::ShellExt` to spawn with `--version` flag
   - Registered in invoke_handler

## What I Tested

- **TypeScript**: `bun run typecheck` passes (no errors)
- **Rust**: `cargo check` compiles successfully (1 warning fixed - unused variable `child` → `_child`)
- **Binary**: Downloaded and verified `llama-server.exe` exists with all required DLLs

## Files Changed

| File                                                         | Action                        |
| ------------------------------------------------------------ | ----------------------------- |
| `src-tauri/binaries/llama-server-x86_64-pc-windows-msvc.exe` | Created                       |
| `src-tauri/binaries/*.dll` (21 files)                        | Created                       |
| `src-tauri/tauri.conf.json`                                  | Modified (added externalBin)  |
| `src-tauri/capabilities/default.json`                        | Created                       |
| `src-tauri/src/lib.rs`                                       | Modified (added test_sidecar) |

## Self-Review Findings

1. **Large binary footprint**: The binaries directory contains ~35MB of DLLs. This is necessary for Tauri sidecar to work but increases repo size. Consider using Git LFS for future binary assets.

2. **Platform-specific**: Only Windows x64 binaries are included. For cross-platform support, macOS and Linux binaries would need to be added in separate commits with appropriate target triple names.

3. **DLL dependencies**: The server requires 21 DLL files to run. These were extracted from the official release zip and placed alongside the executable.

## Issues or Concerns

1. **Git LFS**: The 35MB of binaries may benefit from Git LFS. This was not configured in this task but should be considered for production.

2. **macOS/Linux**: This task only covers Windows. The binaries directory structure is ready for other platforms (Tauri handles the target triple suffix automatically).

3. **Test command**: The `test_sidecar` command is temporary. It should be removed or converted to a proper integration test before production release.
