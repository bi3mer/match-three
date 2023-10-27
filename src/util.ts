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
