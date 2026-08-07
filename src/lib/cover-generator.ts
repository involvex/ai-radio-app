export interface CoverOptions {
	title: string
	topic: string
	style:
		| 'tech'
		| 'casual'
		| 'academic'
		| 'entertaining'
		| 'news'
		| 'podcast'
		| 'chill'
	width?: number
	height?: number
	seed?: number
}

export interface StyleTheme {
	name: string
	bgColor: string
	accentColor: string
	secondaryColor: string
	patternFn: (
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		rand: () => number,
	) => void
}

export const STYLE_THEMES: Record<CoverOptions['style'], StyleTheme> = {
	tech: {
		name: 'tech',
		bgColor: '#0a0a0a',
		accentColor: '#00ff41',
		secondaryColor: '#003311',
		patternFn: drawCircuitPattern,
	},
	casual: {
		name: 'casual',
		bgColor: '#1a1a0a',
		accentColor: '#ffaa00',
		secondaryColor: '#332200',
		patternFn: drawWavePattern,
	},
	academic: {
		name: 'academic',
		bgColor: '#0a0a1a',
		accentColor: '#00aaff',
		secondaryColor: '#002244',
		patternFn: drawGridPattern,
	},
	entertaining: {
		name: 'entertaining',
		bgColor: '#1a0a1a',
		accentColor: '#ff00aa',
		secondaryColor: '#330022',
		patternFn: drawStarPattern,
	},
	news: {
		name: 'news',
		bgColor: '#1a1a1a',
		accentColor: '#ff3333',
		secondaryColor: '#441111',
		patternFn: drawLinePattern,
	},
	podcast: {
		name: 'podcast',
		bgColor: '#0a1a1a',
		accentColor: '#00ffaa',
		secondaryColor: '#003322',
		patternFn: drawSoundwavePattern,
	},
	chill: {
		name: 'chill',
		bgColor: '#0a1a0a',
		accentColor: '#88ff88',
		secondaryColor: '#113311',
		patternFn: drawCloudPattern,
	},
}

let seededRandState = 1

function seededRandom(seed: number): () => number {
	seededRandState = seed || 1
	return () => {
		seededRandState = (seededRandState * 1664525 + 1013904223) % 4294967296
		return seededRandState / 4294967296
	}
}

function hashString(str: string): number {
	let hash = 0
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i)
		hash = (hash << 5) - hash + char
		hash = hash & hash
	}
	return Math.abs(hash)
}

function wrapText(
	ctx: CanvasRenderingContext2D,
	text: string,
	x: number,
	y: number,
	maxWidth: number,
	_lineHeight: number,
	_fontSize: number,
): string[] {
	const words = text.split(' ')
	const lines: string[] = []
	let currentLine = ''

	for (const word of words) {
		const testLine = currentLine ? `${currentLine} ${word}` : word
		const metrics = ctx.measureText(testLine)
		if (metrics.width > maxWidth && currentLine) {
			lines.push(currentLine)
			currentLine = word
		} else {
			currentLine = testLine
		}
	}
	if (currentLine) lines.push(currentLine)

	return lines
}

function drawTitle(
	ctx: CanvasRenderingContext2D,
	title: string,
	width: number,
	height: number,
	accentColor: string,
	_rand: () => number,
): void {
	ctx.save()
	ctx.font = `bold ${Math.max(16, width / 24)}px "Courier New", monospace`
	ctx.fillStyle = accentColor
	ctx.textAlign = 'center'
	ctx.shadowColor = accentColor
	ctx.shadowBlur = 10

	const lines = wrapText(
		ctx,
		title,
		0,
		0,
		width * 0.85,
		height * 0.05,
		width / 24,
	)
	const startY = height * 0.15

	lines.forEach((line, i) => {
		const y = startY + i * (height * 0.06)
		ctx.fillText(line, width / 2, y)
	})

	ctx.restore()
}

