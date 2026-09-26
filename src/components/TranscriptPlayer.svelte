<script lang="ts">
  import { onMount } from 'svelte'
  import {
    type TranscriptLine,
    type Bookmark,
    formatSpeakerName,
    formatTime,
    findActiveSegment,
  } from '../lib/transcript-player'
  import {
    getBookmarks,
    toggleBookmark,
  } from '../lib/db'

  interface Props {
    transcript: TranscriptLine[]
    currentTime: number
    duration: number
    audioElement: HTMLAudioElement | null
    episodeId: string
    episodeTitle: string
    onRegenerate?: (index: number) => void
    regeneratingIndex?: number | null
  }

  let { transcript, currentTime, duration, audioElement, episodeId, episodeTitle, onRegenerate, regeneratingIndex = null }: Props = $props()

  let bookmarks: Bookmark[] = $state([])
  let showBookmarksOnly = $state(false)

  let activeIndex = $derived(findActiveSegment(transcript, currentTime))

  onMount(async () => {
    if (episodeId) {
      const loaded = await getBookmarks(episodeId)
      bookmarks = loaded
      for (const bm of loaded) {
        const line = transcript[bm.segmentIndex]
        if (line) line.isBookmarked = true
      }
    }
  })

  function handleSeek(line: TranscriptLine): void {
    if (audioElement) {
      audioElement.currentTime = line.startTime
    }
  }

  async function handleBookmark(line: TranscriptLine): Promise<void> {
    const isBookmarked = line.isBookmarked
    line.isBookmarked = !isBookmarked

    const bm: Omit<Bookmark, 'id'> = {
      episodeId,
      episodeTitle,
      segmentIndex: line.index,
      speaker: line.speaker,
      text: line.text,
      timestamp: line.startTime,
      createdAt: new Date(),
    }

    await toggleBookmark(bm)

    if (!isBookmarked) {
      const saved = await getBookmarks(episodeId)
      bookmarks = saved
    } else {
      bookmarks = bookmarks.filter(b => !(b.episodeId === episodeId && b.segmentIndex === line.index))
    }
  }

  function getDisplayTranscript(): TranscriptLine[] {
    if (showBookmarksOnly) {
      return transcript.filter(l => l.isBookmarked)
    }
    return transcript
  }

  function formatSpeakerLabel(speaker: string): string {
    return formatSpeakerName(speaker)
  }
</script>

<div class="transcript-player">
  <div class="transcript-header">
    <h3>═══ TRANSCRIPT ═══</h3>
    <label class="filter-toggle">
      <input type="checkbox" bind:checked={showBookmarksOnly} />
      <span>Nur Bookmarks</span>
    </label>
  </div>

  <div class="transcript-list">
    {#if getDisplayTranscript().length === 0}
      <p class="empty">
        {showBookmarksOnly ? 'Keine Bookmarks gesetzt' : 'Kein Transkript verfügbar'}
      </p>
    {:else}
      {#each getDisplayTranscript() as line, i}
        <div
          class="transcript-line"
          class:active={line.index === activeIndex}
          class:bookmarked={line.isBookmarked}
          onclick={() => handleSeek(line)}
        >
          <div class="line-meta">
            <span class="speaker-badge">{formatSpeakerLabel(line.speaker)}</span>
            <span class="timecode">{formatTime(line.startTime)}</span>
          </div>
          <div class="line-text">{line.text}</div>
          <div class="line-actions">
            {#if onRegenerate}
              <button
                class="regen-btn"
                disabled={regeneratingIndex !== null}
                onclick={(e) => { e.stopPropagation(); onRegenerate(line.index); }}
                aria-label={regeneratingIndex === line.index ? 'Segment wird neu generiert' : 'Segment neu generieren'}
                title="Segment neu generieren"
              >
                {regeneratingIndex === line.index ? '⏳' : '🔄'}
              </button>
            {/if}
            <button
              class="bookmark-btn"
              class:active={line.isBookmarked}
              onclick={(e) => { e.stopPropagation(); handleBookmark(line); }}
              aria-label={line.isBookmarked ? 'Bookmark entfernen' : 'Bookmark setzen'}
            >
              {line.isBookmarked ? '★' : '☆'}
            </button>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .transcript-player {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #111111;
    border: 1px solid #003311;
    max-height: 400px;
    display: flex;
    flex-direction: column;
  }

  .transcript-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px dashed #003311;
  }

  .transcript-header h3 {
    font-size: 0.875rem;
    color: #00ff41;
    margin: 0;
  }

  .filter-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.75rem;
    color: #00aa2a;
  }

  .filter-toggle input {
    accent-color: #00ff41;
  }

  .transcript-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .empty {
    color: #005511;
    text-align: center;
    padding: 2rem;
    margin: 0;
    font-size: 0.875rem;
  }

  .transcript-line {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem;
    background: #0a0a0a;
    border: 1px solid #003311;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .transcript-line:hover {
    border-color: #00ff41;
    box-shadow: 0 0 10px rgba(0, 255, 65, 0.1);
  }

  .transcript-line.active {
    border-color: #00ff41;
    background: #001100;
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
  }

  .transcript-line.bookmarked {
    border-color: #ffaa00;
  }

  .transcript-line.bookmarked::before {
    content: '';
    position: absolute;
    left: -1px;
    top: -1px;
    bottom: -1px;
    width: 3px;
    background: #ffaa00;
    border-radius: 4px 0 0 4px;
  }

  .line-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.75rem;
  }

  .speaker-badge {
    background: #003311;
    color: #00ff41;
    padding: 0.125rem 0.5rem;
    border-radius: 2px;
    font-weight: bold;
    font-size: 0.625rem;
  }

  .timecode {
    color: #00aa2a;
    font-variant-numeric: tabular-nums;
  }

  .line-text {
    color: #00ff41;
    font-size: 0.875rem;
    line-height: 1.5;
    white-space: pre-wrap;
  }

  .bookmark-btn {
    background: none;
    border: none;
    color: #005511;
    font-size: 1rem;
    cursor: pointer;
    padding: 0.25rem;
    line-height: 1;
    transition: color 0.2s;
  }

  .bookmark-btn:hover {
    color: #ffaa00;
  }

  .bookmark-btn.active {
    color: #ffaa00;
  }

  .bookmark-btn.active:hover {
    color: #ffcc00;
  }

  .line-actions {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }

  .regen-btn {
    background: none;
    border: none;
    color: #005511;
    font-size: 0.9rem;
    cursor: pointer;
    padding: 0.25rem;
    line-height: 1;
    transition: color 0.2s;
  }

  .regen-btn:hover:not(:disabled) {
    color: #00ff41;
  }

  .regen-btn:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  @media (max-width: 600px) {
    .transcript-player {
      max-height: 300px;
    }
  }
</style>