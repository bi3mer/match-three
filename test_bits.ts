import { argv0 } from "process";

const BIG_0: bigint = BigInt(0);
const BIG_1: bigint = BigInt(1);
const BIG_2: bigint = BigInt(2);
const BIG_3: bigint = BigInt(3);
const BIG_4: bigint = BigInt(4);
const BIG_5: bigint = BigInt(5);

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


let b: bigint = BIG_0;
b |= (BIG_1 << BigInt(0));
b |= (BIG_1 << BigInt(13));
b |= (BIG_1 << BigInt(14));

// @TODO: test validMoveExistsForBoard function for cases 7 and 9 in the comments.
//        Note that the code above is testing for the case where wrapping could 
//        occur and result in an incorrect result
// @TODO: figure out why findConnect3 fails when clearing out for a match of greater
//        than size 3.

let horizontal = b & (b << BigInt(7) & (b << BigInt(14)));


printBoard(b);
console.log('\n\n');
printBoard(horizontal);
