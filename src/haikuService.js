import { getWordSyllablesCount } from "./utils.js";


export default class HaikuService {
  constructor() {
    
  }

  extractHaikuLines(lyrics) {
    let fiveSyllables = new Set();
    let sevenSyllables = new Set();
   
    for (const line of lyrics) {
      let counter = 0;
      const words = line.split(" ");
      for (let i = 0; i < words.length; i++) {
        const syllables = getWordSyllablesCount(words[i]);
        counter += syllables;
        const expression = words.slice(0, i).join(" ");
        if (counter === 5) {
          fiveSyllables.add(expression);
          break;
        } else if (counter === 7) {
          sevenSyllables.add(expression);
          break;
        }
      }
    }
    fiveSyllables = [...fiveSyllables];
    sevenSyllables = [...sevenSyllables];
    return [fiveSyllables, sevenSyllables];
  }

   generateHaiku(lyrics) {
    const [fiveSyllables, sevenSyllables] = this.extractHaikuLines(lyrics);

    const firstLine = fiveSyllables[Math.floor(Math.random() * fiveSyllables.length)];
    const secondLine = fiveSyllables[Math.floor(Math.random() * sevenSyllables.length)];
    const thirdLine = fiveSyllables[Math.floor(Math.random() * fiveSyllables.length)];

    const haiku = [firstLine, secondLine, thirdLine];
    return haiku;
  }
}
