import { Assets } from "./assets";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./constants";

export class Board {
  // TODO: save if switch occurred and use that for updated board
  // TODO: have connect 3 remove all instances
  // TODO: update animation so it goes top down
  // TODO: add some kind of support for a proper lerp
  //
  //
  //
  // For each type there is a bitboard
  //
  // |-----------------------|
  // | 6  13  20  27  34  41 | top row
  // | 5  12  19  26  33  40 |
  // | 4  11  18  25  32  39 |
  // | 3  10  17  24  31  38 |
  // | 2   9  16  23  30  37 |
  // | 1   8  15  22  29  36 |
  // | 0   7  14  21  28  35 | bottom row
  // |-----------------------|
  //
  // Meaning, we are not using 42-63 of a 64 bit number in JavaScript.
  //
  b: number[][]
  boards: number[]
  isDirty: boolean
  
  constructor() {
    this.isDirty = true;
    this.b = [];
    for(let i = 0; i < Assets.size; ++i) {
      this.b.push(0);
    }

    /*
    for(let y = 0; y < BOARD_HEIGHT; ++y) {
      let temp = [];
      for(let x = 0; x < BOARD_WIDTH; ++x) {
        temp.push(Math.floor(Math.random() * Assets.size));
      }

      this.b.push(temp);
    }*/

    // @debugging
    this.b[BOARD_HEIGHT-1][0] = 1;
    this.b[BOARD_HEIGHT-1][1] = 1;
    this.b[BOARD_HEIGHT-1][2] = 1;
    this.b[BOARD_HEIGHT-2][0] = 1;
    this.b[BOARD_HEIGHT-3][0] = 1;
  }

  public runSwitch(x1: number, y1: number, x2: number, y2: number): boolean {
    if((x1 == x2 && Math.abs(y1-y2) == 1) || 
       (y1 == y2 && Math.abs(x1-x2) == 1)) 
    {
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

    return false;
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
    let x: number, val: number, i: number;
    let score = 0;

    for(let y = 0; y < BOARD_HEIGHT; ++y) {
      for (x = 0; x < BOARD_WIDTH; ++x) {
        val = this.b[y][x];
        if (val == -1) continue;
        
        let neighbors = [];
        this.floodFill(x, y, neighbors);
        
        const size = neighbors.length;
        for(let i = 0; i < size; ++i) {
          const [x, y] = neighbors[i];
          this.b[y][x] = -1;
        }
      }
    }

    return 0;
  }
  
  private floodFill(x: number, y: number, neighbors: [number, number][]): void {
    return; // DOn't want an infinite loop
    this.floodFill(x+1, y, neighbors);
    this.floodFill(x-1, y, neighbors);
    this.floodFill(x, y+1, neighbors);
    this.floodFill(x, y-1, neighbors);
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
