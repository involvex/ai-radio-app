export interface QuotaConfig {
	dailyGenerations: number
	dailyCharacters: number
	dailyAudioMinutes: number
}

export interface UsageStats {
	date: string
	generations: number
	characters: number
	audioMinutes: number
	lastReset: string
}

export const DEFAULT_QUOTA: QuotaConfig = {
	dailyGenerations: 50,
	dailyCharacters: 100000,
	dailyAudioMinutes: 120,
}

const STORAGE_KEY = 'ai-radio-quota-usage'

function getTodayString(): string {
	return new Date().toISOString().split('T')[0]
}

function getDefaultUsage(): UsageStats {
	return {
		date: getTodayString(),
		generations: 0,
		characters: 0,
		audioMinutes: 0,
		lastReset: new Date().toISOString(),
	}
}

export function getUsage(): UsageStats {
	try {
		const stored = localStorage.getItem(STORAGE_KEY)
		if (!stored) {
			const defaultUsage = getDefaultUsage()
			saveUsage(defaultUsage)
			return defaultUsage
		}

		const stats: UsageStats = JSON.parse(stored)
		const today = getTodayString()

		if (stats.date !== today) {
			const resetStats: UsageStats = {
				date: today,
				generations: 0,
				characters: 0,
				audioMinutes: 0,
				lastReset: new Date().toISOString(),
			}
			saveUsage(resetStats)
			return resetStats
		}

		return stats
	} catch {
		const defaultUsage = getDefaultUsage()
		saveUsage(defaultUsage)
		return defaultUsage
	}
}

export function saveUsage(stats: UsageStats): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
	} catch (e) {
		console.error('Failed to save quota usage:', e)
	}
}

export function checkQuota(
	type: 'generation' | 'character' | 'audio',
	amount: number,
): {allowed: boolean; remaining: number; limit: number} {
	const usage = getUsage()
	const quota = DEFAULT_QUOTA

	let current: number
	let limit: number

	switch (type) {
		case 'generation':
			current = usage.generations
			limit = quota.dailyGenerations
			break
		case 'character':
			current = usage.characters
			limit = quota.dailyCharacters
			break
		case 'audio':
			current = usage.audioMinutes
			limit = quota.dailyAudioMinutes
			break
	}

	const remaining = Math.max(0, limit - current)
	const allowed = current + amount <= limit

	return {allowed, remaining, limit}
}

export function incrementUsage(
	type: 'generation' | 'character' | 'audio',
	amount: number,
): void {
	const usage = getUsage()

	switch (type) {
		case 'generation':
			usage.generations += amount
			break
		case 'character':
			usage.characters += amount
			break
		case 'audio':
			usage.audioMinutes += amount
			break
	}

	usage.lastReset = new Date().toISOString()
	saveUsage(usage)
}

export function getQuotaDisplay(): {
	generations: {used: number; limit: number; remaining: number; percent: number}
	characters: {used: number; limit: number; remaining: number; percent: number}
	audio: {used: number; limit: number; remaining: number; percent: number}
} {
	const usage = getUsage()
	const quota = DEFAULT_QUOTA

	const generationsUsed = usage.generations
	const generationsLimit = quota.dailyGenerations
	const generationsRemaining = Math.max(0, generationsLimit - generationsUsed)
	const generationsPercent = Math.round(
		(generationsUsed / generationsLimit) * 100,
	)

	const charactersUsed = usage.characters
	const charactersLimit = quota.dailyCharacters
	const charactersRemaining = Math.max(0, charactersLimit - charactersUsed)
	const charactersPercent = Math.round((charactersUsed / charactersLimit) * 100)

	const audioUsed = usage.audioMinutes
	const audioLimit = quota.dailyAudioMinutes
	const audioRemaining = Math.max(0, audioLimit - audioUsed)
	const audioPercent = Math.round((audioUsed / audioLimit) * 100)

	return {
		generations: {
			used: generationsUsed,
			limit: generationsLimit,
			remaining: generationsRemaining,
			percent: generationsPercent,
		},
		characters: {
			used: charactersUsed,
			limit: charactersLimit,
			remaining: charactersRemaining,
			percent: charactersPercent,
		},
		audio: {
			used: audioUsed,
			limit: audioLimit,
			remaining: audioRemaining,
			percent: audioPercent,
		},
	}
}

export function resetQuota(): void {
	const resetStats: UsageStats = {
		date: getTodayString(),
		generations: 0,
		characters: 0,
		audioMinutes: 0,
		lastReset: new Date().toISOString(),
	}
	saveUsage(resetStats)
}

function formatNumber(num: number): string {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + 'M'
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1) + 'K'
	}
	return num.toString()
}

export function formatQuotaDisplay(): string {
	const display = getQuotaDisplay()
	return `Generations: ${display.generations.used}/${display.generations.limit} | Chars: ${formatNumber(display.characters.used)}/${formatNumber(display.characters.limit)} | Audio: ${display.audio.used}/${display.audio.limit}min`
}

function getQuotaColor(percent: number): string {
	if (percent < 50) return '#00ff41'
	if (percent < 80) return '#ffaa00'
	return '#ff3333'
}

export function getQuotaColors(): {
	generations: string
	characters: string
	audio: string
} {
	const display = getQuotaDisplay()
	return {
		generations: getQuotaColor(display.generations.percent),
		characters: getQuotaColor(display.characters.percent),
		audio: getQuotaColor(display.audio.percent),
	}
}
