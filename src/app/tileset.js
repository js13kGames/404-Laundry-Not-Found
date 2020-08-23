import { init, load, dataAssets, imageAssets, TileEngine, SpriteSheet, Sprite, GameLoop, initKeys, keyPressed } from 'kontra';

let { canvas, context } = init();

initKeys();

load(
  'assets/colored_tilemap_packed.png',
  'assets/sprite2.png',
  'assets/george.png',
  'assets/tilemap.json'
)
  .then(assets => {
    let tileEngine = TileEngine(dataAssets['assets/tilemap']);

    let worldWidth = tileEngine.width * tileEngine.tilewidth;
    let worldHeight = tileEngine.height * tileEngine.tileheight;

    let image = imageAssets['assets/george.png'];

    let spriteSheet = SpriteSheet({
      image: image,
      frameWidth: 48,
      frameHeight: 48,
      animations: {
        walk_down: {
          frames: [0, 4, 8, 12],
          frameRate: 8,
        },
        walk_left: {
          frames: [1, 5, 9, 13],
          frameRate: 8,
        },
        walk_right: {
          frames: [3, 7, 11, 15],
          frameRate: 8,
        },
        walk_up: {
          frames: [2, 6, 10, 14],
          frameRate: 8,
        }
      }
    });

    let sprite = Sprite({
      x: 200,
      y: 200,
      //anchor: { x: 0.5, y: 0.5 },
      height: 48,
      width: 48,
      speed: 2,
      // required for an animation sprite
      animations: spriteSheet.animations,
      update: function (dt) {

        let collisionBox = {
          x: this.x + tileEngine.sx,
          y: this.y + tileEngine.sy,
          height: this.height,
          width: this.width,
        }

        if (keyPressed('left')) {
          this.playAnimation('walk_left');

          collisionBox.x -= this.speed;

          if (tileEngine.layerCollidesWith('collisions', collisionBox)) {
            return;
          }

          this.x -= this.speed;

          // limit player to the left limit of the canvas
          if (this.x < 0) {
            this.x = 0;
          }

          this.advance();

          // move the camera and the player together so long as he doesn't reach the edge
          if (this.x < worldWidth - canvas.width / 2) {
            tileEngine.sx -= this.speed;
          }

        }

        if (keyPressed('right')) {
          this.playAnimation('walk_right');

          collisionBox.x += this.speed;

          if (tileEngine.layerCollidesWith('collisions', collisionBox)) {
            return;
          }

          this.x += this.speed;

          // limit player to the right limit of the canvas
          if (this.x > canvas.width - this.width) {
            this.x = canvas.width - this.width;
          }

          this.advance();

          // the camera and the player together so long as he doesn't reach the edge
          if (this.x > canvas.width / 2) {
            tileEngine.sx += this.speed;
          }

        }

        if (keyPressed('up')) {
          this.playAnimation('walk_up');

          collisionBox.y -= this.speed;

          if (tileEngine.layerCollidesWith('collisions', collisionBox)) {
            return;
          }

          this.y -= this.speed;

          // limit player to the left limit of the canvas
          if (this.y < 0) {
            this.y = 0;
          }

          this.advance();

          // move the camera and the player together so long as he doesn't reach the edge
          if (this.y < worldHeight - canvas.height / 2) {
            tileEngine.sy -= this.speed;
          }

        }

        if (keyPressed('down')) {
          this.playAnimation('walk_down');

          collisionBox.y += this.speed;

          if (tileEngine.layerCollidesWith('collisions', collisionBox)) {
            return;
          }

          this.y += this.speed;

          // limit player to the lower limit of the canvas
          if (this.y > canvas.height - this.height) {
            this.y = canvas.height - this.height;
          }

          this.advance();

          // move the camera and the player together so long as he doesn't reach the edge
          if (this.y > canvas.height / 2) {
            tileEngine.sy += this.speed;
          }

        }
      }
    });

    tileEngine.addObject(sprite);

    // use kontra.gameLoop to play the animation
    let loop = GameLoop({
      update: function (dt) {
        sprite.update();
      },
      render: function () {
        tileEngine.render();
        sprite.render();
      }
    });

    loop.start();

  });
