import {FilesetResolver, LlmInference} from '@mediapipe/tasks-genai'

import {
	deleteCachedModel,
	ensureCachedModel,
	getCachedModelBlob,
	getStorageUsage,
	hasCachedModel,
	type DownloadProgress,
} from './model-downloader'
import {checkWebGPU} from './webgpu-check'

const WASM_CDN =
	'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai@latest/wasm'

export const AVAILABLE_MODELS = {
	'gemma-270m-int4': {
		name: 'Gemma 3 270M (Klein & schnell)',
		url: 'https://huggingface.co/litert-community/Gemma3-270M-IT/resolve/main/gemma3-270m-it-int4-web.task',
		filename: 'gemma3-270m-it-int4-web.task',
		sizeBytes: 350_000_000,
		description: 'Kleinster Download, für schwache Geräte',
	},
	'gemma3-1b-int4': {
		name: 'Gemma 3 1B (Empfohlen)',
		url: 'https://huggingface.co/litert-community/Gemma3-1B-IT/resolve/main/gemma3-1b-it-int4-web.task',
		filename: 'gemma3-1b-it-int4-web.task',
		sizeBytes: 700_000_000,
		description: 'Schnell, gut für Deutsch',
	},
	'gemma3-1b-int8': {
		name: 'Gemma 3 1B (Hohe Qualität)',
		url: 'https://huggingface.co/litert-community/Gemma3-1B-IT/resolve/main/gemma3-1b-it-int8-web.task',
		filename: 'gemma3-1b-it-int8-web.task',
		sizeBytes: 1_000_000_000,
		description: 'Bessere Qualität, größerer Download',
	},
} as const

export type ModelKey = keyof typeof AVAILABLE_MODELS

let llmInference: LlmInference | null = null
let currentModelKey = ''
let filesetPromise: ReturnType<typeof FilesetResolver.forGenAiTasks> | null =
	null

/** Singleton WASM runtime — reuses CDN fileset across loads (prewarmable). */
export function preloadWasm(): Promise<unknown> {
	if (!filesetPromise) {
		filesetPromise = FilesetResolver.forGenAiTasks(WASM_CDN)
	}
	return filesetPromise
}

/** Single source of truth for WebGPU (deduped, re-exported for compat). */
export async function checkWebGPUAvailability(): Promise<{
	supported: boolean
	reason?: string
}> {
	return checkWebGPU()
}

