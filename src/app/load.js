import { init, load, dataAssets, TileEngine, GameLoop, initKeys, SpriteSheet, imageAssets, Sprite } from 'kontra';
import { Player } from './player';
import { Sock } from './sock';
import { HUD } from './hud';

let { canvas, context } = init();

initKeys();

load(
  'assets/arcade-standard-29-8x.png',
  'assets/player.png',
  'assets/side_scroll_map.json',
  'assets/charset.png'
).then(assets => {

  let tileEngine = TileEngine(dataAssets['assets/side_scroll_map']);

  const worldWidth = tileEngine.width * tileEngine.tilewidth;

  // Create ladders
  let ladders = [];
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

  // Create platforms
  let platforms = [];
  tileEngine.layers.forEach(layer => {
    if (layer.name == "platforms") {
      layer.objects.forEach(element => {
        platforms.push(element);
      });
    }
  });

  let spriteSheet = SpriteSheet({
    image: imageAssets['assets/player.png'],
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

  const FIRST_PLATFORM_Y = platforms[platforms.length - 1].y;
  const PLAYER_WIDTH = 12;
  const PLAYER_HIGHT = 16;
  const PLAYER_SCALE = 3;
  const PLAYER_ANCHOR = 0;

  let player = Player({
    y: FIRST_PLATFORM_Y - PLAYER_HIGHT * PLAYER_SCALE * (PLAYER_ANCHOR > 0 ? PLAYER_ANCHOR : 1),
    width: PLAYER_WIDTH,
    height: PLAYER_HIGHT,
    anchor: { x: PLAYER_ANCHOR, y: PLAYER_ANCHOR },
    scaleX: PLAYER_SCALE,
    scaleY: PLAYER_SCALE,
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

  let hud = HUD({
    charset: imageAssets['assets/charset'],
    elapsedTime: 0,
    countdown: 60,
  });

  // use kontra.gameLoop to play the animation
  let loop = GameLoop({
    update: function (dt) {
      player.checkCollisions(ladders, platforms);
      player.update(dt);
      sock.update(dt);
      hud.update(dt);
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

      // render HUD
      hud.render();
    }
  });

  loop.start();
});
