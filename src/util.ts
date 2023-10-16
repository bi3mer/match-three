/**
 * LERP
 * @param a - start coordinate
 * @param b - end coordinate
 * @param percent - percent between a and 
 * @returns - point between and b based on percent
 */
export function lerp (a: number, b: number, percent: number){
  return (1-percent)*a + percent*b;
}

/**
 * Return an integer between the min and max, inclusive 
 */
export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max-min+1) + min);
}
