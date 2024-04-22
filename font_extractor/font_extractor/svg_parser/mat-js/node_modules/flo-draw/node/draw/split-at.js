/**
 * Returns 2 new beziers split at the given t parameter, i.e. for the ranges
 * [0,t] and [t,1].
 * @param ps
 * @param t
 */
function splitAt(ps, t) {
    if (ps.length === 2) {
        return splitLineAt(ps, t);
    }
    else if (ps.length === 3) {
        return splitQuadAt(ps, t);
    }
    else if (ps.length === 4) {
        return splitCubicAt(ps, t);
    }
    return [];
}
/**
 * Returns 2 new cubic beziers split at the given t parameter, i.e. for the ranges
 * [0,t] and [t,1]. Uses de Casteljau's algorithm.
 *
 * A loose bound on the accuracy of the resultant points is given by:
 * |δP| = 2n*max_k(|b_k|)η, where n = 3 (cubic), b_k are the control points
 * abd η is Number.EPSILON.
 * @param ps A cubic bezier curve
 * @param t The t parameter where the curve should be split
 */
function splitCubicAt(ps, t) {
    const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps;
    const s = 1 - t;
    const t2 = t * t;
    const t3 = t2 * t;
    const s2 = s * s;
    const s3 = s2 * s;
    /** The split point */
    const p = [
        t3 * x3 + 3 * s * t2 * x2 + 3 * s2 * t * x1 + s3 * x0,
        t3 * y3 + 3 * s * t2 * y2 + 3 * s2 * t * y1 + s3 * y0
    ];
    const ps1 = [
        [x0, y0],
        [t * x1 + s * x0,
            t * y1 + s * y0],
        [t2 * x2 + 2 * s * t * x1 + s2 * x0,
            t2 * y2 + 2 * s * t * y1 + s2 * y0],
        p
    ];
    const ps2 = [
        p,
        [t2 * x3 + 2 * t * s * x2 + s2 * x1,
            t2 * y3 + 2 * t * s * y2 + s2 * y1],
        [t * x3 + s * x2,
            t * y3 + s * y2],
        [x3, y3]
    ];
    return [ps1, ps2];
}
function splitQuadAt(ps, t) {
    const [[x0, y0], [x1, y1], [x2, y2]] = ps;
    const s = 1 - t;
    /** The split point */
    const p = [
        s * s * x0 + 2 * s * t * x1 + t * t * x2,
        s * s * y0 + 2 * s * t * y1 + t * t * y2
    ];
    const ps1 = [
        [x0, y0],
        [s * x0 + t * x1,
            s * y0 + t * y1],
        p
    ];
    const ps2 = [
        p,
        [s * x1 + t * x2,
            s * y1 + t * y2],
        [x2, y2]
    ];
    return [ps1, ps2];
}
function splitLineAt(ps, t) {
    const [[x0, y0], [x1, y1]] = ps;
    const s = 1 - t;
    /** The split point */
    const p = [
        s * x0 + t * x1,
        s * y0 + t * y1
    ];
    const ps1 = [
        [x0, y0],
        p
    ];
    const ps2 = [
        p,
        [x1, y1]
    ];
    return [ps1, ps2];
}
export { splitAt };
//# sourceMappingURL=split-at.js.map