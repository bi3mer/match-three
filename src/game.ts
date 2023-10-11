import { Assets } from "./assets";
import { Board } from "./board";
import { BOARD_HEIGHT, BOARD_WIDTH, IMAGE_HEIGHT, IMAGE_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH, STATE_ANIMATION, STATE_CHECK_BOARD, STATE_MOUSE_MOVEMENT, STATE_PLAYER, STATE_TIME_OUT } from "./constants";
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
    this.canvas.setAttribute('width', `${SCREEN_HEIGHT}`);
    this.canvas.setAttribute('height', `${SCREEN_HEIGHT}`);
    document.getElementById('canvashere')!.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;

    this.brd = new Board();
    this.state = STATE_CHECK_BOARD;
    this.score = 0;
    this.timeOut = 0;

    this.mouse = new Mouse(this.canvas);
  }

  render(): void {
    this.ctx.drawImage(Assets.backGround, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    this.brd.isDirty = false;
    let y, x;
  
    for(y=0; y < BOARD_HEIGHT; ++y) {
      for(x=0; x < BOARD_WIDTH; ++x) {
        const assetIndex = this.brd.b[y][x];
        if (assetIndex == -1) continue;
        if (this.mouse.mouseDown && this.mouse.downX == x && this.mouse.downY == y) continue;

        this.ctx.drawImage(
          Assets.matchTypes[assetIndex],
          x * IMAGE_WIDTH,
          (y+1) * IMAGE_HEIGHT,
          IMAGE_WIDTH,
          IMAGE_HEIGHT);
      }
    }

    if (this.mouse.mouseDown) {
      this.ctx.drawImage(
        Assets.matchTypes[this.brd.b[this.mouse.downY][this.mouse.downX]],
        this.mouse.x - IMAGE_WIDTH/2,
        this.mouse.y - IMAGE_HEIGHT/2,
        IMAGE_WIDTH,
        IMAGE_HEIGHT
      );
    }
  
    const scoreText = `Score: ${this.score}`;
    this.ctx.fillStyle = 'white';
    this.ctx.font = '40px monospace'
    this.ctx.fillText(scoreText, SCREEN_WIDTH / 2.7, IMAGE_HEIGHT/2);
  }

  update(deltaTime: number): void {
    switch (this.state) {
      case STATE_CHECK_BOARD:
        this.checkBoardState();
        break;
      case STATE_TIME_OUT:
        this.timeOutState(deltaTime);
        break;
      case STATE_PLAYER:
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
      this.state = STATE_PLAYER;
    } else {
      this.score += Math.max(0, modScore);
      this.timeOut = 25;
      this.state = STATE_TIME_OUT;
    }
  }

  private timeOutState(deltaTime: number) {
    if(this.timeOut <= 0) {
      this.state = STATE_CHECK_BOARD;
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
        this.state = STATE_TIME_OUT;
      } 
    }
  }
}