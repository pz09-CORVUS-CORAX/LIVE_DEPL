//==================================
// 2d vector pure functions library
//==================================
import { orient2d } from 'big-float-ts';
import { dot } from './dot.js';
import { cross } from './cross.js';
import { segSegIntersection } from './lines-and-segments/seg-seg-intersection.js';
import { doesSegSegIntersect } from './lines-and-segments/does-seg-seg-intersect.js';
import { lineLineIntersection } from './lines-and-segments/line-line-intersection.js';
import { translate } from './affine-transformations/translate/translate.js';
import { rotate } from './affine-transformations/linear/rotate.js';
import { scale } from './affine-transformations/linear/scale.js';
import { reverse } from './affine-transformations/linear/reverse.js';
import { reverseRotate } from './affine-transformations/linear/reverse-rotate.js';
import { rotate90Degrees } from './affine-transformations/linear/rotate-90-degrees.js';
import { rotateNeg90Degrees } from './affine-transformations/linear/rotate-neg-90-degrees.js';
import { transformLinear } from './affine-transformations/linear/transform-linear.js';
import { transformAffine } from './affine-transformations/transform-affine.js';
import { toUnitVector } from './distance-and-length/to-unit-vector.js';
import { toLength } from './distance-and-length/to-length.js';
import { distanceBetween } from './distance-and-length/distance-between.js';
import { len } from './distance-and-length/len.js';
import { lengthSquared } from './distance-and-length/length-squared.js';
import { manhattanDistanceBetween } from './distance-and-length/manhattan-distance-between.js';
import { manhattanLength } from './distance-and-length/manhattan-length.js';
import { distanceBetweenPointAndLine } from './distance-and-length/distance-between-point-and-line.js';
import { squaredDistanceBetweenPointAndLineSegment } from './distance-and-length/squared-distance-between-point-and-line-segment.js';
import { squaredDistanceBetween } from './distance-and-length/squared-distance-between.js';
import { circumCenter } from './triangle-centers/circum-center.js';
import { inCenter } from './triangle-centers/in-center.js';
import { centroid } from './triangle-centers/centroid.js';
import { det3 } from './matrix/det.js';
/**
 * Three 2d points are a counter-clockwise turn if ccw > 0, clockwise if
 * ccw < 0, and colinear if ccw === 0 because ccw is a determinant that gives
 * twice the signed area of the triangle formed by the points a, b and c.
 * * **certified**
 * @param A The first point
 * @param B The second point
 * @param C The third point
 */
const ccw = orient2d;
/**
 * Returns the second 2-vector minus the first.
 * @param p the first vector
 * @param q the second vector
  */
function fromTo(p, q) {
    return [q[0] - p[0], q[1] - p[1]];
}
/**
 * Performs linear interpolation between two 2d points and returns the
 * resulting point.
 * @param p the first point.
 * @param q the second point.
 * @param t the interpolation fraction (often in [0,1]).
 */
function interpolate(p, q, t) {
    return [
        p[0] + (q[0] - p[0]) * t,
        p[1] + (q[1] - p[1]) * t
    ];
}
/**
 * Returns the mean of two 2d points.
 * @param ps the two points
 */
function mean(ps) {
    const p = ps[0];
    const q = ps[1];
    return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
}
/**
* Returns true if two 2-vectors are identical (by value), false otherwise.
* @param a a 2d vector
* @param b another 2d vector
*/
function equal(a, b) {
    return (a[0] === b[0] && a[1] === b[1]);
}
/**
 * Returns the closest point to the array of 2d points or if the array is empty
 * returns undefined.
 * @param p
 * @param ps
 */
function getClosestTo(p, ps) {
    let closestPoint = undefined;
    let closestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < ps.length; i++) {
        const q = ps[i];
        const d = squaredDistanceBetween(p, q);
        if (d < closestDistance) {
            closestPoint = q;
            closestDistance = d;
        }
    }
    return closestPoint;
}
/**
 * Returns the closest point to the array of 2d points by providing a distance
 * function. If the given array is empty, returns undefined.
 * @param p
 * @param ps
 * @param f a function that takes the object and returns a point in order to
 * apply the Euclidian distance.
 */
function getObjClosestTo(p, ps, f) {
    let closestObj = undefined; // Closest Point
    let closestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < ps.length; i++) {
        const o = ps[i];
        const d = squaredDistanceBetween(p, f(o));
        if (d < closestDistance) {
            closestObj = o;
            closestDistance = d;
        }
    }
    return closestObj;
}
export { dot, cross, squaredDistanceBetween, fromTo, interpolate, mean, translate, rotate, equal, getClosestTo, getObjClosestTo, ccw, lineLineIntersection, segSegIntersection, doesSegSegIntersect, scale, reverse, toUnitVector, toLength, distanceBetween, len, lengthSquared, manhattanDistanceBetween, manhattanLength, distanceBetweenPointAndLine, squaredDistanceBetweenPointAndLineSegment, circumCenter, inCenter, centroid, det3, reverseRotate, rotate90Degrees, rotateNeg90Degrees, transformLinear, transformAffine };
//# sourceMappingURL=index.js.map