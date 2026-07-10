# Fix Android Crash: Invalid Icon Format

## Root Cause
Tauri's Rust `image` crate crashes on Android because window icon PNGs are **16-bit per channel** instead of standard **8-bit RGBA**. The first icon in `bundle.icon` (`32x32.png`) triggers the panic:
```
invalid icon: The specified dimensions (32x32) don't match the number of pixels supplied by the `rgba` argument (2048)
```
Decoded 16-bit RGBA data produces twice the expected pixel count when interpreted as 8-bit.

## Affected Files
- `src-tauri/icons/32x32.png` — 16-bit RGBA
- `src-tauri/icons/128x128.png` — 16-bit RGBA
- `src-tauri/icons/128x128@2x.png` — 16-bit RGBA
- `src-tauri/icons/64x64.png` — 16-bit RGBA (not in bundle, but safe to fix)
- `src-tauri/icons/icon.png` — 16-bit RGBA (fallback window icon)

Other icons (tray, Android launchers, iOS, Store logos) are mostly fine or use different code paths.

## Fix Steps
1. Convert the affected PNGs to **8-bit RGBA** using Pillow
2. Fix Rust compiler warnings in `src-tauri/src/lib.rs` (unused `mut`, unused `app`, unused `Result`)

### Script to convert icons
```python
from PIL import Image
import os

files = [
    "src-tauri/icons/32x32.png",
    "src-tauri/icons/64x64.png",
    "src-tauri/icons/128x128.png",
    "src-tauri/icons/128x128@2x.png",
    "src-tauri/icons/icon.png",
]

for f in files:
    img = Image.open(f).convert("RGBA")
    img.save(f, "PNG")
    print(f"Fixed: {f}")
```

### Rust warnings fix in `src-tauri/src/lib.rs`
- Line 61: change `let mut builder` to `let builder`
- Line 69: change `|app|` to `|_app|`
- Line 59: add `let _ = ` before `tauri::mobile_entry_point`

## Validation
- Rebuild Android dev: `bun run tauri dev --target aarch64-linux-android`
- Verify the app launches without the SIGABRT crash
- Verify window icon and tray icon render correctly
