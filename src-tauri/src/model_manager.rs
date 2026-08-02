use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::{AppHandle, Emitter, Manager};

#[derive(Debug, Serialize, Deserialize)]
pub struct LocalModel {
    pub name: String,
    pub filename: String,
    pub path: String,
    pub size_bytes: u64,
    pub downloaded: bool,
}

fn models_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    Ok(data_dir.join("models"))
}

#[tauri::command]
pub async fn list_local_models(app: AppHandle) -> Result<Vec<LocalModel>, String> {
    let dir = models_dir(&app)?;
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
                name: filename.strip_suffix(".gguf").unwrap_or(&filename).to_string(),
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
    let dir = models_dir(&app)?;
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let dest = dir.join(&filename);

    // Path traversal guard - check resolved path is within models dir
    let resolved = dest.to_string_lossy().to_string();
    let models_root = dir.to_string_lossy().to_string();
    if !resolved.starts_with(&models_root) {
        return Err("Invalid filename".to_string());
    }

    if dest.exists() {
        return Ok(dest.to_string_lossy().to_string());
    }

    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(300))
        .build()
        .map_err(|e| e.to_string())?;
    let response = client.get(&url).send().await.map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        return Err(format!("Download failed: HTTP {}", response.status()));
    }

    let total_size = response.content_length().unwrap_or(0);

    let mut file = std::fs::File::create(&dest).map_err(|e| e.to_string())?;
    let mut downloaded: u64 = 0;
    let mut stream = response.bytes_stream();

    use futures_util::StreamExt;
    use std::io::Write;

    let download_result = async {
        while let Some(chunk) = stream.next().await {
            let chunk = chunk.map_err(|e| e.to_string())?;
            file.write_all(&chunk).map_err(|e| e.to_string())?;
            downloaded += chunk.len() as u64;
            app.emit("model-download-progress", serde_json::json!({
                "filename": filename,
                "downloaded": downloaded,
                "total": total_size,
            })).ok();
        }
        Ok::<(), String>(())
    }
    .await;

    if let Err(e) = download_result {
        let _ = std::fs::remove_file(&dest);
        return Err(e);
    }

    Ok(dest.to_string_lossy().to_string())
}

#[tauri::command]
pub async fn delete_model(app: AppHandle, filename: String) -> Result<(), String> {
    let dir = models_dir(&app)?;
    let path = dir.join(&filename);

    // Path traversal guard - check resolved path is within models dir
    let resolved = path.to_string_lossy().to_string();
    let models_root = dir.to_string_lossy().to_string();
    if !resolved.starts_with(&models_root) {
        return Err("Invalid filename".to_string());
    }

    if path.exists() {
        std::fs::remove_file(&path).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn pick_model_file(app: AppHandle) -> Result<Option<String>, String> {
    tokio::task::spawn_blocking(move || {
        use tauri_plugin_dialog::DialogExt;
        let file = app.dialog().file()
            .add_filter("GGUF Model", &["gguf"])
            .blocking_pick_file();
        match file {
            Some(path) => Ok(Some(path.to_string())),
            None => Ok(None),
        }
    })
    .await
    .map_err(|e| e.to_string())?
}
