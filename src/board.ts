import { Assets } from "./assets";
import { BOARD_HEIGHT, BOARD_SIZE, BOARD_WIDTH, MATCH_TYPES } from "./constants";
import { randomInt, bigAbs, printBoard } from "./util";

const BIG_0: bigint = BigInt(0);
const BIG_1: bigint = BigInt(1);
const BIG_2: bigint = BigInt(2);
const BIG_3: bigint = BigInt(3);
const BIG_4: bigint = BigInt(4);
const BIG_5: bigint = BigInt(5);

const TOP_ROW_MASK: bigint = ~BIG_0 ^ (
  (BIG_1 >> BIG_0) |
  (BIG_1 << BigInt(7)) |
  (BIG_1 << BigInt(14)) |
  (BIG_1 << BigInt(21)) |
  (BIG_1 << BigInt(28)) |
  (BIG_1 << BigInt(35))
);

const BOT_ROW_MASK: bigint = ~BIG_0 ^ (
  (BIG_1 << BigInt(6)) |
  (BIG_1 << BigInt(13)) |
  (BIG_1 << BigInt(20)) |
  (BIG_1 << BigInt(27)) |
  (BIG_1 << BigInt(34)) |
  (BIG_1 << BigInt(41))
);

const LEFT_COL_MASK: bigint = ~BIG_0 ^ (
  (BIG_1 >> BIG_0) |
  (BIG_1 << BIG_1) |
  (BIG_1 << BIG_2) |
  (BIG_1 << BIG_3) |
  (BIG_1 << BIG_4) |
  (BIG_1 << BIG_5) |
  (BIG_1 << BOARD_WIDTH)
);

const RIGHT_COL_MASK: bigint = ~BIG_0 ^ (
  (BIG_1 << BigInt(35)) |
  (BIG_1 << BigInt(36)) |
  (BIG_1 << BigInt(37)) |
  (BIG_1 << BigInt(38)) |
  (BIG_1 << BigInt(39)) |
  (BIG_1 << BigInt(40)) |
  (BIG_1 << BigInt(41))
);

// This is really hard to read, but I think the easiest way to understand it is 
// look at the three diagrams in test/bitboard.test.ts. Each condition here 
// (e.g. h1) has a corresponding unit test and position in the diagram.
export function connect3Possible(B: bigint): boolean {
  const XX = (B << (BOARD_HEIGHT * BIG_2)) & (B << (BOARD_HEIGHT * BIG_3));
  const X_X = B & (B << (BOARD_HEIGHT * BIG_2));
  // const vXX = (B >> BIG_1) & (B >> BIG_2);
  const vX_X = B & (B << BIG_2);

  const B_BOT_MASK = B & BOT_ROW_MASK;
  const vXX_BOT_MASK = (B_BOT_MASK >> BIG_1) & (B_BOT_MASK >> BIG_2);
  const B_TOP_MASK = B & TOP_ROW_MASK;
  const vXX_TOP_MASK = (B_TOP_MASK >> BIG_1) & (B_TOP_MASK >> BIG_2);

  const h1 = (B & XX);
  const h2 = (XX & (B << (BOARD_HEIGHT * BIG_5)));
  const h3 = ((B << (BOARD_HEIGHT - BIG_1)) & XX);
  const h4 = (XX & (B << (BOARD_HEIGHT * BIG_4 - BIG_1)));
  const h5 = ((B << (BOARD_HEIGHT + BIG_1)) & XX);
  const h6 = (XX & (B << (BOARD_HEIGHT * BIG_4 + BIG_1)));
  const h7 = (X_X & (B << (BOARD_HEIGHT + BIG_1)));
  const h8 = (X_X & (B << (BOARD_HEIGHT - BIG_1)));
  const v1 = ((B_BOT_MASK << BOARD_HEIGHT) & vXX_TOP_MASK);
  const v2 = ((B_BOT_MASK << BIG_1) & vXX_TOP_MASK);
  const v3 = ((B_BOT_MASK >> BOARD_HEIGHT) & vXX_TOP_MASK);
  const v4 = ((B_TOP_MASK >> (BIG_3 - BOARD_HEIGHT)) & vXX_BOT_MASK);
  const v5 = ((B_TOP_MASK >> BIG_4) & vXX_BOT_MASK);
  const v6 = ((B_TOP_MASK >> (BOARD_HEIGHT + BIG_3)) & vXX_BOT_MASK);
  const v7 = (((B & LEFT_COL_MASK) << (BOARD_HEIGHT + BIG_1)) & vX_X);
  const v8 = (((B & RIGHT_COL_MASK) << (BIG_1 - BOARD_HEIGHT)) & vX_X);

  console.log('----h1:', h1 > BIG_0);
  console.log('----h2:', h2 > BIG_0);
  console.log('----h3:', h3 > BIG_0);
  console.log('----h4:', h4 > BIG_0);
  console.log('----h5:', h5 > BIG_0);
  console.log('----h6:', h6 > BIG_0);
  console.log('----h7:', h7 > BIG_0);
  console.log('----h8:', h8 > BIG_0);
  console.log('----v1:', v1 > BIG_0);
  console.log('----v2:', v2 > BIG_0);
  console.log('----v3:', v3 > BIG_0);
  console.log('----v4:', v4 > BIG_0);
  console.log('----v5:', v5 > BIG_0);
  console.log('----v6:', v6 > BIG_0);
  console.log('----v7:', v7 > BIG_0);
  console.log('----v8:', v8 > BIG_0);

  return (
    h1 | h2 | h3 | h4 | h5 | h6 | h7 | h8 |
    v1 | v2 | v3 | v4 | v5 | v6 | v7 | v8) > BIG_0;

}

