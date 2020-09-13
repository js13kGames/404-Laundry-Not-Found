import { Sprite, SpriteSheet } from 'kontra';

export const Enemy = (properties) => {

  const enemySpriteSheet = SpriteSheet({
    image: properties.imageSheet,
    frameWidth: 50,
    frameHeight: 60,
    animations: {
      idle: {
        frames: '0',
        loop: false,
      }
    }
  });

  return Sprite(Object.assign(properties, {
    type: 'enemy',
    animations: enemySpriteSheet.animations,
    update: function (dt) {
      // wrap the sprite to the other side of the screen
      if (this.dx > 0 && this.x >= this.right_bound - this.width) {
        this.dx *= -1;
      }
      if (this.dx < 0 && this.x <= this.left_bound) {
        this.dx *= -1;
      }
      this.playAnimation('idle');
      this.advance(dt);
    },
  }),
  );
}
