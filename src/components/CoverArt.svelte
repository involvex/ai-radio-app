<script lang="ts">
  import { onMount } from 'svelte';
  import { generateCoverCanvas, canvasToDataURL, downloadCover } from '../lib/cover-generator';

  interface Props {
    title: string;
    topic: string;
    style: 'tech' | 'casual' | 'academic' | 'entertaining' | 'news' | 'podcast' | 'chill';
    size?: number;
    onGenerated?: (dataUrl: string) => void;
  }

  let { title, topic, style, size = 300, onGenerated }: Props = $props();

  let dataUrl = $state<string | null>(null);
  let isGenerating = $state(false);
  let isHovered = $state(false);

  async function generateCover() {
    if (isGenerating) return;
    isGenerating = true;

    try {
      const canvas = generateCoverCanvas({
        title,
        topic,
        style,
        width: size,
        height: size,
      });
      dataUrl = canvasToDataURL(canvas);
      onGenerated?.(dataUrl);
    } catch (e) {
      console.error('Failed to generate cover:', e);
      dataUrl = null;
    } finally {
      isGenerating = false;
    }
  }

  function handleDownload() {
    if (!dataUrl) return;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      downloadCover(canvas, `ai-radio-cover-${Date.now()}.png`);
    };
    img.src = dataUrl;
  }

  onMount(() => {
    generateCover();
  });

  $effect(() => {
    if (title && topic && style) {
      generateCover();
    }
  });
</script>

<div
  class="cover-art"
  onmouseenter={() => (isHovered = true)}
  onmouseleave={() => (isHovered = false)}
  onclick={handleDownload}
  role="img"
  aria-label="Cover art - click to download"
  title="Click to download cover"
>
  {#if isGenerating}
    <div class="cover-placeholder generating">
      <span class="generating-text">GENERATING...</span>
    </div>
  {:else if (dataUrl)}
    <img src={dataUrl} alt={title} class="cover-image" />
    {#if isHovered}
      <div class="download-overlay">
        <span>⬇ DOWNLOAD</span>
      </div>
    {/if}
  {:else}
    <div class="cover-placeholder error">
      <span>⚠ ERROR</span>
    </div>
  {/if}
</div>

<style>
  .cover-art {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    border: 2px solid #003311;
    background: #0a0a0a;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cover-art:hover {
    border-color: #00ff41;
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
  }

  .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .cover-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #005511;
    font-family: "Courier New", monospace;
    font-size: 0.875rem;
  }

  .cover-placeholder.generating {
    animation: pulse 1s ease-in-out infinite;
  }

  .generating-text {
    color: #00aa2a;
  }

  .download-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00ff41;
    font-family: "Courier New", monospace;
    font-size: 0.875rem;
    font-weight: bold;
    text-shadow: 0 0 10px #00ff41;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>