import { Sprite } from 'kontra';

/**
 * Overrides Sprite class to introduce camera position correction for position coordinates
 *
 * @class CSpriteClass
 * @extends {Sprite.class}
 */
class CSpriteClass extends Sprite.class {
  render() {
    this.context.save();
    // correction for camera position
    this.context.translate(-this.sx, -this.sy);
    super.render();
    this.context.restore();
  }
}

/**
 * Overrides Sprite class to introduce camera position correction for position coordinates
 * 
 * @param {Object} [properties] - Properties of the sprite.
 */
export const CSprite = (properties) => {
  return new CSpriteClass(properties);
}


