import type {SpeakerSegment} from './generation-stages'

export interface TranscriptLine {
	index: number
	speaker: string
	text: string
	startTime: number
	endTime: number
	isBookmarked: boolean
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

export function segmentsToTranscript(
	segments: SpeakerSegment[],
): TranscriptLine[] {
	let currentTime = 0
	return segments.map((segment, index) => {
		const startTime = currentTime
		const duration = estimateSegmentDuration(segment.text)
		const endTime = startTime + duration
		currentTime = endTime
		return {
			index,
			speaker: segment.speaker,
			text: segment.text,
			startTime,
			endTime,
			isBookmarked: false,
		}
	})
}

export function formatSpeakerName(speaker: string): string {
	const names: Record<string, string> = {
		HOST: 'MODERATOR',
		GUEST: 'GAST',
		CALLER: 'ANRUFER',
	}
	return names[speaker] || speaker
}

export function formatTime(seconds: number): string {
	if (!seconds || !isFinite(seconds)) return '00:00'
	const mins = Math.floor(seconds / 60)
	const secs = Math.floor(seconds % 60)
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function findActiveSegment(
	transcript: TranscriptLine[],
	currentTime: number,
): number {
	for (let i = 0; i < transcript.length; i++) {
		if (
			currentTime >= transcript[i].startTime &&
			currentTime < transcript[i].endTime
		) {
			return i
		}
	}
	return transcript.length > 0 ? transcript.length - 1 : -1
}

function estimateSegmentDuration(text: string): number {
	const words = text.trim().split(/\s+/).length
	const wordsPerMinute = 150
	return (words / wordsPerMinute) * 60
}
