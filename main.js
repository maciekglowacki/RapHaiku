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
    .terms.map((el) =>
      Object.assign({}, { text: el.text }, { tags: el.tags.filter((tag) => partsOfSpeech.includes(tag)) })
    );
  return terms;
}

function splitSentenceIntoWords(sentence) {
  const words = nlp(sentence).terms();
  console.log(words);
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

function getSyllablesCountv2(word) {
  let syllablesCountv2 = word.syllables().map(({ syllables }) => syllables);
  return syllablesCountv2;
}

// console.log(getSyllablesCount(sentence));
// console.log(getTextAndTags(sentence));

// let gucciSongs = genius
//   .getArtistSongsLyrics("Gucci Mane")
//   .then((songs) => (gucciSongs = songs))
//   .catch((err) => console.error(err));

// setTimeout(() => {
//   console.log(gucciSongs);
// }, 2000);

// console.log(getSyllablesCount(sentence));
// console.log(getSyllablesCountv2(sentence));

let xd = genius.extractHaikuLegibleLinesFromLyrics(["Before it pop, before it dock, Get it hot then make it spin"]);
console.log(xd);

export { splitSentenceIntoWords, getWordSyllablesCount };
