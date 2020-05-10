import nlp from "compromise";
import syllable from "compromise-syllables";
nlp.extend(syllable);

const partsOfSpeech = ["Noun", "Verb", "Adjective", "Adverb", "Preposition", "Conjunction", "Determiner"];

export const getTextAndTags = (sentence) => {
  let terms = nlp(sentence)
    .json()[0]
    .terms.map((el) => Object.assign({}, { text: el.text }, { tags: el.tags.filter((tag) => partsOfSpeech.includes(tag)) }));
  return terms;
};

export const splitSentenceIntoWords = (sentence) => {
  const words = nlp(sentence).terms();
  return words;
};

//add error check
export const getWordSyllablesCount = (word) => {
  let syllablesCount = nlp(word)
    .terms()
    .syllables()
    .map(({ syllables }) => syllables)
    .reduce((count, syllables) => count + syllables.length, 0);
  return syllablesCount;
};

//add error check
export const getSentenceSyllablesCount = (sentence) => {
  let syllablesCount = nlp(sentence)
    .terms()
    .syllables()
    .map(({ syllables }) => syllables)
    .reduce((count, syllables) => count + syllables.length, 0);
  return syllablesCount;
};
