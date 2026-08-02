## Task 7: Integrate into Script Generation Flow

**Files:**

- Modify: `src/App.svelte`

**Interfaces:**

- Consumes: `invokeGenerateScript` with `local` provider (Task 4), ModelManager (Task 5)
- Produces: Updated script generation flow that works with local LLM

- [ ] **Step 1: Read current App.svelte**

Read `src/App.svelte` to understand the current `tuneIn()` function and loading states.

- [ ] **Step 2: Add local generation state**

Add a state variable for local generation:

```typescript
let localGenerating = $state(false)
```

- [ ] **Step 3: Update tuneIn() to handle local provider**

The `tuneIn()` function already calls `invokeGenerateScript()` which was updated in Task 4 to support the `local` provider. Verify the flow:

1. When provider is 'local', set `localGenerating = true`
2. Show a different loading message for local generation
3. Reset `localGenerating` when done

- [ ] **Step 4: Add status indicator in the main UI**

Show the local LLM status in the terminal-style header area:

```svelte
{#if settings.apiProvider === 'local'}
  <span class="local-status">
    LOCAL AI: {localStatus}
  </span>
{/if}
```

- [ ] **Step 5: Test the full flow**

Run `bun run typecheck` to verify TypeScript compilation.

- [ ] **Step 6: Commit**

```bash
git add src/App.svelte
git commit -m "feat: integrate local AI provider into script generation flow"
```
