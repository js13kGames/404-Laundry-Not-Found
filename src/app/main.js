import { init, load, dataAssets, TileEngine, GameLoop, initKeys, imageAssets, randInt, collides, bindKeys } from 'kontra';
import { Player } from './player';
import { Sock, SOCK_COLORS } from './sock';
import { HUD } from './hud';
import { TitleScreen } from './title_screen';
import { RSpike } from './rspike';
import { GameOverScreen } from './game_over_screen';
import { Enemy } from './enemy';

let { canvas } = init();

let ladders = [];
let platforms = [];
let socks = [];
let enemies = [];

let tileEngine = null;
let player = null;
let score = 0;
let countdown = 0;
let hud = null;

let titleScreen = null;
let gameOverScreen = null;

const TITLE_SCREEN = 'title';
const GAME_SCREEN = 'game';
const GAME_OVER = 'over';

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
  const numberOfSocks = Math.ceil(worldWidth / (13 * 7));
  for (let i = 0; i < lines.length; i++) {
    const yLine = lines[i];
    for (let j = 0; j < numberOfSocks; j++) {
      const p = randInt(0, 5);
      const color = SOCK_COLORS[p];
      let item = null;
      if (j % 4 === 0) {
        item = RSpike({
          type: 'spike',
          x: j * 13 * 7 - 7,
          y: yLine - 7,
          width: 27,
          height: 27,
          dx: 2 * (i % 2 === 0 ? -1 : 1),
          worldWidth: worldWidth,
          imageSheet: imageAssets['assets/rotating_spike'],
        });
      } else {
        item = Sock({
          type: 'sock',
          x: j * 13 * 7,
          y: yLine,
          width: 13,
          height: 15,
          dx: 2 * (i % 2 === 0 ? -1 : 1),
          worldWidth: worldWidth,
          image: imageAssets['assets/sock-sheet'],
          color: color,
        });
      }
      tileEngine.addObject(item);
      socks.push(item);
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

  gameOverScreen = GameOverScreen({
    width: canvas.width,
    height: canvas.height,
    charset: imageAssets['assets/charset'],
    deathImage: imageAssets['assets/rip']
  })

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
        // Adding enemies
        if (obj.type === "enemy") {
          let props = Object.assign({}, obj);
          obj.properties.forEach(element => {
            props[element.name] = element.value;
          });
          delete props.properties;
          let e = Enemy(Object.assign(props, {
            width: 32,
            height: 38,
            y: props.y - 6,
            dx: 1.5 * (enemies.length % 2 === 0 ? -1 : 1),
            imageSheet: imageAssets['assets/washing_machine'],
          }));
          tileEngine.addObject(e);
          enemies.push(e);
        }
      });
    }
  });

  resetGame(worldWidth, lines);

  bindKeys('enter', function (e) {
    e.preventDefault();

    if (scene === TITLE_SCREEN) {
      scene = GAME_SCREEN;
      titleScreen.hide();
    }

    if (scene === GAME_OVER) {
      resetGame(worldWidth, lines);
      scene = TITLE_SCREEN;
      titleScreen.show();
    }
  });

}

const resetGame = (worldWidth, lines) => {

  player = setupPlayer();

  // add player to the tileEngine to update sx and sy proportionally
  tileEngine.addObject(player);

  socks = setupSocks(worldWidth, lines);

  score = 0;
  countdown = 60;

  hud = HUD({
    charset: imageAssets['assets/charset'],
    elapsedTime: 0,
    countdown: countdown,
    score: score,
    width: canvas.width,
    textScale: 1.5
  });
}

const updateGameScreen = (dt) => {
  player.update(dt);

  if (!player.isAlive()) {
    scene = GAME_OVER;
    gameOverScreen.show();
  }

  // Collisions with socks
  for (let i = 0; i < socks.length; i++) {
    let sock = socks[i];
    if (collides(sock, player)) {
      if (sock.type && sock.type === 'sock') {
        sock.ttl = 0;
        tileEngine.removeObject(sock);
        score += 1;
      }
      if (sock.type && sock.type === 'spike') {
        player.ttl = 0;
        tileEngine.removeObject(player);
      }
    }
  }
  socks = socks.filter(sprite => sprite.isAlive());
  socks.forEach((sock) => {
    sock.update(dt);
  });

  // Collisions with enemies
  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];
    if (collides(enemy, player)) {
      player.ttl = 0;
      tileEngine.removeObject(player);
    }
  }

  enemies.forEach((enemy) => {
    enemy.update(dt);
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
      case GAME_OVER:
        gameOverScreen.update(dt);
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
        // rending enemies
        enemies.forEach((enemy) => {
          enemy.render();
        });
        // render player
        player.render();
        // render HUD
        hud.render();
        break;
      case GAME_OVER:
        gameOverScreen.render();
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
  'assets/rotating_spike.png',
  'assets/rip.png',
  'assets/washing_machine.png',
).then(assets => {
  initKeys();
  setupGame();
  startGame();
});
