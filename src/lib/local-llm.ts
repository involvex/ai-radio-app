import {listen} from '@tauri-apps/api/event'
import {invoke} from '@tauri-apps/api/core'

export interface LocalModel {
	name: string
	filename: string
	path: string
	size_bytes: number
	downloaded: boolean
}

export interface DownloadProgress {
	filename: string
	downloaded: number
	total: number
}

export async function generateScriptLocal(params: {
	topic: string
	quality: string
	style: string
	linkContent?: string
	mode?: string
}): Promise<string> {
	const isAndroid = /android/i.test(navigator.userAgent)
	if (isAndroid) {
		const {generateScript} = await import('./litert-lm')
		return generateScript(params)
	}
	return invoke<string>('generate_script_local', {
		topic: params.topic,
		quality: params.quality,
		style: params.style,
		linkContent: params.linkContent ?? null,
		mode: params.mode ?? null,
	})
}

export async function startLocalLLM(modelPath: string): Promise<string> {
	return invoke<string>('start_local_llm', {modelPath})
}

export async function stopLocalLLM(): Promise<void> {
	return invoke('stop_local_llm')
}

export async function listLocalModels(): Promise<LocalModel[]> {
	return invoke<LocalModel[]>('list_local_models')
}

export async function downloadModel(
	url: string,
	filename: string,
): Promise<string> {
	return invoke<string>('download_model', {url, filename})
}

export async function deleteModel(filename: string): Promise<void> {
	return invoke('delete_model', {filename})
}

export async function pickModelFile(): Promise<string | null> {
	return invoke<string | null>('pick_model_file')
}

export function onDownloadProgress(
	callback: (progress: DownloadProgress) => void,
) {
	return listen<DownloadProgress>('model-download-progress', event => {
		callback(event.payload)
	})
}

export function onLocalLLMReady(callback: () => void) {
	return listen('local-llm-ready', () => callback())
}

export function onLocalLLMError(callback: (error: string) => void) {
	return listen<string>('local-llm-error', event => {
		callback(event.payload)
	})
}
