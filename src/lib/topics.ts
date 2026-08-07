const TOPICS = {
	technology: [
		'Künstliche Intelligenz erklärt: Was steckt hinter ChatGPT?',
		'Quantencomputer: Die Zukunft der Rechenleistung',
		'Cyber-Sicherheit: So schützt du dich online',
		'Robotik im Alltag: Vom Roboterarm zum Androiden',
		'Space Tech: Mars-Missionen und Weltraumtourismus',
		'5G und 6G: Mehr als nur schnelleres Internet',
		'Blockchain jenseits von Krypto: Smart Contracts & DAOs',
		'Edge Computing: Rechenleistung am Rand des Netzes',
		'Digital Twins: Virtuelle Abbilder der Realität',
		'Neuromorphe Chips: Hardware, die wie das Gehirn denkt',
	],
	science: [
		'Klimawandel: Kipppunkte und Lösungsansätze',
		'CRISPR & Gentechnik: Die Schere im Erbgut',
		'Dunkle Materie: Was hält das Universum zusammen?',
		'mRNA-Impfstoffe: Revolution der Medizin',
		'Neurowissenschaften: Wie das Gehirn Bewusstsein erschafft',
		'Kernfusion: Die Energie der Sterne auf der Erde',
		'Mikrobiom: Die Bakterien, die wir sind',
		'Quantenverschränkung: Spukhafte Fernwirkung',
		'Astrobiologie: Suche nach außerirdischem Leben',
		'Materialwissenschaft: Graphen & Metamaterialien',
	],
	culture: [
		'Digital Art & NFTs: Kunst im Blockchain-Zeitalter',
		'Gaming-Kultur: Vom Nischenhobby zum Mainstream',
		'Streaming-Wars: Wie sich unser Medienkonsum ändert',
		'Social Media Algorithmen: Was sie über dich wissen',
		'Meme Culture: Die Sprache des Internets',
		'Virtual Influencer: Wenn Avatare berühmter sind als Menschen',
		'Creator Economy: Vom Hobby zum Beruf',
		'Retro Gaming: Warum Pixel nie aus der Mode kommen',
		'Internet-Ästhetiken: Vaporwave, Cottagecore & Co.',
		'Digital Fashion: Kleidung, die nicht existiert',
	],
	society: [
		'Future of Work: Remote, KI & 4-Tage-Woche',
		'Bildung 2030: Lernen mit KI-Tutoren',
		'Datenschutz vs. Überwachung: Der gläserne Mensch',
		'KI-Ethik: Wer haftet für algorithmische Entscheidungen?',
		'Urban Planning: Schwammstädte & 15-Minuten-Städte',
		'Grundeinkommen: Utopie oder Notwendigkeit?',
		'Demografie: Alternende Gesellschaften & Migration',
		'Gig Economy: Freiheit oder Prekarität?',
		'Desinformation: Wie Fake News die Demokratie bedrohen',
		'Mental Health im digitalen Zeitalter',
	],
	fun: [
		'Weird Science: Ig-Nobel-Preise & kurioseste Studien',
		'Internet Mysteries: Cicada 3301 & ungeklärte Phänomene',
		'Retro Tech: Disketten, Modems & der Sound der 90er',
		'Verschwörungstheorien: Warum wir an sie glauben',
		'Die seltsamsten Gesetze aus aller Welt',
		'Lost Media: Verschwundene Filme, Spiele & Websites',
		'Number Stations: Geheime Radiosignale im Äther',
		'Glitches in the Matrix: Simulationstheorie',
		'Kryptide: Bigfoot, Nessie & die Suche nach Beweisen',
		'Die absurdesten Patente der Geschichte',
	],
}

const CATEGORY_NAMES: Record<keyof typeof TOPICS, string> = {
	technology: '💻 Technologie',
	science: '🔬 Wissenschaft',
	culture: '🎨 Kultur',
	society: '👥 Gesellschaft',
	fun: '🎲 Fun & Kurioses',
}

const TOPIC_CATEGORIES = TOPICS

const ALL_TOPICS = Object.values(TOPICS).flat()

export function getRandomTopic(category?: keyof typeof TOPICS): string {
	if (category && TOPICS[category]) {
		const topics = TOPICS[category]
		return topics[Math.floor(Math.random() * topics.length)]
	}
	return ALL_TOPICS[Math.floor(Math.random() * ALL_TOPICS.length)]
}

export function getTopicsByCategory(category: keyof typeof TOPICS): string[] {
	return TOPICS[category] || []
}

export function getAllCategories(): (keyof typeof TOPICS)[] {
	return Object.keys(TOPICS) as (keyof typeof TOPICS)[]
}

export function getRandomCategory(): keyof typeof TOPICS {
	const categories = getAllCategories()
	return categories[Math.floor(Math.random() * categories.length)]
}

export function getCategories(): {id: keyof typeof TOPICS; name: string}[] {
	return Object.entries(CATEGORY_NAMES).map(([id, name]) => ({
		id: id as keyof typeof TOPICS,
		name,
	}))
}

export {TOPICS, TOPIC_CATEGORIES, CATEGORY_NAMES}
export type TopicCategory = keyof typeof TOPICS
