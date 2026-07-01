<script lang="ts">
  import { onMount } from "svelte";

  let topic = $state("");
  let link = $state("");
  let isGenerating = $state(false);
  let isPlaying = $state(false);
  let audioElement: HTMLAudioElement | null = $state(null);
  let currentScript = $state("");
  let currentTime = $state(0);
  let duration = $state(0);
  let showHistory = $state(false);
  let history: Episode[] = $state([]);

  interface Episode {
    id: string;
    title: string;
    topic: string;
    link?: string;
    script: string;
    audioUrl: string;
    duration: number;
    createdAt: Date;
    isFavorite: boolean;
  }

  onMount(async () => {
    await loadHistory();
  });

  async function loadHistory() {
    try {
      const { getAllEpisodes } = await import("./lib/db");
      history = await getAllEpisodes();
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }

  async function tuneIn() {
    if (!topic.trim()) return;
    isGenerating = true;
    currentScript = "";

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, link: link || undefined }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      currentScript = data.script;

      if (audioElement) {
        audioElement.src = data.audioUrl;
        await audioElement.play();
        isPlaying = true;
      }

      await loadHistory();
    } catch (e) {
      console.error("Error:", e);
      alert("Fehler bei der Generierung");
    } finally {
      isGenerating = false;
    }
  }

  function togglePlayPause() {
    if (!audioElement) return;
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    isPlaying = !isPlaying;
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  function handleTimeUpdate() {
    if (audioElement) {
      currentTime = audioElement.currentTime;
    }
  }

  function handleLoadedMetadata() {
    if (audioElement) {
      duration = audioElement.duration;
    }
  }

  async function playEpisode(episode: Episode) {
    currentScript = episode.script;
    if (audioElement) {
      audioElement.src = episode.audioUrl;
      await audioElement.play();
      isPlaying = true;
    }
    showHistory = false;
  }

  async function deleteEpisode(id: string) {
    try {
      const { deleteEpisode: del } = await import("./lib/db");
      await del(id);
      await loadHistory();
    } catch (e) {
      console.error("Failed to delete:", e);
    }
  }

  async function toggleFavorite(episode: Episode) {
    try {
      const { toggleFavorite: toggle } = await import("./lib/db");
      await toggle(episode.id, !episode.isFavorite);
      await loadHistory();
    } catch (e) {
      console.error("Failed to toggle favorite:", e);
    }
  }
</script>

<div class="scanlines"></div>

<main class="terminal">
  <header class="header">
    <h1>📡 AI_RADIO_v1.0.0</h1>
    <span class="status-indicator">{isGenerating ? "GENERATING..." : "READY"}</span>
  </header>

  <div class="content">
    <div class="input-group">
      <label for="topic">> TOPIC:</label>
      <input
        id="topic"
        type="text"
        bind:value={topic}
        placeholder="Enter topic or paste link..."
        disabled={isGenerating}
      />
    </div>

    <div class="input-group">
      <label for="link">> LINK:</label>
      <input
        id="link"
        type="url"
        bind:value={link}
        placeholder="Optional: Paste URL for content..."
        disabled={isGenerating}
      />
    </div>

    <div class="controls">
      <button
        class="btn-primary"
        onclick={tuneIn}
        disabled={isGenerating || !topic.trim()}
      >
        {isGenerating ? "[ GENERATING... ]" : "[ ▶ TUNE IN ]"}
      </button>

      {#if audioElement && currentScript}
        <button class="btn-secondary" onclick={togglePlayPause}>
          {isPlaying ? "[ ⏸ PAUSE ]" : "[ ▶ PLAY ]"}
        </button>
      {/if}

      <button class="btn-history" onclick={() => showHistory = !showHistory}>
        [ 📜 HISTORY ]
      </button>
    </div>

    {#if audioElement && currentScript}
      <div class="player-section">
        <div class="visualizer">
          {#each Array(20) as _, i}
            <div
              class="bar"
              style="animation-delay: {i * 50}ms; height: {isPlaying ? Math.random() * 100 : 20}%"
            ></div>
          {/each}
        </div>

        <div class="progress-container">
          <span class="time">{formatTime(currentTime)}</span>
          <div class="progress-bar">
            <div
              class="progress-fill"
              style="width: {(currentTime / duration) * 100}%"
            ></div>
          </div>
          <span class="time">{formatTime(duration)}</span>
        </div>
      </div>

      <div class="script-preview">
        <p>{currentScript.slice(0, 200)}...</p>
      </div>
    {/if}
  </div>

  {#if showHistory}
    <div class="history-panel">
      <div class="history-header">
        <h2>═══ HISTORY ═══</h2>
        <button onclick={() => showHistory = false}>[ ✕ ]</button>
      </div>

      <div class="history-list">
        {#if history.length === 0}
          <p class="empty">No episodes yet...</p>
        {:else}
          {#each history as episode}
            <div class="episode-card">
              <div class="episode-info">
                <span class="episode-title">
                  {episode.isFavorite ? "⭐ " : ""}{episode.title}
                </span>
                <span class="episode-meta">
                  {formatTime(episode.duration)} | {new Date(episode.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div class="episode-actions">
                <button onclick={() => playEpisode(episode)}>[ ▶ ]</button>
                <button onclick={() => toggleFavorite(episode)}>
                  [{episode.isFavorite ? "⭐" : "☆"}]
                </button>
                <button onclick={() => deleteEpisode(episode.id)}>[ 🗑 ]</button>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
</main>

<audio
  bind:this={audioElement}
  ontimeupdate={handleTimeUpdate}
  onloadedmetadata={handleLoadedMetadata}
  onended={() => isPlaying = false}
></audio>

<style>
  :global(body) {
    font-family: "Courier New", monospace;
    background: #0a0a0a;
    color: #00ff41;
    min-height: 100vh;
  }

  .scanlines {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15),
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
    z-index: 9999;
  }

  .terminal {
    max-width: 900px;
    margin: 0 auto;
    padding: 1.5rem;
    min-height: 100vh;
    position: relative;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #003311;
    padding-bottom: 1rem;
    margin-bottom: 2rem;
  }

  .header h1 {
    font-size: 1.5rem;
    font-weight: bold;
    text-shadow: 0 0 10px #00ff41;
  }

  .status-indicator {
    color: #00aa2a;
    font-size: 0.875rem;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .input-group label {
    color: #00aa2a;
    font-size: 0.875rem;
  }

  .input-group input {
    background: #111111;
    border: 1px solid #003311;
    color: #00ff41;
    padding: 0.75rem 1rem;
    font-family: inherit;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .input-group input:focus {
    border-color: #00ff41;
    box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
  }

  .input-group input::placeholder {
    color: #005511;
  }

  .input-group input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .controls {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn-primary, .btn-secondary, .btn-history {
    background: #003311;
    border: 1px solid #00ff41;
    color: #00ff41;
    padding: 0.75rem 1.5rem;
    font-family: inherit;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary:hover:not(:disabled), .btn-secondary:hover, .btn-history:hover {
    background: #00ff41;
    color: #0a0a0a;
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.4);
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: #003311;
  }

  .player-section {
    margin-top: 1rem;
    padding: 1.5rem;
    background: #111111;
    border: 1px solid #003311;
  }

  .visualizer {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 4px;
    height: 60px;
    margin-bottom: 1rem;
  }

  .bar {
    width: 8px;
    background: #00ff41;
    animation: pulse 0.5s ease-in-out infinite alternate;
    min-height: 4px;
  }

  @keyframes pulse {
    from { opacity: 0.5; }
    to { opacity: 1; }
  }

  .progress-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .time {
    color: #00aa2a;
    font-size: 0.875rem;
    min-width: 50px;
  }

  .progress-bar {
    flex: 1;
    height: 4px;
    background: #003311;
  }

  .progress-fill {
    height: 100%;
    background: #00ff41;
    transition: width 0.1s;
  }

  .script-preview {
    margin-top: 1rem;
    padding: 1rem;
    background: #0a0a0a;
    border: 1px dashed #003311;
    color: #00aa2a;
    font-size: 0.875rem;
    line-height: 1.6;
  }

  .history-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 350px;
    height: 100vh;
    background: #0a0a0a;
    border-left: 2px solid #003311;
    z-index: 100;
    display: flex;
    flex-direction: column;
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #003311;
  }

  .history-header h2 {
    font-size: 1rem;
  }

  .history-header button {
    background: none;
    border: none;
    color: #00ff41;
    cursor: pointer;
    font-family: inherit;
  }

  .history-list {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .empty {
    color: #005511;
    text-align: center;
    padding: 2rem;
  }

  .episode-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border: 1px solid #003311;
    margin-bottom: 0.5rem;
    background: #111111;
  }

  .episode-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .episode-title {
    font-size: 0.875rem;
  }

  .episode-meta {
    font-size: 0.75rem;
    color: #00aa2a;
  }

  .episode-actions {
    display: flex;
    gap: 0.5rem;
  }

  .episode-actions button {
    background: none;
    border: none;
    color: #00ff41;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.875rem;
    padding: 0.25rem;
  }

  .episode-actions button:hover {
    text-shadow: 0 0 10px #00ff41;
  }
</style>