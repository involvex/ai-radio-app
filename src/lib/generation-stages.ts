export type GenerationStage =
	| 'idle'
	| 'researching'
	| 'writing-script'
	| 'generating-speech'
	| 'mixing-audio'
	| 'generating-metadata'
	| 'generating-cover'
	| 'complete'
	| 'error'

export const STAGE_ORDER: GenerationStage[] = [
	'idle',
	'researching',
	'writing-script',
	'generating-speech',
	'mixing-audio',
	'generating-metadata',
	'generating-cover',
	'complete',
]

export const STAGE_LABELS: Record<GenerationStage, string> = {
	idle: 'IDLE',
	researching: 'RESEARCHING',
	'writing-script': 'WRITING SCRIPT',
	'generating-speech': 'GENERATING SPEECH',
	'mixing-audio': 'MIXING AUDIO',
	'generating-metadata': 'GENERATING METADATA',
	'generating-cover': 'GENERATING COVER',
	complete: 'COMPLETE',
	error: 'ERROR',
}

export interface SpeakerSegment {
	speaker: 'HOST' | 'GUEST' | 'CALLER'
	text: string
	voice: string
	effect?: 'telephone' | 'normal'
	startTime?: number
	endTime?: number
}

export interface ParsedScript {
	segments: SpeakerSegment[]
	totalDuration: number
	title: string
	summary: string
}
