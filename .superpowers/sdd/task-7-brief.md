# Task 7: Enhanced Topic Suggestions & Similar Flow

## Files to Modify

**Modify:**
- `src/lib/topics.ts` (enhance topic database)
- `src/App.svelte` (enhance topic suggestion UI and similar flow)

## Steps

### Step 1: Enhance topics.ts

Modify `src/lib/topics.ts`:
- Expand `TOPICS` array with 30+ diverse topics across categories:
  - Technology: AI, Quantum Computing, Cybersecurity, Robotics, Space Tech
  - Science: Climate, Biology, Physics, Medicine, Neuroscience
  - Culture: Digital Art, Gaming, Streaming, Social Media, Meme Culture
  - Society: Future of Work, Education, Privacy, Ethics, Urban Planning
  - Fun: Weird Science, Internet Mysteries, Retro Tech, Conspiracy Theories
- Add `TOPIC_CATEGORIES` object mapping category to topics
- Add `getRandomTopic(category?): string` - returns random topic from category or all
- Add `getTopicsByCategory(category): string[]` - returns topics for category
- Add `getAllCategories(): string[]` - returns list of categories

### Step 2: Enhance TopicSuggestions component in App.svelte

In `src/App.svelte`:
- Add category filter state: `selectedCategory = $state('all')`
- Add `categories` array from `getAllCategories()`
- Render category tabs/pills above topic suggestions
- Filter displayed topics by selected category
- Add "Würfel 🎲" button for random topic from current category
- Add "Similar" button next to each topic suggestion that calls `handleSimilar(topic)`
- Style: terminal aesthetic, active category highlighted

### Step 3: Enhance Similar Flow

In `handleSimilar(topic)`:
- Generate new episode with "deeper" mode or related topic
- Use LLM to suggest related topic based on current episode
- Add transition animation when switching

### Step 4: Run tests

```bash
cd D:\repos\ai-radio\ai-radio && bun run lint && bun run typecheck
```

Expected: PASS

## Global Constraints

- No cloud dependencies
- All topics local (no API calls for suggestions)
- Bundle size < 50MB
- Svelte 5 runes only
- Preserve terminal/hacker aesthetic