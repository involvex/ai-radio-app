## Task 2: Model Manager (Download, Cache, Select)

**Files:**

- Create: `src-tauri/src/model_manager.rs`
- Modify: `src-tauri/src/lib.rs` (register commands)
- Modify: `src-tauri/Cargo.toml` (add `dirs`, `futures-util` crates)

**Interfaces:**

- Consumes: Tauri app handle, filesystem APIs
- Produces: `download_model()`, `list_local_models()`, `get_model_path()`, `delete_model()`, `pick_model_file()` commands

- [ ] **Step 1: Add dependencies to Cargo.toml**

Add to `[dependencies]`:

```toml
dirs = "5.0"
futures-util = "0.3"
```

- [ ] **Step 2: Create model_manager.rs**

```rust
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::AppHandle;

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

    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(300))
        .build()
        .map_err(|e| e.to_string())?;
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

Add `mod model_manager;` at the top of lib.rs.

Add to the `invoke_handler` in lib.rs:

```rust
model_manager::list_local_models
model_manager::download_model
model_manager::delete_model
model_manager::pick_model_file
```

- [ ] **Step 4: Add tauri-plugin-dialog dependency**

Add to Cargo.toml:

```toml
tauri-plugin-dialog = "2"
```

Register the plugin in lib.rs setup:

```rust
builder = builder.plugin(tauri_plugin_dialog::init());
```

- [ ] **Step 5: Test model listing**

Invoke `list_local_models` from the frontend and verify it returns an empty array (no models yet).

- [ ] **Step 6: Commit**

```bash
git add src-tauri/src/model_manager.rs src-tauri/src/lib.rs src-tauri/Cargo.toml
git commit -m "feat: add model manager for GGUF download, cache, and file picker"
```
