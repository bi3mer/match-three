import { Assets } from "./assets";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./constants";

export class Board {
  // TODO: save if switch occurred and use that for updated board
  // TODO: have connect 3 remove all instances
  // TODO: update animation so it goes top down
  // TODO: add some kind of support for a proper lerp
  b: number[][]
  isDirty: boolean
  
  constructor() {
    this.isDirty = true;
    this.b = [];
    for(let y = 0; y < BOARD_HEIGHT; ++y) {
      let temp = [];
      for(let x = 0; x < BOARD_WIDTH; ++x) {
        temp.push(Math.floor(Math.random() * Assets.size));
      }

      this.b.push(temp);
    }
  }

  public runSwitch(x1: number, y1: number, x2: number, y2: number): boolean {
    let temp = this.b[y1][x1];
    this.b[y1][x1] = this.b[y2][x2];
    this.b[y2][x2] = temp;

    const connectFound = this.connect3Exists();
    if (!connectFound) {
      temp = this.b[y1][x1];
      this.b[y1][x1] = this.b[y2][x2];
      this.b[y2][x2] = temp;
    } 

    return connectFound;
  }

  public updateBoard(): number {
    this.isDirty = true;
    if (this.fill()) {
      return -1;
    }

    return this.findConnect3();
  }

  /**
   * Return true if there is more fill to do, else return false
   * 
   * @TODO: the animation would be better with the commented for loop, but it
   * doesn't handle the problem of:
   * 
   * X -1 X
   * X -1 X
   * 
   * In this case, it basically replaces -1 with -1 every time and the whole 
   * thing doesn't work.
   */
  private fill(): boolean {
    let fillNotComplete = false;
    for(let x = 0; x < BOARD_WIDTH; ++x) {
      for(let y = BOARD_HEIGHT-1; y >= 0; --y) {
      // for(let y = 0; y < BOARD_HEIGHT; ++y) {
        if (this.b[y][x] === -1) {
          if (y === 0) {
            this.b[y][x] = Math.floor(Math.random() * Assets.size);
            fillNotComplete = true;
          } else if (this.b[y-1][x] !== -1) {
            this.b[y][x] = this.b[y-1][x];
            this.b[y-1][x] = -1;
            fillNotComplete = true;
          }
        }
      }
    }

    return fillNotComplete;
  }

  /**
   * Find one connect 3 or more and return the associated score
   * @returns number - score
   */
  private findConnect3(): number {
    let x: number, mod: number, cur: number;
    let score = 0;
    let totalScore = 0;

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

  private connect3Exists(): boolean {
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

          return true;
        }
        
        // vertical directions
        for(score = 0; score + y< BOARD_HEIGHT; ++score) {
          if (cur !== this.b[y+score][x]) break;
        }

        if (score >= 3) {
          return true;
        }
      }
    }

    return false;
  }
}