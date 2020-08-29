import { init, load, dataAssets, TileEngine, GameLoop, initKeys } from 'kontra';
import { Player } from './player';
import { Sock } from './sock';
import { CSprite } from './csprite';

let { canvas, context } = init();

initKeys();

load(
  'assets/arcade-standard-29-8x.png',
  'assets/side_scroll_map.json'
).then(assets => {

  let tileEngine = TileEngine(dataAssets['assets/side_scroll_map']);

  const worldWidth = tileEngine.width * tileEngine.tilewidth;

  let player = Player({
    width: 16,
    height: 32,
    tileEngine: tileEngine,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
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
        let ladder = CSprite(element);
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
