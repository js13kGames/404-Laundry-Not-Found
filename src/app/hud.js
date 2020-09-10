import { GameObject } from 'kontra';
import { SpriteFont } from './text';

const DEFAULTS = {
  characterWidth: 8,
  characterHeight: 8,
  horizontalSpacing: 0,
  verticalSpacing: 0,
  characterSet: 'abcdefghijklmnopqrstuvwxyz0123456789.:!-%,/',
  columnCount: 43
}

export const HUD = (props) => {
  let go = GameObject(props);

  go.update = function(dt) {
    this.elapsedTime += dt;
    this.countdown -= dt;
    if (this.countdown < 0) {
      this.countdown = 0;
    }
    this.children.map(child => child.update && child.update(dt));
  }

  let score = new SpriteFont(
    Object.assign(DEFAULTS, {
      sourceImage: props.charset,
      text: 'score 0',
      x: DEFAULTS.characterWidth,
      y: DEFAULTS.characterHeight,
      update : function(dt) {
        this.text = `score ${this.parent.score}`;
      }
    }),
    { scale: props.textScale }
  );

  go.addChild(score);

  let time = new SpriteFont(
    Object.assign(DEFAULTS, {
      sourceImage: props.charset,
      text: 'time 00:00',
      x: props.width - ('time: 00:00'.length * DEFAULTS.characterWidth * props.textScale) - DEFAULTS.characterWidth,
      y: DEFAULTS.characterHeight,
      update: function(dt) {
        const minutes = Math.floor(Math.ceil(this.parent.countdown) / 60);
        const seconds = Math.ceil(this.parent.countdown) - minutes * 60;
        this.text = `time ${minutes}:${seconds <= 9 ? '0' : ''}${seconds}`;
      }
    }),
    {  scale: props.textScale, align: 'right' }
  );

  go.addChild(time);

  return go;
}
