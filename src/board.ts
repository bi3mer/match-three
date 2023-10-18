import { Assets } from "./assets";
import { BOARD_HEIGHT, BOARD_WIDTH, BOARD_SIZE, MATCH_TYPES } from "./constants";
import { randomInt } from "./util";

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
      this.b.push(BigInt(0));
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

  public getType(x: BigInt, y: BigInt): number {
    const index = BigInt(1) << (x * BOARD_HEIGHT + y);
    for (let i = 0; i < MATCH_TYPES; ++i) {
      if ((this.b[i] & index) != 0) {
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
    let fillPerformed: boolean = false;
    let bIndex: BigInt;

    // loop through all indexes in the board
    for(let i = BOARD_SIZE - BigInt(1); i >= 0; --i) {
      // loop through each board type to see if a piece exists at the board index
      for(bIndex = BigInt(0); bIndex < MATCH_TYPES; ++bIndex) {
        // Check ot see if a board exists at the index and break if we find it
        if ((this.b[bIndex] & (BigInt(1) << i)) != 0) {
          break;
        }
      }
      
      // If bIndex is equal to MATCH_TYPES, then we know that we found a piece
      // and keep going. Else, that means we didn't find a piece and we either 
      // need to move the piece above down or select a random board to fill.
      if (bIndex == MATCH_TYPES) {
        fillPerformed = true;
        if (i % BOARD_HEIGHT == 0) {
          // Piece missing on top row, so select board index
          const index = randomInt(0, Number(MATCH_TYPES)-1);
          this.b[index] |= (BigInt(1) << i);
        } else {
          // Empty spot somewhere on the board that is not on the top row, so 
          // we should take the piece above this and place it down here.
          const aboveIndex = (BigInt(1) << (i - BigInt(1)));
          for (let aboveBoardIndex = 0; aboveBoardIndex < MATCH_TYPES; ++aboveBoardIndex) {
            if ((this.b[aboveBoardIndex] & aboveIndex) != 0) {
              // set the current position i to 1
              this.b[aboveBoardIndex] |= (BigInt(1) << i);

              // Set the position above to i
              this.b[aboveBoardIndex] ^= aboveIndex;
              break;
            }
          }
        }
      }
    } 

    return fillPerformed;
  }

  /**
   * Find one connect 3 or more and return the associated score
   * @returns number - score
   */
  private findConnect3(): number {
    for (let i = 0; i < Assets.size; ++i) {
      const b = this.b[i];
      const h = b & b << BigInt(7) & b << BigInt(14); 
      const v = b & b << BigInt(1) & b << BigInt(2);

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
