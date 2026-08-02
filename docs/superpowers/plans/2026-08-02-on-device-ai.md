# On-Device AI for AI Radio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add local on-device LLM inference to AI Radio using llama.cpp, enabling offline script generation without cloud API keys. Desktop uses a sidecar process; Android uses a Tauri plugin with JNI bridge to prebuilt `.so` files.

**Architecture:** On desktop, a prebuilt `llama-server` binary runs as a Tauri sidecar exposing an OpenAI-compatible HTTP API at `localhost:8080`. On Android, a Tauri 2 Kotlin plugin loads `libllama.so` via JNI and calls the llama.cpp C API directly. The frontend communicates with both via a unified `LocalLLMProvider` abstraction. Models (GGUF format) are downloaded from HuggingFace on demand, bundled as a fallback, or selected via file picker.

**Tech Stack:** llama.cpp (sidecar + FFI), Tauri 2 sidecar/plugin system, `@tauri-apps/plugin-shell`, `@tauri-apps/plugin-dialog`, `@tauri-apps/plugin-fs`, Svelte 5 runes, Rust (reqwest for model download), Kotlin/JNI (Android).

---

## Global Constraints

- Bun >= 1.3.0 for all Node.js operations
- Tauri v2 (not v1)
- Svelte 5 runes syntax (`$state`, `$derived`, `$effect`)
- Rust 2021 edition
- Target: Windows x86_64 (desktop) + Android arm64-v8a
- Default model: Gemma 3 1B (Q4_K_M, ~808MB GGUF)
- No OpenSSL dependency (use `rustls-tls`)
- CSP is disabled (`"csp": null`) in tauri.conf.json

---

## File Structure

### New Files

| File                                                                                     | Responsibility                                                      |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `src-tauri/binaries/llama-server-x86_64-pc-windows-msvc.exe`                             | Prebuilt llama.cpp server binary (desktop sidecar)                  |
| `src-tauri/src/local_llm.rs`                                                             | Desktop-side local LLM provider (spawns sidecar, manages lifecycle) |
| `src-tauri/src/model_manager.rs`                                                         | Model download, caching, and file management                        |
| `src/lib/local-llm.ts`                                                                   | Frontend TypeScript API for local LLM (invoke Tauri commands)       |
| `src/lib/model-manager.ts`                                                               | Frontend model management UI logic                                  |
| `src-tauri/android/app/src/main/java/com/airoadio/desktop/plugins/llm/LocalLlmPlugin.kt` | Android Tauri plugin (Kotlin, JNI bridge to llama.cpp)              |
| `src-tauri/android/app/src/main/java/com/airoadio/desktop/plugins/llm/LlamaCppBridge.kt` | JNI bridge to prebuilt libllama.so                                  |
| `src-tauri/android/app/src/main/jniLibs/arm64-v8a/libllama.so`                           | Prebuilt llama.cpp shared library for Android                       |
| `src-tauri/android/app/src/main/jniLibs/arm64-v8a/libggml.so`                            | Prebuilt ggml library for Android                                   |
| `src-tauri/android/app/src/main/jniLibs/arm64-v8a/libggml-base.so`                       | Prebuilt ggml-base for Android                                      |
| `src-tauri/android/app/src/main/jniLibs/arm64-v8a/libggml-cpu.so`                        | Prebuilt ggml-cpu for Android                                       |
| `src-tauri/android/app/src/main/jniLibs/arm64-v8a/libggml-vulkan.so`                     | Prebuilt ggml-vulkan for Android (GPU)                              |
| `src/components/ModelManager.svelte`                                                     | Model selection, download progress, file picker UI                  |
| `docs/superpowers/plans/2026-08-02-on-device-ai.md`                                      | This plan                                                           |

### Modified Files

| File                                     | Changes                                                                                                                                                  |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src-tauri/Cargo.toml`                   | Add `tauri-plugin-shell`, `tauri-plugin-dialog`, `tauri-plugin-fs`, `reqwest` (already present), `dirs` for app data paths                               |
| `src-tauri/tauri.conf.json`              | Add `externalBin` for sidecar, add plugin permissions                                                                                                    |
| `src-tauri/capabilities/default.json`    | Add shell, dialog, fs permissions                                                                                                                        |
| `src-tauri/src/lib.rs`                   | Register new Tauri commands: `load_local_model`, `generate_script_local`, `download_model`, `list_local_models`, `pick_model_file`, `unload_local_model` |
| `src/lib/settings.ts`                    | Add `'local'` as an API provider option, add `localModelPath` to settings                                                                                |
| `src/App.svelte`                         | Add ModelManager component, update settings panel, handle local provider in `tuneIn()`                                                                   |
| `src-tauri/android/app/build.gradle.kts` | Add JNI library source sets                                                                                                                              |

---

## Task 1: Prebuilt Binaries & Sidecar Setup (Desktop)

**Files:**

- Create: `src-tauri/binaries/llama-server-x86_64-pc-windows-msvc.exe`
- Modify: `src-tauri/tauri.conf.json`
- Modify: `src-tauri/capabilities/default.json`

**Interfaces:**

- Consumes: Prebuilt llama-server binary from llama.cpp releases
- Produces: Sidecar running at `http://127.0.0.1:8080` with OpenAI-compatible API

- [ ] **Step 1: Download prebuilt llama-server binary**

Download the latest `llama-server` binary for Windows x64 from:
`https://github.com/ggml-org/llama.cpp/releases`

Select a release with GGUF support (e.g., b5590 or newer). Download `llama-server-x86_64-pc-windows-msvc.exe` (or the zip containing it).

Place it in `src-tauri/binaries/` with the target triple suffix:

```
src-tauri/binaries/llama-server-x86_64-pc-windows-msvc.exe
```

- [ ] **Step 2: Configure sidecar in tauri.conf.json**

Add `externalBin` to the bundle configuration:

```json
{
	"bundle": {
		"externalBin": ["binaries/llama-server"]
	}
}
```

Note: Tauri automatically appends the target triple and `.exe` suffix at build time.

- [ ] **Step 3: Add shell permissions for sidecar**

Update `src-tauri/capabilities/default.json` to allow spawning the sidecar:

```json
{
	"permissions": [
		"core:default",
		{
			"identifier": "shell:allow-execute",
			"allow": [
				{
					"name": "binaries/llama-server",
					"sidecar": true,
					"args": true
				}
			]
		},
		"shell:allow-spawn",
		"shell:allow-kill"
	]
}
```

- [ ] **Step 4: Test sidecar can be spawned**

Create a temporary test in `src-tauri/src/lib.rs`:

