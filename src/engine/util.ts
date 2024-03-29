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
}
