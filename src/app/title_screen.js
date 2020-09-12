import { GameObject, Scene } from 'kontra';
import { SpriteFont } from './text';
import { CHARSET_DEFAULTS as DEFAULTS } from './charset_defaults';

export const TitleScreen = (props) => {

  let go = GameObject(Object.assign(props, {
    render: function () {
      this.draw();
      this.context.fillStyle = "gray";
      this.context.fillRect(0, 0, this.width, this.height);
    }
  }));

  let title = new SpriteFont(
    Object.assign(DEFAULTS, {
      sourceImage: props.charset,
      text: '404 laundry not found',
      x: (props.width - '404 laundry not found'.length * DEFAULTS.characterWidth * 2) / 2,
      y: DEFAULTS.characterHeight,
    }),
    { scale: 2, align: 'left' }
  );

  let back404 = new SpriteFont(
    Object.assign(DEFAULTS, {
      sourceImage: props.charset,
      text: '404',
      x: (props.width - '404'.length * DEFAULTS.characterWidth * 10) / 2,
      y: (props.height - DEFAULTS.characterHeight * 10) / 2,
      dt: 0,
      alpha: 1,
      width: '404'.length * DEFAULTS.characterWidth * 10,
      height: DEFAULTS.characterHeight * 10,
    }),
    { scale: 10, align: 'left' }
  );

  let cont = new SpriteFont(
    Object.assign(DEFAULTS, {
      sourceImage: props.charset,
      text: 'press -enter- to continue',
      x: (props.width - 'press any key to continue'.length * DEFAULTS.characterWidth * 2) / 2,
      y: props.height - DEFAULTS.characterHeight * 2 * 2,
      dt: 0,
      alpha: 1,
      opacity: 1,
      update: function () {
        this.dt += 1 / 60;
        this.opacity -= 1 / 60;
        if (this.dt > 1) {
          this.dt = 0;
          this.opacity = 1;
        }
      },
    }),
    { scale: 2, align: 'left' }
  );

  return Scene({
    name: 'title',
    children: [go, title, back404, cont],
  })
}
