import * as webllm from '@mlc-ai/web-llm'

let engine: webllm.MLCEngineInterface | null = null
let modelPath: string = ''
let modelLoaded = false
let loadingPromise: Promise<void> | null = null

export interface LocalModelConfig {
	modelPath: string
	modelName: string
}

export async function initLocalModel(config: LocalModelConfig): Promise<void> {
	if (modelLoaded && engine && modelPath === config.modelPath) {
		return
	}

	if (loadingPromise) {
		await loadingPromise
		return
	}

	loadingPromise = (async () => {
		try {
			console.log('[LocalModel] Loading model from:', config.modelPath)
			engine = await webllm.CreateMLCEngine(config.modelPath, {
				initProgressCallback: progress => {
					console.log('[LocalModel] Loading:', progress.progress, progress.text)
				},
			})
			modelPath = config.modelPath
			modelLoaded = true
			console.log('[LocalModel] Model loaded successfully')
		} catch (err) {
			console.error('[LocalModel] Failed to load model:', err)
			engine = null
			modelLoaded = false
			throw err
		} finally {
			loadingPromise = null
		}
	})()

	await loadingPromise
}

export async function generateScriptLocal(
	topic: string,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_modelPath?: string,
): Promise<string> {
	if (!modelLoaded || !engine) {
		throw new Error('Local model not loaded. Call initLocalModel first.')
	}

	const systemPrompt = `Du bist ein erfahrener Radio-Moderator für ein Tech- und Infotainment-Radio. Deine Aufgabe ist es, den bereitgestellten Text in einen kurzen, extrem leicht verständlichen Radio-Beitrag (maximal 90 Sekunden Sprechzeit) umzuwandeln.
- Nutze kurze Sätze. Keine Schachtelsätze.
- Verwende rhetorische Fragen und lockere Überleitungen ("Übrigens...", "Schon gewusst?").
- Antworte ausschließlich mit dem reinen Sprechtext. Keine Markdown-Formatierung.`

	const userPrompt = `Verwandle das in ein Radioskript:\n\n${topic}`

	try {
		const response = await engine.chat.completions.create({
			messages: [
				{role: 'system', content: systemPrompt},
				{role: 'user', content: userPrompt},
			],
			max_tokens: 500,
			temperature: 0.8,
		})

		const text = response.choices[0]?.message?.content
		if (!text) {
			throw new Error('No response from model')
		}
		return text.trim()
	} catch (err) {
		console.error('[LocalModel] Inference failed:', err)
		throw err
	}
}

export function isModelLoaded(): boolean {
	return modelLoaded
}

export async function unloadModel(): Promise<void> {
	if (engine) {
		await engine.unload()
		engine = null
		modelLoaded = false
		modelPath = ''
	}
}
