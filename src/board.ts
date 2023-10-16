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
  // | 0   7  14  21  28  35 | top row
  // | 1   8  15  22  29  36 |
  // | 2   9  16  23  30  37 |
  // | 3  10  17  24  31  38 |
  // | 4  11  18  25  32  39 |
  // | 5  12  19  26  33  40 |
  // | 6  13  20  27  34  41 | bottom row
  // |-----------------------|
  //
  // Meaning, we are not using 42-63 of a 64 bit number in JavaScript. Also, 
  // note that while I would like to use Number, bit operations on it converts
  // to a 32 bit number, which breaks this representation. So... BigInt.
  //
  b: number[][]
  boards: BigInt[]
  
  constructor() {
    this.b = [];
    for(let i = 0; i < MATCH_TYPES; ++i) {
      this.b.push(0);
    }
  }

  public runSwitch(x1: number, y1: number, x2: number, y2: number): boolean {
    // @TODO: bit board switch needs to be more clever
    return false;
  } 

  public updateBoard(): number {
    if (this.fill()) {
      return -1;
    }

    return this.findConnect3();
  }

  public getType(x: number, y: number): number {
    const index = x * MATCH_TYPES + y;
    for (let i = 0; i < MATCH_TYPES; ++i) {
      if (this.b[i] < index) {
        return i;
      }
    }

    return -1;
  }

  /**
   * Get a list of all valid moves for the current board. Going to be used by
   * an AI to play the game.
   */
  public validMoves(): [number, number][] {
    return [];
  }

  /**
   * Loop through the board and fill empty spots either with whatever tile
   * is on top of the current tile or by putting in a random tile. Will return
   * true if a fill operation is run. Else, returns false.
   */
  private fill(): boolean {
    // @TODO: bit board breaks the current approach
    return false;
  }

  /**
   * Find one connect 3 or more and return the associated score
   * @returns number - score
   */
  private findConnect3(): number {
    for (let i = 0; i < Assets.size; ++i) {
      const b = this.b[i];
      const h = b & b << 7 & b << 14; 
      const v = b & b << 1 & b << 2;

      if (h > 0) {
        // @TODO: do something
      }

      if (v > 0) {
        // @TODO: do something
      }
    }

    return 0;  
  }
  
  private connect3Exists(): boolean {
    return false;
  }
}