```rust
#[tauri::command]
async fn test_sidecar(app: tauri::AppHandle) -> Result<String, String> {
    use tauri_plugin_shell::ShellExt;
    let sidecar_command = app.shell().sidecar("binaries/llama-server").unwrap();
    let (mut _rx, child) = sidecar_command.args(["--version"]).spawn().map_err(|e| e.to_string())?;
    Ok("Sidecar spawned successfully".to_string())
}
```

Register this command and test by invoking it from the frontend.

- [ ] **Step 5: Commit**

```bash
git add src-tauri/binaries/ src-tauri/tauri.conf.json src-tauri/capabilities/default.json
git commit -m "feat: add llama.cpp sidecar binary and Tauri configuration"
```

---

## Task 2: Model Manager (Download, Cache, Select)

**Files:**

- Create: `src-tauri/src/model_manager.rs`
- Modify: `src-tauri/src/lib.rs` (register commands)
- Modify: `src-tauri/Cargo.toml` (add `dirs` crate)

**Interfaces:**

- Consumes: Tauri app handle, filesystem APIs
- Produces: `download_model()`, `list_local_models()`, `get_model_path()`, `delete_model()` commands

- [ ] **Step 1: Add `dirs` dependency to Cargo.toml**

```toml
[dependencies]
dirs = "5.0"
```

- [ ] **Step 2: Create model_manager.rs**

```rust
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::AppHandle;
use tauri_plugin_fs::FsExt;

#[derive(Debug, Serialize, Deserialize)]
pub struct LocalModel {
    pub name: String,
    pub filename: String,
    pub path: String,
    pub size_bytes: u64,
    pub downloaded: bool,
}

fn models_dir(app: &AppHandle) -> PathBuf {
    let data_dir = app.path().app_data_dir().expect("failed to get app data dir");
    data_dir.join("models")
}

#[tauri::command]
pub async fn list_local_models(app: AppHandle) -> Result<Vec<LocalModel>, String> {
    let dir = models_dir(&app);
    if !dir.exists() {
        std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    }

    let mut models = Vec::new();
    for entry in std::fs::read_dir(&dir).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        if path.extension().and_then(|e| e.to_str()) == Some("gguf") {
            let metadata = std::fs::metadata(&path).map_err(|e| e.to_string())?;
            let filename = path.file_name().unwrap().to_string_lossy().to_string();
            models.push(LocalModel {
                name: filename.replace(".gguf", ""),
                filename,
                path: path.to_string_lossy().to_string(),
                size_bytes: metadata.len(),
                downloaded: true,
            });
        }
    }
    Ok(models)
}

#[tauri::command]
pub async fn download_model(
    app: AppHandle,
    url: String,
    filename: String,
) -> Result<String, String> {
    let dir = models_dir(&app);
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let dest = dir.join(&filename);

    if dest.exists() {
        return Ok(dest.to_string_lossy().to_string());
    }

    // Download with progress via reqwest
    let client = reqwest::Client::new();
    let response = client.get(&url).send().await.map_err(|e| e.to_string())?;
    let total_size = response.content_length().unwrap_or(0);

    let mut file = std::fs::File::create(&dest).map_err(|e| e.to_string())?;
    let mut downloaded: u64 = 0;
    let mut stream = response.bytes_stream();

    use futures_util::StreamExt;
    use std::io::Write;

    while let Some(chunk) = stream.next().await {
        let chunk = chunk.map_err(|e| e.to_string())?;
        file.write_all(&chunk).map_err(|e| e.to_string())?;
        downloaded += chunk.len() as u64;
        // Emit progress event to frontend
        app.emit("model-download-progress", serde_json::json!({
            "filename": filename,
            "downloaded": downloaded,
            "total": total_size,
        })).ok();
    }

    Ok(dest.to_string_lossy().to_string())
}

#[tauri::command]
pub async fn delete_model(app: AppHandle, filename: String) -> Result<(), String> {
    let path = models_dir(&app).join(&filename);
    if path.exists() {
        std::fs::remove_file(&path).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn pick_model_file(app: AppHandle) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::DialogExt;
    let file = app.dialog().file()
        .add_filter("GGUF Model", &["gguf"])
        .blocking_pick_file();
    match file {
        Some(path) => Ok(Some(path.to_string())),
        None => Ok(None),
    }
}
```

- [ ] **Step 3: Register commands in lib.rs**

Add to the `invoke_handler` in `lib.rs`:

```rust
.model_manager::list_local_models
.model_manager::download_model
.model_manager::delete_model
.model_manager::pick_model_file
```

- [ ] **Step 4: Add `futures-util` dependency**

```toml
[dependencies]
futures-util = "0.3"
```

- [ ] **Step 5: Test model listing**

Invoke `list_local_models` from the frontend and verify it returns an empty array (no models yet).

- [ ] **Step 6: Commit**

```bash
git add src-tauri/src/model_manager.rs src-tauri/src/lib.rs src-tauri/Cargo.toml
git commit -m "feat: add model manager for GGUF download, cache, and file picker"
```

---

## Task 3: Local LLM Provider (Desktop Sidecar)

**Files:**

- Create: `src-tauri/src/local_llm.rs`
- Modify: `src-tauri/src/lib.rs`

**Interfaces:**

- Consumes: Sidecar binary (Task 1), model path (Task 2)
- Produces: `generate_script_local` command, `start_local_llm`, `stop_local_llm` commands

- [ ] **Step 1: Create local_llm.rs**

