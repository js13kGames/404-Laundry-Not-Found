import { init, load, dataAssets, TileEngine, GameLoop, initKeys, SpriteSheet, imageAssets, Sprite } from 'kontra';
import { Player } from './player';
import { Sock } from './sock';

let { canvas, context } = init();

initKeys();

load(
  'assets/arcade-standard-29-8x.png',
  'assets/player.png',
  'assets/side_scroll_map.json'
).then(assets => {

  let tileEngine = TileEngine(dataAssets['assets/side_scroll_map']);

  const worldWidth = tileEngine.width * tileEngine.tilewidth;

  let spriteSheet = SpriteSheet({
    image: imageAssets['assets/player.png'],
    frameWidth: 16,
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

  let player = Player({
    width: 16,
    height: 16,
    tileEngine: tileEngine,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    animations: spriteSheet.animations,
  });

  // add player to the tileEngine to update sx and sy proportionally
  tileEngine.addObject(player);

  let sock = Sock({
    x: 10,
    y: 480 - (20 * 8),
    width: 10,
    height: 10,
    // Change later for the sprite sheet animations
    color: 'blue',
    dx: 2,
    worldWidth: worldWidth
  });

  // Add sock to the tileEngine to update sx and sy proportionally
  tileEngine.addObject(sock);

  let ladders = [];

  // Create ladders
  tileEngine.layers.forEach(layer => {
    if (layer.name == "ladders") {
      layer.objects.forEach(element => {
        let ladder = Sprite(element);
        ladder.color = 'white';
        tileEngine.addObject(ladder);
        ladders.push(ladder);
      });
    }
  });

  let platforms = [];
  // Create platforms
  tileEngine.layers.forEach(layer => {
    if (layer.name == "platforms") {
      layer.objects.forEach(element => {
        platforms.push(element);
      });
    }
  });

  // use kontra.gameLoop to play the animation
  let loop = GameLoop({
    update: function (dt) {
      player.checkCollisions(ladders, platforms);
      player.update(dt);
      sock.update(dt);
    },
    render: function () {
      // render map
      tileEngine.render();

      // rendering sock sprite
      sock.render();

      // Rendering ladders
      ladders.forEach(l => {
        l.render();
      });

      // render player
      player.render();
    }
  });

  loop.start();
});
