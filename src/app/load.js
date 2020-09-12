import { init, load, dataAssets, TileEngine, GameLoop, initKeys, SpriteSheet, imageAssets, Sprite, randInt, collides } from 'kontra';
import { Player } from './player';
import { Sock, SOCK_COLORS } from './sock';
import { HUD } from './hud';

let { canvas, context } = init();

initKeys();

load(
  'assets/side_scroll_map.json',
  'assets/nature-paltformer-tileset-16x16.png',
  'assets/player.png',
  'assets/charset.png',
  'assets/sock-sheet.png',
).then(assets => {

  let tileEngine = TileEngine(dataAssets['assets/side_scroll_map']);

  const worldWidth = tileEngine.width * tileEngine.tilewidth;

  let ladders = [];
  let platforms = [];
  let lines = []
  tileEngine.layers.forEach(layer => {
    if (layer.name === "objects") {
      layer.objects.forEach(obj => {
        // add ladders
        if (obj.type === "ladder") {
          ladders.push(obj);
        }
        // add platforms
        if (obj.type === "platform") {
          platforms.push(obj);
        }
        // Adding lines y-coordinates
        if (obj.type === "line") {
          lines.push(obj.y);
        }
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

  const FIRST_PLATFORM_Y = platforms[0].y;
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

  let socks = [];

  const numberOfSocks = Math.floor(worldWidth / (13 * 6));

  for (let i = 0; i < lines.length; i++) {
    const yLine = lines[i];
    for (let j = 0; j < numberOfSocks; j++) {
      const p = randInt(0, 5);
      const color = SOCK_COLORS[p];
      let sock = Sock({
        x: j * 13 * 6,
        y: yLine,
        width: 13,
        height: 15,
        dx: 2,
        worldWidth: worldWidth,
        image: imageAssets['assets/sock-sheet'],
        color: color,
      });
      tileEngine.addObject(sock);
      socks.push(sock);
    }
  }

  let score = 0;

  let hud = HUD({
    charset: imageAssets['assets/charset'],
    elapsedTime: 0,
    countdown: 60,
    score: score,
    width: canvas.width,
    textScale: 1.5
  });

  // use kontra.gameLoop to play the animation
  let loop = GameLoop({
    update: function (dt) {
      player.checkCollisions(ladders, platforms);
      player.update(dt);

      for (let i = 0; i < socks.length; i++) {
        let sock = socks[i];
        if (collides(sock, player)) {
          sock.ttl = 0;
          score += 1;
        }
      }

      socks = socks.filter(sprite => sprite.isAlive());

      socks.forEach((sock) => {
        sock.update(dt);
      });

      hud.score = score;

      hud.update(dt);
    },
    render: function () {
      // render map
      tileEngine.render();

      // rendering sock sprites
      socks.forEach((sock) => {
        sock.render();
      });

      // render player
      player.render();

      // render HUD
      hud.render();
    }
  });

  loop.start();
});
