/**
 * Returns a rotated (anti-clockwise) version of the given 2d vector given the
 * sine and cosine of the angle.
 * @param sinθ
 * @param cosθ
 * @param p
 */
declare function rotate(sinθ: number, cosθ: number): (p: number[]) => number[];
declare function rotate(sinθ: number, cosθ: number, p: number[]): number[];
export { rotate };
