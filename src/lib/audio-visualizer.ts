export interface VisualizerConfig {
	fftSize: number
	smoothingTimeConstant: number
	minDecibels: number
	maxDecibels: number
}

const DEFAULT_CONFIG: VisualizerConfig = {
	fftSize: 256,
	smoothingTimeConstant: 0.8,
	minDecibels: -90,
	maxDecibels: -10,
}

export class AudioVisualizer {
	private audioContext: AudioContext | null = null
	private analyser: AnalyserNode | null = null
	private source: MediaElementAudioSourceNode | null = null
	private animationFrameId: number | null = null
	private callbacks: Set<(freq: Uint8Array, time: Uint8Array) => void> =
		new Set()
	private config: VisualizerConfig

	constructor(config: Partial<VisualizerConfig> = {}) {
		this.config = {...DEFAULT_CONFIG, ...config}
	}

	async connect(audioElement: HTMLAudioElement): Promise<void> {
		if (this.audioContext) {
			this.disconnect()
		}

		this.audioContext = new (
			window.AudioContext ||
			(window as unknown as {webkitAudioContext: typeof AudioContext})
				.webkitAudioContext
		)()

		if (this.audioContext.state === 'suspended') {
			await this.audioContext.resume()
		}

		this.analyser = this.audioContext.createAnalyser()
		this.analyser.fftSize = this.config.fftSize
		this.analyser.smoothingTimeConstant = this.config.smoothingTimeConstant
		this.analyser.minDecibels = this.config.minDecibels
		this.analyser.maxDecibels = this.config.maxDecibels

		this.source = this.audioContext.createMediaElementSource(audioElement)
		this.source.connect(this.analyser)
		this.analyser.connect(this.audioContext.destination)

		this.startLoop()
	}

	subscribe(
		callback: (freq: Uint8Array, time: Uint8Array) => void,
	): () => void {
		this.callbacks.add(callback)
		return () => this.callbacks.delete(callback)
	}

	getFrequencyData(): Uint8Array | null {
		if (!this.analyser) return null
		const data = new Uint8Array(this.analyser.frequencyBinCount)
		this.analyser.getByteFrequencyData(data)
		return data
	}

	getTimeData(): Uint8Array | null {
		if (!this.analyser) return null
		const data = new Uint8Array(this.analyser.fftSize)
		this.analyser.getByteTimeDomainData(data)
		return data
	}

	disconnect(): void {
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId)
			this.animationFrameId = null
		}

		if (this.source) {
			this.source.disconnect()
			this.source = null
		}

		if (this.analyser) {
			this.analyser.disconnect()
			this.analyser = null
		}

		if (this.audioContext) {
			this.audioContext.close()
			this.audioContext = null
		}

		this.callbacks.clear()
	}

	private startLoop(): void {
		const loop = () => {
			const freqData = this.getFrequencyData()
			const timeData = this.getTimeData()

			if (freqData && timeData) {
				for (const callback of this.callbacks) {
					callback(freqData, timeData)
				}
			}

			this.animationFrameId = requestAnimationFrame(loop)
		}

		this.animationFrameId = requestAnimationFrame(loop)
	}
}

export function frequencyToBars(data: Uint8Array, barCount: number): number[] {
	const binsPerBar = Math.floor(data.length / barCount)
	const bars: number[] = []

	for (let i = 0; i < barCount; i++) {
		const start = i * binsPerBar
		const end = Math.min(start + binsPerBar, data.length)
		let sum = 0

		for (let j = start; j < end; j++) {
			sum += data[j]
		}

		const avg = sum / (end - start)
		const percentage = (avg / 255) * 100
		bars.push(Math.min(100, Math.max(0, percentage)))
	}

	return bars
}