export class Board {
  // TODO: save if switch occurred and use that for updated board
  // TODO: have connect 3 remove all instances
  // TODO: update animation so it goes top down
  // TODO: add some kind of support for a proper lerp
  //
  // This class makes use of 7 bitboards, one for each match three type. It's 
  // basically impossible to comment, so what I've done is I've made unit tests
  // that I hope make things a bit more clear. Therefore, please go to 
  // bitboard.test.ts if you want to understand how all these work. 
  //
  // For each type there is a bitboard
  //
  //
  boards: bigint[]

  constructor() {
    this.boards = [];
    for (let i = 0; i < MATCH_TYPES; ++i) {
      this.boards.push(BIG_0);
    }
  }

  public clear(): void {
    for (let i = 0; i < MATCH_TYPES; ++i) {
      this.boards[i] = BIG_0;
    }
  }

  public validMoveExists(): boolean {
    for (let i = 0; i < MATCH_TYPES; ++i) {
      if (connect3Possible(this.boards[i])) {
        console.log('Match found for', Assets.types[i], new Date());
        return true;
      }
    }

    return false;
  }

  public runSwitch(x1: bigint, y1: bigint, x2: bigint, y2: bigint): boolean {
    // Switch must be with in one block 
    if ((x1 == x2 && bigAbs(y1 - y2) === BIG_1) || (y1 == y2 && bigAbs(x1 - x2) === BIG_1)) {
      // get bit indexes for both mouse positions
      const mod1 = BIG_1 << (x1 * BOARD_HEIGHT + y1);
      const mod2 = BIG_1 << (x2 * BOARD_HEIGHT + y2);

      // get board types for both mouse positions
      const boardIndex1 = this.getType(x1, y1);
      const boardIndex2 = this.getType(x2, y2);

      // swap types
      this.boards[boardIndex1] ^= mod1; // toggle start position to 0
      this.boards[boardIndex1] |= mod2; // set new position to 1

      this.boards[boardIndex2] ^= mod2;
      this.boards[boardIndex2] |= mod1;

      if (this.connect3Exists(boardIndex1) || this.connect3Exists(boardIndex2)) {
        return true;
      }

      // No connect 3 or more found, swap back
      this.boards[boardIndex1] |= mod1;
      this.boards[boardIndex1] ^= mod2;

      this.boards[boardIndex2] |= mod2;
      this.boards[boardIndex2] ^= mod1;
    }

    return false;
  }

