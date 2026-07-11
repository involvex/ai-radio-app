interface TauriRuntime {
	invoke: (cmd: string, args?: Record<string, unknown>) => Promise<unknown>
}

export async function fetchLinkContent(url: string): Promise<string> {
	const tauri = (window as Window & {__TAURI__?: TauriRuntime}).__TAURI__
	if (tauri?.invoke) {
		return (await tauri.invoke('fetch_link_content', {url})) as string
	}

	const target = url.startsWith('http') ? url : `https://${url}`

	const response = await fetch(target, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (compatible; AI-Radio/1.0)',
			Accept: 'text/html,application/xhtml+xml',
		},
	})

	if (!response.ok) {
		throw new Error(`URL konnte nicht geladen werden (HTTP ${response.status})`)
	}

	const html = await response.text()
	return extractTextFromHtml(html)
}

function extractTextFromHtml(html: string): string {
	const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
	const title = titleMatch ? titleMatch[1].trim() : ''

	let text = html
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&nbsp;/g, ' ')
		.replace(/&#\d+;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()

	text = text.slice(0, 8000)

	if (title) {
		return `Titel: ${title}\n\n${text}`
	}
	return text
}
