import { Sprite, keyPressed } from 'kontra';

const HORIZONTAL_SPEED = 3;
const GRAVITY = 1;
const JUMP_VELOCITY = -12;
const DIR_L = -1;
const DIR_R = 1;

/**
 * A tile engine for managing and drawing tilesets.
 * @typedef {Object} TileEngine
 * @property {Number} sx - The x camera position.
 * @property {Number} sy - The y camera position.
 * @param {Number} properties.width - Width of the tile map (in number of tiles).
 * @param {Number} properties.height - Height of the tile map (in number of tiles).
 * @param {Number} properties.tilewidth - Width of a single tile (in pixels).
 * @param {Number} properties.tileheight - Height of a single tile (in pixels).
 * 
 */

/**
 * Creates a player as needed for the game
 *
 * @param {Object} properties - Properties of the sprite.
 * @param {Number} [properties.x] - X coordinate of the position vector.
 * @param {Number} [properties.y] - Y coordinate of the position vector.
 * @param {Number} [properties.width] - Width of the sprite.
 * @param {Number} [properties.height] - Height of the sprite.
 * @param {TileEngine} [properties.tileEngine] - Container tileEngine used to adjust the camera.
 * @param {Number} [properties.canvasWidth] - Width of the container canvas.
 * @param {Number} [properties.canvasHeight] - Height of the container canvas.
 * @param {Object} [properties.animations] - An object of Animations from a Spritesheet to animate the sprite.
 * 
 * @return {Sprite} 
 */
export const Player = (properties) => {
  let {
    x,
    y,
    width,
    height,
    anchor,
    scaleX,
    scaleY,
    tileEngine,
    animations,
    canvasWidth,
    canvasHeight,
  } = properties;

  const worldWidth = tileEngine.width * tileEngine.tilewidth;

  return Sprite({
    x: x || canvasWidth / 2, // center of canvas by default
    y: y || canvasHeight / 2, // center of canvas by default
    width: width,
    height: height,
    anchor: anchor,
    scaleX: scaleX,
    scaleY: scaleY,
    animations: animations,
    speed: HORIZONTAL_SPEED,
    onLadder: false,
    onPlatform: false,
    isFalling: false,
    currentPlatform: null,
    currentLadder: null,
    dirX: DIR_R,
    realHeight: height * scaleY * (anchor.y > 0 ? anchor.y : 1),
    realWidth: width * scaleX * (anchor.x > 0 ? anchor.x : 1),
    update: function (dt) {

      // Set idle animation based on last direction
      if (this.dirX === DIR_R && !this.isFalling) {
        this.playAnimation('idle_right');
      } else if (this.dirX === DIR_L && !this.isFalling) {
        this.playAnimation('idle_left');
      }

      if (keyPressed('left')) {
        // decrease x coordinate
        this.x -= this.speed;

        // limit character to ladder bounds
        if (!this.onPlatform && this.onLadder) {
          if (this.x < this.currentLadder.x) {
            this.x = this.currentLadder.x;
          }
        }

        // limit player to the left limit of the canvas
        if (this.x < 0) {
          this.x = 0;
        } else {
          // move the camera and the player together so long as he doesn't reach the edge
          if (this.x < worldWidth - canvasWidth / 2) {
            tileEngine.sx -= this.speed;
          }
        }
        this.playAnimation('walk_left');
        this.dirX = DIR_L;
      }

      if (keyPressed('right')) {
        // increase x coordinate
        this.x += this.speed;

        // limit character to ladder bounds
        if (!this.onPlatform && this.onLadder) {
          if (this.x > this.currentLadder.x + this.currentLadder.width - this.realWidth) {
            this.x = this.currentLadder.x + this.currentLadder.width - this.realWidth;
          }
        }

        // limit player to the right limit of the canvas
        if (this.x > worldWidth - this.realWidth) {
          this.x = worldWidth - this.realWidth;
        } else {
          // the camera and the player together so long as he doesn't reach the edge
          if (this.x > canvasWidth / 2) {
            tileEngine.sx += this.speed;
          }
        }
        this.playAnimation('walk_right');
        this.dirX = DIR_R;
      }

      if (keyPressed('space') && this.onPlatform) {
        this.dy = JUMP_VELOCITY;
        this.isFalling = true;
      }

      if (this.isFalling) {
        this.dy += GRAVITY;
        // Set jump/falling animation
        if (this.dirX === DIR_R) {
          this.playAnimation('jump_right');
        } else if (this.dirX === DIR_L) {
          this.playAnimation('jump_left');
        }
      }

      if (this.dy >= 0 && this.onPlatform) {
        this.y = this.currentPlatform.y - this.realHeight;
        this.dy = 0;
        this.isFalling = false;
      }

      if (keyPressed("up") && this.onLadder) {
        if (this.onLadder) {
          this.y -= 2;
          // adjust to upper bound of the ladder
          if (this.y + this.realHeight < this.currentLadder.y) {
            this.y = this.currentLadder.y - this.realHeight;
          }
        }
      }

      if (keyPressed("down") && this.onLadder) {
          this.y += 2;
          // adjust to lower bound of the ladder
          if (this.y + height > this.currentLadder.y + this.currentLadder.height) {
            this.y = this.currentLadder.y + this.currentLadder.height - this.realHeight;
          }
      }

      this.advance(dt);
    },
    /**
     * Check for collisions
     *
     * @param {Array.<{x: Number, y: Number, height: Number, width: Number}>} [ladders=[]]
     * @param {Array.<{x: Number, y: Number, height: Number, width: Number}>} [platforms=[]]
     */
    checkCollisions: function (ladders = [], platforms = []) {
      // Check ladder collisions
      this.onLadder = false;
      this.currentLadder = null;
      for (let ladder of ladders) {
        if (ladder.x <= this.x && ladder.x + ladder.width >= this.x + this.realWidth
          && this.y >= ladder.y - this.realHeight && this.y + this.realHeight <= ladder.y + ladder.height
        ) {
          this.onLadder = true;
          this.currentLadder = ladder;
          break;
        }
      }
      // Check platforms collisions
      this.onPlatform = false;
      this.currentPlatform = null;
      for (let platform of platforms) {
        if (platform.x <= this.x && platform.x + platform.width >= this.x + this.realWidth &&
          this.y + this.realHeight === platform.y
        ) {
          this.onPlatform = true;
          this.currentPlatform = platform;
          break;
        }
      }
    }
  });
}
