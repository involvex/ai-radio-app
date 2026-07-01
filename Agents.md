# AI Radio - Agent Instructions

This document provides comprehensive instructions and guidelines for AI agents working on the AI Radio project.

---

## Project Overview

**AI Radio** is a cross-platform desktop/mobile application that generates short, conversational radio-style audio content from topics or web links. It uses:

- **Frontend**: Svelte 5 + TypeScript + Vite
- **Backend/Desktop**: Tauri v2 (Rust)
- **TTS**: Microsoft Edge TTS (WebSocket) with Web Speech fallback
- **AI Integration**: Kilo Gateway, OpenCode AI, Google Gemini (optional)
- **Database**: Dexie (IndexedDB wrapper)
- **Package Manager**: Bun

---

## Useful Commands

All commands are run from the `ai-radio` directory (`D:\repos\ai-radio\ai-radio`).

### Development

```bash
# Start the Vite dev server (frontend only)
bun run dev

# Start Tauri development mode (full app with hot reload)
bun run tauri dev

# Run linter
bun run lint

# Auto-fix linting issues
bun run lint:fix

# Type check TypeScript
bun run typecheck

# Format code with Prettier
bun run format
```

### Building

```bash
# Build frontend for production
bun run build

# Build Tauri app for release
bun run tauri build

# Prebuild check (format + lint + typecheck)
bun run prebuild
bun run check        # equivalent: format + lint:fix + typecheck
```

### Platform-Specific

```bash
# Windows
bun run tauri build --target x86_64-pc-windows-msvc

# Android (requires Android SDK)
bun run tauri build --target arm64-v8a-linux-android  # arm64 Android
```

---

## Technologies

### Frontend Stack

| Technology     | Version | Purpose                                                      |
| -------------- | ------- | ------------------------------------------------------------ |
| **Svelte**     | ^5.0.0  | UI framework (runes syntax: `$state`, `$derived`, `$effect`) |
| **TypeScript** | ^5.5.0  | Type safety                                                  |
| **Vite**       | ^6.0.0  | Build tool and dev server                                    |
| **Dexie**      | ^4.0.10 | IndexedDB wrapper for episode storage                        |
| **cheerio**    | ^1.0.0  | HTML parsing (for future scraping features)                  |

### Desktop/Mobile

| Technology             | Version      | Purpose                              |
| ---------------------- | ------------ | ------------------------------------ |
| **Tauri**              | ^2.0.0       | Cross-platform desktop app framework |
| **Rust**               | 2021 edition | Native backend, system tray          |
| **tauri-plugin-shell** | ^2.0.0       | Shell command execution              |

### LLM/TTS Providers

| Provider          | Endpoint                                                                                   | Model/Service                     |
| ----------------- | ------------------------------------------------------------------------------------------ | --------------------------------- |
| **Kilo Gateway**  | `https://api.kilo.sh/v1/chat/completions`                                                  | `kilo/free/gemini-2.5-flash`      |
| **OpenCode AI**   | `https://opencode.ai/v1/chat/completions`                                                  | `opencode/deepseek-v4-flash-free` |
| **Google Gemini** | `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent` | gemini-2.0-flash                  |
| **Edge TTS**      | `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud`                      | Neural voices (de-DE, en-US)      |

### Development Tools

| Tool                           | Purpose                      |
| ------------------------------ | ---------------------------- |
| **ESLint** + typescript-eslint | Linting                      |
| **Prettier**                   | Code formatting              |
| **svelte-check**               | Svelte/TypeScript validation |

---

## Project Structure

```
ai-radio/
├── src/
│   ├── App.svelte              # Main app component (terminal-style UI)
│   ├── main.ts                 # Entry point
│   ├── lib/
│   │   ├── db.ts               # Dexie IndexedDB wrapper
│   │   ├── edge-tts-client.ts  # Edge TTS WebSocket client
│   │   └── settings.ts         # Settings management + LLM script generation
│   └── vite-env.d.ts
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs              # Rust entry, system tray setup
│   │   └── main.rs             # Desktop main entry
│   ├── Cargo.toml              # Rust dependencies
│   ├── tauri.conf.json         # Tauri configuration
│   └── icons/                  # App icons (PNG, ICO, ICNS)
├── dist/                       # Built frontend (gitignored)
├── package.json
├── vite.config.ts
├── svelte.config.js
├── tsconfig.json
├── tsconfig.node.json
├── eslint.config.ts
└── .env / .env.example         # Environment variables
```

---

## Best Practices and Guidelines

### General

- **Use Bun** for all Node.js operations (installing, running scripts).
- Run `bun run check` before committing to catch formatting, lint, and type errors.
- The app uses **Svelte 5 runes** syntax (`$state`, `$derived`, `$effect`) — avoid Svelte 4 options API.
- Settings and episodes persist via **IndexedDB (Dexie)** and **localStorage**.
- All audio is generated client-side using **Edge TTS** or **Web Speech API**.