  public updateBoard(): number {
    if (this.fill()) {
      return -1;
    }

    return this.findConnect3();
  }

  public getType(x: bigint, y: bigint): number {
    const index = BIG_1 << (x * BOARD_HEIGHT + y);
    for (let i = 0; i < MATCH_TYPES; ++i) {
      if ((this.boards[i] & index) != BIG_0) {
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
    let bIndex: number;

    // loop through all indexes in the board
    for (let i: bigint = BOARD_SIZE - BIG_1; i >= 0; --i) {
      // loop through each board type to see if a piece exists at the board index
      for (bIndex = 0; bIndex < MATCH_TYPES; ++bIndex) {
        // Check ot see if a board exists at the index and break if we find it
        if ((this.boards[bIndex] & (BIG_1 << i)) != BIG_0) {
          break; // nothing found at position i
        }
      }

      // If bIndex is equal to MATCH_TYPES, then we know that we found a piece
      // and keep going. Else, that means we didn't find a piece and we either 
      // need to move the piece above down or fill in randomly
      if (bIndex == MATCH_TYPES) {
        fillPerformed = true;
        if (i % BOARD_HEIGHT == BIG_0) {
          // Piece missing on top row, so select board index
          const index = randomInt(0, Number(MATCH_TYPES) - 1);
          this.boards[index] |= (BIG_1 << i);
        } else {
          // Empty spot somewhere on the board that is not on the top row, so 
          // we should take the piece above this and place it down here. Refer
          // to the board above to see that up by one is subtraction by one.
          const aboveIndex = (BIG_1 << (i - BIG_1));
          for (let aboveBoardIndex = 0; aboveBoardIndex < MATCH_TYPES; ++aboveBoardIndex) {
            if ((this.boards[aboveBoardIndex] & aboveIndex) != BIG_0) {
              // set the current position i to 1
              this.boards[aboveBoardIndex] |= (BIG_1 << i);

              // toggle the position above to 0
              this.boards[aboveBoardIndex] ^= aboveIndex;
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
    let bitIndex: bigint;
    let score = 0;

    for (let i = 0; i < MATCH_TYPES; ++i) {
      const b = this.boards[i];
      const h = b & b << BOARD_HEIGHT & b << (BOARD_HEIGHT * BIG_2);
      const v = b & b << BIG_1 & b << BIG_2;
      if (h > 0) {
        for (bitIndex = BIG_0; bitIndex < BOARD_SIZE; ++bitIndex) {
          // check if bit is 1
          if ((h & (BIG_1 << bitIndex)) !== BIG_0) {
            // if so, add to the score and then toggle 3 to the right to 0
            this.boards[i] &= ~(BIG_1 << bitIndex);
            this.boards[i] &= ~(BIG_1 << (bitIndex - BOARD_HEIGHT));
            this.boards[i] &= ~(BIG_1 << (bitIndex - BIG_2 * BOARD_HEIGHT));
            score += 3;
          }
        }
      }

      if (v > 0) {
        // refer to h > 0 for comments
        for (bitIndex = BIG_0; bitIndex < BOARD_SIZE; ++bitIndex) {
          if ((v & (BIG_1 << bitIndex)) !== BIG_0) {
            this.boards[i] &= ~(BIG_1 << bitIndex);
            this.boards[i] &= ~(BIG_1 << (bitIndex - BIG_1));
            this.boards[i] &= ~(BIG_1 << (bitIndex - BIG_2));
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


  // @TODO: make branchless!
  private connect3Exists(boardIndex: number): boolean {
    const b = this.boards[boardIndex];

    return ((b & b << BIG_1 & b << BIG_2) > 0) ||
      ((b & b << BOARD_HEIGHT & b << (BOARD_HEIGHT * BIG_2)) > 0);
  }
}
