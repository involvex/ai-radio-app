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
