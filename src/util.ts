import { warn } from "console";

/**
 * LERP
 * @param a - start coordinate
 * @param b - end coordinate
 * @param percent - percent between a and 
 * @returns - point between and b based on percent
 */
export function lerp(a: number, b: number, percent: number) {
  return (1 - percent) * a + percent * b;
}

/**
 * Return an integer between the min and max, inclusive 
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min + 1) + min;
}

// randomly return -1 or 1
export function randomSign(): number {
  return Math.sign(Math.random() - 0.5);
}

// @TODO: make this branchless
export function bigAbs(a: bigint): bigint {
  return a >= BigInt(0) ? a : BigInt(-a);
}

export function printBoard(b: bigint): void {
  for (let i = BigInt(0); i < BigInt(7); ++i) {
    let s = "";
    for (let j = BigInt(0); j < BigInt(6); ++j) {
      const index = j * BigInt(9) + i;
      if ((b & (BigInt(1) << index)) != BigInt(0)) {
        s += '1';
      } else {
        s += '0';
      }
    }

    console.log(s);
  }
}


export function drawStrokedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  fillColor: string,
  strokeColor: string) {

  ctx.font = font;
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 8;
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}
