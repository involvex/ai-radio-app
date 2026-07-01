const baseUrl = `speech.platform.bing.com/consumer/speech/synthesize/readaloud`;
const token = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const webSocketURL = `wss://${baseUrl}/edge/v1?TrustedClientToken=${token}`;

function uuid() {
  return crypto.randomUUID().replaceAll("-", "");
}

export type TtsOptions = Partial<{
  voice: string;
  volume: string;
  rate: string;
  pitch: string;
}>;

export async function tts(
  text: string,
  options: TtsOptions = {},
): Promise<ArrayBuffer> {
  const {
    voice = "de-DE-KillianNeural",
    volume = "+0%",
    rate = "+0%",
    pitch = "+0Hz",
  } = options;

  return new Promise<ArrayBuffer>((resolve, reject) => {
    const ws = new WebSocket(`${webSocketURL}&ConnectionId=${uuid()}`);
    ws.binaryType = "arraybuffer";
    const audioData: ArrayBuffer[] = [];

    ws.onmessage = (event) => {
      if (typeof event.data === "string") {
        if (event.data.includes("turn.end")) {
          ws.close();
        }
        return;
      }

      const data = event.data as ArrayBuffer;
      const separator = "Path:audio\r\n";
      const separatorBytes = new TextEncoder().encode(separator);
      const dataBytes = new Uint8Array(data);
      const separatorIndex = findSequenceIndex(dataBytes, separatorBytes);

      if (separatorIndex !== -1) {
        const audioContent = dataBytes.slice(
          separatorIndex + separatorBytes.length,
        );
        audioData.push(audioContent.buffer);
      }
    };

    ws.onerror = (error) => {
      reject(error);
    };

    ws.onopen = () => {
      const speechConfig = JSON.stringify({
        context: {
          synthesis: {
            audio: {
              metadataoptions: {
                sentenceBoundaryEnabled: false,
                wordBoundaryEnabled: false,
              },
              outputFormat: "audio-24khz-48kbitrate-mono-mp3",
            },
          },
        },
      });

      const configMessage = `X-Timestamp:${Date()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n${speechConfig}`;
      ws.send(configMessage);

      const ssmlMessage =
        `X-RequestId:${uuid()}\r\nContent-Type:application/ssml+xml\r\n` +
        `X-Timestamp:${Date()}Z\r\nPath:ssml\r\n\r\n` +
        `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>` +
        `<voice name='${voice}'><prosody pitch='${pitch}' rate='${rate}' volume='${volume}'>` +
        `${text}</prosody></voice></speak>`;

      ws.send(ssmlMessage);
    };

    ws.onclose = () => {
      if (audioData.length > 0) {
        const totalLength = audioData.reduce(
          (sum, buf) => sum + buf.byteLength,
          0,
        );
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const buf of audioData) {
          result.set(new Uint8Array(buf), offset);
          offset += buf.byteLength;
        }
        resolve(result.buffer);
      } else {
        reject(new Error("No audio data received"));
      }
    };
  });
}

function findSequenceIndex(data: Uint8Array, sequence: Uint8Array): number {
  for (let i = 0; i <= data.length - sequence.length; i++) {
    let found = true;
    for (let j = 0; j < sequence.length; j++) {
      if (data[i + j] !== sequence[j]) {
        found = false;
        break;
      }
    }
    if (found) return i;
  }
  return -1;
}

export async function ttsToBlob(
  text: string,
  options?: TtsOptions,
): Promise<Blob> {
  const buffer = await tts(text, options);
  return new Blob([buffer], { type: "audio/mp3" });
}

export const VOICES = {
  german: [
    { id: "de-DE-KillianNeural", name: "Killian (Male)", gender: "Male" },
    { id: "de-DE-ConradNeural", name: "Conrad (Male)", gender: "Male" },
    { id: "de-DE-FreyaNeural", name: "Freya (Female)", gender: "Female" },
    { id: "de-DE-KatjaNeural", name: "Katja (Female)", gender: "Female" },
  ],
  english: [
    { id: "en-US-GuyNeural", name: "Guy (Male)", gender: "Male" },
    { id: "en-US-JennyNeural", name: "Jenny (Female)", gender: "Female" },
  ],
};
