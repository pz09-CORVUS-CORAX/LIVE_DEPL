/**
 * Calculate the determinant of three 3d vectors, i.e. 3x3 matrix
 * @param x a 2d vector
 * @param y another 2d vector
 * @param z another 2d vector
 */
function det3(x, y, z) {
    return (x[0] * (y[1] * z[2] - y[2] * z[1])) -
        (x[1] * (y[0] * z[2] - y[2] * z[0])) +
        (x[2] * (y[0] * z[1] - y[1] * z[0]));
}
export { det3 };
//# sourceMappingURL=det.js.map