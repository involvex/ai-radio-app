# Task 8: Local Quota / Usage Tracking

## Files to Create/Modify

**Create:**

- `src/lib/local-quota.ts`

**Modify:**

- `src/App.svelte` (integrate quota display and limits)

## Steps

### Step 1: Create local quota library

Create `src/lib/local-quota.ts` with:

- `QuotaConfig` interface (dailyGenerations, dailyCharacters, dailyAudioMinutes)
- `UsageStats` interface (date, generations, characters, audioMinutes, lastReset)
- `DEFAULT_QUOTA: QuotaConfig` = { dailyGenerations: 50, dailyCharacters: 100000, dailyAudioMinutes: 120 }
- `getUsage(): UsageStats` - reads from localStorage, resets if date changed
- `saveUsage(stats: UsageStats): void` - saves to localStorage
- `checkQuota(type: 'generation' | 'character' | 'audio', amount: number): { allowed: boolean; remaining: number; limit: number }` - checks if action allowed
- `incrementUsage(type: 'generation' | 'character' | 'audio', amount: number): void` - increments counters
- `getQuotaDisplay(): { generations: {used, limit, remaining, percent}, characters: {...}, audio: {...} }` - returns formatted data for UI
- `resetQuota(): void` - manual reset (for testing)

### Step 2: Integrate into App.svelte

Modify `src/App.svelte`:

- Import quota functions from `./lib/local-quota`
- Add quota state: `quotaDisplay = $state(getQuotaDisplay())`
- Add `refreshQuota()` function that updates quotaDisplay
- In `tuneIn`: before generation, check `checkQuota('generation', 1)` and `checkQuota('character', estimatedChars)`
- If quota exceeded: show error, disable generate button
- After successful generation: `incrementUsage('generation', 1)`, `incrementUsage('character', script.length)`, `incrementUsage('audio', durationMinutes)`, then `refreshQuota()`
- Add quota indicator in header/status bar showing: "Generations: 12/50 | Chars: 45K/100K | Audio: 30/120min"
- Color coding: green < 50%, yellow < 80%, red >= 80%
- Add "Reset Quota" button in settings (for testing)

### Step 3: Run tests

```bash
cd D:\repos\ai-radio\ai-radio && bun run lint && bun run typecheck
```

Expected: PASS

## Global Constraints

- No cloud dependencies - all localStorage
- No external APIs
- Bundle size < 50MB
- Svelte 5 runes only
- Preserve terminal/hacker aesthetic
