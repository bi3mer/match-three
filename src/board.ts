import { Assets } from "./assets";
import { BOARD_HEIGHT, BOARD_WIDTH, BOARD_SIZE, MATCH_TYPES } from "./constants";
import { randomInt, bigAbs } from "./util";

const BIG_0 = BigInt(0);
const BIG_1 = BigInt(1);
const BIG_2 = BigInt(2);
const BIG_3 = BigInt(3);
const BIG_4 = BigInt(4);
const BIG_5 = BigInt(5);

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
      this.b.push(BIG_0);
    }
  }

  public clear(): void {
    for(let i = 0; i < MATCH_TYPES; ++i) {
      this.b[i] = BIG_0;
    }
  }

  public validMoveExists(): boolean {
    for (let i = 0; i < MATCH_TYPES; ++i) {
      if(this.validMoveExistsForBoard(i)) {
        console.log(`valid move exists for: ${i}`);
        return true;
      }
    }

    return false;
  }

  public runSwitch(x1: BigInt, y1: BigInt, x2: BigInt, y2: BigInt): boolean {
    // Switch must be with in one block 
    if((x1 == x2 && bigAbs(y1-y2) === BIG_1) || (y1 == y2 && bigAbs(x1-x2) === BIG_1)) {
      // get bit indexes for both mouse positions
      const mod1 = BIG_1 << (x1 * BOARD_HEIGHT + y1);
      const mod2 = BIG_1 << (x2 * BOARD_HEIGHT + y2);
      
      // get board types for both mouse positions
      const boardIndex1 = this.getType(x1, y1);
      const boardIndex2 = this.getType(x2, y2);

      // swap types
      this.b[boardIndex1] ^= mod1; // toggle start position to 0
      this.b[boardIndex1] |= mod2; // set new position to 1

      this.b[boardIndex2] ^= mod2;
      this.b[boardIndex2] |= mod1;

      if (this.connect3Exists(boardIndex1) || this.connect3Exists(boardIndex2)) {
        return true;
      }

      // No connect 3 or more found, swap back
      this.b[boardIndex1] |= mod1; 
      this.b[boardIndex1] ^= mod2;

      this.b[boardIndex2] |= mod2;
      this.b[boardIndex2] ^= mod1;
    }

    return false;
  } 

  public updateBoard(): number {
    if (this.fill()) {
      return -1;
    }
    
    return this.findConnect3();
  }

  public getType(x: BigInt, y: BigInt): number {
    const index = BIG_1 << (x * BOARD_HEIGHT + y);
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
    for(let i = BOARD_SIZE - BIG_1; i >= 0; --i) {
      // loop through each board type to see if a piece exists at the board index
      for(bIndex = BigInt(0); bIndex < MATCH_TYPES; ++bIndex) {
        // Check ot see if a board exists at the index and break if we find it
        if ((this.b[bIndex] & (BIG_1 << i)) != 0) {
          break; // nothing found at position i
        }
      }
      
      // If bIndex is equal to MATCH_TYPES, then we know that we found a piece
      // and keep going. Else, that means we didn't find a piece and we either 
      // need to move the piece above down or fill in randomly
      if (bIndex == MATCH_TYPES) {
        fillPerformed = true;
        if (i % BOARD_HEIGHT == 0) {
          // Piece missing on top row, so select board index
          const index = randomInt(0, Number(MATCH_TYPES)-1);
          this.b[index] |= (BIG_1 << i);
        } else {
          // Empty spot somewhere on the board that is not on the top row, so 
          // we should take the piece above this and place it down here. Refer
          // to the board above to see that up by one is subtraction by one.
          const aboveIndex = (BIG_1 << (i - BIG_1));
          for (let aboveBoardIndex = 0; aboveBoardIndex < MATCH_TYPES; ++aboveBoardIndex) {
            if ((this.b[aboveBoardIndex] & aboveIndex) != 0) {
              // set the current position i to 1
              this.b[aboveBoardIndex] |= (BIG_1 << i);

              // toggle the position above to 0
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
    let bitIndex: BigInt;
    let score = 0;

    for (let i = 0; i < MATCH_TYPES; ++i) {
      const b = this.b[i];
      const h = b & b << BOARD_HEIGHT & b << (BOARD_HEIGHT*BIG_2); 
      const v = b & b << BIG_1 & b << BIG_2;
      if (h > 0) {
        for(bitIndex = BIG_0; bitIndex < BOARD_SIZE; ++bitIndex) {
          // check if bit is 1
          if ((h & (BIG_1 << bitIndex)) !== BIG_0) {
            // if so, add to the score and then toggle 3 to the right to 0
            this.b[i] ^= (BIG_1 << bitIndex);
            this.b[i] ^= (BIG_1 << (bitIndex - BOARD_HEIGHT));
            this.b[i] ^= (BIG_1 << (bitIndex - BIG_2*BOARD_HEIGHT));
            score += 3;
          }
        }
      }

      if (v > 0) {
        // refer to h > 0 for comments
        for (bitIndex = BIG_0; bitIndex < BOARD_SIZE; ++bitIndex) {
          if ((v & (BIG_1 << bitIndex)) !== BIG_0) {
            this.b[i] ^= (BIG_1 << bitIndex);
            this.b[i] ^= (BIG_1 << (bitIndex - BIG_1));
            this.b[i] ^= (BIG_1 << (bitIndex - BIG_2));
            score += 3;
          }
        }
      }

      if (score > 0) {
        break;
      }
    }

    return score;  
  }
  
  private connect3Exists(boardIndex: number): boolean {
    const b = this.b[boardIndex];
    if ((b & b << BOARD_HEIGHT & b << (BOARD_HEIGHT*BIG_2)) > 0) {
      return true;
    }

    if ((b & b << BIG_1 & b << BIG_2) > 0) {
      return true;
    }

    return false;
  }

  // Need to handle horizontal positions in 6 different dirrections
  //
  //    3     4
  //  1 - X X - 2
  //    5     6
  //
  // The Xs represent two pieces together. If a piece exists at any of the 6
  // numbered locations then there exists a valid move for the player. The same
  // is true for vertical but rotate the diagram ninety degrees.
  // @TODO: handle vertical
  private validMoveExistsForBoard(boardIndex: number): boolean {
    const B = this.b[boardIndex];
    const XX = (B << (BOARD_HEIGHT*BIG_2) & (B << (BOARD_HEIGHT*BIG_3));
    const h1 = B & XX;
    const h2 = XX & (B << (BOARD_HEIGHT*BIG_5));
    return (h1 | h2) > BIG_0;
  }
}
