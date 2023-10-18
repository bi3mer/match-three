import { Assets } from "./assets";
import { Board } from "./board";
import * as constants from "./constants";
import { Mouse } from "./mouse";

export class Game {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private brd: Board
  private state: number
  private score: number
  private timeOut: number
  private mouse: Mouse

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute('id', 'canvas');
    this.canvas.setAttribute('width', `${constants.SCREEN_WIDTH}`);
    this.canvas.setAttribute('height', `${constants.SCREEN_HEIGHT}`);
    document.getElementById('canvashere')!.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;

    this.brd = new Board();
    this.state = constants.STATE_CHECK_BOARD;
    this.score = 0;
    this.timeOut = 0;

    this.mouse = new Mouse(this.canvas);
  }

  render(): void {
    this.ctx.drawImage(Assets.backGround, 0, 0, constants.SCREEN_WIDTH, constants.SCREEN_HEIGHT);

    this.brd.isDirty = false;
    let y, x;
  
    for(y=0; y < constants.BOARD_HEIGHT; ++y) {
      for(x=0; x < constants.BOARD_WIDTH; ++x) {
        const assetIndex = this.brd.getType(BigInt(x), BigInt(y));
        if (assetIndex == -1) continue;
        if (this.mouse.mouseDown && this.mouse.downX == x && this.mouse.downY == y) continue;

        this.ctx.drawImage(
          Assets.matchTypes[assetIndex],
          x * constants.IMAGE_WIDTH,
          (y+1) * constants.IMAGE_HEIGHT,
          constants.IMAGE_WIDTH,
          constants.IMAGE_HEIGHT);
      }
      break;
    }

    if (this.mouse.mouseDown) {
      this.ctx.drawImage(
        Assets.matchTypes[this.brd.b[this.mouse.downY][this.mouse.downX]],
        this.mouse.x - constants.IMAGE_WIDTH/2,
        this.mouse.y - constants.IMAGE_HEIGHT/2,
        constants.IMAGE_WIDTH,
        constants.IMAGE_HEIGHT
      );
    }
  
    const scoreText = `Score: ${this.score}`;
    this.ctx.fillStyle = 'white';
    this.ctx.font = '40px monospace'
    this.ctx.fillText(scoreText, constants.SCREEN_WIDTH / 2.7, constants.IMAGE_HEIGHT/2);
  }

  update(deltaTime: number): void {
    switch (this.state) {
      case constants.STATE_CHECK_BOARD:
        this.checkBoardState();
        break;
      case constants.STATE_TIME_OUT:
        this.timeOutState(deltaTime);
        break;
      case constants.STATE_PLAYER:
        this.playerState();
        break;
      default:
        console.error(`Unhandled state '${this.state}'. The game is ruined.`);
        break;
    }
  }

  private checkBoardState() {
    const modScore = this.brd.updateBoard();
    if (modScore === 0) {
      this.state = constants.STATE_PLAYER;
    } else {
      this.score += Math.max(0, modScore);
      this.timeOut = 25;
      this.state = constants.STATE_TIME_OUT;
    }
  }

  private timeOutState(deltaTime: number) {
    if(this.timeOut <= 0) {
      this.state = constants.STATE_CHECK_BOARD;
    } else {
      this.timeOut -= deltaTime;
    }
  }

  private playerState() {
    if (this.mouse.shouldHandleMouseEvent) {
      this.mouse.shouldHandleMouseEvent = false;
      if (this.brd.runSwitch(
        this.mouse.downX, 
        this.mouse.downY, 
        this.mouse.upX, 
        this.mouse.upY)) 
      {
        this.timeOut = 500;
        this.state = constants.STATE_TIME_OUT;
      } 
    }
  }
}
