import { Assets } from "./assets";
import { Board } from "./board";
import { BOARD_HEIGHT, BOARD_WIDTH, IMAGE_HEIGHT, IMAGE_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH, STATE_ANIMATION, STATE_CHECK_BOARD, STATE_MOUSE_MOVEMENT, STATE_PLAYER } from "./constants";

export class Game {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private brd: Board
  private state: number
  private score: number

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute('id', 'canvas');
    this.canvas.setAttribute('width', `${SCREEN_HEIGHT}`);
    this.canvas.setAttribute('height', `${SCREEN_HEIGHT}`);
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;

    this.brd = new Board();
    this.state = STATE_CHECK_BOARD;
    this.score = 0;
  }

  update(): void {
    this.ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    const score = this.brd.updateBoard();
    this.score += score;
    // switch (this.state) {
    //   case STATE_PLAYER:
    //     console.error('state player not implemented');
    //     break;
    //   case STATE_MOUSE_MOVEMENT:
    //     console.error('state mouse movement not implemented');
    //     break;
    //   case STATE_ANIMATION:
    //     console.error('state animation not implemented...');
    //     break;
    //   case STATE_CHECK_BOARD:
    //     const score = this.brd.updateBoard();
    //     this.score += score;

    //     // if (score > 0) {
    //     //   // do stuff
    //     // }
    //     break;
    //   default:
    //     console.error(`Unhandled state '${this.state}'. The game is ruined.`);
    //     break;
    // }
  }

  render(): void {
    let y, x;
    
    for(y=0; y < BOARD_HEIGHT; ++y) {
      for(x=0; x < BOARD_WIDTH; ++x) {
        const assetIndex = this.brd.b[y][x];
        if (assetIndex == -1) continue;

        this.ctx.drawImage(
          Assets.images[assetIndex],
          x * IMAGE_WIDTH,
          (y+1) * IMAGE_HEIGHT,
          IMAGE_WIDTH,
          IMAGE_HEIGHT);
      }
    }

    const scoreText = `Score: ${this.score}`;
    this.ctx.fillStyle = 'white';
    this.ctx.font = '40px monospace'
    this.ctx.fillText(scoreText, SCREEN_WIDTH / 2.7, IMAGE_HEIGHT/2);
  }
}