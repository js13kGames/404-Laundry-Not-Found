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

  go.update = function(dt) {
    this.elapsedTime += dt;
    this.countdown -= dt;
    if (this.countdown < 0) {
      this.countdown = 0;
    }
    this.children.map(child => child.update && child.update(dt));
  }

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
      x: 640 - (11 * TEXT_CONFIG.characterWidth * 1.5) - 8,
      y: 8,
      update: function(dt) {
        const minutes = Math.floor(Math.ceil(this.parent.countdown) / 60);
        const seconds = Math.ceil(this.parent.countdown) - minutes * 60;
        this.text = `time: ${minutes}:${seconds <= 9 ? '0' : ''}${seconds}`;
      }
    }),
    { scale: 1.5, align: 'right' }
  );

  go.addChild(time);

  return go;
}
