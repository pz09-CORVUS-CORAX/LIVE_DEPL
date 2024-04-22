/**
 * Find point where two lines intersect. Returns he point where the two lines
 * intersect or undefined if they don't intersect or are the same line.
 * see Wikipedia https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
 * @param l1 A line
 * @param l2 Another line
 */
declare function lineLineIntersection(l1: number[][], l2: number[][]): number[] | undefined;
export { lineLineIntersection };
