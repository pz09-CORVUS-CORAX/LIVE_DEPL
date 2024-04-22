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
declare const ccw: typeof orient2d;
/**
 * Returns the second 2-vector minus the first.
 * @param p the first vector
 * @param q the second vector
  */
declare function fromTo(p: number[], q: number[]): number[];
/**
 * Performs linear interpolation between two 2d points and returns the
 * resulting point.
 * @param p the first point.
 * @param q the second point.
 * @param t the interpolation fraction (often in [0,1]).
 */
declare function interpolate(p: number[], q: number[], t: number): number[];
/**
 * Returns the mean of two 2d points.
 * @param ps the two points
 */
declare function mean(ps: [number[], number[]]): number[];
/**
* Returns true if two 2-vectors are identical (by value), false otherwise.
* @param a a 2d vector
* @param b another 2d vector
*/
declare function equal(a: number[], b: number[]): boolean;
/**
 * Returns the closest point to the array of 2d points or if the array is empty
 * returns undefined.
 * @param p
 * @param ps
 */
declare function getClosestTo(p: number[], ps: number[][]): number[] | undefined;
/**
 * Returns the closest point to the array of 2d points by providing a distance
 * function. If the given array is empty, returns undefined.
 * @param p
 * @param ps
 * @param f a function that takes the object and returns a point in order to
 * apply the Euclidian distance.
 */
declare function getObjClosestTo<T>(p: number[], ps: T[], f: (o: T) => number[]): T | undefined;
export { dot, cross, squaredDistanceBetween, fromTo, interpolate, mean, translate, rotate, equal, getClosestTo, getObjClosestTo, ccw, lineLineIntersection, segSegIntersection, doesSegSegIntersect, scale, reverse, toUnitVector, toLength, distanceBetween, len, lengthSquared, manhattanDistanceBetween, manhattanLength, distanceBetweenPointAndLine, squaredDistanceBetweenPointAndLineSegment, circumCenter, inCenter, centroid, det3, reverseRotate, rotate90Degrees, rotateNeg90Degrees, transformLinear, transformAffine };
