<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { AudioVisualizer, frequencyToBars, type VisualizerConfig } from "../lib/audio-visualizer";

  interface Props {
    audioElement: HTMLAudioElement | null;
    isPlaying: boolean;
    barCount?: number;
    style?: 'bars' | 'waveform' | 'circular';
    config?: Partial<VisualizerConfig>;
  }

  let { audioElement, isPlaying, barCount = 32, style = 'bars', config = {} }: Props = $props();

  let visualizer: AudioVisualizer | null = $state(null);
  let bars: number[] = $state([]);
  let frequencyData: Uint8Array | null = $state(null);
  let timeData: Uint8Array | null = $state(null);
  let canvasRef: HTMLCanvasElement | null = $state(null);

  const initVisualizer = async () => {
    if (!audioElement) return;
    
    visualizer = new AudioVisualizer(config);
    try {
      await visualizer.connect(audioElement);
      visualizer.subscribe((freq, time) => {
        frequencyData = freq;
        timeData = time;
        bars = frequencyToBars(freq, barCount);
      });
    } catch (e) {
      console.error('Failed to connect visualizer:', e);
    }
  };

  const cleanup = () => {
    if (visualizer) {
      visualizer.disconnect();
      visualizer = null;
    }
  };

  onMount(() => {
    initVisualizer();
  });

  onDestroy(() => {
    cleanup();
  });

  $effect(() => {
    if (!audioElement || !isPlaying) {
      bars = new Array(barCount).fill(0);
    }
  });

  function drawWaveform(ctx: CanvasRenderingContext2D, width: number, height: number) {
    if (!timeData) return;
    
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00ff41';
    ctx.shadowBlur = 10;

    const sliceWidth = width / timeData.length;
    let x = 0;

    for (let i = 0; i < timeData.length; i++) {
      const v = timeData[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function drawCircular(ctx: CanvasRenderingContext2D, width: number, height: number) {
    if (!frequencyData) return;
    
    ctx.clearRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    const barCount = frequencyData.length;
    const angleStep = (Math.PI * 2) / barCount;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    for (let i = 0; i < barCount; i++) {
      const value = frequencyData[i] / 255;
      const barLength = value * radius * 0.8;
      const angle = i * angleStep - Math.PI / 2;

      const innerX = centerX + Math.cos(angle) * (radius * 0.2);
      const innerY = centerY + Math.sin(angle) * (radius * 0.2);
      const outerX = centerX + Math.cos(angle) * (radius * 0.2 + barLength);
      const outerY = centerY + Math.sin(angle) * (radius * 0.2 + barLength);

      const hue = 120 + (value * 60);
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.moveTo(innerX, innerY);
      ctx.lineTo(outerX, outerY);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }

  function renderCanvas() {
    if (!canvasRef) return;
    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvasRef.getBoundingClientRect();
    canvasRef.width = rect.width * dpr;
    canvasRef.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    if (style === 'waveform') {
      drawWaveform(ctx, rect.width, rect.height);
    } else if (style === 'circular') {
      drawCircular(ctx, rect.width, rect.height);
    }
  }

  $effect(() => {
    if (style !== 'bars' && canvasRef) {
      renderCanvas();
    }
  });

  $effect(() => {
    if (!isPlaying && canvasRef) {
      const ctx = canvasRef.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
      }
    }
  });
</script>

<div class="visualizer-container" data-style={style}>
  {#if style === 'bars'}
    <div class="bars-visualizer" role="img" aria-label="Audio frequency visualizer">
      {#each bars as barHeight, index}
        <div
          class="bar"
          style="height: {barHeight}%; animation-delay: {index * 30}ms;"
          aria-hidden="true"
        ></div>
      {/each}
    </div>
  {:else if style === 'waveform'}
    <canvas
      bind:this={canvasRef}
      class="canvas-visualizer"
      width={300}
      height={100}
      aria-label="Audio waveform visualizer"
    ></canvas>
  {:else if style === 'circular'}
    <canvas
      bind:this={canvasRef}
      class="canvas-visualizer"
      width={200}
      height={200}
      aria-label="Circular audio visualizer"
    ></canvas>
  {/if}
</div>

<style>
  .visualizer-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80px;
  }

  .bars-visualizer {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 3px;
    height: 100%;
    width: 100%;
  }

  .bar {
    width: 6px;
    background: linear-gradient(to top, #00ff41, #00aa2a);
    border-radius: 2px;
    min-height: 3px;
    animation: pulse 0.3s ease-in-out infinite alternate;
    transform-origin: bottom;
  }

  @keyframes pulse {
    from {
      opacity: 0.4;
      transform: scaleY(0.8);
    }
    to {
      opacity: 1;
      transform: scaleY(1);
    }
  }

  .canvas-visualizer {
    width: 100%;
    height: 100%;
    max-width: 400px;
    max-height: 200px;
  }

  :global(.visualizer-container[data-style="waveform"] .canvas-visualizer) {
    height: 100px;
  }

  :global(.visualizer-container[data-style="circular"] .canvas-visualizer) {
    height: 200px;
  }
</style>