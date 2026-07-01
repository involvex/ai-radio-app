import { serve } from "bun";
import { tts } from "edge-tts";
import * as cheerio from "cheerio";

const VOICE = "de-DE-KillianNeural";
const PORT = 3000;

const RADIO_PROMPT = `Du bist ein erfahrener Radio-Moderator für ein Tech- und Infotainment-Radio. Deine Aufgabe ist es, den bereitgestellten Text in einen kurzen, extrem leicht verständlichen Radio-Beitrag (maximal 90 Sekunden Sprechzeit) umzuwandeln.
- Nutze kurze Sätze. Keine Schachtelsätze.
- Verwende rhetorische Fragen und lockere Überleitungen ("Übrigens...", "Schon gewusst?").
- Streiche komplexe mathematische Formeln oder tiefe Code-Details. Erkläre das *Prinzip* so, dass man beim Autofahren oder Kochen folgen kann, ohne volle Aufmerksamkeit zu investieren.
- Antworte ausschließlich mit dem reinen Sprechtext. Keine Markdown-Formatierung, keine Metadaten, keine Regieanweisungen.`;

async function extractTextFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    $(
      "script, style, nav, header, footer, aside, .ads, .advertisement, .social-share",
    ).remove();

    const title = $("h1").first().text() || $("title").first().text() || "";
    const paragraphs = $("article p, main p, .content p, #content p")
      .slice(0, 20)
      .map((_, el) => $(el).text())
      .get()
      .filter((text) => text.length > 50)
      .join(" ");

    return `${title}\n\n${paragraphs}`.trim();
  } catch (error) {
    console.error("Scraping error:", error);
    return "";
  }
}

async function generateScript(context: string): Promise<string> {
  const apiKey = process.env.KILO_API_KEY || process.env.OPENCODE_API_KEY;

  if (!apiKey) {
    return fallbackGenerateScript(context);
  }

  try {
    const response = await fetch("https://api.kilo.sh/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "kilo/free/gemini-2.5-flash",
        messages: [
          { role: "system", content: RADIO_PROMPT },
          {
            role: "user",
            content: `Verwandle das in ein Radioskript:\n\n${context}`,
          },
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("LLM error, using fallback:", error);
    return fallbackGenerateScript(context);
  }
}

function fallbackGenerateScript(context: string): string {
  const lines = context.split(/\n+/).filter((l) => l.trim());
  const title = lines[0] || "Unbekannt";
  const content = lines.slice(1).join(" ").slice(0, 1000);

  return `Hallo und willkommen bei AI Radio! Heute geht's um ${title}. ${content.slice(0, 300)}... Übrigens, das war's auch schon wieder für heute. Bis zum nächsten Mal, bleibt dran!`;
}

serve(
  {
    port: PORT,
    async fetch(req) {
      const url = new URL(req.url);

      if (url.pathname === "/api/generate" && req.method === "POST") {
        try {
          const { topic, link } = await req.json();

          let context = topic;
          if (link) {
            const scraped = await extractTextFromUrl(link);
            if (scraped) {
              context += "\n\n" + scraped;
            }
          }

          const script = await generateScript(context);

          const audioBuffer = await tts(script, {
            voice: VOICE,
            rate: "+0%",
            pitch: "+0Hz",
            volume: "+0%",
          });

          const base64Audio = Buffer.from(audioBuffer).toString("base64");
          const audioDataUrl = `data:audio/mp3;base64,${base64Audio}`;

          return new Response(
            JSON.stringify({
              script,
              audioUrl: audioDataUrl,
              duration: estimateDuration(script),
            }),
            {
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error) {
          console.error("Generation error:", error);
          return new Response(JSON.stringify({ error: "Generation failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      if (url.pathname === "/api/voices" && req.method === "GET") {
        try {
          const { getVoices } = await import("edge-tts");
          const voices = await getVoices();
          const germanVoices = voices.filter((v: any) =>
            v.Locale.startsWith("de-"),
          );
          return new Response(JSON.stringify(germanVoices), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          return new Response(JSON.stringify([]), {
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      return new Response("Not Found", { status: 404 });
    },
  },
  () => console.log(`AI Radio API running on http://localhost:${PORT}`),
);

function estimateDuration(text: string): number {
  const wordsPerMinute = 150;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil((wordCount / wordsPerMinute) * 60);
}
