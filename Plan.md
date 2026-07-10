Hier ist der schlanke, technisch fokussierte Architektur- und Umsetzungsplan für die **AI Radio App**.

Da dein Stack auf **Bun + TypeScript** ausgelegt ist, nutzen wir für Desktop/Mobile ein Cross-Platform-Framework (z. B. **Capacitor** oder **Tauri v2**, das jetzt auch Mobile supportet) oder bauen direkt eine performante PWA, die via Bun serviert wird.

Da du kostenlose AI-Services nutzen willst, splitten wir die Pipeline in ein schnelles Open-Weight LLM für das Scripting und die native Gemini Multimodal-Engine für Audio oder Edge-Synthese.

---

## 1. System-Architektur & Datenfluss

Der Ablauf muss komplett asynchron und stream-basiert sein, damit der User nicht auf die Generierung warten muss.

```
[User Input: Topic/Link]
       │
       ▼
[Backend: Bun API] ──(Scrape/Fetch Link)──► [Clean Text Content]
       │
       ▼
[LLM: OpenCode Zen / Kilo Gateway / Gemini Flash]
       │ (Generiert lockeres Radio-Skript mit Sprecher-Tags)
       ▼
[Audio Generation: Gemini Audio Out / Edge-TTS] ──► [Streaming Audio Player UI]

```

---

## 2. API & Modell-Auswahl (Free Tier)

Da du kostenlose APIs bevorzugst, nutzen wir die OpenAI-kompatiblen Endpunkte von **OpenCode Zen** oder **Kilo Gateway** für die Text-Verarbeitung und **Gemini (AI Studio)** für die Core-Pipeline.

### Phase 1: Text-Aggregation & Scripting

- **Provider:** `opencode_zen` oder `kilo-gateway`
- **Model-ID:** `opencode/deepseek-v4-flash-free` oder `kilo/google/gemini-2.5-flash` (über Kilo Free Routing).
- **Aufgabe:** Link-Inhalt via JSDOM/Puppeteer scrapen, Text säubern und in ein lockeres, kurzes Skript (ca. 150–200 Wörter) verwandeln.

### Phase 2: Die Stimme (Nicht-robotisch)

Um eine wirklich angenehme, natürliche Stimme ohne Kosten zu bekommen, gibt es zwei Wege:

1. **Gemini 2.0/2.5 Flash (AI Studio Key):** Du nutzt das native Multimodal-Feature. Du schickst den Text hin und forderst als `response_mime_type` direkt `audio/mp3` oder `audio/wav` an. Gemini nutzt hier extrem natürliche, flüssige Stimmen (z.B. Puck, Aoede).
2. **Microsoft Edge TTS Integration:** Ein Node/Bun-Wrapper für die Edge-Read-Aloud-Stimmen (z.B. `de-DE-KillianNeural` oder `de-DE-ConradNeural`). Diese klingen täuschend echt, haben Radiokaliber und sind komplett kostenlos ohne Keys nutzbar.

---

## 3. Der Prompt (Agent-Core)

Das Skript darf nicht nach Wikipedia klingen. Es muss das Gefühl von "Hintergrund-Radio" erzeugen: kurze Sätze, lockere Übergänge, einfache Sprache.

> **Agent Prompt (System Instruction):**
> "Du bist ein erfahrener Radio-Moderator für ein Tech- und Infotainment-Radio. Deine Aufgabe ist es, den bereitgestellten Text in einen kurzen, extrem leicht verständlichen Radio-Beitrag (maximal 90 Sekunden Sprechzeit) umzuwandeln.
>
> - Nutze kurze Sätze. Keine Schachtelsätze.
> - Verwende rhetorische Fragen und lockere Überleitungen ("Übrigens...", "Schon gewusst?").
> - Streiche komplexe mathematische Formeln oder tiefe Code-Details. Erkläre das _Prinzip_ so, dass man beim Autofahren oder Kochen folgen kann, ohne volle Aufmerksamkeit zu investieren.
> - Antworte ausschließlich mit dem reinen Sprechtext. Keine Markdown-Formatierung, keine Metadaten, keine Regieanweisungen."

---

## 4. Technischer Implementierungs-Plan

### Schritt 1: Bun-Backend Setup (Scraper & LLM Router)

Ein simpler Bun-Server, der den Link entgegennimmt und verarbeitet.

