import { IMAGE_HEIGHT, IMAGE_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH } from "./constants";
import { AssetsManager } from "./engine/assetManager";
import { Engine } from "./engine/engine";
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

  AssetsManager.loadSound('success_1.wav', 0);
  AssetsManager.loadSound('success_2.wav', 0);
  AssetsManager.loadSound('success_3.wav', 0);
  AssetsManager.loadSound('success_4.wav', 0);
  AssetsManager.loadSound('explosion.wav', 0);

  const mainMenUScene = new MainMenu();

  const engine = new Engine([mainMenUScene], 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  engine.start();
})();
