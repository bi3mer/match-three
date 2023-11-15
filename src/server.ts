import { Board } from "./board";

// import { Server } from "bun";
//
// const helloBunServer = Bun.serve({
//   port: 8080,
//   // @ts-ignore
//   async fetch(request: Request, server: Server): Response | Promise<Response> {
//     console.log(request.url, await request.text() || '{}');
//     return new Response('Hello from Bun server.');
//   }
// });
//
// console.log(`Listening ${helloBunServer.port} port.`);
//

let inputBoard = [
  [1, 3, 4, 0, 0, 1],
  [1, 1, 3, 1, 4, 4],
  [2, 3, 3, 5, 6, 6],
  [1, 5, 5, 6, 1, 3],
  [4, 0, 0, 2, 1, 0],
  [1, 4, 4, 3, 2, 1],
  [1, 1, 2, 3, 5, 0],
];

let b = new Board(inputBoard);
// console.log('running tree search');
// console.log(b.treeSearch());
//
const BIG_0: bigint = BigInt(0);
const BIG_1: bigint = BigInt(1);
const BIG_2: bigint = BigInt(2);
const BIG_3: bigint = BigInt(3);
const BIG_4: bigint = BigInt(4);
const BIG_5: bigint = BigInt(5);

// b.runSwitch(BIG_2, BIG_1, BIG_3, BIG_1);
// b.printBoard();
// b.treeSearchUpdateBoard();
// console.log('\n\n');
// b.printBoard();
//
//
// b.treeSearchUpdateBoard();
// console.log('\n\n');
// b.printBoard();
//
console.log(b.treeSearch());
console.log(b.calls);
