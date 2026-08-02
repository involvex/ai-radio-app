## Task 3: Local LLM Provider (Desktop Sidecar)

**Files:**

- Create: `src-tauri/src/local_llm.rs`
- Modify: `src-tauri/src/lib.rs` (register commands and state)

**Interfaces:**

- Consumes: Sidecar binary (Task 1), model path (Task 2)
- Produces: `generate_script_local` command (replaces stub), `start_local_llm`, `stop_local_llm` commands

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

    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(120))
        .build()
        .map_err(|e| e.to_string())?;

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

Add `mod local_llm;` at the top of lib.rs.

Add to the builder in the run() function (inside the builder chain):

```rust
.manage(local_llm::LocalLlmState::default())
```

Replace the existing `generate_script_local` stub command with the new one from local_llm.rs.

Add new commands to invoke_handler:

```rust
local_llm::start_local_llm
local_llm::stop_local_llm
local_llm::generate_script_local
```

Remove the old stub `generate_script_local` function from lib.rs.

- [ ] **Step 3: Test compilation**

Run `cargo check` in src-tauri/ to verify everything compiles.

- [ ] **Step 4: Commit**

```bash
git add src-tauri/src/local_llm.rs src-tauri/src/lib.rs
git commit -m "feat: add local LLM provider with llama.cpp sidecar integration"
```
