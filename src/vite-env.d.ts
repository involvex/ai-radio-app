/// <reference types="svelte" />
/// <reference types="vite/client" />

interface Navigator {
	readonly gpu: GPU | undefined
}

interface GPU {
	requestAdapter(options?: GPURequestAdapterOptions): Promise<GPUAdapter | null>
	getPreferredCanvasFormat(): GPUTextureFormat
}

interface GPUAdapter {
	requestDevice(descriptor?: GPUDeviceDescriptor): Promise<GPUDevice>
}

interface GPUDevice {
	readonly lost: Promise<GPUDeviceLostInfo>
	destroy(): void
}

interface GPUDeviceLostInfo {
	readonly reason: string
	readonly message: string
}

interface GPURequestAdapterOptions {
	powerPreference?: GPUPowerPreference
	forceFallbackAdapter?: boolean
}

type GPUPowerPreference = 'low-power' | 'high-performance'

interface GPUDeviceDescriptor {
	label?: string
	requiredFeatures?: GPUFeatureName[]
	requiredLimits?: Record<string, number>
}

type GPUFeatureName = string
type GPUTextureFormat = string
