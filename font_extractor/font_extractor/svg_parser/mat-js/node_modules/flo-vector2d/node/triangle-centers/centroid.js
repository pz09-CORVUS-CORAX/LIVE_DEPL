/**
* Returns the centroid of the given polygon, e.g. triangle. The polygon
* must be simple, i.e. not self-intersecting.
* @param polygon_
*/
function centroid(polygon) {
    const polygon_ = [];
    if (polygon.length === 1) {
        return polygon[0];
    }
    // remove duplicate points
    let prevP = polygon[polygon.length - 1];
    for (let i = 0; i < polygon.length; i++) {
        const [_x, _y] = prevP;
        const [x, y] = polygon[i];
        prevP = [x, y];
        if (x !== _x || y !== _y) {
            polygon_.push([x, y]);
        }
    }
    if (polygon_.length === 2) {
        const p1 = polygon_[0];
        const p2 = polygon_[1];
        const x = p1[0] + p2[0];
        const y = p1[1] + p2[1];
        return [x / 2, y / 2];
    }
    if (polygon_.length === 3) {
        const p1 = polygon_[0];
        const p2 = polygon_[1];
        const p3 = polygon_[2];
        const x = p1[0] + p2[0] + p3[0];
        const y = p1[1] + p2[1] + p3[1];
        return [x / 3, y / 3];
    }
    // polygon.length assumed > 3 and assumed to be non-self-intersecting
    // See wikipedia
    // First calculate the area, A, of the polygon
    let A = 0;
    for (let i = 0; i < polygon_.length; i++) {
        const p0 = polygon_[i];
        const p1 = (i === polygon_.length - 1)
            ? polygon_[0]
            : polygon_[i + 1];
        A = A + (p0[0] * p1[1] - p1[0] * p0[1]);
    }
    A = A / 2;
    const C = [0, 0];
    for (let i = 0; i < polygon_.length; i++) {
        const p0 = polygon_[i];
        const p1 = (i === polygon_.length - 1)
            ? polygon_[0]
            : polygon_[i + 1];
        C[0] = C[0] + (p0[0] + p1[0]) * (p0[0] * p1[1] - p1[0] * p0[1]);
        C[1] = C[1] + (p0[1] + p1[1]) * (p0[0] * p1[1] - p1[0] * p0[1]);
    }
    return [C[0] / (6 * A), C[1] / (6 * A)];
}
export { centroid };
//# sourceMappingURL=centroid.js.map