// import { argv0 } from "process";
//
// const BIG_0: bigint = BigInt(0);
// const BIG_1: bigint = BigInt(1);
// const BIG_2: bigint = BigInt(2);
// const BIG_3: bigint = BigInt(3);
// const BIG_4: bigint = BigInt(4);
// const BIG_5: bigint = BigInt(5);
//
// export const BOARD_WIDTH: bigint = BigInt(6);
// export const BOARD_HEIGHT: bigint = BigInt(7);
// export const BOARD_SIZE: bigint = BOARD_WIDTH * BOARD_HEIGHT;
//
// // function printBits(b: bigint): void {
// //   let s = "";
// //   for (let i = BIG_0; i < BigInt(64); ++i) {
// //     if ((b & (BIG_1 << i)) != BIG_0) {
// //       s += "1";
// //     } else {
// //       s += "0";
// //     }
// //   }
// //
// //   console.log(s);
// // }
//
//
// // HORIZONTAL
// // @TODO: test horizontal
//
// // VERTICAL
// let B: bigint = BIG_0;
// // B |= (BIG_1 << BigInt(8));  // 1
// // B |= (BIG_1 << BigInt(14)); // 2
// // B |= (BIG_1 << BigInt(22)); // 3
// B |= (BIG_1 << BigInt(16));
// B |= (BIG_1 << BigInt(17));
// // B |= (BIG_1 << BigInt(11)); // 4
// // B |= (BIG_1 << BigInt(19)); // 5
// // B |= (BIG_1 << BigInt(25)); // 6
// // B |= (BIG_1 << BigInt(25)); // 7 
// // B |= (BIG_1 << BigInt(25)); // 8
//
//
// const vXX = (B >> BIG_1) & (B >> BIG_2);
// const vX_C = B & (B << BIG_2);
//
// const v1 = (B << BOARD_HEIGHT) & vXX;
// const v2 = (B << BIG_1) & vXX;
// const v3 = (B >> BOARD_HEIGHT) & vXX;
// const v4 = (B >> (-BOARD_HEIGHT + BIG_3)) & vXX;
// const v5 = (B >> BIG_4) & vXX;
// const v6 = (B >> (BOARD_HEIGHT + BIG_3)) & vXX;
//
// printBoard(B);
// console.log(`v1: ${v1 > BIG_0}`);
// console.log(`v2: ${v2 > BIG_0}`);
// console.log(`v3: ${v3 > BIG_0}`);
// console.log(`v4: ${v4 > BIG_0}`);
// console.log(`v5: ${v5 > BIG_0}`);
// console.log(`v6: ${v6 > BIG_0}`);
// // console.log(`v7: ${v7 > BIG_0}`);
// // console.log(`v8: ${v8 > BIG_0}`);
//
// printBoard(vXX);
// console.log('\n');
// printBoard(B >> (BOARD_HEIGHT + BIG_4));
