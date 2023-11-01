import { Scene } from "./scene";
import { Mouse } from "./mouse";
import { AssetsManager } from "./assetManager";

export class Engine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private sceneIndex: number;
  private scenes: Scene[]

  constructor(scenes: Scene[], sceneIndex: number, canvasWidth: number, canvasHeight: number) {
    this.scenes = scenes;
    this.sceneIndex = sceneIndex;

    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute('id', 'canvas');
    this.canvas.setAttribute('width', `${canvasWidth}`);
    this.canvas.setAttribute('height', `${canvasHeight}`);

    document.getElementById('canvashere')!.appendChild(this.canvas); // TODO: make configurable
    this.ctx = this.canvas.getContext('2d')!;

    Mouse.init(this.canvas);
  }

  public start(): void {
    // create progress bar
    const progressBar = document.createElement('progress');
    progressBar.max = 1;

    document.getElementById('canvashere')!.appendChild(progressBar); // TODO: make configurable

    const assetLoadLoop = () => {
      progressBar.value = AssetsManager.percentLoaded();

      if (progressBar.value !== 1.0) {
        window.requestAnimationFrame(assetLoadLoop);
      } else {
        // hide progress bar
        progressBar.hidden = true;

        // start game loop
        let oldFrameTime = (new Date()).getTime();
        let delta = 0;

        const gameLoop = (timeStep: number) => {
          delta = timeStep - oldFrameTime;
          oldFrameTime = timeStep;

          const newIndex = this.scenes[this.sceneIndex].update(delta);
          if (newIndex !== -1) {
            this.sceneIndex = newIndex;
          }

          this.scenes[this.sceneIndex].render(this.ctx);

          window.requestAnimationFrame(gameLoop);
        };

        window.requestAnimationFrame(gameLoop);
      }
    };

    window.requestAnimationFrame(assetLoadLoop);

  }
}
