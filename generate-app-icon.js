#!/usr/bin/env node
// generate-app-icon.js - Generate all app icon sizes from a single source
// Run: node generate-app-icon.js

const {createCanvas} = require('canvas')
const path = require('path')
const fs = require('fs')

// Ensure canvas is available (npm install canvas)
try {
	require('canvas')
} catch (e) {
	console.error('Please install canvas: npm install canvas')
	process.exit(1)
}

// Icon configuration
const ICON_CONFIG = {
	// Base design parameters
	size: 1024,
	backgroundColor: '#0a0a0a',
	primaryColor: '#00ff41',
	secondaryColor: '#003311',
	accentColor: '#00aa2a',

	// Output directories
	output: {
		android: 'src-tauri/icons/android',
		ios: 'src-tauri/icons/ios',
		windows: 'src-tauri/icons',
		macos: 'src-tauri/icons',
		tray: 'src-tauri/icons',
	},
}

// Generate the base icon design
function drawIcon(ctx, size) {
	const centerX = size / 2
	const centerY = size / 2
	const radius = size * 0.45

	// Background - dark with subtle radial gradient
	const bgGradient = ctx.createRadialGradient(
		centerX,
		centerY,
		0,
		centerX,
		centerY,
		size * 0.7,
	)
	bgGradient.addColorStop(0, '#111111')
	bgGradient.addColorStop(1, '#0a0a0a')
	ctx.fillStyle = bgGradient
	ctx.fillRect(0, 0, size, size)

	// Scanline overlay
	ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'
	ctx.lineWidth = 1
	for (let y = 0; y < size; y += 4) {
		ctx.beginPath()
		ctx.moveTo(0, y)
		ctx.lineTo(size, y)
		ctx.stroke()
	}

	// Radio wave circles (expanding rings)
	const waveCount = 4
	for (let i = 0; i < waveCount; i++) {
		const waveRadius = radius * (0.3 + i * 0.18)
		const opacity = 0.15 - i * 0.03

		ctx.beginPath()
		ctx.arc(centerX, centerY, waveRadius, -Math.PI * 0.6, Math.PI * 0.6)
		ctx.strokeStyle = `rgba(0, 255, 65, ${opacity})`
		ctx.lineWidth = size * 0.015
		ctx.lineCap = 'round'
		ctx.stroke()

		// Lower wave
		ctx.beginPath()
		ctx.arc(centerX, centerY, waveRadius, Math.PI * 1.4, Math.PI * 0.4)
		ctx.strokeStyle = `rgba(0, 255, 65, ${opacity * 0.7})`
		ctx.stroke()
	}

	// Central radio tower / antenna
	ctx.strokeStyle = '#00ff41'
	ctx.lineWidth = size * 0.012
	ctx.lineCap = 'round'

	// Main tower
	ctx.beginPath()
	ctx.moveTo(centerX, centerY - radius * 0.8)
	ctx.lineTo(centerX, centerY + radius * 0.3)
	ctx.stroke()

	// Antenna top
	ctx.beginPath()
	ctx.moveTo(centerX - size * 0.05, centerY - radius * 0.8)
	ctx.lineTo(centerX, centerY - radius * 0.95)
	ctx.lineTo(centerX + size * 0.05, centerY - radius * 0.8)
	ctx.stroke()

	// Signal brackets (left and right)
	for (let side of [-1, 1]) {
		for (let j = 0; j < 3; j++) {
			const bracketRadius = radius * 0.15 + j * radius * 0.1
			const opacity = 0.6 - j * 0.15

			ctx.beginPath()
			ctx.arc(
				centerX + side * radius * 0.4,
				centerY - radius * 0.2,
				bracketRadius,
				side === -1 ? -Math.PI * 0.4 : Math.PI * 1.4,
				side === -1 ? Math.PI * 0.4 : Math.PI * 0.6,
			)
			ctx.strokeStyle = `rgba(0, 255, 65, ${opacity})`
			ctx.lineWidth = size * 0.01
			ctx.stroke()
		}
	}

	// "AI" text at bottom
	ctx.font = `bold ${size * 0.12}px "Courier New", monospace`
	ctx.fillStyle = '#00ff41'
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'

	// Glow effect
	ctx.shadowColor = '#00ff41'
	ctx.shadowBlur = size * 0.03
	ctx.fillText('AI', centerX, centerY + radius * 0.7)
	ctx.shadowBlur = 0

	// Small "RADIO" text
	ctx.font = `${size * 0.04}px "Courier New", monospace`
	ctx.fillStyle = '#00aa2a'
	ctx.fillText('RADIO', centerX, centerY + radius * 0.85)
}

