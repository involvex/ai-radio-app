export async function checkWebGPU(): Promise<{
	supported: boolean
	reason?: string
}> {
	if (!navigator.gpu) {
		return {
			supported: false,
			reason: 'WebGPU nicht verfügbar in diesem Browser',
		}
	}
	try {
		const adapter = await navigator.gpu.requestAdapter()
		if (!adapter) {
			return {supported: false, reason: 'Kein GPU-Adapter gefunden'}
		}
		return {supported: true}
	} catch (e) {
		return {
			supported: false,
			reason: `WebGPU-Check fehlgeschlagen: ${e instanceof Error ? e.message : String(e)}`,
		}
	}
}
