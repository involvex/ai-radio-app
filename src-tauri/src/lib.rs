use regex::Regex;
use serde::{Deserialize, Serialize};
use std::time::Duration;

mod local_llm;
mod model_manager;

#[cfg(desktop)]
mod desktop {
    use tauri::{
        menu::{Menu, MenuItem},
        tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
        Manager,
    };

    pub fn setup_tray(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
        let quit = MenuItem::with_id(app, "quit", "Beenden", true, None::<&str>)?;
        let show = MenuItem::with_id(app, "show", "Fenster anzeigen", true, None::<&str>)?;
        let hide = MenuItem::with_id(app, "hide", "Minimieren", true, None::<&str>)?;

        let menu = Menu::with_items(app, &[&show, &hide, &quit])?;

        let _tray = TrayIconBuilder::new()
            .icon(app.default_window_icon().unwrap().clone())
            .menu(&menu)
            .show_menu_on_left_click(false)
            .on_tray_icon_event(|tray, event| {
                if let TrayIconEvent::Click {
                    button: MouseButton::Left,
                    button_state: MouseButtonState::Up,
                    ..
                } = event
                {
                    let app = tray.app_handle();
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
            })
            .on_menu_event(|app, event| match event.id.as_ref() {
                "quit" => {
                    app.exit(0);
                }
                "show" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
                "hide" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.hide();
                    }
                }
                _ => {}
            })
            .build(app)?;

        Ok(())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    match run_inner() {
        Ok(()) => {},
        Err(e) => {
            eprintln!("FATAL: app initialization failed: {}", e);
            std::process::abort();
        }
    }
}

fn run_inner() -> Result<(), Box<dyn std::error::Error>> {
    #[allow(unused_mut)]
    let mut builder = tauri::Builder::default();

    #[cfg(desktop)]
    {
        builder = builder
            .plugin(tauri_plugin_shell::init())
            .plugin(tauri_plugin_dialog::init());
    }
        .manage(local_llm::LocalLlmState::default());

Ok(builder
  .invoke_handler(tauri::generate_handler![
    tts_http_fallback,
    generate_script,
    fetch_link_content,
    suggest_related_topic,
    test_sidecar,
    local_llm::start_local_llm,
    local_llm::stop_local_llm,
    local_llm::generate_script_local,
    model_manager::list_local_models,
    model_manager::download_model,
    model_manager::delete_model,
    model_manager::pick_model_file
  ])
  .setup(|_app| {
            #[cfg(desktop)]
            {
                desktop::setup_tray(_app)?;
            }

            Ok(())
        })
        .run(tauri::generate_context!())?)
}

#[tauri::command]
async fn tts_http_fallback(
    text: String,
    voice: String,
) -> Result<Vec<u8>, String> {
    let lang = if voice.starts_with("de-") {
        "de-DE"
    } else if voice.starts_with("en-") {
        "en-US"
    } else {
        "en-US"
    };

    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(30))
        .user_agent("Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36")
        .build()
        .map_err(|e| e.to_string())?;

    let mut full_audio = Vec::new();
    let chunk_size = 200usize;
    let chars: Vec<char> = text.chars().collect();

    for i in (0..chars.len()).step_by(chunk_size) {
        let end = std::cmp::min(i + chunk_size, chars.len());
        let chunk: String = chars[i..end].iter().cloned().collect();

        let params = [
            ("ie", "UTF-8"),
            ("client", "tw-ob"),
            ("tl", lang),
            ("q", &chunk),
        ];

        let response = client
            .get("https://translate.google.com/translate_tts")
            .query(&params)
            .send()
            .await
            .map_err(|e| format!("TTS request failed: {}", e))?;

        if !response.status().is_success() {
            return Err(format!(
                "TTS HTTP error: {} (chunk {}/{})",
                response.status(),
                (i / chunk_size) + 1,
                (chars.len() / chunk_size) + 1
            ));
        }

        let bytes = response
            .bytes()
            .await
            .map_err(|e| format!("Failed to read audio: {}", e))?
            .to_vec();

        full_audio.extend_from_slice(&bytes);
    }

    Ok(full_audio)
}