```rust
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_shell::ShellExt;

pub struct LocalLlmState {
    pub child: Mutex<Option<tauri_plugin_shell::process::Child>>,
    pub port: u16,
    pub model_path: Mutex<Option<String>>,
}

impl Default for LocalLlmState {
    fn default() -> Self {
        Self {
            child: Mutex::new(None),
            port: 8080,
            model_path: Mutex::new(None),
        }
    }
}

#[tauri::command]
pub async fn start_local_llm(
    app: AppHandle,
    model_path: String,
) -> Result<String, String> {
    let state = app.state::<LocalLlmState>();

    // Stop any existing instance
    stop_local_llm_inner(&state)?;

    let port = state.port;
    let model = model_path.clone();

    let sidecar_command = app.shell()
        .sidecar("binaries/llama-server")
        .map_err(|e| e.to_string())?;

    let args = vec![
        "--model".to_string(),
        model,
        "--port".to_string(),
        port.to_string(),
        "--host".to_string(),
        "127.0.0.1".to_string(),
        "--ctx-size".to_string(),
        "2048".to_string(),
        "--n-predict".to_string(),
        "1024".to_string(),
        "--no-warmup".to_string(),
    ];

    let (mut rx, child) = sidecar_command
        .args(&args)
        .spawn()
        .map_err(|e| e.to_string())?;

    *state.child.lock().unwrap() = Some(child);
    *state.model_path.lock().unwrap() = Some(model_path);

    // Wait for server to be ready by polling health endpoint
    let url = format!("http://127.0.0.1:{}/health", port);
    let client = reqwest::Client::new();
    for _ in 0..30 {
        tokio::time::sleep(std::time::Duration::from_millis(500)).await;
        if let Ok(resp) = client.get(&url).send().await {
            if resp.status().is_success() {
                app.emit("local-llm-ready", ()).ok();
                return Ok(format!("Local LLM started on port {}", port));
            }
        }
    }

    Err("Local LLM failed to start within 15 seconds".to_string())
}

fn stop_local_llm_inner(state: &LocalLlmState) -> Result<(), String> {
    if let Some(child) = state.child.lock().unwrap().take() {
        child.kill().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn stop_local_llm(app: AppHandle) -> Result<(), String> {
    let state = app.state::<LocalLlmState>();
    stop_local_llm_inner(&state)?;
    Ok(())
}

#[tauri::command]
pub async fn generate_script_local(
    app: AppHandle,
    topic: String,
    quality: String,
    style: String,
    link_content: Option<String>,
    mode: Option<String>,
) -> Result<String, String> {
    let state = app.state::<LocalLlmState>();
    let port = state.port;

    let system_prompt = build_local_system_prompt(&quality, &style);
    let user_prompt = build_local_user_prompt(&topic, &link_content, &mode);

    let request_body = serde_json::json!({
        "messages": [
            { "role": "system", "content": system_prompt },
            { "role": "user", "content": user_prompt }
        ],
        "max_tokens": max_tokens_for_quality(&quality),
        "temperature": temperature_for_quality(&quality),
        "stream": false
    });

    let client = reqwest::Client::new();
    let response = client
        .post(format!("http://127.0.0.1:{}/v1/chat/completions", port))
        .json(&request_body)
        .send()
        .await
        .map_err(|e| format!("Local LLM request failed: {}", e))?;

    let body: serde_json::Value = response.json().await.map_err(|e| e.to_string())?;

    let script = body["choices"][0]["message"]["content"]
        .as_str()
        .unwrap_or("")
        .to_string();

    if script.is_empty() {
        return Err("Local LLM returned empty response".to_string());
    }

    Ok(script)
}

fn build_local_system_prompt(quality: &str, style: &str) -> String {
    let duration = match quality {
        "short" => "30 Sekunden",
        "normal" => "90 Sekunden",
        "long" => "3 Minuten",
        "chill" => "4 Minuten",
        _ => "90 Sekunden",
    };

    let style_hint = match style {
        "tech" => "Technisch versiert, mit klaren Erklärungen.",
        "casual" => "Locker und ungezwungen, wie unter Freunden.",
        "academic" => "Fachkundig und präzise, aber verständlich.",
        "entertaining" => "Unterhaltsam mit Überraschungsmomenten.",
        "news" => "Nachrichtlich informativ und sachlich.",
        "podcast" => "Podcast-Atmosphäre, persönlich und nahbar.",
        _ => "Locker und verständlich.",
    };

    format!(
        "Du bist ein erfahrener Radio-Moderator für ein Tech- und Infotainment-Radio. \
         Deine Aufgabe ist es, den bereitgestellten Text in einen kurzen, extrem leicht \
         verständlichen Radio-Beitrag (maximal {} Sprechzeit) umzuwandeln.\n\
         {}\n\
         - Nutze kurze Sätze. Keine Schachtelsätze.\n\
         - Verwende rhetorische Fragen und lockere Überleitungen.\n\
         - Antworte ausschließlich mit dem reinen Sprechtext.",
        duration, style_hint
    )
}

fn build_local_user_prompt(topic: &str, link_content: &Option<String>, mode: &Option<String>) -> String {
    let mut prompt = match mode.as_deref() {
        Some("deeper") => format!(
            "Gehe vertieft auf das Thema '{}' ein. Erkläre den Kontext, warum es wichtig ist, und nenne konkrete Beispiele.",
            topic
        ),
        _ => format!(
            "Verwandle das following Topic in ein Radioskript: '{}'",
            topic
        ),
    };

    if let Some(content) = link_content {
        prompt.push_str(&format!("\n\nQuelltext (URL-Inhalt):\n{}", content));
    }

    prompt
}

fn max_tokens_for_quality(quality: &str) -> u32 {
    match quality {
        "short" => 200,
        "normal" => 500,
        "long" => 800,
        "chill" => 1000,
        _ => 500,
    }
}

fn temperature_for_quality(quality: &str) -> f32 {
    match quality {
        "short" => 0.9,
        "normal" => 0.8,
        "long" => 0.7,
        "chill" => 0.6,
        _ => 0.8,
    }
}
```

- [ ] **Step 2: Register commands and state in lib.rs**

Add to `lib.rs`:

```rust
mod local_llm;
mod model_manager;

// In the Builder::default() chain:
.manage(local_llm::LocalLlmState::default())

// In invoke_handler:
.local_llm::start_local_llm
.local_llm::stop_local_llm
.local_llm::generate_script_local
```

- [ ] **Step 3: Test sidecar lifecycle**

Invoke `start_local_llm` with a model path, verify the health endpoint responds, then invoke `stop_local_llm`.

- [ ] **Step 4: Commit**

```bash
git add src-tauri/src/local_llm.rs src-tauri/src/lib.rs
git commit -m "feat: add local LLM provider with llama.cpp sidecar integration"
```

---

## Task 4: Frontend Local LLM API

**Files:**

- Create: `src/lib/local-llm.ts`
- Modify: `src/lib/settings.ts`

**Interfaces:**

- Consumes: Tauri `invoke()` commands from Tasks 2-3
- Produces: `startLocalLLM()`, `stopLocalLLM()`, `generateScriptLocal()`, `listLocalModels()`, `downloadModel()`, `pickModelFile()`

- [ ] **Step 1: Create local-llm.ts**

