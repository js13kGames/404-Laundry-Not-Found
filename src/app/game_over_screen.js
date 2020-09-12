import { GameObject, Scene, Sprite } from 'kontra';
import { SpriteFont } from './text';
import { CHARSET_DEFAULTS as DEFAULTS } from './charset_defaults';

export const GameOverScreen = (props) => {

  let go = GameObject(Object.assign(props, {
    render: function () {
      this.draw();
      this.context.fillStyle = "gray";
      this.context.fillRect(0, 0, this.width, this.height);
    }
  }));

  let rip = Sprite({
    x: Math.floor((props.width - props.deathImage.width*2)/2),
    y: Math.floor((props.height - props.deathImage.height*2)/2) - 100,
    width: props.deathImage.width,
    height: props.deathImage.height,
    scaleX: 2,
    scaleY: 2,
    image: props.deathImage,
  });

  let back404 = new SpriteFont(
    Object.assign(DEFAULTS, {
      sourceImage: props.charset,
      text: 'game over',
      x: (props.width - 'game over'.length * DEFAULTS.characterWidth * 10) / 2,
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
      text: 'press -enter- to restart',
      x: (props.width - 'press -enter- to restart'.length * DEFAULTS.characterWidth * 2) / 2,
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
    name: 'game_over',
    children: [go, rip, back404, cont],
  })
}

