# match-three

Assets found on [itch.io](https://devilsworkshop.itch.io/match-3-free-2d-sprites-game-art-and-ui) 
under CC 4.0.

## Website

Game can be played on index.html. This comes with the [dist](./dist) folder---
that way the game is playable from GItHub pages---so you don't have to build
anything if you want to play locally. If you do want to build, use  one of the 
following commands:


```bash
bun run build # Build once for debug
bun run prod  # Build once for production, minifies
bun run watch # Build as you save files while developing
```

## Server

The server can be called to find the most point solutions for an input level. 

```
TOODO: working curl command here...
```

## Dead Code

Printing bits as board:

```typescript
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
```