```typescript
import {listen} from '@tauri-apps/api/event'
import {invoke} from '@tauri-apps/api/core'

export interface LocalModel {
	name: string
	filename: string
	path: string
	size_bytes: number
	downloaded: boolean
}

export interface DownloadProgress {
	filename: string
	downloaded: number
	total: number
}

export async function startLocalLLM(modelPath: string): Promise<string> {
	return invoke<string>('start_local_llm', {modelPath})
}

export async function stopLocalLLM(): Promise<void> {
	return invoke('stop_local_llm')
}

export async function generateScriptLocal(params: {
	topic: string
	quality: string
	style: string
	linkContent?: string
	mode?: string
}): Promise<string> {
	return invoke<string>('generate_script_local', {
		topic: params.topic,
		quality: params.quality,
		style: params.style,
		linkContent: params.linkContent ?? null,
		mode: params.mode ?? null,
	})
}

export async function listLocalModels(): Promise<LocalModel[]> {
	return invoke<LocalModel[]>('list_local_models')
}

export async function downloadModel(
	url: string,
	filename: string,
): Promise<string> {
	return invoke<string>('download_model', {url, filename})
}

export async function deleteModel(filename: string): Promise<void> {
	return invoke('delete_model', {filename})
}

export async function pickModelFile(): Promise<string | null> {
	return invoke<string | null>('pick_model_file')
}

export function onDownloadProgress(
	callback: (progress: DownloadProgress) => void,
) {
	return listen<DownloadProgress>('model-download-progress', event => {
		callback(event.payload)
	})
}

export function onLocalLLMReady(callback: () => void) {
	return listen('local-llm-ready', () => callback())
}

export function onLocalLLMError(callback: (error: string) => void) {
	return listen<string>('local-llm-error', event => {
		callback(event.payload)
	})
}

// HuggingFace model URLs for easy access
export const AVAILABLE_MODELS = {
	'gemma-3-1b': {
		name: 'Gemma 3 1B (Recommended)',
		url: 'https://huggingface.co/unsloth/gemma-3-1b-it-GGUF/resolve/main/gemma-3-1b-it-Q4_K_M.gguf',
		filename: 'gemma-3-1b-it-Q4_K_M.gguf',
		sizeBytes: 808_000_000, // ~808MB
		description: 'Good German quality, ~2GB RAM required',
	},
	'qwen3-1.7b': {
		name: 'Qwen3 1.7B',
		url: 'https://huggingface.co/unsloth/Qwen3-1.7B-GGUF/resolve/main/Qwen3-1.7B-Q4_K_M.gguf',
		filename: 'Qwen3-1.7B-Q4_K_M.gguf',
		sizeBytes: 1_000_000_000, // ~1GB
		description: 'Strong multilingual, ~2GB RAM required',
	},
	'llama-3.2-3b': {
		name: 'Llama 3.2 3B',
		url: 'https://huggingface.co/unsloth/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf',
		filename: 'Llama-3.2-3B-Instruct-Q4_K_M.gguf',
		sizeBytes: 2_000_000_000, // ~2GB
		description: 'Highest quality, ~4GB RAM required',
	},
} as const
```

- [ ] **Step 2: Add 'local' provider to settings.ts**

Modify the `AppSettings` interface in `settings.ts`:

```typescript
// Change apiProvider type:
apiProvider: 'kilo' | 'opencode' | 'gemini' | 'local' | 'none';

// Add to AppSettings:
localModelPath?: string;
```

- [ ] **Step 3: Update invokeGenerateScript to support local provider**

```typescript
export async function invokeGenerateScript(
	topic: string,
	settings: AppSettings,
	linkContent?: string,
	mode?: 'deeper' | 'similar',
	similarTopic?: string,
): Promise<string> {
	const effectiveTopic =
		mode === 'similar' && similarTopic ? similarTopic : topic

	// Local provider uses different Tauri command
	if (settings.apiProvider === 'local') {
		return invoke<string>('generate_script_local', {
			topic: effectiveTopic,
			quality: settings.quality,
			style: settings.style,
			linkContent: linkContent || null,
			mode: mode || null,
		})
	}

	// Cloud providers use existing command
	return invoke<string>('generate_script', {
		request: {
			topic: effectiveTopic,
			provider: settings.apiProvider,
			api_key: settings.apiKey || '',
			link_content: linkContent || null,
			quality: settings.quality,
			style: settings.style,
			mode: mode || null,
		},
	})
}
```

- [ ] **Step 4: Test frontend API**

Invoke `listLocalModels()` from browser console, verify it returns empty array.

- [ ] **Step 5: Commit**

```bash
git add src/lib/local-llm.ts src/lib/settings.ts
git commit -m "feat: add frontend local LLM API and settings integration"
```

---

## Task 5: Model Manager UI Component

**Files:**

- Create: `src/components/ModelManager.svelte`
- Modify: `src/App.svelte`

**Interfaces:**

- Consumes: `local-llm.ts` API (Task 4)
- Produces: ModelManager Svelte component with download, select, delete, file picker

- [ ] **Step 1: Create ModelManager.svelte**

