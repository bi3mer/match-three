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
b.updateBoard();
b.print(1);
