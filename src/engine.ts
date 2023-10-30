import { Scene } from "./scene/scene";
import * as constants from "./constants";

export class Engine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private sceneIndex: number;
  private scenes: Scene[]

  constructor(scenes: Scene[], sceneIndex: number) {
    this.scenes = scenes;
    this.sceneIndex = sceneIndex;

    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute('id', 'canvas');
    this.canvas.setAttribute('width', `${constants.SCREEN_WIDTH}`);
    this.canvas.setAttribute('height', `${constants.SCREEN_HEIGHT}`);
    document.getElementById('canvashere')!.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;
  }

  public run(): void {
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
}
