use regex::Regex;
use serde::{Deserialize, Serialize};
use std::time::Duration;

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

#[allow(unused_must_use)]
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() -> Result<(), Box<dyn std::error::Error>> {
    #[allow(unused_mut)]
    let mut builder = tauri::Builder::default();

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_shell::init());
    }

Ok(builder
  .invoke_handler(tauri::generate_handler![
    tts_http_fallback,
    generate_script,
    generate_script_local,
    fetch_link_content
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

#[tauri::command]
async fn generate_script(req: GenerateScriptRequest) -> Result<String, String> {
  eprintln!("[generate_script] START provider={} api_key_len={} quality={:?}", req.provider, req.api_key.len(), req.quality);

  if req.api_key.is_empty() {
    return Err("No API key configured".to_string());
  }
  if req.provider == "none" {
    return Err("No provider selected".to_string());
  }

  let quality = req.quality.as_deref().unwrap_or("normal");
  let (max_tokens, temp, duration_hint) = match quality {
    "short" => (200, 0.9, "maximal 30 Sekunden Sprechzeit"),
    "long" => (800, 0.7, "maximal 3 Minuten Sprechzeit"),
    "chill" => (1000, 0.6, "entspannt und ausführlich, bis zu 4 Minuten Sprechzeit"),
    _ => (500, 0.8, "maximal 90 Sekunden Sprechzeit"),
  };

  let system_prompt = format!(
    "Du bist ein erfahrener Radio-Moderator für ein Tech- und Infotainment-Radio. Deine Aufgabe ist es, den bereitgestellten Text in einen kurzen, extrem leicht verständlichen Radio-Beitrag ({}) umzuwandeln.\n- Nutze kurze Sätze. Keine Schachtelsätze.\n- Verwende rhetorische Fragen und lockere Überleitungen (\"Übrigens...\", \"Schon gewusst?\").\n- Antworte ausschließlich mit dem reinen Sprechtext. Keine Markdown-Formatierung.",
    duration_hint
  );

  let mut user_prompt =
    format!("Verwandle das in ein Radioskript:\n\n{}", req.topic);

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
async fn generate_script_local(
    _model_path: String,
    topic: String,
) -> Result<String, String> {
  eprintln!("[generate_script_local] called with topic={}", topic);
  // On-device LLM not yet implemented - use API mode
  Err("On-device LLM not yet implemented. Please use API mode with a valid API key.".to_string())
}
