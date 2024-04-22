
import { distanceBetween } from "../distance-and-length/distance-between.js";


/** 
 * Returns the incenter of the given triangle.
 * * see Wikipedia - https://en.wikipedia.org/wiki/Incenter 
 * @param triangle
 */
function inCenter(triangle: number[][]): number[] {
    const dst = distanceBetween;

    const p = triangle[0];
    const q = triangle[1];
    const r = triangle[2];

    const a = dst(q, r);
    const b = dst(p, r);
    const c = dst(p, q);
    const lengthSum = a + b + c;
    return [
        (a*p[0] + b*q[0] + c*r[0]) / lengthSum,
        (a*p[1] + b*q[1] + c*r[1]) / lengthSum
    ];
}


export { inCenter }