// Generate Android adaptive icon foreground
function drawAdaptiveForeground(ctx, size) {
	const centerX = size / 2
	const centerY = size / 2
	const radius = size * 0.38

	// Transparent background for adaptive icon
	ctx.clearRect(0, 0, size, size)

	// Radio waves (simplified for foreground)
	for (let i = 0; i < 3; i++) {
		const waveRadius = radius * (0.25 + i * 0.25)

		ctx.beginPath()
		ctx.arc(centerX, centerY, waveRadius, -Math.PI * 0.5, Math.PI * 0.5)
		ctx.strokeStyle = '#00ff41'
		ctx.lineWidth = size * 0.02
		ctx.lineCap = 'round'
		ctx.stroke()
	}

	// Central tower
	ctx.beginPath()
	ctx.moveTo(centerX, centerY - radius)
	ctx.lineTo(centerX, centerY + radius * 0.4)
	ctx.strokeStyle = '#00ff41'
	ctx.lineWidth = size * 0.02
	ctx.lineCap = 'round'
	ctx.stroke()

	// Antenna
	ctx.beginPath()
	ctx.moveTo(centerX - size * 0.04, centerY - radius)
	ctx.lineTo(centerX, centerY - radius * 1.15)
	ctx.lineTo(centerX + size * 0.04, centerY - radius)
	ctx.stroke()
}

// Generate adaptive icon background (solid color)
function drawAdaptiveBackground(ctx, size) {
	ctx.fillStyle = '#0a0a0a'
	ctx.fillRect(0, 0, size, size)
}

// Resize and save canvas
function saveCanvas(canvas, outputPath) {
	const buffer = canvas.toBuffer('image/png')
	fs.writeFileSync(outputPath, buffer)
	console.log(`Generated: ${outputPath}`)
}

