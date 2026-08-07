import type {SpeakerSegment} from './generation-stages'
import type {Episode} from './db'

export interface ShowNotes {
	show_title: string
	show_duration: string
	two_sentence_summary: string
	date_of_generation: string
	timecoded_transcript: Array<{
		speaker: string
		start_time: string
		end_time: string
		text: string
	}>
}

export async function createShowZip(
	episode: Episode & {
		coverDataUrl?: string
		speakerSegments?: SpeakerSegment[]
	},
	coverDataUrl?: string,
): Promise<Blob> {
	const JSZip = (await import('jszip')).default
	const zip = new JSZip()

	const audioBlob = await fetchBlob(episode.audioUrl!)
	zip.file('ai_radio.mp3', audioBlob)

	const coverUrl = coverDataUrl || episode.coverDataUrl
	if (coverUrl) {
		const coverBlob = await fetchBlob(coverUrl)
		zip.file('cover.png', coverBlob)
	}

	const showNotes = generateShowNotes(episode)
	zip.file('show_notes.json', JSON.stringify(showNotes, null, 2))

	return zip.generateAsync({
		type: 'blob',
		compression: 'DEFLATE',
		compressionOptions: {level: 6},
	})
}

export async function fetchBlob(url: string): Promise<Blob> {
	if (url.startsWith('data:')) {
		const response = await fetch(url)
		return response.blob()
	}
	if (url.startsWith('blob:')) {
		const response = await fetch(url)
		return response.blob()
	}
	const response = await fetch(url)
	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
	}
	return response.blob()
}

export function generateShowNotes(
	episode: Episode & {speakerSegments?: SpeakerSegment[]},
): ShowNotes {
	const segments = episode.speakerSegments || []
	let currentTime = 0

	const timecodedTranscript = segments.map(segment => {
		const startTime = currentTime
		const duration = estimateSegmentDuration(segment.text)
		const endTime = startTime + duration
		currentTime = endTime

		return {
			speaker: formatSpeakerName(segment.speaker),
			start_time: formatTimecode(startTime),
			end_time: formatTimecode(endTime),
			text: segment.text,
		}
	})

	const totalDuration = currentTime
	const title = episode.title
	const summary =
		episode.script.slice(0, 200).trim() +
		(episode.script.length > 200 ? '...' : '')

	return {
		show_title: title,
		show_duration: formatTimecode(totalDuration),
		two_sentence_summary: summary,
		date_of_generation: new Date(episode.createdAt).toISOString().split('T')[0],
		timecoded_transcript: timecodedTranscript,
	}
}

export function formatSpeakerName(speaker: string): string {
	const names: Record<string, string> = {
		HOST: 'MODERATOR',
		GUEST: 'GAST',
		CALLER: 'ANRUFER',
	}
	return names[speaker] || speaker
}

export function formatTimecode(seconds: number): string {
	if (!seconds || !isFinite(seconds)) return '00:00'
	const mins = Math.floor(seconds / 60)
	const secs = Math.floor(seconds % 60)
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function downloadZip(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = filename
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
	URL.revokeObjectURL(url)
}

function estimateSegmentDuration(text: string): number {
	const words = text.trim().split(/\s+/).length
	const wordsPerMinute = 150
	return (words / wordsPerMinute) * 60
}
