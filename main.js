import nlp from "compromise";
import syllable from "compromise-syllables";
import Genius from "./geniusapiclient/genius.js";
nlp.extend(syllable);

const genius = new Genius();

const partsOfSpeech = ["Noun", "Verb", "Adjective", "Adverb", "Preposition", "Conjunction", "Determiner"];

let sentence = "I'm gon' shoot ya (ayy)";

//add error check
function getTextAndTags(sentence) {
  let terms = nlp(sentence)
    .json()[0]
    .terms.map((el) =>
      Object.assign({}, { text: el.text }, { tags: el.tags.filter((tag) => partsOfSpeech.includes(tag)) })
    );
  return terms;
}

//add error check
function getSyllablesCount(sentence) {
  let syllablesCount = nlp(sentence)
    .terms()
    .syllables()
    .map((token) => token.syllables)
    .reduce((count, syllables) => count + syllables.length, 0);
  return syllablesCount;
}

// console.log(getSyllablesCount(sentence));
// console.log(getTextAndTags(sentence));

let gucci = genius.getArtistId(id => gucci = id);
setTimeout(() => console.log(gucci), 3000);
// let lol = await genius.getArtistIdXD();
