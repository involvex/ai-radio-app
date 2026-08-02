import {FilesetResolver, LlmInference} from '@mediapipe/tasks-genai'

const WASM_CDN =
	'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai@latest/wasm'

export const AVAILABLE_MODELS = {
	'gemma3-1b-int4': {
		name: 'Gemma 3 1B (Empfohlen)',
		url: 'https://huggingface.co/litert-community/Gemma3-1B-IT/resolve/main/gemma3-1b-it-int4-web.task',
		sizeBytes: 700_000_000,
		description: 'Schnell, gut für Deutsch',
	},
	'gemma3-1b-int8': {
		name: 'Gemma 3 1B (Hohe Qualität)',
		url: 'https://huggingface.co/litert-community/Gemma3-1B-IT/resolve/main/gemma3-1b-it-int8-web.task',
		sizeBytes: 1_000_000_000,
		description: 'Bessere Qualität, größerer Download',
	},
} as const

export type ModelKey = keyof typeof AVAILABLE_MODELS

let llmInference: LlmInference | null = null
let currentModelKey = ''

export async function checkWebGPUAvailability(): Promise<{
	supported: boolean
	reason?: string
}> {
	if (!navigator.gpu) {
		return {supported: false, reason: 'WebGPU nicht verfügbar'}
	}
	try {
		const adapter = await navigator.gpu.requestAdapter()
		if (!adapter) {
			return {supported: false, reason: 'Kein GPU-Adapter'}
		}
		return {supported: true}
	} catch (e) {
		return {
			supported: false,
			reason: `WebGPU-Check fehlgeschlagen: ${e instanceof Error ? e.message : String(e)}`,
		}
	}
}

function buildSystemPrompt(quality: string, style: string): string {
	const durationHint = matchQuality(quality)
	const styleIntro = matchStyle(style)

	return `${styleIntro} Du verwandelst den bereitgestellten Text in einen kurzen, extrem leicht verständlichen Radio-Beitrag (${durationHint}).
- Nutze kurze Sätze. Keine Schachtelsätze.
- Verwende rhetorische Fragen und lockere Überleitungen ("Übrigens...", "Schon gewusst?").
- Antworte ausschließlich mit dem reinen Sprechtext. Keine Markdown-Formatierung.`
}

function matchQuality(quality: string): string {
	switch (quality) {
		case 'short':
			return 'maximal 30 Sekunden Sprechzeit'
		case 'long':
			return 'maximal 3 Minuten Sprechzeit'
		case 'chill':
			return 'entspannt und ausführlich, bis zu 4 Minuten Sprechzeit'
		default:
			return 'maximal 90 Sekunden Sprechzeit'
	}
}

function matchStyle(style: string): string {
	switch (style) {
		case 'casual':
			return 'Du sprichst wie mit einem guten Freund. Locker, umgangssprachlich, mit Humor und Alltagsbeispielen.'
		case 'academic':
			return 'Du bist ein erfahrener Dozent und Erklärer. Strukturiert, faktenbasiert, mit klaren Zusammenhängen.'
		case 'entertaining':
			return 'Du bist ein unterhaltsamer Erzähler und Entertainer. Nutze Humor, überraschende Fakten, Storytelling.'
		case 'news':
			return 'Du bist ein erfahrener Nachrichtensprecher. Sachlich, prägnant, informativ.'
		case 'podcast':
			return 'Du bist ein erfahrener Podcast-Host. Persönlich, nahbar, mit eigenen Anekdoten.'
		default:
			return 'Du bist ein erfahrener Radio-Moderator für ein Tech- und Infotainment-Radio.'
	}
}

function maxTokensForQuality(quality: string): number {
	switch (quality) {
		case 'short':
			return 200
		case 'long':
			return 800
		case 'chill':
			return 1000
		default:
			return 500
	}
}

function buildGemmaPrompt(systemPrompt: string, userPrompt: string): string {
	return `<start_of_turn>user\n${systemPrompt}\n\n${userPrompt}<end_of_turn>\n<start_of_turn>model\n`
}

export async function loadModelFromUrl(
	modelKey: ModelKey,
	onProgress?: (progress: number) => void,
): Promise<void> {
	if (llmInference && currentModelKey === modelKey) {
		return
	}

	await unloadModel()

	const model = AVAILABLE_MODELS[modelKey]
	onProgress?.(0)

	const genai = await FilesetResolver.forGenAiTasks(WASM_CDN)

	onProgress?.(10)

	const maxTokens = 1000
	const topK = 40
	const temperature = 0.8
	const randomSeed = 42

	llmInference = await LlmInference.createFromOptions(genai, {
		baseOptions: {
			modelAssetPath: model.url,
		},
		maxTokens,
		topK,
		temperature,
		randomSeed,
	})

	currentModelKey = modelKey
	onProgress?.(100)
}

export async function loadModelFromFile(
	file: File,
	onProgress?: (progress: number) => void,
): Promise<void> {
	if (file.name.endsWith('.litertlm')) {
		throw new Error(
			'.litertlm Dateien sind nur für Android Native kompatibel. Bitte verwende eine .task Datei (z.B. gemma3-1b-it-int4-web.task).',
		)
	}

	await unloadModel()

	onProgress?.(0)

	const genai = await FilesetResolver.forGenAiTasks(WASM_CDN)

	onProgress?.(10)

	const stream = file.stream().getReader()

	llmInference = await LlmInference.createFromOptions(genai, {
		baseOptions: {
			modelAssetBuffer: stream,
		},
		maxTokens: 1000,
		topK: 40,
		temperature: 0.8,
		randomSeed: 42,
	})

	currentModelKey = `file:${file.name}`
	onProgress?.(100)
}

export async function generateScript(params: {
	topic: string
	quality: string
	style: string
	linkContent?: string
	mode?: string
}): Promise<string> {
	if (!llmInference) {
		throw new Error('Kein Modell geladen. Bitte zuerst ein Modell laden.')
	}

	const systemPrompt = buildSystemPrompt(params.quality, params.style)

	let userPrompt: string
	if (params.mode === 'deeper') {
		userPrompt = `Gehe vertieft auf das Thema ein. Erzähle mehr Hintergründe, Details, Zusammenhänge und interessante Fakten.\n\nVerwandle das in ein Radioskript:\n\n${params.topic}`
	} else {
		userPrompt = `Verwandle das in ein Radioskript:\n\n${params.topic}`
	}

	if (params.linkContent) {
		userPrompt += `\n\nQuelltext (URL-Inhalt):\n${params.linkContent}`
	}

	const prompt = buildGemmaPrompt(systemPrompt, userPrompt)

	const maxTokens = maxTokensForQuality(params.quality)

	const response = await llmInference.generateResponse(prompt)

	if (!response || response.length === 0) {
		throw new Error('Leere Antwort vom lokalen Modell')
	}

	let text = response.trim()
	if (text.length > maxTokens * 4) {
		text = text.slice(0, maxTokens * 4)
	}

	return text
}

export async function unloadModel(): Promise<void> {
	if (llmInference) {
		llmInference.close()
		llmInference = null
		currentModelKey = ''
	}
}

export function isModelReady(): boolean {
	return llmInference !== null
}

export function getCurrentModelKey(): string {
	return currentModelKey
}
