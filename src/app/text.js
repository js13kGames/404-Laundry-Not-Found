import { GameObject } from 'kontra';

// Adapted from Mikhail Radionov https://heckx2.com/canvas-sprite-font/
export class SpriteFont extends GameObject.class {

  static DEFAULT_OPTIONS = {
    scale: 1,
    characterSpacing: 1,
    lineSpacing: 10,
    align: 'left',
  };

  constructor(properties, options = {}) {
    super(properties);

    this.config = properties;
    this.sourceImage = properties.sourceImage;
    this.options = Object.assign({}, SpriteFont.DEFAULT_OPTIONS, options);

    if (!this.sourceImage) {
      throw new Error(`Font sourceImage is not defined`);
    }
  }

  draw() {
    this.drawText(this.text);
  }

  drawCharacter(character, position = { x: 0, y: 0 }) {
    const characterIndex = this.config.characterSet.indexOf(character);

    if (characterIndex === -1) {
      throw new Error(`Font character "${character}" is not defined`);
    }

    const rowIndex = Math.floor(characterIndex / this.config.columnCount);
    const columnIndex = characterIndex % this.config.columnCount;

    const {
      characterWidth,
      characterHeight,
      horizontalSpacing,
      verticalSpacing,
    } = this.config;

    const sourceX = columnIndex * (characterWidth + horizontalSpacing);
    const sourceY = rowIndex * (characterHeight + verticalSpacing);
    const sourceWidth = characterWidth;
    const sourceHeight = characterHeight;

    const destinationX = position.x;
    const destinationY = position.y;
    const destinationWidth = characterWidth * this.options.scale;
    const destinationHeight = characterHeight * this.options.scale;


    this.context.drawImage(
      this.sourceImage,
      sourceX, sourceY, sourceWidth, sourceHeight,
      destinationX, destinationY, destinationWidth, destinationHeight
    );
  }

  drawWord(word, position = { x: 0, y: 0 }) {
    const characters = this.splitWordIntoCharacters(word);

    characters.forEach((character, characterIndex) => {
      let characterSpacing = this.options.characterSpacing;
      if (characterIndex === 0) {
        characterSpacing = 0;
      }

      const characterTotalWidth = this.config.characterWidth * this.options.scale + characterSpacing;

      const characterX = position.x + characterIndex * characterTotalWidth;
      const characterY = position.y;

      const characterPosition = {
        x: characterX,
        y: characterY,
      };

      this.drawCharacter(character, characterPosition);
    });
  }

  drawLine(line, position = { x: 0, y: 0 }) {
    const words = this.splitLineIntoWords(line);

    let prevWordEndX = 0;

    words.forEach((word, wordIndex) => {
      const wordX = position.x + prevWordEndX;
      const wordY = position.y;
      const wordPosition = {
        x: wordX,
        y: wordY,
      };

      this.drawWord(word, wordPosition);

      const wordWidth = this.getWordWidth(word);

      let wordSpacing = this.getWordSpacing();
      if (wordIndex === words.length - 1) {
        wordSpacing = 0;
      }

      const wordTotalWidth = wordWidth + wordSpacing;

      prevWordEndX += wordTotalWidth;
    });
  }

  drawText(text, position = { x: 0, y: 0 }) {
    const textWidth = this.getTextWidth(text);

    const lines = this.splitTextIntoLines(text);

    lines.forEach((line, lineIndex) => {
      let lineSpacing = this.options.lineSpacing;
      if (lineIndex === 0) {
        lineSpacing = 0;
      }

      const lineWidth = this.getLineWidth(line);

      let lineX = position.x;
      if (this.options.align === 'center') {
        lineX += (textWidth - lineWidth) / 2;
      } else if (this.options.align === 'right') {
        lineX += textWidth - lineWidth;
      }

      const lineTotalHeight = this.config.characterHeight * this.options.scale + lineSpacing;

      const lineY = position.y + lineTotalHeight * lineIndex;

      const linePosition = {
        x: lineX,
        y: lineY,
      };

      this.drawLine(line, linePosition);
    });
  }

  splitWordIntoCharacters(word) {
    return Array.from(word);
  }

  splitLineIntoWords(line) {
    return line.split(' ');
  }

  splitTextIntoLines(text) {
    return text.split('\n');
  }

  getWordWidth(word) {
    const allCharactersWidth = word.length * (this.config.characterWidth * this.options.scale);
    const allSpacingsWidth = (word.length - 1) * this.options.characterSpacing;

    const wordWidth = allCharactersWidth + allSpacingsWidth;

    return wordWidth;
  }

  getWordSpacing() {
    return this.config.characterWidth * this.options.scale + this.options.characterSpacing * 2
  }

  getLineWidth(line) {
    let lineWidth = 0;

    const words = this.splitLineIntoWords(line);

    words.forEach((word, wordIndex) => {
      const wordWidth = this.getWordWidth(word);

      let wordSpacing = this.getWordSpacing();
      if (wordIndex === 0) {
        wordSpacing = 0;
      }

      const wordTotalWidth = wordWidth + wordSpacing;

      lineWidth += wordTotalWidth;
    });

    return lineWidth;
  }

  getTextWidth(text) {
    const lines = this.splitTextIntoLines(text);

    const lineWidths = lines.map((line) => {
      return this.getLineWidth(line);
    });

    const maxLineWidth = Math.max(...lineWidths);

    return maxLineWidth;
  }
}
