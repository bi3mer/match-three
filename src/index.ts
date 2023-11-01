import { IMAGE_HEIGHT, IMAGE_WIDTH } from "./constants";
import { AssetsManager } from "./engine/assetManager";
import { Engine } from "./engine/engine";
import { Game } from "./scenes/game";
import { MainMenu } from "./scenes/mainMenu";

(() => {
  // Start asset loading
  AssetsManager.loadImage("apple.png", Number(IMAGE_WIDTH), Number(IMAGE_HEIGHT));
  AssetsManager.loadImage("bread.png", Number(IMAGE_WIDTH), Number(IMAGE_HEIGHT));
  AssetsManager.loadImage("coconut.png", Number(IMAGE_WIDTH), Number(IMAGE_HEIGHT));
  AssetsManager.loadImage("broccoli.png", Number(IMAGE_WIDTH), Number(IMAGE_HEIGHT));
  AssetsManager.loadImage("milk.png", Number(IMAGE_WIDTH), Number(IMAGE_HEIGHT));
  AssetsManager.loadImage("orange.png", Number(IMAGE_WIDTH), Number(IMAGE_HEIGHT));
  AssetsManager.loadImage("star.png", Number(IMAGE_WIDTH), Number(IMAGE_HEIGHT));
  AssetsManager.loadImage("bg.png", null, null);



  const mainMenUScene = new MainMenu();
  const gameScene = new Game();

  const engine = new Engine([mainMenUScene, gameScene], 0);
  engine.start();

  const loadLoop = () => {
    const loaded = Assets.percentLoaded();

    if (loaded !== 1.0 && SoundManager.isLoaded()) {
      // @ts-ignore
      document.getElementById('progress')!.value = loaded;
      window.requestAnimationFrame(loadLoop);
    } else {
      // hide progress bar
      document.getElementById('progress')!.hidden = true;
    }
  };

  window.requestAnimationFrame(loadLoop);
})();
