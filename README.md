# match-three

Assets found on [itch.io](https://devilsworkshop.itch.io/match-3-free-2d-sprites-game-art-and-ui) 
under CC 4.0.

## Bugs

- Two pieces of the same kind can stack on top of each other and break the game.

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

```bash
bun run server
```

Sample call with Python:

```python
import requests

lvl = [
    6, 3, 6, 3, 0, 2, 
    4, 3, 3, 6, 6, 2, 
    3, 2, 4, 1, 4, 1, 
    2, 1, 6, 0, 4, 6, 
    2, 4, 5, 6, 4, 1, 
    2, 0, 5, 0, 6, 5, 
    2, 3, 4, 0, 2, 3
]

print(requests.post('http://localhost:8000/solve', json=lvl).content)
```
