
/**
 * Returns a scaled version of the given 2-vector.
 * @param p a vector
 * @param c a scale factor
 */
function scale(p: number[], c: number): number[] {
    return [c*p[0], c*p[1]];
}


export { scale }
