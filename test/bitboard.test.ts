import { expect, test } from "bun:test";
import { BOARD_HEIGHT } from "../src/constants";
import { connect3Possible } from "../src/board";
import { printBoard } from "../src/util";

const BIG_0: bigint = BigInt(0);
const BIG_1: bigint = BigInt(1);

// I'm representing a bitboard with the following indices
//
// |-----------------------|
// | 0   9  18  27  36  45 | top row
// | 1  10  19  28  37  46 |
// | 2  11  20  29  38  47 |
// | 3  12  21  30  39  48 |
// | 4  13  22  31  40  49 |
// | 5  14  23  32  41  50 |
// | 6  15  24  33  42  51 | bottom row
// | 0   0   0   0   0   0 | Prevents wrapping for matches
// | 0   0   0   0   0   0 | Prevents wrapping for finding potential moves
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
test("h1", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(22));
  B |= (BIG_1 << BigInt(31));
  B |= (BIG_1 << BigInt(4));

  expect(connect3Possible(B)).toBeTrue();
});

test("h1-wrap", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(8));
  B |= (BIG_1 << BigInt(15));
  B |= (BIG_1 << BigInt(35));

  expect(connect3Possible(B)).toBeFalse();

  B = BIG_0;
  B |= (BIG_1 << BigInt(11));
  B |= (BIG_1 << BigInt(18));
  B |= (BIG_1 << BigInt(40));
  B |= (BIG_1 << BigInt(33));

  expect(connect3Possible(B)).toBeFalse();
});

test("h2", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(18));
  B |= (BIG_1 << BigInt(27));
  B |= (BIG_1 << BigInt(45));

  expect(connect3Possible(B)).toBeTrue();
});

test("h2-wrap", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(27));
  B |= (BIG_1 << BigInt(34));
  B |= (BIG_1 << BigInt(5));

  expect(connect3Possible(B)).toBeFalse();
});

test("h3", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(15));
  B |= (BIG_1 << BigInt(24));
  B |= (BIG_1 << BigInt(5));

  expect(connect3Possible(B)).toBeTrue();
});

test("h4", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(1));
  B |= (BIG_1 << BigInt(10));
  B |= (BIG_1 << BigInt(18));

  expect(connect3Possible(B)).toBeTrue();
});

test("h5", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(12));
  B |= (BIG_1 << BigInt(21));
  B |= (BIG_1 << BigInt(4));

  expect(connect3Possible(B)).toBeTrue();
});

test("h6", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(32));
  B |= (BIG_1 << BigInt(41));
  B |= (BIG_1 << BigInt(51));

  expect(connect3Possible(B)).toBeTrue();
});

test("h7", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(28));
  B |= (BIG_1 << BigInt(46));
  B |= (BIG_1 << BigInt(36));

  expect(connect3Possible(B)).toBeTrue();
});

test("h8", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(14));
  B |= (BIG_1 << BigInt(32));
  B |= (BIG_1 << BigInt(24));

  expect(connect3Possible(B)).toBeTrue();
});

// VERTICAL unit tests
test("v1", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(10));
  B |= (BIG_1 << BigInt(11));
  B |= (BIG_1 << BigInt(0));

  expect(connect3Possible(B)).toBeTrue();
});

test("v2", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(20));
  B |= (BIG_1 << BigInt(21));
  B |= (BIG_1 << BigInt(18));

  expect(connect3Possible(B)).toBeTrue();
});


test("v3", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(37));
  B |= (BIG_1 << BigInt(38));
  B |= (BIG_1 << BigInt(45));

  expect(connect3Possible(B)).toBeTrue();
});

test("v4", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(49));
  B |= (BIG_1 << BigInt(50));
  B |= (BIG_1 << BigInt(42));

  expect(connect3Possible(B)).toBeTrue();
});

test("v5", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(13));
  B |= (BIG_1 << BigInt(14));
  B |= (BIG_1 << BigInt(24));

  expect(connect3Possible(B)).toBeTrue();
});

test("v6", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(8));
  B |= (BIG_1 << BigInt(9));
  B |= (BIG_1 << BigInt(11));

  expect(connect3Possible(B)).toBeTrue();
});

test("v6-wrap-1", () => {
  let B: bigint = BIG_0;

  B |= (BIG_1 << BigInt(13));
  B |= (BIG_1 << BigInt(14));
  B |= (BIG_1 << BigInt(18));

  expect(connect3Possible(B)).toBeFalse();
});

test("v6-wrap-2", () => {
  let B: bigint = BIG_0;

  B |= (BIG_1 << BigInt(14));
  B |= (BIG_1 << BigInt(15));
  B |= (BIG_1 << BigInt(18));

  expect(connect3Possible(B)).toBeFalse();
});

test("v7", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(13));
  B |= (BIG_1 << BigInt(15));
  B |= (BIG_1 << BigInt(5));

  expect(connect3Possible(B)).toBeTrue();
});

test("v8", () => {
  let B: bigint = BIG_0;
  B |= (BIG_1 << BigInt(40));
  B |= (BIG_1 << BigInt(42));
  B |= (BIG_1 << BigInt(50));

  expect(connect3Possible(B)).toBeTrue();
});
