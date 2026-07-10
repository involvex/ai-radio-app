# Android Crash Fix Plan

## Crash Summary

**Device**: POCO/Redmi (ARM64, Android 13 / API 33)
**Symptom**: App aborts immediately on launch with Rust panic
**Stack trace key**: `ai_radio_lib::_start_app` (line +8) → `stop_unwind` → `abort`

The panic occurs almost immediately after Tauri's mobile entry point `_start_app` spawns. Offset +8 means the panic is in the very first function calls — before any window or webview is created.

## Root Cause

In `src-tauri/src/lib.rs:60-71`, `run()` is the mobile entry point (`tauri::mobile_entry_point`). Three issues interact to cause the abort:

1. **`.expect()` turns recoverable errors into panics.** If `.run()` returns `Err` (missing assets, webview init failure, plugin error), `.expect("error while running tauri application")` panics on any thread → process abort on Android.
2. **`tauri_plugin_shell` is loaded unconditionally.** `tauri-plugin-shell` v2 supports desktop/Android, but if it returns a configuration/permission error on first run, the `.expect()` turns it into a fatal panic.
3. **Missing mobile config.** `tauri.conf.json` has no `app.mobile` section; the app identifier (`com.airoadio.desktop`) and frontend-dist path need mobile-specific validation.

## Fix Plan

### 1. Replace `.expect()` with graceful error handling (src-tauri/src/lib.rs)

Change `run()` from a panic-on-error path to one that logs the error and exits cleanly:

```rust
pub fn run() -> Result<(), Box<dyn std::error::Error>> {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init()?)
        .setup(|_app| {
            #[cfg(desktop)] {
                desktop::setup_tray(_app)?;
            }
            #[cfg(mobile)] {
                // mobile-specific setup placeholder
            }
            Ok(())
        })
        .run(tauri::generate_context!())
}
```

Update `main.rs` to print the error instead of silently ignoring it:

```rust
fn main() {
    if let Err(e) = ai_radio_lib::run() {
        eprintln!("Fatal error: {e}");
        std::process::exit(1);
    }
}
```

This surfaces the real initialization error in `adb logcat` instead of relying on `stop_unwind`.

### 2. Guard `tauri_plugin_shell` with `#[cfg(desktop)]` (src-tauri/src/lib.rs)

The shell plugin is a desktop-only feature (no shell on Android). Move it behind the desktop guard:

```rust
                #[cfg(desktop)]
                {
                    let _ = tauri_plugin_shell::init();
                }
```

### 3. Add mobile config to `tauri.conf.json`

Add an `app.mobile` block so Tauri knows how to bootstrap the WebView on Android:

```json
  "app": {
    "mobile": {
      "windows": ["main"]
    }
  }
```

Keep the existing desktop `app.windows` for desktop targets.

### 4. Add Android logging (src-tauri/src/lib.rs)

Import `tauri::Manager` unconditionally and log startup progress so `adb logcat` shows what succeeded before failure:

```rust
use tauri::Manager;
// In setup:
_app.emit("log", "Tauri app initialized").ok();
```

(Minimal; can be expanded later.)

### 5. Rebuild and validate

Build commands:
```bash
# 1. Build frontend
bun run build

# 2. Build Android APK
bun run tauri build --target arm64-v8a-linux-android

# 3. Install and capture logs
adb install -r src-tauri/target/arm64-v8a-linux-android/release/apk/ai-radio.apk
adb logcat --pid=$(adb shell pidof -s com.airadio.desktop) > ai-radio.log
```

Verify the APK launches and the logcat output shows either success or a readable Tauri error from step 1.

## Risks & Open Questions

- **`tauri-plugin-shell` on mobile**: If the feature is actually needed on mobile (e.g., for importing audio files), replace with a mobile-compatible alternative instead of removing it entirely.
- **Asset path on Android**: If `tauri.conf.json::build.frontendDist` resolves incorrectly after the config change, Tauri will fail to load the Svelte app. Validate by checking `adb logcat` for asset-load errors after step 1.
- **App identifier**: `com.airoadio.desktop` is unusual for an Android package. Consider renaming to `com.airadio.desktop`, but only after testing the crash fix to isolate the cause.