function drawTopic(
	ctx: CanvasRenderingContext2D,
	topic: string,
	width: number,
	height: number,
	secondaryColor: string,
): void {
	ctx.save()
	ctx.font = `${Math.max(10, width / 36)}px "Courier New", monospace`
	ctx.fillStyle = secondaryColor
	ctx.textAlign = 'center'

	const maxChars = Math.floor((width / (width / 36)) * 0.7)
	const displayTopic =
		topic.length > maxChars ? topic.slice(0, maxChars) + '...' : topic

	ctx.fillText(displayTopic, width / 2, height * 0.88)

	ctx.restore()
}

function drawRadioIcon(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	accentColor: string,
	_rand: () => number,
): void {
	ctx.save()
	const centerX = width / 2
	const centerY = height / 2
	const radius = Math.min(width, height) * 0.2

	ctx.strokeStyle = accentColor
	ctx.lineWidth = 3
	ctx.shadowColor = accentColor
	ctx.shadowBlur = 15

	ctx.beginPath()
	ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
	ctx.stroke()

	ctx.beginPath()
	ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2)
	ctx.stroke()

	ctx.beginPath()
	ctx.moveTo(centerX, centerY - radius * 0.6)
	ctx.lineTo(centerX, centerY - radius)
	ctx.stroke()

	ctx.beginPath()
	ctx.arc(centerX, centerY, radius * 0.2, 0, Math.PI * 2)
	ctx.fillStyle = accentColor
	ctx.fill()

	ctx.restore()
}

function drawScanlines(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	color: string,
): void {
	ctx.save()
	ctx.strokeStyle = color
	ctx.lineWidth = 1
	ctx.globalAlpha = 0.1

	for (let y = 0; y < height; y += 4) {
		ctx.beginPath()
		ctx.moveTo(0, y)
		ctx.lineTo(width, y)
		ctx.stroke()
	}
	ctx.restore()
}

function drawCircuitPattern(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	_rand: () => number,
): void {
	ctx.save()
	ctx.strokeStyle = '#003311'
	ctx.lineWidth = 1

	const gridSize = 40
	for (let x = 0; x < width; x += gridSize) {
		for (let y = 0; y < height; y += gridSize) {
			if (_rand() > 0.7) {
				ctx.beginPath()
				ctx.moveTo(x, y)
				if (_rand() > 0.5) {
					ctx.lineTo(x + gridSize, y)
				} else {
					ctx.lineTo(x, y + gridSize)
				}
				ctx.stroke()
			}
			if (_rand() > 0.85) {
				const rx = x + _rand() * gridSize
				const ry = y + _rand() * gridSize
				ctx.beginPath()
				ctx.arc(rx, ry, 3, 0, Math.PI * 2)
				ctx.stroke()
			}
		}
	}
	ctx.restore()
}

function drawWavePattern(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	rand: () => number,
): void {
	ctx.save()
	ctx.strokeStyle = '#332200'
	ctx.lineWidth = 2

	for (let i = 0; i < 5; i++) {
		ctx.beginPath()
		const amplitude = 20 + rand() * 40
		const frequency = 0.01 + rand() * 0.02
		const offsetY = height * 0.3 + i * (height * 0.15)
		const phase = rand() * Math.PI * 2

		ctx.moveTo(0, offsetY)
		for (let x = 0; x < width; x += 2) {
			const y = offsetY + Math.sin(x * frequency + phase) * amplitude
			ctx.lineTo(x, y)
		}
		ctx.stroke()
	}
	ctx.restore()
}

function drawGridPattern(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	rand: () => number,
): void {
	ctx.save()
	ctx.strokeStyle = '#002244'
	ctx.lineWidth = 0.5

	const gridSize = 30
	for (let x = 0; x <= width; x += gridSize) {
		ctx.beginPath()
		ctx.moveTo(x, 0)
		ctx.lineTo(x, height)
		ctx.stroke()
	}
	for (let y = 0; y <= height; y += gridSize) {
		ctx.beginPath()
		ctx.moveTo(0, y)
		ctx.lineTo(width, y)
		ctx.stroke()
	}

	ctx.fillStyle = '#004488'
	for (let x = gridSize; x < width; x += gridSize * 2) {
		for (let y = gridSize; y < height; y += gridSize * 2) {
			if (rand() > 0.6) {
				ctx.fillRect(x - 2, y - 2, 4, 4)
			}
		}
	}
	ctx.restore()
}

