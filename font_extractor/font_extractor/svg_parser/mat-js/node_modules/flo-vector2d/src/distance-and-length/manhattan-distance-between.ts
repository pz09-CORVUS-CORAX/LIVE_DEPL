
/** 
 * Returns the Manhattan distance between two 2d points.
 * @param p a point.
 * @param q another point.
 */
function manhattanDistanceBetween(p: number[], q: number[]): number {
    return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]);
}


export { manhattanDistanceBetween }
