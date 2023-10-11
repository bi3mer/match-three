import { Assets } from "./assets";
import { Game } from "./game";

(() => {
  Assets.init();
  const loadLoop = () => {
    const loaded = Assets.percentLoaded();
    
    if (loaded !== 1.0) {
      // @ts-ignore
      document.getElementById('progress')!.value = loaded;
      window.requestAnimationFrame(loadLoop);
    } else {
      // hide progress bar
      document.getElementById('progress')!.hidden = true;

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
  };

  window.requestAnimationFrame (loadLoop);
})();