function drawStarPattern(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	rand: () => number,
): void {
	ctx.save()
	ctx.fillStyle = '#330022'

	for (let i = 0; i < 80; i++) {
		const x = rand() * width
		const y = rand() * height
		const size = 1 + rand() * 3
		const spikes = 5
		const outerRadius = size
		const innerRadius = size * 0.4

		ctx.beginPath()
		const angleStep = Math.PI / spikes
		for (let j = 0; j < spikes * 2; j++) {
			const radius = j % 2 === 0 ? outerRadius : innerRadius
			const angle = j * angleStep - Math.PI / 2
			const sx = x + Math.cos(angle) * radius
			const sy = y + Math.sin(angle) * radius
			if (j === 0) ctx.moveTo(sx, sy)
			else ctx.lineTo(sx, sy)
		}
		ctx.closePath()
		ctx.fill()
	}
	ctx.restore()
}

function drawLinePattern(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	rand: () => number,
): void {
	ctx.save()
	ctx.strokeStyle = '#441111'
	ctx.lineWidth = 2

	for (let i = 0; i < 12; i++) {
		const y = (height / 13) * (i + 1) + (rand() - 0.5) * 10
		ctx.beginPath()
		ctx.moveTo(0, y)
		for (let x = 0; x < width; x += 10) {
			const offset = (rand() - 0.5) * 4
			ctx.lineTo(x, y + offset)
		}
		ctx.stroke()
	}
	ctx.restore()
}

function drawSoundwavePattern(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	_rand: () => number,
): void {
	ctx.save()
	ctx.strokeStyle = '#003322'
	ctx.lineWidth = 1.5

	for (let i = 0; i < 40; i++) {
		const barWidth = width / 40
		const x = i * barWidth
		const barHeight = _rand() * height * 0.4
		const y = (height - barHeight) / 2

		ctx.beginPath()
		ctx.moveTo(x + barWidth / 2, y + barHeight)
		ctx.lineTo(x + barWidth / 2, y)
		ctx.stroke()
	}
	ctx.restore()
}

function drawCloudPattern(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	rand: () => number,
): void {
	ctx.save()
	ctx.fillStyle = '#113311'

	for (let i = 0; i < 15; i++) {
		const cx = rand() * width
		const cy = rand() * height
		const radius = 20 + rand() * 40

		ctx.beginPath()
		for (let j = 0; j < 8; j++) {
			const angle = (j / 8) * Math.PI * 2
			const r = radius * (0.5 + rand() * 0.5)
			const x = cx + Math.cos(angle) * r
			const y = cy + Math.sin(angle) * r * 0.6
			if (j === 0) ctx.moveTo(x, y)
			else ctx.lineTo(x, y)
		}
		ctx.closePath()
		ctx.fill()
	}
	ctx.restore()
}

export function generateCoverCanvas(options: CoverOptions): HTMLCanvasElement {
	const width = options.width || 512
	const height = options.height || 512
	const seed =
		options.seed ??
		hashString(`${options.title}-${options.topic}-${options.style}`)
	const rand = seededRandom(seed)

	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height

	const ctx = canvas.getContext('2d')
	if (!ctx) throw new Error('Failed to get canvas context')

	const theme = STYLE_THEMES[options.style]

	ctx.fillStyle = theme.bgColor
	ctx.fillRect(0, 0, width, height)

	theme.patternFn(ctx, width, height, rand)

	drawScanlines(ctx, width, height, theme.accentColor)

	drawRadioIcon(ctx, width, height, theme.accentColor, rand)

	drawTitle(ctx, options.title, width, height, theme.accentColor, rand)

	drawTopic(ctx, options.topic, width, height, theme.secondaryColor)

	return canvas
}

export function canvasToDataURL(
	canvas: HTMLCanvasElement,
	type = 'image/png',
): string {
	return canvas.toDataURL(type)
}

export function downloadCover(
	canvas: HTMLCanvasElement,
	filename: string,
): void {
	const dataUrl = canvas.toDataURL('image/png')
	const link = document.createElement('a')
	link.href = dataUrl
	link.download = filename
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}
