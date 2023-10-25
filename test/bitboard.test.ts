import { expect, test } from "bun:test";
import { BOARD_HEIGHT } from "../src/constants";

const BIG_0: bigint = BigInt(0);
const BIG_1: bigint = BigInt(1);
const BIG_2: bigint = BigInt(2);
const BIG_3: bigint = BigInt(3);
const BIG_4: bigint = BigInt(4);

// I'm representing a bitboard with the following indices
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
// Most of this is pretty simple. If I want to test if there is a mtach three
// going down, then I shift the board by 2 and by 3 and take the & of there
// result. The same for horizontal, except I shift by the board with and two
// times the board width. This is how the function connect3Exists works in 
// board.ts
//
// It gets more complicated when I want to see if there exists a valid move 
// that the player can make. If there isn't, that means the board needs to 
// be reset. So, there are two cases to consider: (1) there is a horizontal
// move and (2) there is a vertical move. For each of these cases, there are 
// 8 possible moves for a total of 16. Meaning, we have 16 bit operations toBeTrue
// test.
//
//    3     4
//  1 - X X - 2
//    5     6
//
//      7
//    X - X
//      8
//
// The Xs represent two pieces together. If a piece exists at any of the 8 
// numbered locations then there exists a valid move for the player.
//   
//    2
//  1 _ 3
//    X 
//    X
//  4 _ 5
//    6
//
//    X
//  7 _ 8
//    X
//
// The unit tests below all go into the validMoveExistsForBoard function in 
// board.ts. 

// HORIZONTAL unit tests

// VERTICAL unit tests
test("v1", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(8));  // 1
  B |= (BIG_1 << BigInt(16));
  B |= (BIG_1 << BigInt(17));

  const vXX = (B >> BIG_1) & (B >> BIG_2);
  const v1 = (B << BOARD_HEIGHT) & vXX;
  expect(v1 > BIG_0).toBeTrue();
});

test("v2", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(16));
  B |= (BIG_1 << BigInt(17));
  B |= (BIG_1 << BigInt(14));

  const vXX = (B >> BIG_1) & (B >> BIG_2);
  const v2 = (B << BIG_1) & vXX;
  expect(v2 > BIG_0).toBeTrue();
});


test("v3", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(16));
  B |= (BIG_1 << BigInt(17));
  B |= (BIG_1 << BigInt(22));

  const vXX = (B >> BIG_1) & (B >> BIG_2);
  const v3 = (B >> BOARD_HEIGHT) & vXX;
  expect(v3 > BIG_0).toBeTrue();
});

test("v4", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(16));
  B |= (BIG_1 << BigInt(17));
  B |= (BIG_1 << BigInt(11));

  const vXX = (B >> BIG_1) & (B >> BIG_2);
  const v4 = (B >> (BIG_3 - BOARD_HEIGHT)) & vXX;
  expect(v4 > BIG_0).toBeTrue();
});

test("v5", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(16));
  B |= (BIG_1 << BigInt(17));
  B |= (BIG_1 << BigInt(19));

  const vXX = (B >> BIG_1) & (B >> BIG_2);
  const v5 = (B >> BIG_4) & vXX;
  expect(v5 > BIG_0).toBeTrue();
});

test("v6", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(16));
  B |= (BIG_1 << BigInt(17));
  B |= (BIG_1 << BigInt(25));

  const vXX = (B >> BIG_1) & (B >> BIG_2);
  const v6 = (B >> (BOARD_HEIGHT + BIG_3)) & vXX;
  expect(v6 > BIG_0).toBeTrue();
});


test("v7", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(16));
  B |= (BIG_1 << BigInt(18));
  B |= (BIG_1 << BigInt(10));

  const vX_X = B & (B << BIG_2);
  const v7 = (B << (BOARD_HEIGHT + BIG_1)) & vX_X;
  expect(v7 > BIG_0).toBeTrue();
});

test("v8", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(16));
  B |= (BIG_1 << BigInt(18));
  B |= (BIG_1 << BigInt(24));

  const vX_X = B & (B << BIG_2);
  const v8 = (B << (BIG_1 - BOARD_HEIGHT)) & vX_X;
  expect(v8 > BIG_0).toBeTrue();
});
