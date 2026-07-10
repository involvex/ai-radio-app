import {loadSettings, type AppSettings, saveSettings} from './settings'
import {getAllEpisodes, type Episode, saveEpisode} from './db'

export interface SyncData {
	version: number
	exportedAt: string
	deviceId: string
	settings: AppSettings
	episodes: Omit<Episode, 'audioBlob'>[]
}

function generateDeviceId(): string {
	let id = localStorage.getItem('ai-radio-device-id')
	if (!id) {
		id = `device-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
		localStorage.setItem('ai-radio-device-id', id)
	}
	return id
}

export async function exportData(): Promise<SyncData> {
	const episodes = await getAllEpisodes()
	const episodesWithoutAudio = episodes.map(ep => ({
		...ep,
		audioUrl: undefined,
		audioBlob: undefined,
	}))

	return {
		version: 1,
		exportedAt: new Date().toISOString(),
		deviceId: generateDeviceId(),
		settings: loadSettings(),
		episodes: episodesWithoutAudio as Omit<Episode, 'audioBlob'>[],
	}
}

export function downloadSyncFile(data: SyncData): void {
	const json = JSON.stringify(data, null, 2)
	const blob = new Blob([json], {type: 'application/json'})
	const url = URL.createObjectURL(blob)

	const a = document.createElement('a')
	a.href = url
	a.download = `ai-radio-backup-${new Date().toISOString().slice(0, 10)}.json`
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
	URL.revokeObjectURL(url)
}

export async function importData(file: File): Promise<{
	settingsImported: boolean
	episodesImported: number
}> {
	const text = await file.text()
	const data = JSON.parse(text) as SyncData

	if (!data.version || !data.episodes || !data.settings) {
		throw new Error('Invalid sync file format')
	}

	let settingsImported = false
	let episodesImported = 0

	if (data.settings) {
		saveSettings(data.settings)
		settingsImported = true
	}

	if (data.episodes && Array.isArray(data.episodes)) {
		for (const ep of data.episodes) {
			const existing = await getAllEpisodes()
			const duplicate = existing.find(
				e =>
					e.title === ep.title &&
					e.topic === ep.topic &&
					e.createdAt.getTime() === new Date(ep.createdAt).getTime(),
			)

			if (!duplicate) {
				await saveEpisode({
					title: ep.title,
					topic: ep.topic,
					link: ep.link,
					script: ep.script,
					audioBlob: undefined,
					audioUrl: undefined,
					duration: ep.duration,
					createdAt: new Date(ep.createdAt),
					isFavorite: ep.isFavorite,
				})
				episodesImported++
			}
		}
	}

	return {settingsImported, episodesImported}
}
