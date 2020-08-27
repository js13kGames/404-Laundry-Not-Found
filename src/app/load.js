import { init, load, dataAssets, TileEngine, GameLoop, initKeys } from 'kontra';

import { Player } from './player';

let { canvas, context } = init();

initKeys();

load(
  'assets/arcade-standard-29-8x.png',
  'assets/side_scroll_map.json'
).then(assets => {

  let tileEngine = TileEngine(dataAssets['assets/side_scroll_map']);

  let player = Player({
    width: 16,
    height: 32,
    tileEngine: tileEngine,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
  });

  // add player to the tileEngine to update sx and sy proportionally
  tileEngine.addObject(player);

  // use kontra.gameLoop to play the animation
  let loop = GameLoop({
    update: function (dt) {
      player.update(dt);
    },
    render: function () {
      // render map
      tileEngine.render();

      // render player black magic
      context.save();
      // Translate coordinates to keep player in the middle of the screen
      context.translate(-player.sx, -player.sy);
      player.render();
      context.restore();
    }
  });

  loop.start();
});
