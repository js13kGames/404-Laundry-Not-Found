import { Sprite, SpriteSheet, keyPressed, getWorldRect } from 'kontra';

const HORIZONTAL_SPEED = 3;
const GRAVITY = 1;
const JUMP_VELOCITY = -12;
const DIR_L = -1;
const DIR_R = 1;

const PLAYER_WIDTH = 12;
const PLAYER_HIGHT = 16;
const PLAYER_SCALE = 3;
const PLAYER_ANCHOR = 0;

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
 * @param {Object} [properties.imageSheet] - Spritesheet image to animate the sprite.
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
    canvasWidth,
    canvasHeight,
    imageSheet,
    platforms,
    ladders,
  } = properties;

  let playerSpriteSheet = SpriteSheet({
    image: imageSheet,
    frameWidth: 12,
    frameHeight: 16,
    animations: {
      idle_right: {
        frames: 1,
        loop: false,
      },
      idle_left: {
        frames: 9,
        loop: false,
      },
      walk_right: {
        frames: '0..7',
        frameRate: 12
      },
      walk_left: {
        frames: '8..15',
        frameRate: 12
      },
      jump_right: {
        frames: '16..20',
        frameRate: 12
      },
      jump_left: {
        frames: '21..25',
        frameRate: 12
      },
    }
  });

  const FIRST_PLATFORM_Y = Array.isArray(platforms) && platforms.length ? platforms[0].y : canvasWidth / 2;

  const worldWidth = tileEngine.width * tileEngine.tilewidth;

  return Sprite({
    x: x || canvasWidth / 2, // center of canvas by default
    y: y || FIRST_PLATFORM_Y - PLAYER_HIGHT * PLAYER_SCALE * (PLAYER_ANCHOR > 0 ? PLAYER_ANCHOR : 1),
    width: width || PLAYER_WIDTH,
    height: height || PLAYER_HIGHT,
    anchor: anchor || { x: PLAYER_ANCHOR, y: PLAYER_ANCHOR },
    scaleX: scaleX || PLAYER_SCALE,
    scaleY: scaleY || PLAYER_SCALE,
    animations: playerSpriteSheet.animations,
    speedX: HORIZONTAL_SPEED,
    dirX: DIR_R,
    onLadder: false,
    onPlatform: false,
    isFalling: false,
    currentPlatform: null,
    currentLadder: null,
    ladders: ladders,
    platforms: platforms,
    update: function (dt) {

      this.checkCollisions();

      // get scaled dimensions of the sprite
      const wc = getWorldRect(this);

      // Set idle animation based on last direction
      if (this.dirX === DIR_R && !this.isFalling) {
        this.playAnimation('idle_right');
      } else if (this.dirX === DIR_L && !this.isFalling) {
        this.playAnimation('idle_left');
      }

      if (keyPressed('left')) {
        // decrease x coordinate
        this.x -= this.speedX;

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
            tileEngine.sx -= this.speedX;
          }
        }
        this.playAnimation('walk_left');
        this.dirX = DIR_L;
      }

      if (keyPressed('right')) {
        // increase x coordinate
        this.x += this.speedX;

        // limit character to ladder bounds
        if (!this.onPlatform && this.onLadder) {
          if (this.x > this.currentLadder.x + this.currentLadder.width - wc.width) {
            this.x = this.currentLadder.x + this.currentLadder.width - wc.width;
          }
        }

        // limit player to the right limit of the canvas
        if (this.x > worldWidth - wc.width) {
          this.x = worldWidth - wc.width;
        } else {
          // the camera and the player together so long as he doesn't reach the edge
          if (this.x > canvasWidth / 2) {
            tileEngine.sx += this.speedX;
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
      } else {
        // fall off a cliff
        this.isFalling = !this.onPlatform && !this.onLadder;
      }

      if (this.dy > 0 && this.onPlatform) {
        this.y = this.currentPlatform.y - wc.height;
        this.dy = 0;
        this.isFalling = false;
      }

      if (keyPressed("up") && this.onLadder) {
        if (this.onLadder) {
          this.y -= 2;
          // adjust to upper bound of the ladder
          if (this.y + wc.height < this.currentLadder.y) {
            this.y = this.currentLadder.y - wc.height;
          }
        }
      }

      if (keyPressed("down") && this.onLadder) {
          this.y += 2;
          // adjust to lower bound of the ladder
          if (this.y + wc.height > this.currentLadder.y + this.currentLadder.height) {
            this.y = this.currentLadder.y + this.currentLadder.height - wc.height;
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
    checkCollisions: function () {
      // get scaled dimensions of the sprite
      const wc = getWorldRect(this);
      // Check ladder collisions
      this.onLadder = false;
      this.currentLadder = null;
      for (let ladder of this.ladders) {
        if (ladder.x <= this.x && ladder.x + ladder.width >= this.x + wc.width
          && this.y >= ladder.y - wc.height && this.y + wc.height <= ladder.y + ladder.height
        ) {
          this.onLadder = true;
          this.currentLadder = ladder;
          break;
        }
      }
      // Check platforms collisions
      this.onPlatform = false;
      this.currentPlatform = null;
      for (let platform of this.platforms) {
        if (platform.x < this.x + wc.width*3/4 && platform.x + platform.width > this.x &&
          Math.abs(this.y + wc.height - platform.y) < 3
        ) {
          this.onPlatform = true;
          this.currentPlatform = platform;
          break;
        }
      }
    }
  });
}
