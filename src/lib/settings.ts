import {invoke} from '@tauri-apps/api/core'

export interface AppSettings {
	apiKey: string
	apiProvider: 'kilo' | 'opencode' | 'gemini' | 'local' | 'none'
	localModelPath?: string
	defaultVoice: string
	autoPlay: boolean
	playbackSpeed: number
	quality: 'short' | 'normal' | 'long' | 'chill'
	style: 'tech' | 'casual' | 'academic' | 'entertaining' | 'news' | 'podcast'
}

export async function invokeGenerateScript(
	topic: string,
	settings: AppSettings,
	linkContent?: string,
	mode?: 'deeper' | 'similar',
	similarTopic?: string,
): Promise<string> {
	const effectiveTopic =
		mode === 'similar' && similarTopic ? similarTopic : topic

	if (settings.apiProvider === 'local') {
		try {
			return await invoke<string>('generate_script_local', {
				topic: effectiveTopic,
				quality: settings.quality,
				style: settings.style,
				linkContent: linkContent || null,
				mode: mode || null,
			})
		} catch (err) {
			console.error('[Tauri] generate_script_local failed:', err)
			const message = err instanceof Error ? err.message : String(err)
			throw new Error(message || 'Local LLM-Anfrage fehlgeschlagen', {
				cause: err,
			})
		}
	}

	try {
		return (await invoke('generate_script', {
			req: {
				topic: effectiveTopic,
				provider: settings.apiProvider,
				api_key: settings.apiKey,
				link_content: linkContent ?? null,
				quality: settings.quality,
				style: settings.style,
				mode: mode ?? null,
			},
		})) as string
	} catch (err) {
		console.error('[Tauri] generate_script failed:', err)
		const message = err instanceof Error ? err.message : String(err)
		throw new Error(message || 'LLM-Anfrage fehlgeschlagen', {cause: err})
	}
}

const DEFAULT_SETTINGS: AppSettings = {
	apiKey: '',
	apiProvider: 'none',
	defaultVoice: 'de-DE-KillianNeural',
	autoPlay: true,
	playbackSpeed: 1,
	quality: 'normal',
	style: 'tech',
}

export function loadSettings(): AppSettings {
	try {
		const saved = localStorage.getItem('ai-radio-settings')
		if (saved) {
			return {...DEFAULT_SETTINGS, ...JSON.parse(saved)}
		}
	} catch (e) {
		console.error('Failed to load settings:', e)
	}

	const envSettings: Partial<AppSettings> = {}

	if (import.meta.env.VITE_KILO_API_KEY) {
		envSettings.apiKey = import.meta.env.VITE_KILO_API_KEY
		envSettings.apiProvider = 'kilo'
	} else if (import.meta.env.VITE_OPENCODE_API_KEY) {
		envSettings.apiKey = import.meta.env.VITE_OPENCODE_API_KEY
		envSettings.apiProvider = 'opencode'
	} else if (import.meta.env.VITE_GEMINI_API_KEY) {
		envSettings.apiKey = import.meta.env.VITE_GEMINI_API_KEY
		envSettings.apiProvider = 'gemini'
	}

	if (import.meta.env.VITE_DEFAULT_VOICE) {
		envSettings.defaultVoice = import.meta.env.VITE_DEFAULT_VOICE
	}

	return {...DEFAULT_SETTINGS, ...envSettings}
}

export function saveSettings(settings: AppSettings): void {
	localStorage.setItem('ai-radio-settings', JSON.stringify(settings))
}

export function generateScriptFallback(topic: string): string {
	const title = topic.slice(0, 100)
	return `Hallo und willkommen bei AI Radio! Heute geht's um ${title}. Hier ist dein persönlicher Radio-Beitrag. Viel Spaß beim Hören! Übrigens, das war's auch schon wieder für heute. Bis zum nächsten Mal, bleib dran!`
}

export async function suggestRelatedTopic(
	topic: string,
	settings: AppSettings,
): Promise<string> {
	if (
		settings.apiProvider === 'none' ||
		settings.apiProvider === 'local' ||
		!settings.apiKey
	) {
		return ''
	}
	try {
		const result = await invoke('suggest_related_topic', {
			topic,
			provider: settings.apiProvider,
			api_key: settings.apiKey,
		})
		return (result as string) || ''
	} catch (e) {
		console.error('Failed to suggest related topic:', e)
		return ''
	}
}
