
/**
 * Returns the given 2-vector scaled to the given length.
 * @param p a vector
 * @param length the length to scale to
 */
function toLength(p: number[], length: number): number[] {
    const c = length / Math.sqrt(p[0]*p[0] + p[1]*p[1]);

    return [c*p[0], c*p[1]];
}


export { toLength }
