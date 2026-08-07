import {invoke} from '@tauri-apps/api/core'

export const SETTINGS_VERSION = 2

export interface AppSettings {
	apiKey: string
	apiProvider: 'kilo' | 'opencode' | 'gemini' | 'local' | 'none'
	localModelPath?: string
	localModelKey?: string
	defaultVoice: string
	autoPlay: boolean
	playbackSpeed: number
	quality: 'short' | 'normal' | 'long' | 'chill'
	style: 'tech' | 'casual' | 'academic' | 'entertaining' | 'news' | 'podcast'
	visualizerStyle: 'bars' | 'wave' | 'dots'
	quotaEnabled: boolean
	autoSaveCovers: boolean
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
		const isAndroid = /android/i.test(navigator.userAgent)
		if (isAndroid) {
			const {generateScript} = await import('./litert-lm')
			return generateScript({
				topic: effectiveTopic,
				quality: settings.quality,
				style: settings.style,
				linkContent: linkContent || undefined,
				mode: mode || undefined,
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
	visualizerStyle: 'bars',
	quotaEnabled: true,
	autoSaveCovers: true,
}

export function migrateSettings(
	oldSettings: Partial<AppSettings>,
	oldVersion: number,
): AppSettings {
	const migrated = {...DEFAULT_SETTINGS, ...oldSettings} as AppSettings

	if (oldVersion < 2) {
		migrated.visualizerStyle =
			oldSettings.visualizerStyle ?? DEFAULT_SETTINGS.visualizerStyle
		migrated.quotaEnabled =
			oldSettings.quotaEnabled ?? DEFAULT_SETTINGS.quotaEnabled
		migrated.autoSaveCovers =
			oldSettings.autoSaveCovers ?? DEFAULT_SETTINGS.autoSaveCovers
	}

	return migrated
}

export function loadSettings(): AppSettings {
	try {
		const saved = localStorage.getItem('ai-radio-settings')
		const versionStr = localStorage.getItem('ai-radio-settings-version')
		const savedVersion = versionStr ? parseInt(versionStr, 10) : 1

		if (saved) {
			const loaded = JSON.parse(saved)
			if (savedVersion < SETTINGS_VERSION) {
				const migrated = migrateSettings(loaded, savedVersion)
				saveSettings(migrated)
				localStorage.setItem(
					'ai-radio-settings-version',
					String(SETTINGS_VERSION),
				)
				return migrated
			}
			return {...DEFAULT_SETTINGS, ...loaded}
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
	localStorage.setItem('ai-radio-settings-version', String(SETTINGS_VERSION))
}

export function exportSettings(): string {
	const saved = localStorage.getItem('ai-radio-settings')
	const version = localStorage.getItem('ai-radio-settings-version')
	const data = {
		settings: saved ? JSON.parse(saved) : DEFAULT_SETTINGS,
		version: version ? parseInt(version, 10) : SETTINGS_VERSION,
		exportedAt: new Date().toISOString(),
	}
	return JSON.stringify(data, null, 2)
}

export function importSettings(jsonString: string): boolean {
	try {
		const data = JSON.parse(jsonString)
		if (!data.settings || typeof data.settings !== 'object') {
			return false
		}
		const migrated = migrateSettings(data.settings, data.version || 1)
		saveSettings(migrated)
		return true
	} catch {
		return false
	}
}

export function resetSettings(): void {
	localStorage.removeItem('ai-radio-settings')
	localStorage.removeItem('ai-radio-settings-version')
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
