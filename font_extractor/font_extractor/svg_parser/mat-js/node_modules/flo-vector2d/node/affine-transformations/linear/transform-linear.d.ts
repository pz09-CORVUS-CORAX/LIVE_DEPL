/**
 * Transform and returns the vector after applying the linear transformation
 * [[a,b],[c,d]] to the given 2d vector.
 * @param a top-left transformation matrix entry
 * @param b top-right transformation matrix entry
 * @param c bottom-left transformation matrix entry
 * @param d bottom-right transformation matrix entry
 * @param p a vector to transform
 */
declare function transformLinear([[a, b], [c, d]]: number[][]): (p: number[]) => number[];
declare function transformLinear([[a, b], [c, d]]: number[][], p: number[]): number[];
export { transformLinear };