### State Management

- Use Svelte 5 runes (`$state`, `$derived`) for component state.
- App settings are managed via `src/lib/settings.ts` (load/save with localStorage).
- Episode history uses Dexie (`src/lib/db.ts`) for IndexedDB storage.

### API Keys

- API keys can be provided via `.env` variables (`VITE_KILO_API_KEY`, `VITE_OPENCODE_API_KEY`, `VITE_GEMINI_API_KEY`) or entered manually in the Settings UI.
- The app works **offline** without an API key (uses fallback text generator).
- Never log or expose API keys in production.

### TTS Implementation

- Primary: **Edge TTS** via WebSocket (`src/lib/edge-tts-client.ts`).
- Fallback: **Web Speech API** (browser-native, lower quality).
- Voice options: German (`de-DE-KillianNeural`, `de-DE-ConradNeural`, etc.) and English (`en-US-GuyNeural`, `en-US-JennyNeural`).

### Rust/Tauri

- System tray is set up in `src-tauri/src/lib.rs` with show/hide/quit menu items.
- Do not add dependencies to `src-tauri/Cargo.toml` without verifying cross-platform compatibility.
- Android targets are pre-built in `src-tauri/target/` — do not commit these.

### Error Handling

- TTS falls back gracefully: Edge TTS → Web Speech API → silent failure.
- LLM calls use try/catch with fallback to `generateScriptFallback()`.
- All async operations wrap errors and show user-friendly messages in the UI.

### Security

- CSP is disabled (`"csp": null`) in tauri.conf.json for development. Review before production.
- API keys stored in localStorage are not encrypted — consider this for production.
- Edge TTS uses a hardcoded token (`VITE_EDGE_TTS_TOKEN`) — this is a known public token.

---

## Code Style

### TypeScript

- Use explicit types for function parameters and return values.
- Prefer `interface` over `type` for object shapes.
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safe access.

### Svelte

- Use `$state()` for reactive state, `$derived()` for computed values.
- Keep components in `App.svelte` as the single root component.
- Use `lang="ts"` in `<script>` tags.

### CSS

- The app uses a **terminal/hacker aesthetic** with dark theme (`#0a0a0a` background, `#00ff41` green text).
- Scanline overlay effect via CSS `repeating-linear-gradient`.
- Use inline `<style>` in Svelte components (scoped).

### Rust

- Follow Rust idioms and use `Result` for error handling.
- Keep platform-specific code under `#[cfg(desktop)]` or `#[cfg(mobile)]` guards.

---

## Build & Release

### Frontend Build

```bash
bun run build   # outputs to dist/
```

### Tauri Build

```bash
bun run tauri build   # builds for all targets
```

Build artifacts:

- Windows: `src-tauri/target/release/ai-radio.exe`
- Android APK: `src-tauri/target/*/release/*.apk` (if built for Android)
- MSI/NSIS: `src-tauri/target/release/bundle/` (Windows installers)

### Pre-Release Checklist

- [ ] Run `bun run check` (format + lint + typecheck)
- [ ] Test offline mode (no API key)
- [ ] Verify Edge TTS works with different voices
- [ ] Check system tray functionality on desktop
- [ ] Review `tauri.conf.json` for `devtools` and `csp` settings

---

## Environment Variables

Create a `.env` file (copy from `.env.example`) with optional variables:

```env
# LLM API Keys (optional - app works without these)
VITE_KILO_API_KEY=your_kilo_key
VITE_OPENCODE_API_KEY=your_opencode_key
VITE_GEMINI_API_KEY=your_gemini_key

# Optional: Set default TTS voice
VITE_DEFAULT_VOICE=de-DE-KillianNeural

# Edge TTS Token (public, already set as fallback)
VITE_EDGE_TTS_TOKEN=6A5AA1D4EAFF4E9FB37E23D68491D6F4
```

---

## Quick Reference

### Radio Script Prompt

```
Du bist ein erfahrener Radio-Moderator für ein Tech- und Infotainment-Radio. Deine Aufgabe ist es, den bereitgestellten Text in einen kurzen, extrem leicht verständlichen Radio-Beitrag (maximal 90 Sekunden Sprechzeit) umzuwandeln.
- Nutze kurze Sätze. Keine Schachtelsätze.
- Verwende rhetorische Fragen und lockere Überleitungen ("Übrigens...", "Schon gewusst?").
- Antworte ausschließlich mit dem reinen Sprechtext. Keine Markdown-Formatierung.
```

### App States

- **OFFLINE**: No API key configured, uses fallback text.
- **READY**: API configured, waiting for user input.
- **GENERATING**: Script being generated via LLM.
- **STREAMING**: Audio playback active.

### Key Dependencies Versions

- Svelte: 5.x (runes, not options API)
- Tauri: 2.x (not 1.x)
- Dexie: 4.x (not 3.x)
- Bun: >=1.3.0 required
