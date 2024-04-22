/**
 * Returns true if the two given 2d line segments intersect, false otherwise.
 * * **robust** uses exact adaptive floating point arithmetic.
 * @param a a line segment
 * @param b another line segment
 */
declare function doesSegSegIntersect(a: number[][], b: number[][]): boolean;
export { doesSegSegIntersect };