```svelte
<script lang="ts">
  import {
    listLocalModels,
    downloadModel,
    deleteModel,
    pickModelFile,
    startLocalLLM,
    stopLocalLLM,
    onDownloadProgress,
    onLocalLLMReady,
    AVAILABLE_MODELS,
    type LocalModel,
    type DownloadProgress,
  } from '$lib/local-llm';

  let models = $state<LocalModel[]>([]);
  let selectedModel = $state<string>('');
  let isDownloading = $state(false);
  let downloadProgress = $state<DownloadProgress | null>(null);
  let isStarting = $state(false);
  let status = $state<'stopped' | 'starting' | 'ready' | 'error'>('stopped');
  let errorMessage = $state('');

  // Load models on mount
  $effect(() => {
    loadModels();
    const unsubProgress = onDownloadProgress((p) => {
      downloadProgress = p;
    });
    const unsubReady = onLocalLLMReady(() => {
      status = 'ready';
      isStarting = false;
    });
    return () => {
      unsubProgress.then((unsub) => unsub());
      unsubReady.then((unsub) => unsub());
    };
  });

  async function loadModels() {
    models = await listLocalModels();
  }

  async function handleDownload(modelKey: keyof typeof AVAILABLE_MODELS) {
    const model = AVAILABLE_MODELS[modelKey];
    isDownloading = true;
    downloadProgress = null;
    try {
      await downloadModel(model.url, model.filename);
      await loadModels();
    } catch (e) {
      errorMessage = String(e);
    } finally {
      isDownloading = false;
      downloadProgress = null;
    }
  }

  async function handlePickFile() {
    try {
      const path = await pickModelFile();
      if (path) {
        await loadModels();
      }
    } catch (e) {
      errorMessage = String(e);
    }
  }

  async function handleDelete(filename: string) {
    await deleteModel(filename);
    await loadModels();
    if (selectedModel === filename) {
      selectedModel = '';
    }
  }

  async function handleStart() {
    if (!selectedModel) return;
    isStarting = true;
    status = 'starting';
    errorMessage = '';
    try {
      const model = models.find((m) => m.filename === selectedModel);
      if (model) {
        await startLocalLLM(model.path);
      }
    } catch (e) {
      errorMessage = String(e);
      status = 'error';
      isStarting = false;
    }
  }

  async function handleStop() {
    await stopLocalLLM();
    status = 'stopped';
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
</script>

<div class="model-manager">
  <h3>LOCAL AI MODELS</h3>

  <!-- Status indicator -->
  <div class="status">
    <span class="status-dot" class:active={status === 'ready'} class:error={status === 'error'}></span>
    {#if status === 'stopped'}NOT RUNNING
    {:else if status === 'starting'}STARTING...
    {:else if status === 'ready'}READY
    {:else}ERROR: {errorMessage}
    {/if}
  </div>

  <!-- Download available models -->
  <div class="section">
    <h4>DOWNLOAD MODELS</h4>
    {#each Object.entries(AVAILABLE_MODELS) as [key, model]}
      {@const isInstalled = models.some((m) => m.filename === model.filename)}
      <div class="model-row">
        <div class="model-info">
          <span class="model-name">{model.name}</span>
          <span class="model-size">{formatSize(model.sizeBytes)}</span>
          <span class="model-desc">{model.description}</span>
        </div>
        {#if isInstalled}
          <span class="installed-badge">INSTALLED</span>
        {:else if isDownloading && downloadProgress?.filename === model.filename}
          <div class="progress">
            <div class="progress-bar" style="width: {(downloadProgress.downloaded / downloadProgress.total) * 100}%"></div>
            <span>{formatSize(downloadProgress.downloaded)} / {formatSize(downloadProgress.total)}</span>
          </div>
        {:else}
          <button onclick={() => handleDownload(key)} disabled={isDownloading}>DOWNLOAD</button>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Installed models -->
  <div class="section">
    <h4>INSTALLED MODELS</h4>
    {#if models.length === 0}
      <p class="empty">No models installed. Download one above or pick a .gguf file.</p>
    {:else}
      {#each models as model}
        <div class="model-row">
          <label class="model-select">
            <input type="radio" name="model" value={model.filename} bind:group={selectedModel} />
            <span class="model-name">{model.name}</span>
            <span class="model-size">{formatSize(model.size_bytes)}</span>
          </label>
          <button class="delete-btn" onclick={() => handleDelete(model.filename)}>×</button>
        </div>
      {/each}
    {/if}

    <button class="pick-file-btn" onclick={handlePickFile}>PICK .GGUF FILE</button>
  </div>

  <!-- Start/Stop -->
  <div class="controls">
    {#if status === 'stopped' || status === 'error'}
      <button class="start-btn" onclick={handleStart} disabled={!selectedModel || isStarting}>
        {isStarting ? 'STARTING...' : 'START LOCAL AI'}
      </button>
    {:else}
      <button class="stop-btn" onclick={handleStop}>STOP</button>
    {/if}
  </div>
</div>

<style>
  .model-manager {
    border: 1px solid #00ff41;
    padding: 1rem;
    margin: 0.5rem 0;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
  }
  h3, h4 { color: #00ff41; margin: 0 0 0.5rem; text-transform: uppercase; }
  .status {
    display: flex; align-items: center; gap: 0.5rem;
    margin-bottom: 1rem; color: #00ff41;
  }
  .status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #333;
  }
  .status-dot.active { background: #00ff41; box-shadow: 0 0 6px #00ff41; }
  .status-dot.error { background: #ff0040; }
  .section { margin-bottom: 1rem; }
  .model-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.5rem 0; border-bottom: 1px solid #1a1a1a;
  }
  .model-info { display: flex; flex-direction: column; gap: 2px; }
  .model-name { color: #00ff41; font-weight: bold; }
  .model-size { color: #666; font-size: 0.75rem; }
  .model-desc { color: #444; font-size: 0.7rem; }
  .installed-badge { color: #00ff41; font-size: 0.7rem; }
  .progress { display: flex; align-items: center; gap: 0.5rem; }
  .progress-bar {
    height: 4px; background: #00ff41; transition: width 0.3s;
  }
  .empty { color: #666; font-style: italic; }
  button {
    background: transparent; border: 1px solid #00ff41; color: #00ff41;
    padding: 0.3rem 0.8rem; cursor: pointer; font-family: inherit;
    text-transform: uppercase; font-size: 0.75rem;
  }
  button:hover:not(:disabled) { background: #00ff4120; }
  button:disabled { opacity: 0.3; cursor: not-allowed; }
  .delete-btn { border-color: #ff0040; color: #ff0040; padding: 0.2rem 0.5rem; }
  .pick-file-btn { width: 100%; margin-top: 0.5rem; }
  .controls { display: flex; gap: 0.5rem; margin-top: 1rem; }
  .start-btn { flex: 1; background: #00ff4120; }
  .stop-btn { flex: 1; border-color: #ff0040; color: #ff0040; }
  .model-select { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
  .model-select input { accent-color: #00ff41; }
</style>
```

- [ ] **Step 2: Integrate ModelManager into App.svelte**

Add to the settings panel section in `App.svelte`:

```svelte
<script lang="ts">
  import ModelManager from './components/ModelManager.svelte';
  // ... existing imports
</script>

<!-- In the settings panel, add after the API provider section -->
{#if settings.apiProvider === 'local'}
  <ModelManager />
{/if}
```

- [ ] **Step 3: Add 'local' option to provider dropdown in settings**

In the settings panel of `App.svelte`, add a radio/option for the local provider:

```svelte
<button
  class="provider-btn"
  class:active={settings.apiProvider === 'local'}
  onclick={() => settings.apiProvider = 'local'}
>
  LOCAL
</button>
```

- [ ] **Step 4: Test UI renders**

Run `bun run dev` and verify the ModelManager component appears in settings when "LOCAL" is selected.

- [ ] **Step 5: Commit**

```bash
git add src/components/ModelManager.svelte src/App.svelte
git commit -m "feat: add ModelManager UI component for local AI model management"
```

---

## Task 6: Android Tauri Plugin (JNI Bridge)

**Files:**

- Create: `src-tauri/android/app/src/main/java/com/airoadio/desktop/plugins/llm/LocalLlmPlugin.kt`
- Create: `src-tauri/android/app/src/main/java/com/airoadio/desktop/plugins/llm/LlamaCppBridge.kt`
- Create: `src-tauri/android/app/src/main/jniLibs/arm64-v8a/` (prebuilt .so files)
- Modify: `src-tauri/android/app/build.gradle.kts`

**Interfaces:**

- Consumes: Prebuilt llama.cpp `.so` files for Android arm64-v8a
- Produces: Kotlin plugin with `loadModel`, `generate`, `unloadModel` commands

- [ ] **Step 1: Obtain prebuilt llama.cpp .so files for Android**

Option A: Build from source using Android NDK:

