
/**
 * Returns a 90 degrees rotated version of the given 2-vector.
 * @param p a 2d vector
 */
function rotate90Degrees(p: number[]): number[] {
    return [-p[1], p[0]];
}


export { rotate90Degrees }
