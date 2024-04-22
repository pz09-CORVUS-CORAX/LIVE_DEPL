
import { squaredDistanceBetween } from "./squared-distance-between.js";


/**
 * Returns the squared distance between the given point and line segment.
 * @param p a point
 * @param l a line
 */
function squaredDistanceBetweenPointAndLineSegment(
        p: number[], 
        l: number[][]): number {
            
    const sqDst = squaredDistanceBetween;

    const v = l[0];
    const w = l[1];

    const l2 = sqDst(v, w);
    if (l2 == 0) { return sqDst(p, v); }

    let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    t = Math.max(0, Math.min(1, t));

    const d2 = sqDst(
        p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]
    );

    return d2;
}


export { squaredDistanceBetweenPointAndLineSegment }
