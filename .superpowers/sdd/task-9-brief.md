# Task 9: Settings Persistence & Migration

## Files to Modify

**Modify:**

- `src/lib/settings.ts` (add migration, versioning, backup/restore)
- `src/App.svelte` (add settings export/import UI)

## Steps

### Step 1: Add settings versioning and migration to settings.ts

Modify `src/lib/settings.ts`:

- Add `SETTINGS_VERSION = 2` constant
- Add `migrateSettings(oldSettings, oldVersion): AppSettings` function:
  - v1 → v2: Add new fields (visualizerStyle, quotaEnabled, autoSaveCovers)
  - Handle missing fields with defaults
- Modify `loadSettings()` to:
  - Read version from localStorage
  - If version < SETTINGS_VERSION, run migration
  - Save migrated settings
- Add `exportSettings(): string` - returns JSON string of all settings
- Add `importSettings(jsonString: string): boolean` - validates and imports
- Add `resetSettings(): void` - clears localStorage, loads defaults

### Step 2: Add settings backup/restore UI to App.svelte

In `src/App.svelte`:

- In settings panel, add "Export Settings" button - downloads settings.json
- Add "Import Settings" file input - reads JSON file, validates, imports
- Add "Reset to Defaults" button - confirms, then resets
- Add version display: "Settings v2"
- Handle file input change for import

### Step 3: Run tests

```bash
cd D:\repos\ai-radio\ai-radio && bun run lint && bun run typecheck && bun run build
```

Expected: PASS

## Global Constraints

- No cloud dependencies
- localStorage only
- Bundle size < 50MB
- Svelte 5 runes only
- Preserve terminal/hacker aesthetic
