import nlp from "compromise";
import syllable from "compromise-syllables";
import Genius from "./geniusapiclient/genius.js";
nlp.extend(syllable);

const genius = new Genius();

const partsOfSpeech = ["Noun", "Verb", "Adjective", "Adverb", "Preposition", "Conjunction", "Determiner"];

let sentence = "Before it pop, before it dock, Get it hot then make it spin";

//add error check
function getTextAndTags(sentence) {
  let terms = nlp(sentence)
    .json()[0]
    .terms.map((el) => Object.assign({}, { text: el.text }, { tags: el.tags.filter((tag) => partsOfSpeech.includes(tag)) }));
  return terms;
}

function splitSentenceIntoWords(sentence) {
  const words = nlp(sentence).terms();
  return words;
}

//add error check
function getWordSyllablesCount(word) {
  let syllablesCount = nlp(word)
    .terms()
    .syllables()
    .map(({ syllables }) => syllables)
    .reduce((count, syllables) => count + syllables.length, 0);
  return syllablesCount;
}

//add error check
function getSentenceSyllablesCount(sentence) {
  let syllablesCount = nlp(sentence)
    .terms()
    .syllables()
    .map(({ syllables }) => syllables)
    .reduce((count, syllables) => count + syllables.length, 0);
  return syllablesCount;
}

let gucciSongs = genius
  .generateHaiku("Gucci Mane")
  .then((songs) => (gucciSongs = songs))
  .then(() => console.log(gucciSongs))
  .catch((err) => console.error(err));

export { splitSentenceIntoWords, getWordSyllablesCount };
