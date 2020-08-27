import { CSprite } from './csprite'

export const Sock = (properties) => {
  return CSprite(Object.assign(properties, {
    update: function (dt) {
      // wrap the sprite to the other side of the screen
      if (this.x > this.worldWidth - this.width) {
        this.x = -this.x;
      }
      this.advance(dt);
    }
  }),
  );
}
