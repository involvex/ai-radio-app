const TOPICS = {
  tech: [
    "Künstliche Intelligenz erklärt: Was steckt hinter ChatGPT?",
    "Warum ist mein Smartphone jedes Jahr schneller?",
    "Die Zukunft des Internets: Web 3.0 und Blockchain",
    "Smart Home - Dein Haus denkt für dich",
    "Cyber-Sicherheit: So schützt du dich online",
    "5G - Mehr als nur schnelleres Internet",
    "Cloud Computing: Wo sind meine Daten wirklich?",
    "Das Metaverse - Zukunft oder Luftschloss?",
    "E-Auto vs. Verbrenner: Was ist besser für die Umwelt?",
    "Wie funktioniert Gesichtserkennung?",
  ],
  wissen: [
    "Warum schlafen wir? Die Wissenschaft des Schlafs",
    "Wie entstehen Träume?",
    "Schwarze Löcher: Was wissen wir wirklich?",
    "Der Klimawandel in 5 Minuten erklärt",
    "Warum ist der Himmel blau?",
    "DNA: Der Bauplan des Lebens",
    "Wie heilt eine Wunde?",
    "Der Ozean: Das letzte unbekannte Gebiet der Erde",
    "Quantenphysik für Anfänger",
    "Warum haben wir Jahrzehnte?",
  ],
  gesellschaft: [
    "Generation Z: Die digitale Eingeborene",
    "Social Media - Sucht oder Kommunikation?",
    "Warum ist Urlaub wichtig für unsere Gesundheit?",
    "Die Wissenschaft des Lächelns",
    "Warum procrastinieren wir?",
    "Stadt vs. Land: Wo lebt es sich besser?",
    "Die Psyche unter Stress: Was passiert im Gehirn?",
    "Warum lieben wir Horrorfilme?",
    "Der Einfluss von Musik auf unsere Stimmung",
    "Warum ist Lesen gut fürs Gehirn?",
  ],
  ratgeber: [
    "Gesünder schlafen: 10 Tipps für besseren Schlaf",
    "Wie bleibe ich motiviert?",
    "Effektives Lernen: Die Pomodoro-Technik",
    "Gesunde Ernährung für Anfänger",
    "Wie reduziere ich Stress im Alltag?",
    "Mehr Produktivität in weniger Zeit",
    "Gesund bleiben im Homeoffice",
    "Wie funktioniert unser Gedächtnis?",
    "Besser konzentrieren: Fokus fürs digitale Zeitalter",
    "Work-Life-Balance: Tipps für Berufstätige",
  ],
  witziges: [
    "Warum gähnen wir ansteckend?",
    "Die seltsamsten Gesetze aus aller Welt",
    "Warum vergessen wir Träume so schnell?",
    "Haustiere verstehen uns besser als wir denken",
    "Die Wissenschaft hinter Déjà vu",
    "Warum macht Kaffee uns wach?",
    "Ungewöhnliche Fakten, die niemand braucht",
    "Warum haben Katzen neun Leben?",
    "Die lustigsten Übersetzungsfehler der Geschichte",
    "Warum knacken unsere Finger?",
  ],
  trending: [
    "Bitcoin und Kryptowährungen für Einsteiger",
    "NFTs: Digitales Eigentum erklärt",
    "Influencer Marketing: Wie funktioniert das?",
    "Nachhaltigkeit: Was kann jeder tun?",
    "Remote-Arbeit: Die Zukunft der Büros?",
    "Elektromobilität: Der Weg zur Klimaneutralität?",
    "Datenschutz im digitalen Zeitalter",
    "Kreativität und künstliche Intelligenz",
    "Die Streaming-Revolution: Fernsehen neu gedacht",
    "Fitness-Tracker: Wie gesund sind wir wirklich?",
  ],
};

const CATEGORY_NAMES: Record<keyof typeof TOPICS, string> = {
  tech: "💻 Technologie",
  wissen: "🔬 Wissenschaft",
  gesellschaft: "👥 Gesellschaft",
  ratgeber: "💡 Ratgeber",
  witziges: "😄 Interessantes",
  trending: "📈 Trendthemen",
};

const ALL_TOPICS = Object.values(TOPICS).flat();

export function getRandomTopic(): string {
  return ALL_TOPICS[Math.floor(Math.random() * ALL_TOPICS.length)];
}

export function getRandomTopicByCategory(
  category: keyof typeof TOPICS,
): string {
  const topics = TOPICS[category];
  return topics[Math.floor(Math.random() * topics.length)];
}

export function getRandomCategory(): keyof typeof TOPICS {
  const categories = Object.keys(TOPICS) as (keyof typeof TOPICS)[];
  return categories[Math.floor(Math.random() * categories.length)];
}

export function getCategories(): { id: keyof typeof TOPICS; name: string }[] {
  return Object.entries(CATEGORY_NAMES).map(([id, name]) => ({
    id: id as keyof typeof TOPICS,
    name,
  }));
}

export { TOPICS, CATEGORY_NAMES };