#[derive(Debug, Deserialize, Serialize)]
struct GenerateScriptRequest {
  topic: String,
  provider: String,
  api_key: String,
  link_content: Option<String>,
  quality: Option<String>,
  style: Option<String>,
  mode: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
struct ChatMessage {
  role: String,
  content: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct LlmRequest {
  model: String,
  messages: Vec<ChatMessage>,
  max_tokens: u32,
  temperature: f32,
}

fn build_system_prompt(quality: &str, style: &str) -> String {
  let duration_hint = match quality {
    "short" => "maximal 30 Sekunden Sprechzeit",
    "long" => "maximal 3 Minuten Sprechzeit",
    "chill" => "entspannt und ausführlich, bis zu 4 Minuten Sprechzeit",
    _ => "maximal 90 Sekunden Sprechzeit",
  };

  let style_intro = match style {
    "casual" => "Du sprichst wie mit einem guten Freund. Locker, umgangssprachlich, mit Humor und Alltagsbeispielen. Du darfst 'du'zen, Abkürzungen nutzen und kleine Anekdoten einwerfen.",
    "academic" => "Du bist ein erfahrener Dozent und Erklärer. Strukturiert, faktenbasiert, mit klaren Zusammenhängen und Hintergründen. Verwende präzise Fachbegriffe und erkläre sie.",
    "entertaining" => "Du bist ein unterhaltsamer Erzähler und Entertainer. Nutze Humor, überraschende Fakten, Storytelling und rhetorische Fragen. Mach das Thema zum Erlebnis.",
    "news" => "Du bist ein erfahrener Nachrichtensprecher. Sachlich, prägnant, informativ. Im Stil einer guten Nachrichtensendung mit klaren Fakten und Einordnungen.",
    "podcast" => "Du bist ein erfahrener Podcast-Host. Persönlich, nahbar, mit eigenen Anekdoten und direkten Fragen an die Hörer. Wie ein Gespräch mit einem klugen Freund.",
    _ => "Du bist ein erfahrener Radio-Moderator für ein Tech- und Infotainment-Radio. Nutze technisches Verständnis, erkläre komplexe Themen verständlich, mit Beispielen aus der digitalen Welt.",
  };

  format!(
    "{} Du verwandelst den bereitgestellten Text in einen kurzen, extrem leicht verständlichen Radio-Beitrag ({}).\n- Nutze kurze Sätze. Keine Schachtelsätze.\n- Verwende rhetorische Fragen und lockere Überleitungen (\"Übrigens...\", \"Schon gewusst?\").\n- Antworte ausschließlich mit dem reinen Sprechtext. Keine Markdown-Formatierung.",
    style_intro, duration_hint
  )
}

#[tauri::command]
async fn generate_script(req: GenerateScriptRequest) -> Result<String, String> {
  eprintln!("[generate_script] START provider={} api_key_len={} quality={:?} style={:?} mode={:?}", req.provider, req.api_key.len(), req.quality, req.style, req.mode);

  if req.api_key.is_empty() {
    return Err("No API key configured".to_string());
  }
  if req.provider == "none" {
    return Err("No provider selected".to_string());
  }

  let quality = req.quality.as_deref().unwrap_or("normal");
  let style = req.style.as_deref().unwrap_or("tech");
  let system_prompt = build_system_prompt(quality, style);

  let (max_tokens, temp) = match quality {
    "short" => (200, 0.9),
    "long" => (800, 0.7),
    "chill" => (1000, 0.6),
    _ => (500, 0.8),
  };

  let mode = req.mode.as_deref().unwrap_or("normal");
  let mut user_prompt = match mode {
    "deeper" => format!(
      "Gehe vertieft auf das Thema ein. Erzähle mehr Hintergründe, Details, Zusammenhänge und interessante Fakten.\n\nVerwandle das in ein Radioskript:\n\n{}",
      req.topic
    ),
    _ => format!("Verwandle das in ein Radioskript:\n\n{}", req.topic),
  };

  if let Some(ref lc) = req.link_content {
    user_prompt.push_str("\n\nQuelltext (URL-Inhalt):\n");
    user_prompt.push_str(lc);
  }

  let client = reqwest::Client::builder()
    .timeout(Duration::from_secs(60))
    .user_agent("AI-Radio/1.0")
    .build()
    .map_err(|e| format!("HTTP client error: {}", e))?;

  if req.provider == "gemini" {
    let endpoint = format!(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key={}",
      req.api_key
    );
    let body = serde_json::json!({
      "contents": [
        {"parts": [{"text": format!("{}\n\n{}", system_prompt, user_prompt)}]}
      ],
      "generationConfig": {"maxOutputTokens": 500, "temperature": 0.8}
    });
    let response = client
      .post(endpoint)
      .json(&body)
      .send()
      .await
      .map_err(|e| format!("Gemini request failed: {}", e))?;
    if !response.status().is_success() {
      let status = response.status();
      let body = response.text().await.unwrap_or_default();
      eprintln!("[generate_script] Gemini API error: status={} body={}", status, body);
      return Err(format!("Gemini API error: {} - {}", status, body));
    }
    let data: serde_json::Value =
      response.json().await.map_err(|e| format!("Gemini parse error: {}", e))?;
    let text =
      data["candidates"][0]["content"]["parts"][0]["text"]
        .as_str()
        .map(|s| s.to_string());
    return text.ok_or("Gemini response missing text".to_string());
  }

let (endpoint, model) = if req.provider == "kilo" {
    (
      "https://api.kilo.ai/api/gateway/chat/completions".to_string(),
      "kilo-auto/free".to_string(),
    )
  } else {
    (
      "https://opencode.ai/zen/v1/chat/completions".to_string(),
      "mimo-v2.5-free".to_string(),
    )
  };

  let body = LlmRequest {
    model,
    messages: vec![
      ChatMessage {
        role: "system".into(),
        content: system_prompt,
      },
      ChatMessage {
        role: "user".into(),
        content: user_prompt,
      },
    ],
    max_tokens,
    temperature: temp,
  };

  let response = client
    .post(&endpoint)
    .header("Content-Type", "application/json")
    .header("Authorization", format!("Bearer {}", req.api_key))
    .json(&body)
    .send()
    .await
    .map_err(|e| format!("LLM request failed: {}", e))?;

  eprintln!("[generate_script] provider={} endpoint={} status={} api_key_len={}",
    req.provider, endpoint, response.status(), req.api_key.len());

  if !response.status().is_success() {
    let status = response.status();
    let body = response.text().await.unwrap_or_default();
    eprintln!("[generate_script] LLM API error: status={} body={}", status, body);
    return Err(format!("LLM API error: {} - {}", status, body));
  }

  let data: serde_json::Value =
    response.json().await.map_err(|e| format!("LLM parse error: {}", e))?;
  let content = data["choices"][0]["message"]["content"]
    .as_str()
    .map(|s| s.trim().to_string());
  content.ok_or("LLM response missing content".to_string())
}

#[tauri::command]
async fn fetch_link_content(url: String) -> Result<String, String> {
  let target = if url.starts_with("http://") || url.starts_with("https://") {
    url
  } else {
    format!("https://{}", url)
  };

  let client = reqwest::Client::builder()
    .timeout(Duration::from_secs(30))
    .user_agent("Mozilla/5.0 (compatible; AI-Radio/1.0)")
    .build()
    .map_err(|e| format!("HTTP client error: {}", e))?;

  let response = client
    .get(&target)
    .send()
    .await
    .map_err(|e| format!("URL request failed: {}", e))?;

  if !response.status().is_success() {
    return Err(format!(
      "URL konnte nicht geladen werden (HTTP {})",
      response.status()
    ));
  }

  let html = response
    .text()
    .await
    .map_err(|e| format!("Failed to read response: {}", e))?;

  let title_re = Regex::new(r"(?i)<title[^>]*>([^<]+)</title>")
    .map_err(|e| format!("Regex error: {}", e))?;
  let title = title_re
    .captures(&html)
    .and_then(|c| c.get(1))
    .map(|m| m.as_str().trim())
    .unwrap_or("");

  let mut text = html
    .replace("<script", " <script")
    .replace("</script>", "</script> ");

  let script_re = Regex::new(r"(?is)<script[^>]*>.*?</script>")
    .map_err(|e| format!("Regex error: {}", e))?;
  text = script_re.replace_all(&text, " ").to_string();

  let style_re = Regex::new(r"(?is)<style[^>]*>.*?</style>")
    .map_err(|e| format!("Regex error: {}", e))?;
  text = style_re.replace_all(&text, " ").to_string();

  let tag_re = Regex::new(r"<[^>]+>")
    .map_err(|e| format!("Regex error: {}", e))?;
  text = tag_re.replace_all(&text, " ").to_string();

  text = text
    .replace("&amp;", "&")
    .replace("&lt;", "<")
    .replace("&gt;", ">")
    .replace("&nbsp;", " ")
    .replace("&#160;", " ");

  let ws_re = Regex::new(r"\s+").map_err(|e| format!("Regex error: {}", e))?;
  text = ws_re.replace_all(&text, " ").trim().to_string();

  text = text.chars().take(8000).collect::<String>();

  if !title.is_empty() {
    Ok(format!("Titel: {}\n\n{}", title, text))
  } else {
    Ok(text)
  }
}

#[tauri::command]
async fn test_sidecar(app: tauri::AppHandle) -> Result<String, String> {
    use tauri_plugin_shell::ShellExt;
    let sidecar_command = app.shell().sidecar("binaries/llama-server").map_err(|e| e.to_string())?;
    let (mut _rx, _child) = sidecar_command.args(["--version"]).spawn().map_err(|e| e.to_string())?;
    Ok("Sidecar spawned successfully".to_string())
}

#[tauri::command]
async fn suggest_related_topic(
    topic: String,
    provider: String,
    api_key: String,
) -> Result<String, String> {
  if api_key.is_empty() || provider == "none" {
    return Err("No API key configured".to_string());
  }

  let client = reqwest::Client::builder()
    .timeout(Duration::from_secs(30))
    .user_agent("AI-Radio/1.0")
    .build()
    .map_err(|e| format!("HTTP client error: {}", e))?;

  let system_prompt = "Du bist ein Radio-Editor. Nenne genau 3 verwandte, interessante Themen zum gegebenen Thema. Antworte NUR mit den 3 Themen, je eine pro Zeile, ohne Nummerierung oder Aufzählungszeichen.";
  let user_prompt = format!("Welche 3 verwandten Themen passen zu: {}?", topic);

  let response_text = if provider == "gemini" {
    let endpoint = format!(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key={}",
      api_key
    );
    let body = serde_json::json!({
      "contents": [
        {"parts": [{"text": format!("{}\n\n{}", system_prompt, user_prompt)}]}
      ],
      "generationConfig": {"maxOutputTokens": 200, "temperature": 0.9}
    });
    let response = client
      .post(&endpoint)
      .json(&body)
      .send()
      .await
      .map_err(|e| format!("Gemini request failed: {}", e))?;
    if !response.status().is_success() {
      return Err(format!("Gemini API error: {}", response.status()));
    }
    let data: serde_json::Value =
      response.json().await.map_err(|e| format!("Gemini parse error: {}", e))?;
    data["candidates"][0]["content"]["parts"][0]["text"]
      .as_str()
      .map(|s| s.to_string())
      .unwrap_or_default()
  } else {
    let (endpoint, model) = if provider == "kilo" {
      (
        "https://api.kilo.ai/api/gateway/chat/completions".to_string(),
        "kilo-auto/free".to_string(),
      )
    } else {
      (
        "https://opencode.ai/zen/v1/chat/completions".to_string(),
        "mimo-v2.5-free".to_string(),
      )
    };

    let body = serde_json::json!({
      "model": model,
      "messages": [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
      ],
      "max_tokens": 200,
      "temperature": 0.9
    });

    let response = client
      .post(&endpoint)
      .header("Content-Type", "application/json")
      .header("Authorization", format!("Bearer {}", api_key))
      .json(&body)
      .send()
      .await
      .map_err(|e| format!("LLM request failed: {}", e))?;

    if !response.status().is_success() {
      return Err(format!("LLM API error: {}", response.status()));
    }

    let data: serde_json::Value =
      response.json().await.map_err(|e| format!("LLM parse error: {}", e))?;
    data["choices"][0]["message"]["content"]
      .as_str()
      .map(|s| s.to_string())
      .unwrap_or_default()
  };

  let lines: Vec<&str> = response_text.lines().filter(|l| !l.trim().is_empty()).collect();
  if lines.is_empty() {
    return Err("No related topics generated".to_string());
  }

  let idx = (rand::random::<f32>() * lines.len() as f32).floor() as usize;
  Ok(lines[idx % lines.len()].trim().to_string())
}
