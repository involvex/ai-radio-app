const baseUrl = `speech.platform.bing.com/consumer/speech/synthesize/readaloud`
const EDGE_TTS_TOKEN =
	import.meta.env.VITE_EDGE_TTS_TOKEN || '6A5AA1D4EAFF4E9FB37E23D68491D6F4'

function uuid() {
	return crypto.randomUUID().replaceAll('-', '')
}

export type TtsOptions = Partial<{
	voice: string
	volume: string
	rate: string
	pitch: string
}>

function getVoiceLang(voice: string): string {
	if (voice.startsWith('de-')) return 'de-DE'
	if (voice.startsWith('en-')) return 'en-US'
	return 'en-US'
}

export async function ttsWebSpeech(
	text: string,
	options: TtsOptions = {},
): Promise<void> {
	const {voice = 'de-DE-KillianNeural', rate = '+0%', pitch = '+0Hz'} = options

	return new Promise((resolve, reject) => {
		if (!window.speechSynthesis) {
			reject(new Error('SpeechSynthesis not available'))
			return
		}

		window.speechSynthesis.cancel()

		const utterance = new SpeechSynthesisUtterance(text)

		const lang = getVoiceLang(voice)
		utterance.lang = lang

		const rateNum = parseFloat(rate.replace('%', '')) / 100 + 1
		utterance.rate = Math.max(0.1, Math.min(10, rateNum))

		const pitchNum = parseFloat(pitch.replace('Hz', ''))
		utterance.pitch = Math.max(0, Math.min(2, isNaN(pitchNum) ? 1 : pitchNum))

		const voices = window.speechSynthesis.getVoices()
		const matchedVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]))
		if (matchedVoice) {
			utterance.voice = matchedVoice
		}

		utterance.onend = () => resolve()
		utterance.onerror = event =>
			reject(new Error(`Speech synthesis failed: ${event.error}`))

		window.speechSynthesis.speak(utterance)
	})
}

async function ttsEdge(
	text: string,
	options: TtsOptions = {},
): Promise<ArrayBuffer> {
	const {
		voice = 'de-DE-KillianNeural',
		volume = '+0%',
		rate = '+0%',
		pitch = '+0Hz',
	} = options

	const lang = getVoiceLang(voice)
	const wsUrl = `wss://${baseUrl}/edge/v1?TrustedClientToken=${EDGE_TTS_TOKEN}&ConnectionId=${uuid()}`

	return new Promise<ArrayBuffer>((resolve, reject) => {
		let ws: WebSocket
		let closed = false
		const audioData: Uint8Array[] = []

		const cleanup = () => {
			if (ws && ws.readyState === WebSocket.OPEN) {
				ws.close()
			}
		}

		const timeout = setTimeout(() => {
			closed = true
			cleanup()
			reject(new Error('TTS request timeout'))
		}, 30000)

		try {
			ws = new WebSocket(wsUrl)
			ws.binaryType = 'arraybuffer'

			ws.onmessage = event => {
				if (closed) return

				if (typeof event.data === 'string') {
					if (event.data.includes('turn.end')) {
						clearTimeout(timeout)
						closed = true
						cleanup()
					}
					return
				}

				const data = new Uint8Array(event.data as ArrayBuffer)
				const separator = new TextEncoder().encode('Path:audio\r\n')
				const idx = findSequenceIndex(data, separator)

				if (idx !== -1) {
					const audioContent = data.slice(idx + separator.length)
					audioData.push(audioContent)
				}
			}

			ws.onerror = () => {
				clearTimeout(timeout)
				if (!closed) {
					closed = true
					reject(new Error('WebSocket connection failed'))
				}
			}

			ws.onclose = () => {
				clearTimeout(timeout)
				if (closed) return
				closed = true

				if (audioData.length > 0) {
					const totalLength = audioData.reduce(
						(sum, buf) => sum + buf.length,
						0,
					)
					const result = new Uint8Array(totalLength)
					let offset = 0
					for (const buf of audioData) {
						result.set(buf, offset)
						offset += buf.length
					}
					resolve(result.buffer)
				} else {
					reject(new Error('No audio data received'))
				}
			}

			ws.onopen = () => {
				const speechConfig = JSON.stringify({
					context: {
						synthesis: {
							audio: {
								metadataoptions: {
									sentenceBoundaryEnabled: false,
									wordBoundaryEnabled: false,
								},
								outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
							},
						},
					},
				})

				const configMessage = `X-Timestamp:${new Date().toISOString()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n${speechConfig}`
				ws.send(configMessage)

				const ssmlMessage =
					`X-RequestId:${uuid()}\r\nContent-Type:application/ssml+xml\r\n` +
					`X-Timestamp:${new Date().toISOString()}Z\r\nPath:ssml\r\n\r\n` +
					`<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${lang}'>` +
					`<voice name='${voice}'><prosody pitch='${pitch}' rate='${rate}' volume='${volume}'>` +
					`${text}</prosody></voice></speak>`

				ws.send(ssmlMessage)
			}
		} catch (err) {
			clearTimeout(timeout)
			reject(err)
		}
	})
}

export async function tts(
	text: string,
	options: TtsOptions = {},
): Promise<ArrayBuffer> {
	return ttsEdge(text, options)
}

export async function ttsHttpFallback(
	text: string,
	voice: string,
): Promise<Blob> {
	const {invoke} = await import('@tauri-apps/api/core')
	const result = await invoke<number[]>('tts_http_fallback', {
		text,
		voice,
	})
	return new Blob([new Uint8Array(result)], {type: 'audio/mp3'})
}

export async function ttsToBlob(
	text: string,
	options?: TtsOptions,
): Promise<Blob> {
	try {
		const buffer = await ttsEdge(text, options)
		return new Blob([buffer], {type: 'audio/mp3'})
	} catch (edgeError) {
		console.error('Edge TTS failed:', edgeError)
		try {
			const {voice = 'de-DE-KillianNeural'} = options || {}
			return await ttsHttpFallback(text, voice)
		} catch (httpError) {
			console.error('HTTP TTS fallback failed:', httpError)
			if (!window.speechSynthesis) {
				throw new Error(
					`TTS unavailable (Edge: ${
						edgeError instanceof Error ? edgeError.message : 'unknown error'
					}; HTTP: ${
						httpError instanceof Error ? httpError.message : 'unknown error'
					})`,
					{cause: httpError},
				)
			}
			await ttsWebSpeech(text, options)
			return new Blob([], {type: 'audio/mp3'})
		}
	}
}

function findSequenceIndex(data: Uint8Array, sequence: Uint8Array): number {
	for (let i = 0; i <= data.length - sequence.length; i++) {
		let found = true
		for (let j = 0; j < sequence.length; j++) {
			if (data[i + j] !== sequence[j]) {
				found = false
				break
			}
		}
		if (found) return i
	}
	return -1
}

export const VOICES = {
	german: [
		{id: 'de-DE-KillianNeural', name: 'Killian (Male)', gender: 'Male'},
		{id: 'de-DE-ConradNeural', name: 'Conrad (Male)', gender: 'Male'},
		{id: 'de-DE-FreyaNeural', name: 'Freya (Female)', gender: 'Female'},
		{id: 'de-DE-KatjaNeural', name: 'Katja (Female)', gender: 'Female'},
	],
	english: [
		{id: 'en-US-GuyNeural', name: 'Guy (Male)', gender: 'Male'},
		{id: 'en-US-JennyNeural', name: 'Jenny (Female)', gender: 'Female'},
	],
}
