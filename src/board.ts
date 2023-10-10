import { Assets } from "./assets";

export class Board {
  b: number[][]
  WIDTH = 8
  HEIGHT = 8
  
  constructor() {
    this.b = [];
    for(let y = 0; y < this.HEIGHT; ++y) {
      let temp = [];
      for(let x = 0; x < this.WIDTH; ++x) {
        temp.push(Math.floor(Math.random() * Assets.size));
      }

      this.b.push(temp);
    }
  }
}