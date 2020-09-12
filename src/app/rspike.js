import { Sprite, SpriteSheet } from 'kontra';

export const RSpike = (properties) => {

  const spikeSpriteSheet = SpriteSheet({
    image: properties.imageSheet,
    frameWidth: 27,
    frameHeight: 27,
    animations: {
      rotating: {
        frames: '0..2',
        frameRate: 12
      }
    }
  });

  return Sprite(Object.assign(properties, {
    animations: spikeSpriteSheet.animations,
    update: function (dt) {
      // wrap the sprite to the other side of the screen
      if (this.dx > 0 && this.x > this.worldWidth - this.width) {
        this.x -= this.x;
      }
      if (this.dx < 0 && this.x < 0) {
        this.x = this.worldWidth - this.x;
      }
      this.playAnimation('rotating');
      this.advance(dt);
    },
  }),
  );
}
