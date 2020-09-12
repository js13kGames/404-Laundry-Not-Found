import { init, load, dataAssets, TileEngine, GameLoop, initKeys, imageAssets, randInt, collides, bindKeys } from 'kontra';
import { Player } from './player';
import { Sock, SOCK_COLORS } from './sock';
import { HUD } from './hud';
import { TitleScreen } from './title_screen';

let { canvas } = init();

let ladders = [];
let platforms = [];
let socks = [];

let tileEngine = null;
let player = null;
let score = 0;
let hud = null;

let titleScreen = null;

const TITLE_SCREEN = 'title';
const GAME_SCREEN = 'game';
let scene = TITLE_SCREEN;

const setupPlayer = () => {
  return Player({
    tileEngine: tileEngine,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    imageSheet: imageAssets['assets/player.png'],
    platforms: platforms,
    ladders: ladders,
  });
}

const setupSocks = (worldWidth, lines) => {
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
        dx: 2 * (i % 2 === 0 ? -1 : 1),
        worldWidth: worldWidth,
        image: imageAssets['assets/sock-sheet'],
        color: color,
      });
      tileEngine.addObject(sock);
      socks.push(sock);
    }
  }
  return socks;
}

const setupGame = () => {

  titleScreen = TitleScreen({
    width: canvas.width,
    height: canvas.height,
    charset: imageAssets['assets/charset'],
  });

  bindKeys('enter', function(e) {
    e.preventDefault();
    scene = GAME_SCREEN;
  });

  tileEngine = TileEngine(dataAssets['assets/side_scroll_map']);

  const worldWidth = tileEngine.width * tileEngine.tilewidth;
  
  let lines = [];
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

  player = setupPlayer();

  // add player to the tileEngine to update sx and sy proportionally
  tileEngine.addObject(player);

  socks = setupSocks(worldWidth, lines);

  score = 0;

  hud = HUD({
    charset: imageAssets['assets/charset'],
    elapsedTime: 0,
    countdown: 60,
    score: score,
    width: canvas.width,
    textScale: 1.5
  });
}

const updateGameScreen = (dt) => {
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
}

 // use kontra.gameLoop to play the animation
const loop = GameLoop({
  update: function (dt) {
    switch (scene) {
      case TITLE_SCREEN:
        titleScreen.update(dt);
        break;
      case GAME_SCREEN:
        updateGameScreen(dt);
        break;
    }
  },
  render: function () {

    switch (scene) {
      case TITLE_SCREEN:
        titleScreen.render();
        break;
      case GAME_SCREEN:
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
        break;
    }
  }
});

const startGame = () => {
  loop.start(); // start the game
}

// wait for resources
load(
  'assets/side_scroll_map.json',
  'assets/nature-paltformer-tileset-16x16.png',
  'assets/player.png',
  'assets/charset.png',
  'assets/sock-sheet.png',
).then(assets => {
  initKeys();
  setupGame();
  startGame();
});
