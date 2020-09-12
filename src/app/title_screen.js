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

export const TitleScreen = (props) => {

  let go = GameObject(Object.assign(props, {
    render: function() {
      this.draw();
      this.context.fillStyle = "gray";
      this.context.fillRect(0, 0, this.width, this.height);
    }
   }));

  let title = new SpriteFont(
    Object.assign(DEFAULTS, {
      sourceImage: props.charset,
      text: '404 laundry not found',
      x: (props.width - '404 laundry not found'.length * DEFAULTS.characterWidth * 2)/2,
      y: DEFAULTS.characterHeight,
    }),
    { scale: 2, align: 'left' }
  );

  go.addChild(title);

  let back404 = new SpriteFont(
    Object.assign(DEFAULTS, {
      sourceImage: props.charset,
      text: '404',
      x: (props.width - '404'.length * DEFAULTS.characterWidth * 10)/2,
      y: (props.height - DEFAULTS.characterHeight * 10)/2,
      dt: 0,
      alpha: 1,
      width: '404'.length * DEFAULTS.characterWidth * 10,
      height: DEFAULTS.characterHeight * 10,
    }),
    { scale: 10, align: 'left' }
  );

  go.addChild(back404);

  let cont = new SpriteFont(
    Object.assign(DEFAULTS, {
      sourceImage: props.charset,
      text: 'press -enter- to continue',
      x: (props.width - 'press any key to continue'.length * DEFAULTS.characterWidth * 2)/2,
      y: props.height - DEFAULTS.characterHeight * 2 * 2,
      dt: 0,
      alpha: 1,
      render: function() {
        this.dt += 1/60;
        this.alpha -= 1/60;
        if (this.dt > 1) {
          this.dt = 0;
          this.alpha = 1;
        }
        this.context.save();
        this.context.globalAlpha = this.alpha;
        this.draw();
        this.context.restore();
      },
    }),
    { scale: 2, align: 'left' }
  );

  go.addChild(cont);

   return go;
}
