<script lang="ts">
import {
  checkWebGPUAvailability,
  loadModelFromCacheOrUrl,
  loadModelFromCustomUrl,
  loadModelFromFile,
  unloadModel,
  isModelReady,
  isModelCached,
  deleteModelCache,
  getModelStorageUsage,
  AVAILABLE_MODELS,
  type ModelKey,
} from '../lib/litert-lm'
import {
  formatBytes,
  formatSpeed,
  formatEta,
  type DownloadProgress,
} from '../lib/model-downloader'
import {loadSettings, saveSettings} from '../lib/settings'

let webgpuSupported = $state(false)
let webgpuReason = $state('')
let llmStatus: 'CHECKING...' | 'NOT RUNNING' | 'LOADING...' | 'READY' | 'ERROR' = $state('CHECKING...')
let loadStage = $state('')
let errorMessage = $state('')
let selectedModelKey: ModelKey = $state('gemma3-1b-int4')
let downloadDetail = $state<DownloadProgress | null>(null)
let cachedMap = $state<Record<string, boolean>>({})
let storageUsage = $state({usage: 0, quota: 0})
let currentKey = $state('')
let aborter: AbortController | null = null
let fileInput: HTMLInputElement | null = $state(null)
let customUrl = $state('')

const modelEntries = Object.entries(AVAILABLE_MODELS)

async function refreshCacheState() {
  const next: Record<string, boolean> = {}
  for (const [key] of modelEntries) {
    try {
      next[key] = await isModelCached(key)
    } catch {
      next[key] = false
    }
  }
  cachedMap = next
  try {
    storageUsage = await getModelStorageUsage()
  } catch {
    // ignore
  }
  currentKey = isModelReady()
    ? (await import('../lib/litert-lm')).getCurrentModelKey()
    : currentKey
}

async function checkWebGPU() {
  llmStatus = 'CHECKING...'
  const result = await checkWebGPUAvailability()
  webgpuSupported = result.supported
  webgpuReason = result.reason || ''
  if (!result.supported) {
    llmStatus = 'ERROR'
    errorMessage = result.reason || 'WebGPU nicht verfügbar'
  } else {
    llmStatus = isModelReady() ? 'READY' : 'NOT RUNNING'
  }
  await refreshCacheState()
}

async function handleDownload(modelKey: ModelKey) {
  aborter?.abort()
  aborter = new AbortController()
  llmStatus = 'LOADING...'
  loadStage = 'Download wird vorbereitet…'
  downloadDetail = null
  errorMessage = ''

  try {
    const settings = loadSettings()
    await loadModelFromCacheOrUrl(modelKey, {
      quality: settings.quality,
      signal: aborter.signal,
      onStage: stage => {
        loadStage =
          stage === 'wasm'
            ? 'WASM-Runtime wird geladen…'
            : stage === 'download'
              ? 'Modell wird heruntergeladen…'
              : stage === 'init'
                ? 'Modell wird in GPU geladen…'
                : 'Bereit'
      },
      onDownloadProgress: p => {
        downloadDetail = p
      },
    })
    llmStatus = 'READY'
    loadStage = ''
    const updated = loadSettings()
    updated.localModelKey = modelKey
    saveSettings(updated)
    await refreshCacheState()
    currentKey = modelKey
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      llmStatus = 'NOT RUNNING'
      errorMessage = 'Download abgebrochen'
    } else {
      llmStatus = 'ERROR'
      errorMessage = e instanceof Error ? e.message : String(e)
    }
  } finally {
    aborter = null
  }
}

function handleCancel() {
  aborter?.abort()
}

async function handlePickFile() {
  if (!fileInput) return
  fileInput.click()
}

async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  llmStatus = 'LOADING...'
  loadStage = 'Datei wird geladen…'
  downloadDetail = null
  errorMessage = ''

  try {
    await loadModelFromFile(file, () => {})
    llmStatus = 'READY'
    loadStage = ''
    currentKey = `file:${file.name}`
    await refreshCacheState()
  } catch (e) {
    llmStatus = 'ERROR'
    errorMessage = e instanceof Error ? e.message : String(e)
  } finally {
    if (fileInput) fileInput.value = ''
  }
}

