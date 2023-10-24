import { argv0 } from "process";

const BIG_0: bigint = BigInt(0);
const BIG_1: bigint = BigInt(1);
const BIG_2: bigint = BigInt(2);
const BIG_3: bigint = BigInt(3);
const BIG_4: bigint = BigInt(4);
const BIG_5: bigint = BigInt(5);

export const BOARD_WIDTH: bigint = BigInt(6);
export const BOARD_HEIGHT: bigint = BigInt(7);
export const BOARD_SIZE: bigint = BOARD_WIDTH * BOARD_HEIGHT;

// function printBits(b: bigint): void {
//   let s = "";
//   for (let i = BIG_0; i < BigInt(64); ++i) {
//     if ((b & (BIG_1 << i)) != BIG_0) {
//       s += "1";
//     } else {
//       s += "0";
//     }
//   }
//
//   console.log(s);
// }

function printBoard(b: bigint): void {
  for (let i = BIG_0; i < BigInt(7); ++i) {
    let s = "";
    for (let j = BIG_0; j < BigInt(6); ++j) {
      const index = j * BigInt(7) + i;
      if ((b & (BIG_1 << index)) != BIG_0) {
        s += '1';
      } else {
        s += '0';
      }
    }

    console.log(s);
  }
}



let B: bigint = BIG_0;
B |= (BIG_1 << BigInt(8));
B |= (BIG_1 << BigInt(16));
B |= (BIG_1 << BigInt(17));

const vXX = (B << (BOARD_HEIGHT + BIG_1)) & (B << (BOARD_HEIGHT + BIG_2));
const v1 = B & vXX;

printBoard(B);
console.log(`v1: ${v1}`);
