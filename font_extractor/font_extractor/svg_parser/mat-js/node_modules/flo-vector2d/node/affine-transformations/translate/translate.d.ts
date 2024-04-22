/**
 * Returns the result of adding two 2-vectors. This function is curried.
 * @param a - A 2d vector
 * @param b - Another 2d vector
 */
declare function translate(a: number[]): ((b: number[]) => number[]);
declare function translate(a: number[], b: number[]): number[];
export { translate };