```typescript
// server.ts
import {serve} from 'bun'

serve({
	port: 3000,
	async fetch(req) {
		const url = new URL(req.url)
		if (url.pathname === '/api/generate' && req.method === 'POST') {
			const {topic, link} = await req.json()

			// 1. Scrape content if link exists
			let context = topic
			if (link) {
				const html = await fetch(link).then(res => res.text())
				// Hier simplen Regex/JSDOM Parser nutzen, um Main-Text zu extrahieren
				context += `\nInhalt des Links:\n${extractMainText(html)}`
			}

			// 2. Call Gemini for Native Audio Output
			const audioBuffer = await generateRadioAudio(context)

			return new Response(audioBuffer, {
				headers: {'Content-Type': 'audio/mp3'},
			})
		}
		return new Response('Not Found', {status: 404})
	},
})
```

### Schritt 2: Audio-Generierung via Gemini API Studio

```typescript
async function generateRadioAudio(context: string): Promise<Buffer> {
	const apiKey = process.env.GEMINI_API_KEY
	const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

	const response = await fetch(url, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			contents: [
				{parts: [{text: `Verwandle das in ein Radioskript: ${context}`}]},
			],
			generationConfig: {
				// Fordert direkt Audio statt Text an (falls im SDK/Beta für deinen Key freigeschaltet)
				responseMimeType: 'audio/mp3',
				speechConfig: {
					voiceConfig: {prebuiltVoiceConfig: {voiceName: 'Puck'}},
				},
			},
			systemInstruction: {
				parts: [{text: 'Du bist Radio-Moderator. Sprich locker und kurz.'}],
			},
		}),
	})

	const json = await response.json()
	// Extrahiere Base64 Audio aus dem Response-Objekt und konvertiere in Buffer
	const base64Audio = json.candidates[0].content.parts[0].inlineData.data
	return Buffer.from(base64Audio, 'base64')
}
```

### Schritt 3: Frontend (UI mit Dark-Mode Terminal-Aesthetic)

Da du Terminal-Style und Dark-Mode bevorzugst, halten wir das Interface extrem minimalistisch: Ein zentrales Eingabefeld, eine Link-Zeile und ein Retro-Audio-Visualizer.

```html
<!-- index.html (PWA / Capacitor Basis) -->
<div
	class="bg-black text-green-500 font-mono min-h-screen p-6 flex flex-col justify-between"
>
	<header class="border-b border-green-800 pb-2">
		<h1 class="text-xl font-bold">📡 AI_RADIO_v1.0.0</h1>
	</header>

	<main
		class="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full gap-4"
	>
		<input
			id="topic"
			type="text"
			placeholder="Enter Topic..."
			class="bg-zinc-900 border border-green-800 p-3 text-green-400 focus:outline-none focus:border-green-500"
		/>
		<input
			id="link"
			type="url"
			placeholder="Paste Link (optional)..."
			class="bg-zinc-900 border border-green-800 p-3 text-green-400 focus:outline-none focus:border-green-500"
		/>

		<button
			onclick="tuneIn()"
			class="bg-green-900 hover:bg-green-800 text-white p-3 font-bold transition-all"
		>
			[ TUNE IN ]
		</button>

		<!-- Simple Custom Audio UI -->
		<div
			id="player"
			class="hidden border border-zinc-800 p-4 bg-zinc-950 mt-4 text-center"
		>
			<div class="animate-pulse text-xs mb-2">NOW STREAMING AI PODCAST...</div>
			<audio
				id="audioElement"
				controls
				class="w-full invert opacity-80"
			></audio>
		</div>
	</main>
</div>
```

---

## 5. Next Steps zur Umsetzung

1. **Scraper validieren:** Nutze ein einfaches npm-Paket wie `cheerio` im Bun-Backend, um Text von URLs zu ziehen, ohne Overhead.
2. **Audio-Fallback prüfen:** Wenn der native Audio-Output von Gemini in deinem Workspace Ratenbegrenzungen hat, binde `edge-tts` ein (generiert via Python-Bridge oder direktem Node-Port erstklassige, kostenlose MP3s).
3. **Pacing:** Setze im LLM-Prompt fest, dass das Skript exakt aus maximal 4–5 Absätzen mit maximal 2 Sätzen bestehen darf. Das hält die Audio-Files klein (unter 1 MB), sorgt für schnellen Load und schont die Free-Tier Limits.
