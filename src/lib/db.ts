import Dexie, { type Table } from "dexie";

export interface Episode {
  id: string;
  title: string;
  topic: string;
  link?: string;
  script: string;
  audioBlob?: Blob;
  audioUrl?: string;
  duration: number;
  createdAt: Date;
  isFavorite: boolean;
}

export class AIRadioDB extends Dexie {
  episodes!: Table<Episode>;

  constructor() {
    super("ai-radio-db");
    this.version(1).stores({
      episodes: "++id, title, topic, createdAt, isFavorite",
    });
  }
}

const db = new AIRadioDB();

export async function saveEpisode(
  episode: Omit<Episode, "id">,
): Promise<string> {
  return await db.episodes.add(episode as Episode);
}

export async function getAllEpisodes(): Promise<Episode[]> {
  return await db.episodes.orderBy("createdAt").reverse().toArray();
}

export async function getEpisode(id: string): Promise<Episode | undefined> {
  return await db.episodes.get(id);
}

export async function deleteEpisode(id: string): Promise<void> {
  await db.episodes.delete(id);
}

export async function toggleFavorite(
  id: string,
  isFavorite: boolean,
): Promise<void> {
  await db.episodes.update(id, { isFavorite });
}

export async function updateEpisodeAudio(
  id: string,
  audioBlob: Blob,
  audioUrl: string,
): Promise<void> {
  await db.episodes.update(id, { audioBlob, audioUrl });
}
