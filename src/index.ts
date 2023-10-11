import { Assets } from "./assets";
import { Game } from "./game";

(() => {
  Assets.init();
  const loadLoop = () => {
    const loaded = Assets.percentLoaded();

    if (loaded !== 1.0) {
      document.getElementById('myProgress')!.style.width = `${loaded}%`;
    } else {
      // hide progress bar
      document.getElementById('myProgress')!.hidden = true;

      // start the game
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
    }

    window.requestAnimationFrame(loadLoop);
  };

  window.requestAnimationFrame (loadLoop);
})();