function buildSystemPrompt(quality: string, style: string): string {
	const durationHint = matchQuality(quality)
	const wordBudget = wordCountForQuality(quality)
	const styleIntro = matchStyle(style)
	const dialogueHint =
		style === 'podcast' || style === 'entertaining' || style === 'casual'
			? '\n- Format als Dialog: abwechselnd "HOST: ..." und "GUEST: ..." Zeilen (je 1-2 Sätze). Mindestens 3 Sprecherwechsel.'
			: '\n- Format: ein Sprecher ("HOST: ..." pro Absatz). Nur bei Interviews zusätzlich "GUEST: ..." nutzen.'

	return `${styleIntro} Du verwandelst den bereitgestellten Text in einen kurzen, extrem leicht verständlichen Radio-Beitrag (${durationHint}, max. ${wordBudget} Wörter).
- Aufbau: Hook (1 Satz, Neugier wecken) → 2-3 kurze Kapitel → Outro mit Frage an die Hörer ("Was meinst du dazu?").
- Nutze kurze Sätze. Keine Schachtelsätze.${dialogueHint}
- Antworte ausschließlich mit dem reinen Sprechtext. Keine Markdown-Formatierung, keine Aufzählungszeichen, keine URLs.`
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

function inferenceParamsForQuality(quality: string): {
	maxTokens: number
	temperature: number
	topK: number
} {
	switch (quality) {
		case 'short':
			return {maxTokens: 200, temperature: 0.9, topK: 40}
		case 'long':
			return {maxTokens: 800, temperature: 0.7, topK: 40}
		case 'chill':
			return {maxTokens: 1000, temperature: 0.6, topK: 40}
		default:
			return {maxTokens: 500, temperature: 0.8, topK: 40}
	}
}

function maxTokensForQuality(quality: string): number {
	return inferenceParamsForQuality(quality).maxTokens
}

/** Word budget for the spoken script (keeps small on-device models on track). */
export function wordCountForQuality(quality: string): number {
	switch (quality) {
		case 'short':
			return 60
		case 'long':
			return 350
		case 'chill':
			return 450
		default:
			return 180
	}
}

/**
 * Cleanup pass so EdgeTTS / Web Speech don't spell out markdown, URLs or
 * abbreviations. Applied to every local-LLM script before playback.
 */
export function sanitizeForTts(input: string): string {
	let text = input
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`([^`]*)`/g, '$1')
		.replace(/^#{1,6}\s*/gm, '')
		.replace(/\*\*([^*]+)\*\*/g, '$1')
		.replace(/(^|\W)\*([^*\n]+)\*/g, '$1$2')
		.replace(/!?\[[^\]]*\]\(([^)]*)\)/g, ' ')
		.replace(/https?:\/\/\S+/g, ' ')
		.replace(/^\s*[-*•\d]+[.)]\s+/gm, '')
		.replace(/^>\s?/gm, '')
	text = text
		.replace(/\bz\.?\s*B\.?\b/gi, 'zum Beispiel')
		.replace(/\bca\.?\b/gi, 'circa')
		.replace(/\binkl\.?\b/gi, 'inklusive')
		.replace(/\betc\.?\b/gi, 'und so weiter')
		.replace(/\busw\.?\b/gi, 'und so weiter')
		.replace(/\bbzw\.?\b/gi, 'beziehungsweise')
		.replace(/\bd\.?\s*h\.?\b/gi, 'das heißt')
		.replace(/&/g, 'und')
	text = text.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n')
	text = text.replace(/ +/g, ' ')
	return text.trim()
}

/** Truncate to the word budget at a sentence boundary when possible. */
export function enforceWordBudget(text: string, quality: string): string {
	const budget = wordCountForQuality(quality)
	const words = text.split(/\s+/)
	if (words.length <= budget) return text
	const sliced = words.slice(0, budget).join(' ')
	const lastStop = Math.max(
		sliced.lastIndexOf('.'),
		sliced.lastIndexOf('!'),
		sliced.lastIndexOf('?'),
	)
	if (lastStop > sliced.length * 0.5) {
		return sliced.slice(0, lastStop + 1)
	}
	return `${sliced}…`
}

const TASK_HELP_URL = 'https://huggingface.co/litert-community/Gemma3-1B-IT'

/** Shared filename check for the picker + URL import. */
export function validateTaskFileName(name: string): void {
	const lower = name.toLowerCase()
	if (lower.endsWith('.task')) return
	if (lower.endsWith('.litertlm')) {
		throw new Error(
			`.litertlm wird im WebView nicht unterstützt (nur Android-nativ). Bitte eine .task Datei nutzen, z.B. von ${TASK_HELP_URL} (Datei *-web.task).`,
		)
	}
	if (
		lower.endsWith('.gguf') ||
		lower.endsWith('.bin') ||
		lower.endsWith('.onnx')
	) {
		throw new Error(
			`"${name}" ist kein MediaPipe .task Modell (.gguf/.bin/.onnx laufen nur am Desktop-Sidecar). Bitte eine *-web.task Datei wählen: ${TASK_HELP_URL}`,
		)
	}
	throw new Error(
		`"${name}" ist keine .task Modelldatei. Bitte eine Datei mit Endung .task wählen (z.B. gemma3-1b-it-int4-web.task): ${TASK_HELP_URL}`,
	)
}

function fileNameFromUrl(url: string): string {
	try {
		const path = new URL(url).pathname
		const last = path.split('/').filter(Boolean).pop() ?? 'custom.task'
		return decodeURIComponent(last)
	} catch {
		return 'custom.task'
	}
}

/** Load a user-provided .task URL (paste-import) with cache + validation. */
export async function loadModelFromCustomUrl(
	url: string,
	options: LoadModelOptions = {},
): Promise<string> {
	const trimmed = url.trim()
	if (!/^https:\/\//i.test(trimmed)) {
		throw new Error('Bitte eine https URL zu einer .task Datei einfügen.')
	}
	const filename = fileNameFromUrl(trimmed)
	validateTaskFileName(filename)

	await unloadModel()
	options.onStage?.('wasm')
	await preloadWasm()
	options.onStage?.('download')
	const cacheKey = `custom:${filename}`
	const blob = await ensureCachedModel(cacheKey, trimmed, filename, {
		signal: options.signal,
		onProgress: options.onDownloadProgress,
	})
	options.onStage?.('init')
	llmInference = await createInferenceFromBlob(
		blob,
		options.quality ?? 'normal',
	)
	currentModelKey = cacheKey
	options.onStage?.('ready')
	return cacheKey
}

function buildGemmaPrompt(systemPrompt: string, userPrompt: string): string {
	return `<start_of_turn>user\n${systemPrompt}\n\n${userPrompt}<end_of_turn>\n<start_of_turn>model\n`
}

async function createInferenceFromBlob(
	blob: Blob,
	quality: string,
): Promise<LlmInference> {
	const genai = await preloadWasm()
	const params = inferenceParamsForQuality(quality)
	// MediaPipe accepts a ReadableStream reader as modelAssetBuffer.
	const stream = blob.stream() as unknown as ReadableStream<Uint8Array>
	const reader =
		stream.getReader() as unknown as ReadableStreamDefaultReader<Uint8Array>
	return LlmInference.createFromOptions(genai as never, {
		baseOptions: {
			modelAssetBuffer: reader as never,
		},
		maxTokens: params.maxTokens,
		topK: params.topK,
		temperature: params.temperature,
		randomSeed: 42,
	})
}

export interface LoadModelOptions {
	/** Quality preset used for maxTokens/temperature at load time. */
	quality?: string
	signal?: AbortSignal
	onDownloadProgress?: (p: DownloadProgress) => void
	onStage?: (stage: 'wasm' | 'download' | 'init' | 'ready') => void
}

/** Load with persistent cache: CacheStorage first, resumable download otherwise. */
export async function loadModelFromCacheOrUrl(
	modelKey: ModelKey,
	options: LoadModelOptions = {},
): Promise<void> {
	if (llmInference && currentModelKey === modelKey) {
		return
	}
	await unloadModel()

	const model = AVAILABLE_MODELS[modelKey]
	options.onStage?.('wasm')
	await preloadWasm()

	options.onStage?.('download')
	const blob = await ensureCachedModel(modelKey, model.url, model.filename, {
		expectedSize: model.sizeBytes,
		signal: options.signal,
		onProgress: options.onDownloadProgress,
	})

	options.onStage?.('init')
	llmInference = await createInferenceFromBlob(
		blob,
		options.quality ?? 'normal',
	)
	currentModelKey = modelKey
	options.onStage?.('ready')
}

/** Backward-compatible wrapper (percent-only callback). */
export async function loadModelFromUrl(
	modelKey: ModelKey,
	onProgress?: (progress: number) => void,
): Promise<void> {
	await loadModelFromCacheOrUrl(modelKey, {
		onDownloadProgress: p => onProgress?.(Math.round(p.percent)),
	})
}

export async function loadModelFromFile(
	file: File,
	onProgress?: (progress: number) => void,
): Promise<void> {
	validateTaskFileName(file.name)

	await unloadModel()
	onProgress?.(0)
	await preloadWasm()
	onProgress?.(10)

	// Persist picked file to cache so reloads work offline.
	const blob = new Blob([await file.arrayBuffer()], {
		type: 'application/octet-stream',
	})
	const cacheKey = `file:${file.name}`
	await ensureCachedModelFromBlob(cacheKey, blob)

	llmInference = await createInferenceFromBlob(blob, 'normal')
	currentModelKey = cacheKey
	onProgress?.(100)
}

async function ensureCachedModelFromBlob(
	cacheKey: string,
	blob: Blob,
): Promise<void> {
	const {storeModelBlob} = await import('./model-downloader')
	await storeModelBlob(cacheKey, blob)
}

export async function generateScript(params: {
	topic: string
	quality: string
	style: string
	linkContent?: string
	mode?: string
	onToken?: (partial: string) => void
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

	// Prefer streaming when supported so the UI stays responsive.
	let response = ''
	try {
		const maybeStream = (
			llmInference as unknown as {
				generateResponseStreaming?: (
					prompt: string,
					cb: (partial: string, done: boolean) => void,
				) => Promise<string | void>
			}
		).generateResponseStreaming
		if (maybeStream && params.onToken) {
			const result = await maybeStream.call(
				llmInference,
				prompt,
				(partial, _done) => {
					response = partial
					params.onToken?.(partial)
				},
			)
			if (typeof result === 'string' && result.length > 0) {
				response = result
			}
		} else {
			response = await llmInference.generateResponse(prompt)
			params.onToken?.(response)
		}
	} catch {
		response = await llmInference.generateResponse(prompt)
	}

	if (!response || response.length === 0) {
		throw new Error('Leere Antwort vom lokalen Modell')
	}

	let text = sanitizeForTts(response.trim())
	text = enforceWordBudget(text, params.quality)
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

export async function isModelCached(modelKey: string): Promise<boolean> {
	return hasCachedModel(modelKey)
}

export async function deleteModelCache(modelKey: string): Promise<void> {
	await deleteCachedModel(modelKey)
	if (currentModelKey === modelKey) {
		await unloadModel()
	}
}

export async function getModelCacheBlob(
	modelKey: string,
): Promise<Blob | null> {
	return getCachedModelBlob(modelKey)
}

export async function getModelStorageUsage(): Promise<{
	usage: number
	quota: number
}> {
	return getStorageUsage()
}
