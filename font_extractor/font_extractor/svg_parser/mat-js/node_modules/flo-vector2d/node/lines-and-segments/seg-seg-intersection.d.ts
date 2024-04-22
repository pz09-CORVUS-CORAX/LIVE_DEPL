/**
* Returns the point where two line segments intersect or undefined if they
* don't intersect or if they intersect at infinitely many points.
* * see Geometric primitves http://algs4.cs.princeton.edu/91primitives
* * **certified**
* @param ab The first line
* @param cd The second line
*/
declare function segSegIntersection(ab: number[][], cd: number[][]): number[] | undefined;
export { segSegIntersection };
