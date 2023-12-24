const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

class Translator {
  getWordRegExp(word) {
    return new RegExp(`(?<=\\s|^)${word}(?=\\s|\.?$)`, "gi");
  }

  highlight(text, translation) {
    const textWords = text.split(/\s/);
    const translationWords = translation.split(/\s/);
    const highlightedTranslation = [];
    for (let i = 0; i < textWords.length; i++) {
      if (textWords[i] !== translationWords[i]) {
        highlightedTranslation.push(
          `<span class="highlight">${translationWords[i]}</span>`,
        );
      } else {
        highlightedTranslation.push(translationWords[i]);
      }
    }
    return highlightedTranslation.join(" ");
  }

  translate(text, locale) {
    if (locale === "american-to-british") {
      let translatedText = text;

      for (let key in americanOnly) {
        let regex = this.getWordRegExp(key);
        translatedText = translatedText.replace(regex, americanOnly[key]);
      }

      for (let key in americanToBritishSpelling) {
        let regex = this.getWordRegExp(key);
        translatedText = translatedText.replace(
          regex,
          americanToBritishSpelling[key],
        );
      }

      for (let key in americanToBritishTitles) {
        let regex = this.getWordRegExp(key);
        translatedText = translatedText.replace(
          regex,
          americanToBritishTitles[key],
        );
      }

      let timeRegex = /([1-9]|1[012]):([0-5][0-9])/g;
      translatedText = translatedText.replace(
        timeRegex,
        (_match, group1, group2) => `${group1}.${group2}`,
      );

      return translatedText;
    } else if (locale === "british-to-american") {
      let translatedText = text;

      for (let key in britishOnly) {
        let regex = this.getWordRegExp(key);
        translatedText = translatedText.replace(regex, britishOnly[key]);
      }

      for (let key in americanToBritishSpelling) {
        let regex = this.getWordRegExp(americanToBritishSpelling[key]);
        translatedText = translatedText.replace(regex, key);
      }

      for (let key in americanToBritishTitles) {
        let regex = this.getWordRegExp(americanToBritishTitles[key]);
        translatedText = translatedText.replace(regex, key);
      }

      let timeRegex = /([1-9]|1[012]).([0-5][0-9])/g;
      translatedText = translatedText.replace(
        timeRegex,
        (_match, group1, group2) => `${group1}:${group2}`,
      );

      return translatedText;
    } else return "";
  }

  translateAndHighlight(text, locale) {
    return this.highlight(text, this.translate(text, locale));
  }
}

module.exports = Translator;
