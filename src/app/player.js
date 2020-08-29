import { keyPressed, collides } from 'kontra';
import { CSprite } from './csprite'

const HORIZONTAL_SPEED = 3;
const GRAVITY = 1;
const JUMP_VELOCITY = -12;
const STATE_ON_PLATFORM = 0;
const STATE_FALLING = 1;

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
    tileEngine,
    // animations,
    canvasWidth,
    canvasHeight,
  } = properties;

  const FIRST_PLATFORM_Y = 80;
  const FLOOR = canvasHeight - FIRST_PLATFORM_Y - height;

  const worldWidth = tileEngine.width * tileEngine.tilewidth;
  // const worldHeight = tileEngine.height * tileEngine.tileheight;

  return CSprite({
    x: x || canvasWidth / 2 - width,
    y: y || FLOOR,
    width: width,
    height: height,
    // Change later for the sprite sheet animations
    color: 'red',
    speed: HORIZONTAL_SPEED,
    state: STATE_ON_PLATFORM,
    onLadder: false,
    onPlatform: false,
    currentPlatform: null,
    update: function (dt) {

      if (keyPressed('left')) {
        // decrease x coordinate
        this.x -= this.speed;
        // limit player to the left limit of the canvas
        if (this.x < 0) {
          this.x = 0;
        } else {
          // move the camera and the player together so long as he doesn't reach the edge
          if (this.x < worldWidth - canvasWidth / 2) {
            tileEngine.sx -= this.speed;
          }
        }
      }

      if (keyPressed('right')) {
        // increase x coordinate
        this.x += this.speed;
        // limit player to the right limit of the canvas
        if (this.x > worldWidth - this.width) {
          this.x = worldWidth - this.width;
        } else {
          // the camera and the player together so long as he doesn't reach the edge
          if (this.x > canvasWidth / 2) {
            tileEngine.sx += this.speed;
          }
        }
      }

      if (keyPressed('space') && this.state === STATE_ON_PLATFORM) {
        this.dy = JUMP_VELOCITY;
        this.state = STATE_FALLING;
      }

      if (this.state === STATE_FALLING) {
        this.dy += GRAVITY;
      }

      if (this.dy > 0 && this.onPlatform) {
        this.y = this.currentPlatform.y - this.height;
        this.dy = 0;
        this.state = STATE_ON_PLATFORM;
      }

      if (this.onLadder && keyPressed("up")) {
        this.y -= 2;
      }

      this.advance(dt);
    },
    checkCollisions: function (ladders = [], platforms = []) {
      // Check ladder collisions
      this.onLadder = false;
      for (let ladder of ladders) {
        if (collides(ladder, this)) {
          this.onLadder = true;
          break;
        }
      }
      // Check platforms collisions
      this.onPlatform = false;
      for (let platform of platforms) {
        if (platform.x < this.x && platform.x + platform.width > this.x + this.width &&
          this.y + this.height === platform.y
        ) {
          this.onPlatform = true;
          this.currentPlatform = platform;
          break;
        }
      }
    }
  });
}
