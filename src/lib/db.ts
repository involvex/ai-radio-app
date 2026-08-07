import Dexie, {type Table} from 'dexie'

import type {SpeakerSegment} from './generation-stages'

export interface Episode {
	id: string
	title: string
	topic: string
	link?: string
	script: string
	audioBlob?: Blob
	audioUrl?: string
	duration: number
	createdAt: Date
	isFavorite: boolean
	speakerSegments?: SpeakerSegment[]
	coverDataUrl?: string
}

export interface Bookmark {
	id?: number
	episodeId: string
	episodeTitle: string
	segmentIndex: number
	speaker: string
	text: string
	timestamp: number
	createdAt: Date
}

export class AIRadioDB extends Dexie {
	episodes!: Table<Episode>
	bookmarks!: Table<Bookmark>

	constructor() {
		super('ai-radio-db')
		this.version(1).stores({
			episodes: '++id, title, topic, createdAt, isFavorite',
			bookmarks: '++id, episodeId, segmentIndex, timestamp',
		})
	}
}

const db = new AIRadioDB()

export async function saveEpisode(
	episode: Omit<Episode, 'id'>,
): Promise<string> {
	return await db.episodes.add(episode as Episode)
}

export async function getAllEpisodes(): Promise<Episode[]> {
	return await db.episodes.orderBy('createdAt').reverse().toArray()
}

export async function getEpisode(id: string): Promise<Episode | undefined> {
	return await db.episodes.get(id)
}

export async function deleteEpisode(id: string): Promise<void> {
	await db.episodes.delete(id)
}

export async function toggleFavorite(
	id: string,
	isFavorite: boolean,
): Promise<void> {
	await db.episodes.update(id, {isFavorite})
}

export async function updateEpisodeAudio(
	id: string,
	audioBlob: Blob,
	audioUrl: string,
): Promise<void> {
	await db.episodes.update(id, {audioBlob, audioUrl})
}

export async function addBookmark(
	bookmark: Omit<Bookmark, 'id'>,
): Promise<number> {
	return await db.bookmarks.add(bookmark as Bookmark)
}

export async function removeBookmark(
	episodeId: string,
	segmentIndex: number,
): Promise<void> {
	const bookmark = await db.bookmarks.where({episodeId, segmentIndex}).first()
	if (bookmark?.id) {
		await db.bookmarks.delete(bookmark.id)
	}
}

export async function getBookmarks(episodeId?: string): Promise<Bookmark[]> {
	if (episodeId) {
		return await db.bookmarks.where('episodeId').equals(episodeId).toArray()
	}
	return await db.bookmarks.toArray()
}

export async function toggleBookmark(
	bookmark: Omit<Bookmark, 'id'>,
): Promise<void> {
	const existing = await db.bookmarks
		.where({episodeId: bookmark.episodeId, segmentIndex: bookmark.segmentIndex})
		.first()
	if (existing?.id) {
		await db.bookmarks.delete(existing.id)
	} else {
		await db.bookmarks.add(bookmark as Bookmark)
	}
}
