export interface DownloadProgress {
	downloaded: number
	total: number
	percent: number
	speedBps: number
	etaSec: number | null
}

export interface StoredModelMeta {
	cacheKey: string
	url: string
	filename: string
	sizeBytes: number
	downloadedAt: string
}

const MODEL_CACHE_NAME = 'ai-radio-models-v1'
const META_PREFIX = 'ai-radio-model-meta:'

function metaKey(cacheKey: string): string {
	return `${META_PREFIX}${cacheKey}`
}

export function readModelMeta(cacheKey: string): StoredModelMeta | null {
	try {
		const raw = localStorage.getItem(metaKey(cacheKey))
		if (!raw) return null
		return JSON.parse(raw) as StoredModelMeta
	} catch {
		return null
	}
}

function writeModelMeta(meta: StoredModelMeta): void {
	try {
		localStorage.setItem(metaKey(meta.cacheKey), JSON.stringify(meta))
	} catch {
		// Quota full — cache blob is still usable, meta is best-effort.
	}
}

export function removeModelMeta(cacheKey: string): void {
	try {
		localStorage.removeItem(metaKey(cacheKey))
	} catch {
		// ignore
	}
}

async function openModelCache(): Promise<Cache> {
	return caches.open(MODEL_CACHE_NAME)
}

/** Real download with byte progress, speed + ETA, cancel via AbortSignal. Supports HTTP Range resume. */
export async function downloadWithProgress(
	url: string,
	options: {
		resumeFrom?: number
		signal?: AbortSignal
		onProgress?: (p: DownloadProgress) => void
	} = {},
): Promise<Blob> {
	const resumeFrom = options.resumeFrom ?? 0
	const headers: Record<string, string> = {}
	if (resumeFrom > 0) {
		headers['Range'] = `bytes=${resumeFrom}-`
	}

	const response = await fetch(url, {headers, signal: options.signal})
	if (!response.ok && response.status !== 206) {
		throw new Error(`Download fehlgeschlagen (HTTP ${response.status})`)
	}
	if (resumeFrom > 0 && response.status !== 206) {
		throw new Error('Server unterstützt kein Fortsetzen — bitte neu starten')
	}

	const contentLength = Number(response.headers.get('content-length') ?? '0')
	const total =
		resumeFrom + (Number.isFinite(contentLength) ? contentLength : 0)
	const reader = response.body?.getReader()
	if (!reader) {
		throw new Error('Download-Stream nicht verfügbar')
	}

	const chunks: BlobPart[] = []
	let downloaded = resumeFrom
	const startTime = performance.now()
	let lastReport = 0
	const report = () => {
		const elapsedSec = Math.max((performance.now() - startTime) / 1000, 0.1)
		const freshBytes = downloaded - resumeFrom
		const speedBps = freshBytes / elapsedSec
		const remaining = total > 0 ? Math.max(total - downloaded, 0) : 0
		const etaSec = total > 0 && speedBps > 0 ? remaining / speedBps : null
		const percent = total > 0 ? Math.min(100, (downloaded / total) * 100) : 0
		options.onProgress?.({downloaded, total, percent, speedBps, etaSec})
	}

	try {
		for (;;) {
			const {done, value} = await reader.read()
			if (done) break
			if (value) {
				chunks.push(value as BlobPart)
				downloaded += value.byteLength
				const now = performance.now()
				if (now - lastReport > 150) {
					lastReport = now
					report()
				}
			}
		}
	} finally {
		reader.releaseLock()
	}

	report()
	return new Blob(chunks as BlobPart[], {type: 'application/octet-stream'})
}

export async function storeModelBlob(
	cacheKey: string,
	blob: Blob,
): Promise<void> {
	const cache = await openModelCache()
	await cache.put(cacheKey, new Response(blob))
}

export async function getCachedModelBlob(
	cacheKey: string,
): Promise<Blob | null> {
	try {
		const cache = await openModelCache()
		const res = await cache.match(cacheKey)
		if (!res) return null
		const blob = await res.blob()
		if (blob.size === 0) return null
		return blob
	} catch {
		return null
	}
}

export async function hasCachedModel(cacheKey: string): Promise<boolean> {
	return (await getCachedModelBlob(cacheKey)) !== null
}

export async function deleteCachedModel(cacheKey: string): Promise<void> {
	try {
		const cache = await openModelCache()
		await cache.delete(cacheKey)
	} finally {
		removeModelMeta(cacheKey)
	}
}

/** Download (if needed) + persist to CacheStorage. Returns the Blob. */
export async function ensureCachedModel(
	cacheKey: string,
	url: string,
	filename: string,
	options: {
		expectedSize?: number
		signal?: AbortSignal
		onProgress?: (p: DownloadProgress) => void
	} = {},
): Promise<Blob> {
	const existing = await getCachedModelBlob(cacheKey)
	if (existing) {
		if (
			options.expectedSize &&
			Math.abs(existing.size - options.expectedSize) >
				options.expectedSize * 0.05
		) {
			await deleteCachedModel(cacheKey)
		} else {
			options.onProgress?.({
				downloaded: existing.size,
				total: existing.size,
				percent: 100,
				speedBps: 0,
				etaSec: 0,
			})
			return existing
		}
	}

	const blob = await downloadWithProgress(url, {
		signal: options.signal,
		onProgress: options.onProgress,
	})

	if (
		options.expectedSize &&
		Math.abs(blob.size - options.expectedSize) > options.expectedSize * 0.05
	) {
		throw new Error(
			`Download unvollständig (${formatBytes(blob.size)} statt ~${formatBytes(options.expectedSize)}). Bitte erneut versuchen.`,
		)
	}

	await storeModelBlob(cacheKey, blob)
	writeModelMeta({
		cacheKey,
		url,
		filename,
		sizeBytes: blob.size,
		downloadedAt: new Date().toISOString(),
	})
	return blob
}

export async function getStorageUsage(): Promise<{
	usage: number
	quota: number
}> {
	try {
		const est = await navigator.storage.estimate()
		return {usage: est.usage ?? 0, quota: est.quota ?? 0}
	} catch {
		return {usage: 0, quota: 0}
	}
}

export function formatBytes(bytes: number): string {
	if (!Number.isFinite(bytes) || bytes < 0) return '–'
	if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`
	if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(0)} MB`
	if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`
	return `${bytes} B`
}

export function formatSpeed(bps: number): string {
	if (!Number.isFinite(bps) || bps <= 0) return '–'
	return `${formatBytes(bps)}/s`
}

export function formatEta(etaSec: number | null): string {
	if (etaSec === null || !Number.isFinite(etaSec)) return '–'
	if (etaSec < 60) return `${Math.round(etaSec)}s`
	const min = Math.floor(etaSec / 60)
	const sec = Math.round(etaSec % 60)
	return `${min}m ${sec}s`
}