// Main generation function
async function generateIcons() {
	console.log('Generating AI Radio app icons...\n')

	// Create output directories
	Object.values(ICON_CONFIG.output).forEach(dir => {
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, {recursive: true})
		}
	})

	// 1. Generate master icon (1024x1024)
	const masterCanvas = createCanvas(ICON_CONFIG.size, ICON_CONFIG.size)
	const masterCtx = masterCanvas.getContext('2d')
	drawIcon(masterCtx, ICON_CONFIG.size)
	saveCanvas(masterCanvas, path.join(ICON_CONFIG.output.windows, 'icon.png'))

	// 2. Android adaptive icons
	console.log('\n--- Android Adaptive Icons ---')

	// Foreground (1024x1024 for xxxhdpi)
	const fgCanvas = createCanvas(1024, 1024)
	const fgCtx = fgCanvas.getContext('2d')
	drawAdaptiveForeground(fgCtx, 1024)

	// Generate foreground for each density
	const androidDensities = [
		{dir: 'mipmap-mdpi', size: 48},
		{dir: 'mipmap-hdpi', size: 72},
		{dir: 'mipmap-xhdpi', size: 96},
		{dir: 'mipmap-xxhdpi', size: 144},
		{dir: 'mipmap-xxxhdpi', size: 192},
	]

	for (const {dir, size} of androidDensities) {
		const outDir = path.join(ICON_CONFIG.output.android, dir)
		if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true})

		// Resize foreground
		const resizedFg = createCanvas(size, size)
		const resizedFgCtx = resizedFg.getContext('2d')
		resizedFgCtx.drawImage(fgCanvas, 0, 0, size, size)
		saveCanvas(resizedFg, path.join(outDir, 'ic_launcher_foreground.png'))

		// Background
		const bgCanvas = createCanvas(size, size)
		const bgCtx = bgCanvas.getContext('2d')
		drawAdaptiveBackground(bgCtx, size)
		saveCanvas(bgCanvas, path.join(outDir, 'ic_launcher_background.png'))

		// Legacy ic_launcher (full icon with background)
		const legacyCanvas = createCanvas(size, size)
		const legacyCtx = legacyCanvas.getContext('2d')
		drawAdaptiveBackground(legacyCtx, size)
		legacyCtx.drawImage(resizedFg, 0, 0)
		saveCanvas(legacyCanvas, path.join(outDir, 'ic_launcher.png'))

		// Round version (same for now)
		saveCanvas(legacyCanvas, path.join(outDir, 'ic_launcher_round.png'))
	}

	// 3. Windows .ico (multiple sizes in one file)
	console.log('\n--- Windows ICO ---')
	const icoSizes = [16, 24, 32, 48, 64, 128, 256]
	// Note: canvas doesn't support .ico directly, save as PNGs
	for (const size of icoSizes) {
		const canvas = createCanvas(size, size)
		const ctx = canvas.getContext('2d')
		drawIcon(ctx, size)
		saveCanvas(
			canvas,
			path.join(ICON_CONFIG.output.windows, `icon-${size}.png`),
		)
	}
	console.log(
		'Note: Convert PNGs to .ico using: magick convert icon-*.png icon.ico',
	)

	// 4. macOS .icns (multiple sizes)
	console.log('\n--- macOS ICNS ---')
	const icnsSizes = [16, 32, 64, 128, 256, 512, 1024]
	for (const size of icnsSizes) {
		const canvas = createCanvas(size, size)
		const ctx = canvas.getContext('2d')
		drawIcon(ctx, size)
		saveCanvas(
			canvas,
			path.join(ICON_CONFIG.output.macos, `icon_${size}x${size}.png`),
		)

		// @2x versions
		if (size <= 512) {
			const canvas2x = createCanvas(size * 2, size * 2)
			const ctx2x = canvas2x.getContext('2d')
			drawIcon(ctx2x, size * 2)
			saveCanvas(
				canvas2x,
				path.join(ICON_CONFIG.output.macos, `icon_${size}x${size}@2x.png`),
			)
		}
	}
	console.log('Note: Use iconutil to convert to .icns')

	// 5. iOS icons
	console.log('\n--- iOS Icons ---')
	const iosSizes = [
		{name: 'Icon-20', size: 20},
		{name: 'Icon-20@2x', size: 40},
		{name: 'Icon-20@3x', size: 60},
		{name: 'Icon-29', size: 29},
		{name: 'Icon-29@2x', size: 58},
		{name: 'Icon-29@3x', size: 87},
		{name: 'Icon-40', size: 40},
		{name: 'Icon-40@2x', size: 80},
		{name: 'Icon-40@3x', size: 120},
		{name: 'Icon-60@2x', size: 120},
		{name: 'Icon-60@3x', size: 180},
		{name: 'Icon-76', size: 76},
		{name: 'Icon-76@2x', size: 152},
		{name: 'Icon-83.5@2x', size: 167},
		{name: 'Icon-1024', size: 1024},
	]

	for (const {name, size} of iosSizes) {
		const canvas = createCanvas(size, size)
		const ctx = canvas.getContext('2d')
		drawIcon(ctx, size)
		saveCanvas(canvas, path.join(ICON_CONFIG.output.ios, `${name}.png`))
	}

	// 6. Tray icons (small)
	console.log('\n--- Tray Icons ---')
	const trayCanvas = createCanvas(32, 32)
	const trayCtx = trayCanvas.getContext('2d')
	drawIcon(trayCtx, 32)
	saveCanvas(trayCanvas, path.join(ICON_CONFIG.output.tray, 'tray_icon.png'))

	const tray2xCanvas = createCanvas(64, 64)
	const tray2xCtx = tray2xCanvas.getContext('2d')
	drawIcon(tray2xCtx, 64)
	saveCanvas(
		tray2xCanvas,
		path.join(ICON_CONFIG.output.tray, 'tray_icon@2x.png'),
	)

	console.log('\n✅ Icon generation complete!')
	console.log('\nNext steps:')
	console.log('1. Windows: Use ImageMagick to create .ico from icon-*.png')
	console.log('2. macOS: Use iconutil to create .icns from icon_*.png')
	console.log('3. Run: bun run tauri build')
}

// Run
generateIcons().catch(console.error)