```bash
git clone https://github.com/ggml-org/llama.cpp.git
cd llama.cpp
cmake \
  -DCMAKE_TOOLCHAIN_FILE=$ANDROID_NDK/build/cmake/android.toolchain.cmake \
  -DANDROID_ABI=arm64-v8a \
  -DANDROID_PLATFORM=android-28 \
  -DBUILD_SHARED_LIBS=ON \
  -DGGML_VULKAN=ON \
  -DGGML_OPENMP=OFF \
  -DGGML_LLAMAFILE=OFF \
  -DCMAKE_BUILD_TYPE=Release \
  -B build-android
cmake --build build-android --config Release -j$(nproc)
```

Option B: Use prebuilt binaries from `xentron-bit/llama-android-prebuilt`:

```bash
git clone https://github.com/xentron-bit/llama-android-prebuilt.git
cp llama-android-prebuilt/jniLibs/arm64-v8a/*.so \
   src-tauri/android/app/src/main/jniLibs/arm64-v8a/
```

Place the following files in `src-tauri/android/app/src/main/jniLibs/arm64-v8a/`:

- `libllama.so`
- `libggml.so`
- `libggml-base.so`
- `libggml-cpu.so`
- `libggml-vulkan.so` (optional, for GPU acceleration)

- [ ] **Step 2: Create LlamaCppBridge.kt (JNI bridge)**

```kotlin
package com.airoadio.desktop.plugins.llm

import android.util.Log

class LlamaCppBridge {
    companion object {
        private const val TAG = "LlamaCppBridge"

        init {
            try {
                System.loadLibrary("llama")
                System.loadLibrary("ggml")
                System.loadLibrary("ggml-base")
                System.loadLibrary("ggml-cpu")
                Log.i(TAG, "llama.cpp libraries loaded successfully")
            } catch (e: UnsatisfiedLinkError) {
                Log.e(TAG, "Failed to load llama.cpp libraries", e)
            }
        }
    }

    // Native methods - implemented via JNI or called via C API
    external fun nativeLoadModel(modelPath: String, ctxSize: Int): Long
    external fun nativeGenerate(handle: Long, prompt: String, maxTokens: Int, temperature: Float): String
    external fun nativeFreeModel(handle: Long)

    fun loadModel(modelPath: String, ctxSize: Int = 2048): Long {
        return nativeLoadModel(modelPath, ctxSize)
    }

    fun generate(handle: Long, prompt: String, maxTokens: Int = 512, temperature: Float = 0.8f): String {
        return nativeGenerate(handle, prompt, maxTokens, temperature)
    }

    fun freeModel(handle: Long) {
        nativeFreeModel(handle)
    }
}
```

Note: The `external` functions require a C/C++ JNI layer. For a simpler approach, you can use a Kotlin wrapper that calls the llama.cpp C API via a C bridge file, or use a prebuilt AAR that includes JNI bindings.

Alternative simpler approach using a C bridge file:

- [ ] **Step 2b: Create JNI C bridge (if needed)**

Create `src-tauri/android/app/src/main/cpp/llama-jni.c`:

```c
#include <jni.h>
#include "llama.h"

JNIEXPORT jlong JNICALL
Java_com_airoadio_desktop_plugins_llm_LlamaCppBridge_nativeLoadModel(
    JNIEnv *env, jobject thiz, jstring modelPath, jint ctxSize) {
    const char *path = (*env)->GetStringUTFChars(env, modelPath, NULL);

    struct llama_context_params params = llama_context_default_params();
    params.n_ctx = ctxSize;
    params.n_batch = 512;

    struct llama_model *model = llama_load_model_from_file(path, params);
    (*env)->ReleaseStringUTFChars(env, modelPath, path);

    if (!model) return -1;

    struct llama_context *ctx = llama_new_context_with_model(model, params);
    return (jlong)(intptr_t)ctx;
}

JNIEXPORT jstring JNICALL
Java_com_airoadio_desktop_plugins_llm_LlamaCppBridge_nativeGenerate(
    JNIEnv *env, jobject thiz, jlong handle, jstring prompt,
    jint maxTokens, jfloat temperature) {
    struct llama_context *ctx = (struct llama_context *)(intptr_t)handle;
    const char *promptStr = (*env)->GetStringUTFChars(env, prompt, NULL);

    // Tokenize
    const int n_prompt = -llama_tokenize(
        llama_get_model(ctx), promptStr, strlen(promptStr), NULL, 0, true, true);
    llama_token *tokens = malloc(sizeof(llama_token) * n_prompt);
    llama_tokenize(
        llama_get_model(ctx), promptStr, strlen(promptStr), tokens, n_prompt, true, true);

    // Generate
    struct llama_batch batch = llama_batch_init(n_prompt, 0, 1);
    for (int i = 0; i < n_prompt; i++) {
        llama_batch_add(&batch, tokens[i], i, {0}, false);
    }
    batch.logits[batch.n_tokens - 1] = true;

    llama_decode(ctx, batch);

    // Sample and generate
    std::string result;
    for (int i = 0; i < maxTokens; i++) {
        llama_token new_token_id = llama_sample_top_p_top_k(
            ctx, tokens, n_prompt, 1, 1, temperature);
        if (new_token_id == llama_token_eos()) break;
        char *buf = llama_token_to_piece(ctx, new_token_id);
        result += buf;
        llama_free_batch(batch);
        batch = llama_batch_init(1, 0, 1);
        llama_batch_add(&batch, new_token_id, 0, {0}, false);
        batch.logits[0] = true;
        llama_decode(ctx, batch);
    }

    free(tokens);
    llama_free_batch(batch);
    (*env)->ReleaseStringUTFChars(env, prompt, promptStr);

    return (*env)->NewStringUTF(env, result.c_str());
}

JNIEXPORT void JNICALL
Java_com_airoadio_desktop_plugins_llm_LlamaCppBridge_nativeFreeModel(
    JNIEnv *env, jobject thiz, jlong handle) {
    struct llama_context *ctx = (struct llama_context *)(intptr_t)handle;
    llama_free(ctx);
}
```

- [ ] **Step 3: Create LocalLlmPlugin.kt (Tauri plugin)**