async function handleImportUrl() {
  const url = customUrl.trim()
  if (!url) {
    errorMessage = 'Bitte eine https URL zu einer .task Datei einfügen.'
    return
  }
  aborter?.abort()
  aborter = new AbortController()
  llmStatus = 'LOADING...'
  loadStage = 'URL-Modell wird heruntergeladen…'
  downloadDetail = null
  errorMessage = ''

  try {
    const settings = loadSettings()
    const cacheKey = await loadModelFromCustomUrl(url, {
      quality: settings.quality,
      signal: aborter.signal,
      onStage: (stage: 'wasm' | 'download' | 'init' | 'ready') => {
        loadStage =
          stage === 'wasm'
            ? 'WASM-Runtime wird geladen…'
            : stage === 'download'
              ? 'Modell wird heruntergeladen…'
              : stage === 'init'
                ? 'Modell wird in GPU geladen…'
                : 'Bereit'
      },
      onDownloadProgress: (p: DownloadProgress) => {
        downloadDetail = p
      },
    })
    llmStatus = 'READY'
    loadStage = ''
    currentKey = cacheKey
    customUrl = ''
    await refreshCacheState()
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      llmStatus = 'NOT RUNNING'
      errorMessage = 'Download abgebrochen'
    } else {
      llmStatus = 'ERROR'
      errorMessage = e instanceof Error ? e.message : String(e)
    }
  } finally {
    aborter = null
  }
}

async function handleUnload() {
  try {
    await unloadModel()
    llmStatus = 'NOT RUNNING'
    loadStage = ''
    downloadDetail = null
    errorMessage = ''
    currentKey = ''
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : String(e)
  }
}

async function handleDeleteCache(modelKey: ModelKey) {
  try {
    await deleteModelCache(modelKey)
    await refreshCacheState()
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : String(e)
  }
}

function selectModel(modelKey: ModelKey) {
  selectedModelKey = modelKey
}

$effect(() => {
  checkWebGPU()
})
</script>

