/**
 * Returns the given 2-vector scaled to a length of one.
 * @param p a vector
 */
function toUnitVector(p) {
    const scaleFactor = 1 / (Math.sqrt(p[0] * p[0] + p[1] * p[1]));
    return [p[0] * scaleFactor, p[1] * scaleFactor];
}
export { toUnitVector };
//# sourceMappingURL=to-unit-vector.js.map