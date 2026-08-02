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
  onLocalLLMError,
  AVAILABLE_MODELS,
  type LocalModel,
  type DownloadProgress,
} from '../lib/local-llm'
import {loadSettings, saveSettings} from '../lib/settings'

let installedModels: LocalModel[] = $state([])
let activeModelPath: string = $state('')
let llmStatus: 'NOT RUNNING' | 'STARTING...' | 'READY' | 'ERROR' = $state('NOT RUNNING')
let errorMessage = $state('')
let downloading: Record<string, {progress: number; total: number}> = $state({})

const modelEntries = Object.entries(AVAILABLE_MODELS)

function formatSize(bytes: number): string {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(0)} MB`
  return `${(bytes / 1_000).toFixed(0)} KB`
}

async function refreshModels() {
  try {
    installedModels = await listLocalModels()
    const settings = loadSettings()
    activeModelPath = settings.localModelPath || ''
  } catch (e) {
    console.error('Failed to list models:', e)
  }
}

async function handleDownload(url: string, filename: string) {
  downloading = {...downloading, [filename]: {progress: 0, total: 0}}
  try {
    await downloadModel(url, filename)
    await refreshModels()
  } catch (e) {
    console.error('Download failed:', e)
  } finally {
    const d = {...downloading}
    delete d[filename]
    downloading = d
  }
}

async function handleDelete(filename: string) {
  try {
    await deleteModel(filename)
    if (activeModelPath && activeModelPath.includes(filename)) {
      activeModelPath = ''
      const settings = loadSettings()
      settings.localModelPath = ''
      saveSettings(settings)
    }
    await refreshModels()
  } catch (e) {
    console.error('Delete failed:', e)
  }
}

function selectModel(path: string) {
  activeModelPath = path
  const settings = loadSettings()
  settings.localModelPath = path
  saveSettings(settings)
}

async function handlePickFile() {
  try {
    const picked = await pickModelFile()
    if (picked) {
      selectModel(picked)
      await refreshModels()
    }
  } catch (e) {
    console.error('File pick failed:', e)
  }
}

async function handleStart() {
  if (!activeModelPath) return
  llmStatus = 'STARTING...'
  errorMessage = ''
  try {
    await startLocalLLM(activeModelPath)
  } catch (e) {
    llmStatus = 'ERROR'
    errorMessage = e instanceof Error ? e.message : String(e)
  }
}

async function handleStop() {
  try {
    await stopLocalLLM()
    llmStatus = 'NOT RUNNING'
    errorMessage = ''
  } catch (e) {
    console.error('Stop failed:', e)
  }
}

$effect(() => {
  const unlistenProgress = onDownloadProgress((progress: DownloadProgress) => {
    downloading = {
      ...downloading,
      [progress.filename]: {progress: progress.downloaded, total: progress.total},
    }
  })

  const unlistenReady = onLocalLLMReady(() => {
    llmStatus = 'READY'
    errorMessage = ''
  })

  const unlistenError = onLocalLLMError((error: string) => {
    llmStatus = 'ERROR'
    errorMessage = error
  })

  refreshModels()

  return () => {
    unlistenProgress.then((fn) => fn())
    unlistenReady.then((fn) => fn())
    unlistenError.then((fn) => fn())
  }
})

function isModelInstalled(filename: string): boolean {
  return installedModels.some((m) => m.filename === filename)
}
</script>

<div class="model-manager">
  <h3>═══ LOCAL LLM ═══</h3>

  <div class="status-bar">
    <span class="status-label">STATUS:</span>
    <span
      class="status-value"
      class:ready={llmStatus === 'READY'}
      class:error={llmStatus === 'ERROR'}
      class:starting={llmStatus === 'STARTING...'}
    >
      {llmStatus}
    </span>
    {#if errorMessage}
      <span class="error-text">{errorMessage}</span>
    {/if}
  </div>

  <div class="controls-row">
    <button
      class="btn-ctrl"
      disabled={llmStatus === 'STARTING...' || !activeModelPath}
      onclick={handleStart}
    >
      [ ▶ START ]
    </button>
    <button class="btn-ctrl" disabled={llmStatus === 'NOT RUNNING'} onclick={handleStop}>
      [ ⏹ STOP ]
    </button>
  </div>

  <div class="section">
    <h4>> DOWNLOAD MODELS</h4>
    {#each modelEntries as [key, model]}
      <div class="model-row">
        <div class="model-info">
          <span class="model-name">{model.name}</span>
          <span class="model-meta">{formatSize(model.sizeBytes)} — {model.description}</span>
          {#if downloading[model.filename]}
            <div class="progress-bar">
              <div
                class="progress-fill"
                style="width: {downloading[model.filename].total
                  ? (downloading[model.filename].progress / downloading[model.filename].total) *
                    100
                  : 0}%"
              ></div>
            </div>
          {/if}
        </div>
        <button
          class="btn-sm"
          disabled={isModelInstalled(model.filename) || !!downloading[model.filename]}
          onclick={() => handleDownload(model.url, model.filename)}
        >
          {isModelInstalled(model.filename)
            ? '[ INSTALLED ]'
            : downloading[model.filename]
              ? '[ DOWNLOADING... ]'
              : '[ DOWNLOAD ]'}
        </button>
      </div>
    {/each}
  </div>

  <div class="section">
    <h4>> INSTALLED MODELS</h4>
    {#if installedModels.length === 0}
      <p class="empty">No models installed.</p>
    {:else}
      {#each installedModels as model}
        <div class="model-row">
          <label class="model-radio">
            <input
              type="radio"
              name="active-model"
              checked={activeModelPath === model.path}
              onchange={() => selectModel(model.path)}
            />
            <div class="model-info">
              <span class="model-name">{model.filename}</span>
              <span class="model-meta">{formatSize(model.size_bytes)}</span>
            </div>
          </label>
          <button class="btn-sm btn-delete" onclick={() => handleDelete(model.filename)}>
            [ 🗑 ]
          </button>
        </div>
      {/each}
    {/if}
  </div>

  <div class="section">
    <button class="btn-ctrl btn-pick" onclick={handlePickFile}>
      [ 📁 PICK .GGUF FILE ]
    </button>
    <button class="btn-ctrl btn-refresh" onclick={refreshModels}>
      [ 🔄 REFRESH ]
    </button>
  </div>
</div>

<style>
  .model-manager {
    padding: 1rem;
    background: #111111;
    border: 1px solid #003311;
    margin-top: 0.5rem;
  }

  .model-manager h3 {
    font-size: 0.875rem;
    color: #00ff41;
    margin-bottom: 1rem;
    text-shadow: 0 0 5px #00ff41;
  }

  .status-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 0.5rem;
    background: #0a0a0a;
    border: 1px solid #003311;
  }

  .status-label {
    color: #00aa2a;
    font-size: 0.75rem;
  }

  .status-value {
    color: #005511;
    font-size: 0.75rem;
    font-weight: bold;
  }

  .status-value.ready {
    color: #00ff41;
    text-shadow: 0 0 5px #00ff41;
  }

  .status-value.error {
    color: #ff3333;
  }

  .status-value.starting {
    color: #ffaa00;
    animation: blink 1s infinite;
  }

  .error-text {
    color: #ff3333;
    font-size: 0.7rem;
    margin-left: auto;
    max-width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @keyframes blink {
    50% {
      opacity: 0.5;
    }
  }

  .controls-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .btn-ctrl {
    background: #003311;
    border: 1px solid #00ff41;
    color: #00ff41;
    padding: 0.5rem 1rem;
    font-family: inherit;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-ctrl:hover:not(:disabled) {
    background: #00ff41;
    color: #0a0a0a;
    box-shadow: 0 0 10px rgba(0, 255, 65, 0.4);
  }

  .btn-ctrl:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .section {
    margin-bottom: 1rem;
  }

  .section h4 {
    font-size: 0.75rem;
    color: #00aa2a;
    margin-bottom: 0.5rem;
  }

  .model-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    border: 1px dashed #003311;
    margin-bottom: 0.25rem;
    background: #0a0a0a;
  }

  .model-radio {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    flex: 1;
  }

  .model-radio input {
    accent-color: #00ff41;
  }

  .model-info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    flex: 1;
    min-width: 0;
  }

  .model-name {
    font-size: 0.8rem;
    color: #00ff41;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .model-meta {
    font-size: 0.65rem;
    color: #005511;
  }

  .progress-bar {
    width: 100%;
    height: 3px;
    background: #003311;
    margin-top: 0.25rem;
  }

  .progress-fill {
    height: 100%;
    background: #00ff41;
    transition: width 0.3s;
  }

  .btn-sm {
    background: none;
    border: 1px solid #003311;
    color: #00aa2a;
    padding: 0.25rem 0.5rem;
    font-family: inherit;
    font-size: 0.7rem;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .btn-sm:hover:not(:disabled) {
    border-color: #00ff41;
    color: #00ff41;
  }

  .btn-sm:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-delete:hover {
    border-color: #ff3333;
    color: #ff3333;
  }

  .empty {
    color: #005511;
    font-size: 0.75rem;
    padding: 0.5rem;
    text-align: center;
  }

  .btn-pick,
  .btn-refresh {
    margin-right: 0.5rem;
  }
</style>
