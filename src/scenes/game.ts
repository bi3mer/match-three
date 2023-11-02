import { Scene } from "../engine/scene";
import { Board } from "../board";
import { Explosion } from "../engine/explosion";
import { BOARD_HEIGHT, BOARD_SIZE, BOARD_WIDTH, IMAGE_HEIGHT, IMAGE_WIDTH, NUM_PARTICLES, SCREEN_HEIGHT, SCREEN_WIDTH, STATE_CHECK_BOARD, STATE_EXPLOSION, STATE_PLAYER, STATE_TIME_OUT } from "../constants";
import { AssetsManager } from "../engine/assetManager";
import { Mouse } from "../engine/mouse";

export class Game extends Scene {
  private brd: Board
  private state: number
  private score: number
  private timeOut: number
  private explosion: Explosion

  constructor() {
    super();

    this.brd = new Board();
    this.state = STATE_CHECK_BOARD;
    this.score = 0;
    this.timeOut = 0;
    this.explosion = new Explosion(NUM_PARTICLES);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(AssetsManager.images[AssetsManager.images.length - 1], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);


    // this.brd.isDirty = false;
    let y, x;
    const [downX, downY, _upX, _upY] = this.getMouseCoordinated();

    for (y = 0; y < BOARD_HEIGHT; ++y) {
      for (x = 0; x < BOARD_WIDTH; ++x) {
        const assetIndex = this.brd.getType(BigInt(x), BigInt(y));
        if (assetIndex == -1) continue;
        if (Mouse.mouseDown && downX == x && downY == y) continue; // @TODO: convert x and y to grid

        ctx.drawImage(
          AssetsManager.images[assetIndex],
          x * IMAGE_WIDTH,
          (y + 1) * IMAGE_HEIGHT, // first row is for UI
          IMAGE_WIDTH,
          IMAGE_HEIGHT);
      }
    }

    if (Mouse.mouseDown) {
      const type = this.brd.getType(BigInt(downX), BigInt(downY)); // @TODO: convert x and y to grid
      if (type !== -1) {
        ctx.drawImage(
          AssetsManager.images[type],
          Mouse.x - IMAGE_WIDTH / 2,
          Mouse.y - IMAGE_HEIGHT / 2,
          IMAGE_WIDTH,
          IMAGE_HEIGHT
        );
      }
    }

    if (this.state === STATE_EXPLOSION) {
      this.explosion.render(ctx);
    }

    const scoreText = `Score: ${this.score}`;
    ctx.fillStyle = 'white';
    ctx.font = '40px monospace'
    ctx.fillText(scoreText, SCREEN_WIDTH / 2.7, IMAGE_HEIGHT / 2);
  }

  update(deltaTime: number): number {
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
      case STATE_EXPLOSION:
        this.explosionState(deltaTime);
        break;
      default:
        console.error(`Unhandled state '${this.state}'. The game is ruined.`);
        break;
    }

    return -1; // @TODO: can never go back to main menu or a loss state right now
  }

  private checkBoardState() {
    const modScore = this.brd.updateBoard();
    if (modScore === 0) {
      if (this.brd.validMoveExists()) {
        this.state = STATE_PLAYER;
      } else {
        this.brd.clear();
        this.score += Number(BOARD_SIZE);
        this.state = STATE_EXPLOSION;
        this.explosion.reset();
        AssetsManager.playSound(4);
        // SoundManager.playExplosion();
      }
    } else {
      this.score += Math.max(0, modScore);
      this.timeOut = 25;
      this.state = STATE_TIME_OUT;

      if (modScore !== -1) {
        AssetsManager.playSound(0);
        // SoundManager.playMatchSound();
      }
    }
  }

  private timeOutState(deltaTime: number) {
    if (this.timeOut <= 0) {
      this.state = STATE_CHECK_BOARD;
    } else {
      this.timeOut -= deltaTime;
    }
  }

  private playerState() {
    if (Mouse.shouldHandleMouseEvent) {
      Mouse.shouldHandleMouseEvent = false;
      const [downX, downY, upX, upY] = this.getMouseCoordinated();

      if (this.brd.runSwitch(
        BigInt(downX),
        BigInt(downY),
        BigInt(upX),
        BigInt(upY))) {
        this.timeOut = 500;
        this.state = STATE_TIME_OUT;
      }
    }
  }

  private explosionState(deltaTime: number): void {
    if (this.explosion.update(deltaTime)) {
      this.timeOut = 250;
      this.state = STATE_TIME_OUT;
    }
  }

  private getMouseCoordinated(): [number, number, number, number] {
    return [
      Math.floor(Mouse.downX / IMAGE_WIDTH),
      Math.floor(Mouse.downY / IMAGE_HEIGHT) - 1,
      Math.floor(Mouse.upX / IMAGE_WIDTH),
      Math.floor(Mouse.upY / IMAGE_HEIGHT) - 1
    ];
  }
}
