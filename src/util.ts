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