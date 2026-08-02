## Task 5: Model Manager UI Component

**Files:**

- Create: `src/components/ModelManager.svelte`
- Modify: `src/App.svelte` (integrate ModelManager, add 'local' provider option)

**Interfaces:**

- Consumes: `local-llm.ts` API (Task 4)
- Produces: ModelManager Svelte component with download, select, delete, file picker

- [ ] **Step 1: Create `src/components/` directory**

```bash
mkdir -p src/components
```

- [ ] **Step 2: Create ModelManager.svelte**

Create a Svelte 5 component using runes syntax (`$state`, `$derived`, `$effect`) that provides:

- List of available models to download (from `AVAILABLE_MODELS`)
- Download button for each model with progress indicator
- List of installed models (from `listLocalModels()`)
- Radio button selection for active model
- Delete button for each installed model
- "PICK .GGUF FILE" button (file picker)
- START/STOP buttons for the local LLM
- Status indicator (NOT RUNNING / STARTING... / READY / ERROR)

Style with the terminal/hacker aesthetic: dark background (#0a0a0a), green text (#00ff41), monospace font, scanline feel.

Use the imports from `$lib/local-llm`:

```typescript
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
} from '$lib/local-llm'
```

- [ ] **Step 3: Integrate ModelManager into App.svelte**

Read the current `src/App.svelte` first to understand the settings panel structure.

Add import at the top:

```typescript
import ModelManager from './components/ModelManager.svelte'
```

In the settings panel section, add the ModelManager component when the local provider is selected. Look for the API provider selection area and add a conditional render:

```svelte
{#if settings.apiProvider === 'local'}
  <ModelManager />
{/if}
```

Also add a "LOCAL" option to the provider selection UI. The current settings panel has provider buttons/selection - add one for 'local'.

- [ ] **Step 4: Test that the component renders**

Run `bun run dev` and verify:

- The ModelManager component appears in settings when LOCAL is selected
- The terminal-style UI is consistent with the rest of the app

- [ ] **Step 5: Commit**

```bash
git add src/components/ModelManager.svelte src/App.svelte
git commit -m "feat: add ModelManager UI component for local AI model management"
```
