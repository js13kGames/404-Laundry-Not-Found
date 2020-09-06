import { GameObject } from 'kontra';
import { SpriteFont } from './text';

const TEXT_CONFIG = {
  characterWidth: 8,
  characterHeight: 8,
  horizontalSpacing: 0,
  verticalSpacing: 0,
  characterSet: 'abcdefghijklmnopqrstuvwxyz0123456789.:!-%,/',
  text: 'score: 0',
  columnCount: 43
}

export const HUD = (properties) => {
  let go = GameObject(properties);

  let score = new SpriteFont(
    Object.assign(TEXT_CONFIG, {
      sourceImage: properties.charset,
      text: 'score: 0',
      x: 8,
      y: 8,
    }),
    { scale: 1.5 }
  );

  go.addChild(score);

  let time = new SpriteFont(
    Object.assign(TEXT_CONFIG, {
      sourceImage: properties.charset,
      text: 'time: 00:00',
      x: 640 - (12 * TEXT_CONFIG.characterWidth * 1.5) - 8,
      y: 8,
    }),
    { scale: 1.5, align: 'right' }
  );

  go.addChild(time);

  return go;
}