```kotlin
package com.airoadio.desktop.plugins.llm

import android.app.Activity
import app.tauri.annotation.Command
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.Plugin
import app.tauri.plugin.JSObject

@TauriPlugin
class LocalLlmPlugin(private val activity: Activity): Plugin(activity) {
    private var bridge: LlamaCppBridge? = null
    private var modelHandle: Long = 0

    @Command
    fun loadModel(invoke: Invoke) {
        val modelPath = invoke.getString("modelPath", "")
        val ctxSize = invoke.getInt("ctxSize", 2048)

        if (modelPath.isEmpty()) {
            invoke.reject("modelPath is required")
            return
        }

        try {
            bridge = LlamaCppBridge()
            modelHandle = bridge!!.loadModel(modelPath, ctxSize)
            if (modelHandle == -1L) {
                invoke.reject("Failed to load model")
                return
            }
            val ret = JSObject()
            ret.put("handle", modelHandle)
            invoke.resolve(ret)
        } catch (e: Exception) {
            invoke.reject("Error loading model: ${e.message}")
        }
    }

    @Command
    fun generate(invoke: Invoke) {
        val prompt = invoke.getString("prompt", "")
        val maxTokens = invoke.getInt("maxTokens", 512)
        val temperature = invoke.getDouble("temperature", 0.8).toFloat()

        if (modelHandle == 0L) {
            invoke.reject("No model loaded")
            return
        }

        try {
            val result = bridge!!.generate(modelHandle, prompt, maxTokens, temperature)
            val ret = JSObject()
            ret.put("text", result)
            invoke.resolve(ret)
        } catch (e: Exception) {
            invoke.reject("Error generating: ${e.message}")
        }
    }

    @Command
    fun unloadModel(invoke: Invoke) {
        if (modelHandle != 0L) {
            bridge?.freeModel(modelHandle)
            modelHandle = 0
        }
        invoke.resolve()
    }
}
```

- [ ] **Step 4: Register Android plugin**

In the Android `MainActivity.kt`:

```kotlin
package com.airoadio.desktop

import android.os.Bundle
import app.tauri.bridgeactivity.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // Register the local LLM plugin
        registerPlugin(LocalLlmPlugin::class.java)
        super.onCreate(savedInstanceState)
    }
}
```

- [ ] **Step 5: Add CMakeLists.txt for native build**

Create `src-tauri/android/app/src/main/cpp/CMakeLists.txt`:

```cmake
cmake_minimum_required(VERSION 3.18)
project(llama-jni)

add_library(llama-jni SHARED llama-jni.c)
target_include_directories(llama-jni PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/../jniLibs/arm64-v8a/include
)
target_link_libraries(llama-jni
    llama
    ggml
    ggml-base
    ggml-cpu
)
```

- [ ] **Step 6: Commit**

```bash
git add src-tauri/android/
git commit -m "feat: add Android Tauri plugin for local llama.cpp inference"
```

---

## Task 7: Integrate Local Provider into Script Generation Flow

**Files:**

- Modify: `src/App.svelte` (update `tuneIn()` function)

**Interfaces:**

- Consumes: `invokeGenerateScript` with `local` provider (Task 4)
- Produces: Updated script generation flow that works with local LLM

- [ ] **Step 1: Update tuneIn() to handle local provider**

The `tuneIn()` function in `App.svelte` already calls `invokeGenerateScript()` which we updated in Task 4 to support the `local` provider. Verify the flow works end-to-end:

1. User selects "LOCAL" as API provider in settings
2. User picks/downloads a model
3. User starts the local LLM
4. User enters a topic and clicks "TUNE IN"
5. `tuneIn()` calls `invokeGenerateScript()` with `settings.apiProvider === 'local'`
6. `invokeGenerateScript()` calls `generate_script_local` Tauri command
7. Script is returned and fed to TTS

- [ ] **Step 2: Add loading state for local generation**

Add a state variable for local generation:

```typescript
let localGenerating = $state(false)
```

In `tuneIn()`, when provider is `local`, set `localGenerating = true` and show a different loading message:

```svelte
{#if localGenerating}
  <div class="loading">GENERATING LOCALLY...</div>
{/if}
```

- [ ] **Step 3: Add status indicator in the main UI**

Show the local LLM status in the terminal-style header:

```svelte
{#if settings.apiProvider === 'local'}
  <span class="local-status">
    LOCAL AI: {localStatus}
  </span>
{/if}
```

- [ ] **Step 4: Test full flow**

1. Run `bun run tauri dev`
2. Select LOCAL provider
3. Download Gemma 3 1B
4. Start local LLM
5. Enter a topic (e.g., "Künstliche Intelligenz im Alltag")
6. Click TUNE IN
7. Verify script is generated and audio plays

- [ ] **Step 5: Commit**

```bash
git add src/App.svelte
git commit -m "feat: integrate local AI provider into script generation flow"
```

---

## Task 8: README.md

**Files:**

- Create: `README.md`

**Interfaces:**

- Consumes: All previous tasks
- Produces: Comprehensive project README

- [ ] **Step 1: Create README.md**

````markdown
# AI Radio

A cross-platform desktop/mobile application that generates short, conversational radio-style audio content from topics or web links. Supports both cloud LLM APIs and **local on-device AI** via llama.cpp.

![Terminal UI](docs/screenshot.png)

## Features

