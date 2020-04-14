import nlp from "compromise";
import syllable from "compromise-syllables";
import Connector from "./geniusapiclient/connector.js";
nlp.extend(syllable);

const connector = new Connector();

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

console.log(getSyllablesCount(sentence));
console.log(getTextAndTags(sentence));

console.log(connector.getArtistId());
