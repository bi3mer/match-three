import { Board } from "./board";
import { Elysia } from 'elysia'

const app = new Elysia();
app.get('/', () => "Hello World");

app.post('/solve', (body) => {
  if (body.body === undefined) {
    return "FAILURE";
  }

  const b = new Board(body.body as number[]);
  const score = b.treeSearch();
  console.log(`score: ${score}`);
  return score;
});

app.listen(8000);
console.log(`🦊 running at ${app.server?.hostname}:${app.server?.port}`);

// let inputBoard = [
//   [1, 3, 4, 0, 0, 1],
//   [1, 1, 3, 1, 4, 4],
//   [2, 3, 3, 5, 6, 6],
//   [1, 5, 5, 6, 1, 3],
//   [4, 0, 0, 2, 1, 0],
//   [1, 4, 4, 3, 2, 1],
//   [1, 1, 2, 3, 5, 0],
// ].flat();
//
//
// let b = new Board(inputBoard);
//
// const start = performance.now();
// const score = b.treeSearch();
// const end = performance.now();
// console.log(`score: ${score}`);
// console.log(`calls: ${Board.calls}`);
// console.log(`time:  ${end - start} ms`);