- **Radio Script Generation**: Convert any topic into a 30-second to 4-minute radio script
- **Cloud LLM Support**: Kilo Gateway, OpenCode AI, Google Gemini
- **Local On-Device AI**: Run Gemma 3, Qwen3, or Llama 3.2 locally via llama.cpp
- **Text-to-Speech**: Edge TTS (Neural voices) with Web Speech API fallback
- **URL Scraping**: Paste a link and generate a radio segment from its content
- **Episode History**: Save, favorite, and replay past episodes
- **Device Sync**: Export/import settings and episodes via JSON
- **System Tray**: Minimize to tray on desktop

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) >= 1.3.0
- [Rust](https://www.rust-lang.org/tools/install) (for Tauri)
- [Tauri Prerequisites](https://v2.tauri.app/start/prerequisites/)

### Development

```bash
# Install dependencies
bun install

# Start Vite dev server (frontend only)
bun run dev

# Start Tauri development mode (full app with hot reload)
bun run tauri dev

# Type check
bun run typecheck

# Lint
bun run lint

# Format
bun run format

# Pre-build check (format + lint + typecheck)
bun run check
```
````

### Building

```bash
# Build frontend
bun run build

# Build Tauri app for release
bun run tauri build
```

## On-Device AI (Local LLM)

AI Radio supports running a local LLM for fully offline script generation. No API key required.

### How It Works

1. **Desktop (Windows)**: llama.cpp runs as a sidecar process exposing an OpenAI-compatible API at `localhost:8080`
2. **Android**: A Tauri plugin loads `libllama.so` via JNI and calls the llama.cpp C API directly

### Supported Models

| Model                    | Size    | RAM Required | Quality |
| ------------------------ | ------- | ------------ | ------- |
| **Gemma 3 1B** (default) | ~808 MB | ~2 GB        | Good    |
| Qwen3 1.7B               | ~1 GB   | ~2 GB        | Good    |
| Llama 3.2 3B             | ~2 GB   | ~4 GB        | Best    |

Models are in GGUF format (Q4_K_M quantization).

### Setup

1. Open Settings → Select **LOCAL** as API Provider
2. Download a model (e.g., Gemma 3 1B) or pick a `.gguf` file from storage
3. Click **START LOCAL AI**
4. Enter a topic and click **TUNE IN**

### Model Sources

Models are downloaded from HuggingFace on first use:

- [Gemma 3 1B GGUF](https://huggingface.co/unsloth/gemma-3-1b-it-GGUF)
- [Qwen3 1.7B GGUF](https://huggingface.co/unsloth/Qwen3-1.7B-GGUF)
- [Llama 3.2 3B GGUF](https://huggingface.co/unsloth/Llama-3.2-3B-Instruct-GGUF)

## Cloud LLM Setup (Optional)

The app works offline without any API key. To use cloud LLMs for higher quality:

### Option 1: Environment Variables

Create a `.env` file:

```env
VITE_KILO_API_KEY=your_kilo_key
VITE_OPENCODE_API_KEY=your_opencode_key
VITE_GEMINI_API_KEY=your_gemini_key
```

### Option 2: Settings UI

Enter API keys directly in the Settings panel.

## Environment Variables

| Variable                | Description                               | Required |
| ----------------------- | ----------------------------------------- | -------- |
| `VITE_KILO_API_KEY`     | Kilo Gateway API key                      | No       |
| `VITE_OPENCODE_API_KEY` | OpenCode AI API key                       | No       |
| `VITE_GEMINI_API_KEY`   | Google Gemini API key                     | No       |
| `VITE_EDGE_TTS_TOKEN`   | Edge TTS token (public fallback included) | No       |
| `VITE_DEFAULT_VOICE`    | Default TTS voice                         | No       |

## Technologies

| Technology                                                                      | Purpose                               |
| ------------------------------------------------------------------------------- | ------------------------------------- |
| [Svelte 5](https://svelte.dev/)                                                 | UI framework (runes syntax)           |
| [Tauri 2](https://v2.tauri.app/)                                                | Cross-platform desktop/mobile app     |
| [Rust](https://www.rust-lang.org/)                                              | Backend, system tray, LLM integration |
| [llama.cpp](https://github.com/ggml-org/llama.cpp)                              | On-device LLM inference               |
| [Edge TTS](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/) | Neural text-to-speech                 |
| [Dexie](https://dexie.org/)                                                     | IndexedDB wrapper for episode storage |

## Project Structure

```
ai-radio/
├── src/
│   ├── App.svelte                    # Main app component
│   ├── main.ts                       # Entry point
│   ├── components/
│   │   └── ModelManager.svelte       # Local AI model management UI
│   └── lib/
│       ├── db.ts                     # Dexie IndexedDB wrapper
│       ├── edge-tts-client.ts        # Edge TTS WebSocket client
│       ├── local-llm.ts              # Local LLM frontend API
│       └── settings.ts               # Settings management
├── src-tauri/
│   ├── binaries/                     # Prebuilt llama-server (desktop sidecar)
│   ├── src/
│   │   ├── lib.rs                    # Rust entry, command registration
│   │   ├── local_llm.rs              # Desktop local LLM provider
│   │   └── model_manager.rs          # Model download & cache management
│   ├── android/
│   │   └── app/src/main/
│   │       ├── java/.../plugins/llm/ # Android Tauri plugin (Kotlin + JNI)
│   │       ├── jniLibs/arm64-v8a/    # Prebuilt llama.cpp .so files
│   │       └── cpp/                  # JNI C bridge
│   ├── Cargo.toml
│   └── tauri.conf.json
├── package.json
└── vite.config.ts
```

## License

MIT

````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add comprehensive README with local AI setup guide"
````

---

## Task 9: Integration Testing & Polish

**Files:**

- Modify: Various (based on testing findings)

**Interfaces:**

- Consumes: All previous tasks
- Produces: Working end-to-end local AI flow on desktop

- [ ] **Step 1: Test desktop sidecar flow end-to-end**

1. Run `bun run tauri dev`
2. Verify sidecar binary is accessible
3. Download Gemma 3 1B model
4. Start local LLM
5. Generate a script on a topic
6. Verify TTS works with the generated script
7. Test "MEHR DAZU", "NEU", "AHNLICH" buttons with local provider

- [ ] **Step 2: Test model management**

1. Download multiple models
2. Switch between them
3. Delete a model
4. Pick a .gguf file from file system
5. Verify download progress indicator works

- [ ] **Step 3: Test error handling**

1. Start without model selected → should show error
2. Start with invalid model path → should show error
3. Kill sidecar externally → should handle gracefully
4. Test with no internet (after model is downloaded)

- [ ] **Step 4: Test cloud/local switching**

1. Switch from cloud to local → verify UI updates
2. Switch from local to cloud → verify sidecar stops
3. Test that settings persist across restarts

- [ ] **Step 5: Run typecheck and lint**

```bash
bun run typecheck
bun run lint
bun run check
```

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "fix: polish local AI integration and fix edge cases"
```

---

## Implementation Order

| Task | Description                             | Depends On |
| ---- | --------------------------------------- | ---------- |
| 1    | Prebuilt binaries & sidecar setup       | —          |
| 2    | Model manager (download, cache, select) | —          |
| 3    | Local LLM provider (desktop sidecar)    | 1, 2       |
| 4    | Frontend local LLM API                  | 2, 3       |
| 5    | Model manager UI component              | 4          |
| 6    | Android Tauri plugin (JNI bridge)       | —          |
| 7    | Integrate into script generation flow   | 4, 5       |
| 8    | README.md                               | —          |
| 9    | Integration testing & polish            | All        |

Tasks 1, 2, 6, and 8 can run in parallel. Task 3 depends on 1+2. Tasks 4-5 depend on 3. Task 7 depends on 4+5. Task 9 is final.

---

## Risk Mitigation

| Risk                                        | Impact | Mitigation                                                                          |
| ------------------------------------------- | ------ | ----------------------------------------------------------------------------------- |
| Sidecar binary too large for bundle         | High   | Download on first use instead of bundling; or use `include_bytes!` for small models |
| llama.cpp fails to compile for Android      | High   | Use prebuilt `.so` from `xentron-bit/llama-android-prebuilt`                        |
| Local model quality insufficient for German | Medium | Test with German prompts early; Gemma 3 1B handles German well                      |
| Sidecar port conflict                       | Low    | Use configurable port; check for existing process before spawning                   |
| Android JNI memory issues                   | Medium | Implement proper model lifecycle management; free memory on app background          |

---

## Future Enhancements (Out of Scope)

- Model quantization selection (Q2, Q4, Q8, FP16)
- Voice cloning with local TTS
- Streaming token display in UI
- Model fine-tuning for radio style
- iOS support (similar to Android but Swift)
- GPU acceleration monitoring (CUDA/Vulkan status)
