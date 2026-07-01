export interface AppSettings {
  apiKey: string;
  apiProvider: "kilo" | "opencode" | "gemini" | "none";
  defaultVoice: string;
  autoPlay: boolean;
  playbackSpeed: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  apiKey: "",
  apiProvider: "none",
  defaultVoice: "de-DE-KillianNeural",
  autoPlay: true,
  playbackSpeed: 1,
};

export function loadSettings(): AppSettings {
  try {
    const saved = localStorage.getItem("ai-radio-settings");
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error("Failed to load settings:", e);
  }

  const envSettings: Partial<AppSettings> = {};

  if (import.meta.env.VITE_KILO_API_KEY) {
    envSettings.apiKey = import.meta.env.VITE_KILO_API_KEY;
    envSettings.apiProvider = "kilo";
  } else if (import.meta.env.VITE_OPENCODE_API_KEY) {
    envSettings.apiKey = import.meta.env.VITE_OPENCODE_API_KEY;
    envSettings.apiProvider = "opencode";
  } else if (import.meta.env.VITE_GEMINI_API_KEY) {
    envSettings.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    envSettings.apiProvider = "gemini";
  }

  if (import.meta.env.VITE_DEFAULT_VOICE) {
    envSettings.defaultVoice = import.meta.env.VITE_DEFAULT_VOICE;
  }

  return { ...DEFAULT_SETTINGS, ...envSettings };
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem("ai-radio-settings", JSON.stringify(settings));
}

export function generateScriptFallback(topic: string): string {
  const title = topic.slice(0, 100);
  return `Hallo und willkommen bei AI Radio! Heute geht's um ${title}. Hier ist dein persönlicher Radio-Beitrag. Viel Spaß beim Hören! Übrigens, das war's auch schon wieder für heute. Bis zum nächsten Mal, bleib dran!`;
}

export async function generateScript(
  topic: string,
  settings: AppSettings,
): Promise<string> {
  if (settings.apiProvider === "none" || !settings.apiKey) {
    return generateScriptFallback(topic);
  }

  try {
    let endpoint = "";
    let model = "";

    switch (settings.apiProvider) {
      case "kilo":
        endpoint = "https://api.kilo.sh/v1/chat/completions";
        model = "kilo/free/gemini-2.5-flash";
        break;
      case "opencode":
        endpoint = "https://opencode.ai/v1/chat/completions";
        model = "opencode/deepseek-v4-flash-free";
        break;
      case "gemini":
        endpoint =
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
        break;
    }

    const systemPrompt = `Du bist ein erfahrener Radio-Moderator für ein Tech- und Infotainment-Radio. Deine Aufgabe ist es, den bereitgestellten Text in einen kurzen, extrem leicht verständlichen Radio-Beitrag (maximal 90 Sekunden Sprechzeit) umzuwandeln.
- Nutze kurze Sätze. Keine Schachtelsätze.
- Verwende rhetorische Fragen und lockere Überleitungen ("Übrigens...", "Schon gewusst?").
- Antworte ausschließlich mit dem reinen Sprechtext. Keine Markdown-Formatierung.`;

    if (settings.apiProvider === "gemini") {
      const response = await fetch(`${endpoint}?key=${settings.apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nVerwandle das in ein Radioskript:\n\n${topic}`,
                },
              ],
            },
          ],
          generationConfig: { maxOutputTokens: 500, temperature: 0.8 },
        }),
      });
      const data = await response.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        generateScriptFallback(topic)
      );
    } else {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Verwandle das in ein Radioskript:\n\n${topic}`,
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
      return (
        data.choices?.[0]?.message?.content?.trim() ||
        generateScriptFallback(topic)
      );
    }
  } catch (error) {
    console.error("LLM error, using fallback:", error);
    return generateScriptFallback(topic);
  }
}
