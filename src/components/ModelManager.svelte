<script lang="ts">
import {
  checkWebGPUAvailability,
  loadModelFromUrl,
  loadModelFromFile,
  unloadModel,
  isModelReady,
  getCurrentModelKey,
  AVAILABLE_MODELS,
  type ModelKey,
} from '../lib/litert-lm'
import {loadSettings, saveSettings} from '../lib/settings'

const isAndroid = /android/i.test(navigator.userAgent)

let webgpuSupported = $state(false)
let webgpuReason = $state('')
let llmStatus: 'CHECKING...' | 'NOT RUNNING' | 'LOADING...' | 'READY' | 'ERROR' = $state('CHECKING...')
let errorMessage = $state('')
let selectedModelKey: ModelKey = $state('gemma3-1b-int4')
let downloadProgress = $state(0)
let fileInput: HTMLInputElement | null = $state(null)

const modelEntries = Object.entries(AVAILABLE_MODELS)

function formatSize(bytes: number): string {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(0)} MB`
  return `${(bytes / 1_000).toFixed(0)} KB`
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
    llmStatus = 'NOT RUNNING'
  }
}

async function handleDownload(modelKey: ModelKey) {
  llmStatus = 'LOADING...'
  downloadProgress = 0
  errorMessage = ''

  try {
    await loadModelFromUrl(modelKey, (progress) => {
      downloadProgress = progress
    })
    llmStatus = 'READY'
    const settings = loadSettings()
    settings.localModelKey = modelKey
    saveSettings(settings)
  } catch (e) {
    llmStatus = 'ERROR'
    errorMessage = e instanceof Error ? e.message : String(e)
  }
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
  downloadProgress = 0
  errorMessage = ''

  try {
    await loadModelFromFile(file, (progress) => {
      downloadProgress = progress
    })
    llmStatus = 'READY'
  } catch (e) {
    llmStatus = 'ERROR'
    errorMessage = e instanceof Error ? e.message : String(e)
  } finally {
    if (fileInput) fileInput.value = ''
  }
}

async function handleUnload() {
  try {
    await unloadModel()
    llmStatus = 'NOT RUNNING'
    errorMessage = ''
  } catch (e) {
    console.error('Unload failed:', e)
  }
}

function selectModel(modelKey: ModelKey) {
  selectedModelKey = modelKey
}

$effect(() => {
  checkWebGPU()
})

$effect(() => {
  if (isModelReady()) {
    llmStatus = 'READY'
  }
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
      <span class="error-text">{errorMessage}</span>
    {/if}
  </div>

  {#if llmStatus === 'LOADING...'}
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" style="width: {downloadProgress}%"></div>
      </div>
      <span class="progress-text">{downloadProgress}%</span>
    </div>
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
              <span class="model-name">{model.name}</span>
              <span class="model-meta">{formatSize(model.sizeBytes)} — {model.description}</span>
            </div>
          </label>
          {#if llmStatus !== 'LOADING...' && llmStatus !== 'READY'}
            <button
              class="btn-sm"
              disabled={llmStatus === 'LOADING...'}
              onclick={() => handleDownload(key as ModelKey)}
            >
              [ DOWNLOAD ]
            </button>
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
    </div>

    {#if getCurrentModelKey()}
      <div class="section loaded-model">
        <h4>> GELADENES MODELL</h4>
        <span class="model-name">{getCurrentModelKey()}</span>
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

  .btn-pick {
    margin-top: 0.5rem;
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
