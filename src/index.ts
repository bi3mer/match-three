import { Assets } from "./assets";
import { Game } from "./game";

(() => {
  Assets.init();
  const game = new Game();
  
  let oldTimeFrame = (new Date()).getTime();
  let delta: number = 0;
  
  const loop = (timeStep: number) => {
    delta = timeStep - oldTimeFrame;
    oldTimeFrame = timeStep;
    game.update(delta);
    game.render();
    window.requestAnimationFrame(loop);
  }
  
  window.requestAnimationFrame(loop);
})();
