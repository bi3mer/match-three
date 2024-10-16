import { argv0 } from "process";
import { BOARD_HEIGHT, BOARD_WIDTH, MATCH_TYPES } from "./constants";
import { randomInt, bigAbs } from "./engine/util";

const BIG_0: bigint = BigInt(0);
const BIG_1: bigint = BigInt(1);
const BIG_2: bigint = BigInt(2);
const BIG_3: bigint = BigInt(3);
const BIG_4: bigint = BigInt(4);
const BIG_5: bigint = BigInt(5);
const BIG_9: bigint = BigInt(9);
const BIG_45: bigint = BigInt(45);

// This is really hard to read, but I think the easiest way to understand it is 
// look at the three diagrams in test/bitboard.test.ts. Each condition here 
// (e.g. h1) has a corresponding unit test and position in the diagram.
export function connect3Possible(B: bigint): boolean {
  // Horizontal matches
  const XX = (B << (BIG_9 * BIG_2)) & (B << (BIG_9 * BIG_3));
  const X_X = B & (B << (BIG_9 * BIG_2));

  const h1 = (B & XX);
  const h2 = (XX & (B << (BIG_9 * BIG_5)));
  const h3 = ((B << (BIG_9 - BIG_1)) & XX);
  const h4 = (XX & (B << (BIG_9 * BIG_4 - BIG_1)));
  const h5 = ((B << (BIG_9 + BIG_1)) & XX);
  const h6 = (XX & (B << (BIG_9 * BIG_4 + BIG_1)));
  const h7 = (X_X & (B << (BIG_9 + BIG_1)));
  const h8 = (X_X & (B << (BIG_9 - BIG_1)));

  // Vertical matches
  const vXX = (B >> BIG_1) & (B >> BIG_2);
  const vX_X = B & (B >> BIG_2);

  const v1 = ((B << BIG_9) & vXX);
  const v2 = ((B << BIG_1) & vXX);
  const v3 = ((B >> BIG_9) & vXX);
  const v4 = ((B >> (BIG_3 - BIG_9)) & vXX);
  const v5 = ((B >> BIG_4) & vXX);
  const v6 = ((B >> (BIG_9 + BIG_3)) & vXX);
  const v7 = (B >> (BIG_1 - BIG_9)) & vX_X;
  const v8 = (B >> (BIG_1 + BIG_9)) & vX_X;

  // Debugging prints
  // console.log('----h1:    ', h1 > BIG_0);
  // console.log('----h2:    ', h2 > BIG_0);
  // console.log('----h3:    ', h3 > BIG_0);
  // console.log('----h4:    ', h4 > BIG_0);
  // console.log('----h5:    ', h5 > BIG_0);
  // console.log('----h6:    ', h6 > BIG_0);
  // console.log('----h7:    ', h7 > BIG_0);
  // console.log('----h8:    ', h8 > BIG_0);
  // console.log('----v1:    ', v1 > BIG_0);
  // console.log('----v2:    ', v2 > BIG_0);
  // console.log('----v3:    ', v3 > BIG_0);
  // console.log('----v4:    ', v4 > BIG_0);
  // console.log('----v5:    ', v5 > BIG_0);
  // console.log('----v6:    ', v6 > BIG_0);
  // console.log('----v7:    ', v7 > BIG_0);
  // console.log('----v8:    ', v8 > BIG_0);

  // If the or of all 16 is greater than 0, that means at least one possible 
  // match 3 was found for the player.
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
  static calls: number = 0


  constructor(inputBoard: number[] | undefined = undefined) {
    this.boards = [];
    for (let i = 0; i < MATCH_TYPES; ++i) {
      this.boards.push(BIG_0);
    }

    if (inputBoard !== undefined) {
      if (inputBoard.length !== Number(BOARD_HEIGHT * BOARD_WIDTH)) {
        throw new Error(`Invalid board dimension: ${inputBoard.length}`);
      }

      let index: number;
      let boardIndex: bigint;
      for (let y = BIG_0; y < BOARD_HEIGHT; ++y) {
        for (let x = BIG_0; x < BOARD_WIDTH; ++x) {
          index = Number(y * BOARD_WIDTH + x);
          boardIndex = x * BIG_9 + y;

          this.boards[inputBoard[index]] |= (BIG_1 << boardIndex);
        }
      }
    }
  }

  private copy(): Board {
    const b = new Board();
    for (let i = 0; i < MATCH_TYPES; ++i) {
      b.boards[i] = this.boards[i]; // bigint is pass by value
    }

    return b;
  }

  public clear(): void {
    for (let i = 0; i < MATCH_TYPES; ++i) {
      this.boards[i] = BIG_0;
    }
  }

  public validMoveExists(): boolean {
    for (let i = 0; i < MATCH_TYPES; ++i) {
      if (connect3Possible(this.boards[i])) {
        // console.log('Match found for', Assets.types[i], new Date());
        return true;
      }
    }

    return false;
  }

  public runSwitch(x1: bigint, y1: bigint, x2: bigint, y2: bigint): boolean {
    // Switch must be with in one block 
    if ((x1 == x2 && bigAbs(y1 - y2) === BIG_1) || (y1 == y2 && bigAbs(x1 - x2) === BIG_1)) {
      // get bit indexes for both mouse positions
      const mod1 = BIG_1 << (x1 * BIG_9 + y1);
      const mod2 = BIG_1 << (x2 * BIG_9 + y2);

      // get board types for both mouse positions
      const boardIndex1 = this.getType(x1, y1);
      const boardIndex2 = this.getType(x2, y2);

      // make sure a valid type found
      if (boardIndex1 === -1 || boardIndex2 === -1) {
        return false;
      }

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
    const index = BIG_1 << (x * BIG_9 + y);
    for (let i = 0; i < MATCH_TYPES; ++i) {
      if ((this.boards[i] & index) != BIG_0) {
        return i;
      }
    }

    return -1;
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
    for (let y = BIG_0; y < BOARD_HEIGHT; ++y) {
      for (let x = BIG_0; x < BOARD_WIDTH; ++x) {
        const index = y + x * BIG_9;
        for (bIndex = 0; bIndex < MATCH_TYPES; ++bIndex) {
          if ((this.boards[bIndex] & BIG_1 << index) != BIG_0) {
            break;
          }
        }

        // If bIndex is not equal to MATCH_TYPES, then we know that we found a piece
        // and keep going. Else, that means we didn't find a piece and we either 
        // need to move the piece above down or fill in randomly
        if (bIndex == MATCH_TYPES) {
          fillPerformed = true;
          if (y == BIG_0) {
            // Piece missing on top row, so select board index
            const type = randomInt(0, Number(MATCH_TYPES) - 1);
            this.boards[type] |= (BIG_1 << index);
          }
        } else {
          fillPerformed = true;

          // Empty spot somewhere on the board that is not on the top row, so 
          // we should take the piece above this and place it down here. Refer
          // to the board above to see that up by one is subtraction by one.
          const aboveIndex = (BIG_1 << (index - BIG_1));
          for (let aboveBoardIndex = 0; aboveBoardIndex < MATCH_TYPES; ++aboveBoardIndex) {
            if ((this.boards[aboveBoardIndex] & aboveIndex) != BIG_0) {
              // set the current position i to 1
              this.boards[aboveBoardIndex] |= (BIG_1 << index);

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
    let bitIndex: bigint, x: bigint, y: bigint;
    let score = 0;

    for (let i = 0; i < MATCH_TYPES; ++i) {
      const b = this.boards[i];
      const h = b & b << BIG_9 & b << (BIG_9 * BIG_2);
      const v = b & b << BIG_1 & b << BIG_2;

      if (h > 0) {
        for (x = BIG_0; x < BOARD_WIDTH; ++x) {
          let xMod = x * BIG_9;
          for (y = BIG_0; y < BOARD_HEIGHT; ++y) {
            bitIndex = xMod + y;
            if ((h & (BIG_1 << bitIndex)) !== BIG_0) {
              // if so, add to the score and then toggle 3 to the right to 0
              this.boards[i] &= ~(BIG_1 << bitIndex);
              this.boards[i] &= ~(BIG_1 << (bitIndex - BIG_9));
              this.boards[i] &= ~(BIG_1 << (bitIndex - BIG_2 * BIG_9));
              score += 3;
            }
          }
        }
      }

      if (v > 0) {
        for (x = BIG_0; x < BOARD_WIDTH; ++x) {
          let xMod = x * BIG_9;
          for (y = BIG_0; y < BOARD_HEIGHT; ++y) {
            bitIndex = xMod + y;
            if ((v & (BIG_1 << bitIndex)) !== BIG_0) {
              this.boards[i] &= ~(BIG_1 << bitIndex);
              this.boards[i] &= ~(BIG_1 << (bitIndex - BIG_1));
              this.boards[i] &= ~(BIG_1 << (bitIndex - BIG_2));
              score += 3;
            }
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
    const b = this.boards[boardIndex];

    return ((b & b << BIG_1 & b << BIG_2) |         // vertical
      (b & b << BIG_9 & b << (BIG_9 * BIG_2))) > 0; // horizontal
  }

  ///////////////////////  Tree Search Stuff
  private strHash(): string {
    return this.boards.join('');
  }

  private movePiecesDown(): boolean {
    let pieceMoved = false;

    // loop through x and y coordinates, avoding the final row
    for (let y = BIG_0; y < BOARD_HEIGHT - BIG_1; ++y) {
      for (let x = BIG_0; x < BOARD_WIDTH; ++x) {
        const pieceType = this.getType(x, y);
        const pieceTypeBelow = this.getType(x, y + BIG_1);

        if (pieceType != -1 && pieceTypeBelow == -1) {
          const index = x * BIG_9 + y;

          this.boards[pieceType] ^= (BIG_1 << index);
          this.boards[pieceType] |= (BIG_1 << (index + BIG_1));
          pieceMoved = true;
        }
      }
    }

    return pieceMoved;
  }

  // TODO: should be private, but debugging right now
  public treeSearchUpdateBoard(): number {
    let score = this.findConnect3();
    while (this.movePiecesDown()) {
      score += this.findConnect3();
    }

    return score;
  }

  /**
  * Finds all valid next boards. It ignores the far right column and the bottom
  * row by reducing the for loops by 1. This is okay because switches are 
  * tested for (0,1) and (1,0). By only testing these two and not the negative
  * directions, we reduce the number of computations by half.
  */
  private validNextBoards(): Board[] {
    let boards: Board[] = [];

    // loop through all the places where a swap can be, excluding edges
    const H = BOARD_HEIGHT - BIG_1;
    let W = BOARD_WIDTH - BIG_1;

    for (let y = BIG_0; y < H; ++y) {
      for (let x = BIG_0; x < W; ++x) {
        let newB = this.copy();
        if (newB.runSwitch(x, y, x + BIG_1, y)) {
          boards.push(newB);

          newB = this.copy();
          if (newB.runSwitch(x, y, x, y + BIG_1)) {
            boards.push(newB);
          }
        } else if (newB.runSwitch(x, y, x, y + BIG_1)) {
          boards.push(newB);
        }
      }
    }

    return boards;
  }


  private _treeSearch(map: Set<string>): number {
    Board.calls++;

    // run till there are no valid updates. Ignore fill
    let score = this.treeSearchUpdateBoard();

    // If no valid move exists, then the tree search is done 
    if (!this.validMoveExists()) {
      return score;
    }

    // Go through valid mmoves to update the tree search
    let boards = this.validNextBoards();
    for (let i = 0; i < boards.length; ++i) {
      const B = boards[i];
      const H = B.strHash();

      if (!map.has(H)) {
        score += B._treeSearch(map);
        map.add(H);
      }
    }

    return score;
  }

  public treeSearch(): number {
    return this._treeSearch(new Set<string>());
  }

  /////////////////////// Utility / Debugging
  public print(typeIndex: number): void {
    const b = this.boards[typeIndex];

    for (let i = BIG_0; i < BigInt(7); ++i) {
      let s = "";
      for (let j = BIG_0; j < BigInt(6); ++j) {
        const index = (j * BIG_9) + i;

        if ((b & (BIG_1 << index)) != BIG_0) {
          s += '1';
        } else {
          s += '0';
        }
      }

      console.log(s);
    }
  }

  public printBoard(): void {
    for (let y = BIG_0; y < BOARD_HEIGHT; ++y) {
      let s = "";
      for (let x = BIG_0; x < BOARD_WIDTH; ++x) {
        const t = this.getType(x, y)

        if (t === -1) {
          s += ` `;
        } else {
          s += `${t}`;
        }
      }

      console.log(s);
    }
  }
}