<div class="model-manager">
  <h3>═══ LOCAL LLM ═══</h3>

  <div class="status-bar">
    <span class="status-label">WebGPU:</span>
    <span class="status-value" class:supported={webgpuSupported} class:unsupported={!webgpuSupported}>
      {webgpuSupported ? 'VERFÜGBAR' : 'NICHT VERFÜGBAR'}
    </span>
    {#if !webgpuSupported && webgpuReason}
      <span class="error-text">{webgpuReason}</span>
    {/if}
  </div>

  <div class="status-bar">
    <span class="status-label">STATUS:</span>
    <span
      class="status-value"
      class:ready={llmStatus === 'READY'}
      class:error={llmStatus === 'ERROR'}
      class:loading={llmStatus === 'LOADING...' || llmStatus === 'CHECKING...'}
    >
      {llmStatus}
    </span>
    {#if errorMessage}
      <span class="error-text" title={errorMessage}>{errorMessage}</span>
    {/if}
  </div>

  {#if storageUsage.quota > 0}
    <div class="status-bar">
      <span class="status-label">SPEICHER:</span>
      <span class="status-value">{formatBytes(storageUsage.usage)} / {formatBytes(storageUsage.quota)}</span>
    </div>
  {/if}

  {#if llmStatus === 'LOADING...' && downloadDetail}
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" style="width: {downloadDetail.percent}%"></div>
      </div>
      <span class="progress-text">{Math.round(downloadDetail.percent)}%</span>
    </div>
    <div class="progress-meta">
      <span>{formatBytes(downloadDetail.downloaded)} / {downloadDetail.total > 0 ? formatBytes(downloadDetail.total) : '–'}</span>
      <span>{formatSpeed(downloadDetail.speedBps)} · ETA {formatEta(downloadDetail.etaSec)}</span>
    </div>
    {#if loadStage}
      <div class="progress-meta"><span>{loadStage}</span></div>
    {/if}
    <div class="controls-row">
      <button class="btn-ctrl btn-stop" onclick={handleCancel}>[ ✕ ABBRECHEN ]</button>
    </div>
  {:else if llmStatus === 'LOADING...' && loadStage}
    <div class="progress-meta"><span>{loadStage}</span></div>
  {/if}

  {#if webgpuSupported}
    <div class="controls-row">
      {#if llmStatus === 'NOT RUNNING' || llmStatus === 'CHECKING...' || llmStatus === 'ERROR'}
        <button
          class="btn-ctrl"
          onclick={() => handleDownload(selectedModelKey)}
        >
          [ ▶ START ]
        </button>
      {:else if llmStatus === 'READY'}
        <button class="btn-ctrl btn-stop" onclick={handleUnload}>
          [ ⏹ STOP ]
        </button>
      {/if}
    </div>

    <div class="section">
      <h4>> MODELL AUSWÄHLEN</h4>
      <p class="hint">⚠️ Erster Download nur über WLAN empfohlen. Danach offline nutzbar (Cache).</p>
      {#each modelEntries as [key, model]}
        <div class="model-row">
          <label class="model-radio">
            <input
              type="radio"
              name="active-model"
              checked={selectedModelKey === key}
              onchange={() => selectModel(key as ModelKey)}
              disabled={llmStatus === 'LOADING...' || llmStatus === 'READY'}
            />
            <div class="model-info">
              <span class="model-name">{model.name} {cachedMap[key] ? '· CACHED' : ''}</span>
              <span class="model-meta">{formatBytes(model.sizeBytes)} — {model.description}</span>
            </div>
          </label>
          {#if llmStatus !== 'LOADING...' && llmStatus !== 'READY'}
            <div class="model-actions">
              <button
                class="btn-sm"
                onclick={() => handleDownload(key as ModelKey)}
              >
                {cachedMap[key] ? '[ LADEN ]' : '[ DOWNLOAD ]'}
              </button>
              {#if cachedMap[key]}
                <button
                  class="btn-sm btn-danger"
                  onclick={() => handleDeleteCache(key as ModelKey)}
                  title="Cache löschen"
                >
                  [ 🗑 ]
                </button>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <div class="section">
      <h4>> EIGENES MODELL</h4>
      <input
        type="file"
        accept=".task"
        bind:this={fileInput}
        onchange={handleFileSelect}
        style="display: none;"
      />
      <button class="btn-ctrl btn-pick" onclick={handlePickFile}>
        [ 📁 .TASK DATEI AUSWÄHLEN ]
      </button>
      <p class="hint">Nur MediaPipe `.task` (Web) — z.B. `gemma3-1b-it-int4-web.task`. `.litertlm`, `.gguf`, `.bin` und `.onnx` werden abgelehnt (nativ/Desktop-Formate).</p>
      <div class="url-row">
        <input
          class="url-input"
          type="url"
          inputmode="url"
          placeholder="https://…/*.task URL einfügen"
          bind:value={customUrl}
          disabled={llmStatus === 'LOADING...'}
        />
        <button
          class="btn-sm"
          onclick={handleImportUrl}
          disabled={llmStatus === 'LOADING...' || !customUrl.trim()}
        >
          [ ⬇ URL IMPORT ]
        </button>
      </div>
      <p class="hint">Quelle für .task Dateien: huggingface.co/litert-community/Gemma3-1B-IT (Datei *-web.task)</p>
    </div>

    {#if currentKey}
      <div class="section loaded-model">
        <h4>> GELADENES MODELL</h4>
        <span class="model-name">{currentKey}</span>
      </div>
    {/if}
  {:else}
    <div class="section">
      <p class="hint warning">
        Local LLM benötigt WebGPU. Bitte verwende Chrome 113+ oder einen kompatiblen Browser.
      </p>
    </div>
  {/if}
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
    margin-bottom: 0.5rem;
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

  .status-value.supported {
    color: #00ff41;
    text-shadow: 0 0 5px #00ff41;
  }

  .status-value.unsupported {
    color: #ff3333;
  }

  .status-value.ready {
    color: #00ff41;
    text-shadow: 0 0 5px #00ff41;
  }

  .status-value.error {
    color: #ff3333;
  }

  .status-value.loading {
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

  .progress-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    background: #0a0a0a;
    border: 1px solid #003311;
  }

  .progress-bar {
    flex: 1;
    height: 4px;
    background: #003311;
  }

  .progress-fill {
    height: 100%;
    background: #00ff41;
    transition: width 0.3s;
  }

  .progress-text {
    color: #00aa2a;
    font-size: 0.7rem;
    min-width: 40px;
    text-align: right;
  }

  .progress-meta {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    font-size: 0.7rem;
    color: #00aa2a;
    padding: 0.25rem 0.5rem;
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

  .btn-stop {
    border-color: #ff3333;
    color: #ff3333;
  }

  .btn-stop:hover {
    background: #ff3333;
    color: #0a0a0a;
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

  .model-radio input:disabled {
    accent-color: #555;
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

  .model-actions {
    display: flex;
    gap: 0.25rem;
    flex-shrink: 0;
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

  .btn-danger {
    border-color: #551111;
    color: #ff6666;
  }

  .btn-pick {
    margin-top: 0.5rem;
  }

  .url-row {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.75rem;
    align-items: center;
  }

  .url-input {
    flex: 1;
    min-width: 0;
    background: #0a0a0a;
    border: 1px solid #003311;
    color: #00ff41;
    padding: 0.4rem 0.5rem;
    font-family: inherit;
    font-size: 0.75rem;
  }

  .url-input:focus {
    outline: none;
    border-color: #00ff41;
  }

  .url-input:disabled {
    opacity: 0.4;
  }

  .loaded-model {
    padding: 0.5rem;
    background: #0a0a0a;
    border: 1px solid #003311;
  }

  .hint {
    font-size: 0.75rem;
    color: #00aa2a;
    margin-bottom: 0.75rem;
  }

  .hint.warning {
    color: #ffaa00;
  }
</style>
