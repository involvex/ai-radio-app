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

export async function startLocalLLM(modelPath: string): Promise<string> {
	return invoke<string>('start_local_llm', {modelPath})
}

export async function stopLocalLLM(): Promise<void> {
	return invoke('stop_local_llm')
}

export async function generateScriptLocal(params: {
	topic: string
	quality: string
	style: string
	linkContent?: string
	mode?: string
}): Promise<string> {
	return invoke<string>('generate_script_local', {
		topic: params.topic,
		quality: params.quality,
		style: params.style,
		linkContent: params.linkContent ?? null,
		mode: params.mode ?? null,
	})
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

// HuggingFace model URLs for easy access
export const AVAILABLE_MODELS = {
	'gemma-3-1b': {
		name: 'Gemma 3 1B (Recommended)',
		url: 'https://huggingface.co/unsloth/gemma-3-1b-it-GGUF/resolve/main/gemma-3-1b-it-Q4_K_M.gguf',
		filename: 'gemma-3-1b-it-Q4_K_M.gguf',
		sizeBytes: 808_000_000,
		description: 'Good German quality, ~2GB RAM required',
	},
	'qwen3-1.7b': {
		name: 'Qwen3 1.7B',
		url: 'https://huggingface.co/unsloth/Qwen3-1.7B-GGUF/resolve/main/Qwen3-1.7B-Q4_K_M.gguf',
		filename: 'Qwen3-1.7B-Q4_K_M.gguf',
		sizeBytes: 1_000_000_000,
		description: 'Strong multilingual, ~2GB RAM required',
	},
	'llama-3.2-3b': {
		name: 'Llama 3.2 3B',
		url: 'https://huggingface.co/unsloth/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf',
		filename: 'Llama-3.2-3B-Instruct-Q4_K_M.gguf',
		sizeBytes: 2_000_000_000,
		description: 'Highest quality, ~4GB RAM required',
	},
} as const
