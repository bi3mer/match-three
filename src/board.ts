import { Assets } from "./assets";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./constants";

export class Board {
  b: number[][]
  WIDTH = 8
  HEIGHT = 8
  
  constructor() {
    this.b = [];
    for(let y = 0; y < this.HEIGHT; ++y) {
      let temp = [];
      for(let x = 0; x < this.WIDTH; ++x) {
        temp.push(Math.floor(Math.random() * Assets.size));
      }

      this.b.push(temp);
    }
  }

  public updateBoard(): number {
    // fill, if not fill then check connect 3
    return this.findConnect3();
  }

  private findConnect3(): number {
    let x: number, mod: number, cur: number;
    let score = 0;

    for(let y = 0; y < BOARD_HEIGHT; ++y) {
      for (x = 0; x < BOARD_WIDTH; ++x) {
        cur = this.b[y][x];
        if (cur === -1) continue;

        // horizontal direction
        for(score = 0; score + x < BOARD_WIDTH; ++score) {
          if (cur !== this.b[y][score+x]) break;
        }

        if (score >= 3) {
          const max = x+score;
          for(; x < max; ++x) {
            this.b[y][x] = -1;
          }

          return score;
        }
        
        // vertical directions
        for(score = 0; score + y< BOARD_HEIGHT; ++score) {
          if (cur !== this.b[y+score][x]) break;
        }

        if (score >= 3) {
          const max = y+score;
          for(; y < max; ++y) {
            this.b[y][x] = -1;
          }

          return score;
        }
      }
    }

    return 0;
  }
}