import { getWordSyllablesCount } from "./utils";

export default class HaikuService {
	extractHaikuLines(lyrics: Array<string>) {
		const fiveSyllables: Array<string> = [];
		const sevenSyllables: Array<string> = [];
		for (const line of lyrics) {
			let counter = 0;
			const words = line.split(" ");
			for (let i = 0; i < words.length; i++) {
				const syllables = getWordSyllablesCount(words[i]);
				counter += syllables;
				const expression = words.slice(0, i).join(" ");
				if (counter === 5 && !fiveSyllables.includes(expression)) {
					fiveSyllables.push(expression);
					break;
				} else if (counter === 7 && !sevenSyllables.includes(expression)) {
					sevenSyllables.push(expression);
					break;
				}
			}
		}

		return [fiveSyllables, sevenSyllables];
	}

	generateHaiku(lyrics: Array<string>) {
		const [fiveSyllables, sevenSyllables] = this.extractHaikuLines(lyrics);

		const firstLine = fiveSyllables[Math.floor(Math.random() * fiveSyllables.length)];
		const secondLine = fiveSyllables[Math.floor(Math.random() * sevenSyllables.length)];
		const thirdLine = fiveSyllables[Math.floor(Math.random() * fiveSyllables.length)];

		const haiku = [firstLine, secondLine, thirdLine];
		return haiku;
	}
}
