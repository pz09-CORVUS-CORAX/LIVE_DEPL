/**
 * Draws a polygon
 * @param g
 * @param poly the polygon specified as an array of points - the last point does
 * not have to be specified
 * @param class_
 * @param delay
 */
declare function polygon(g: SVGGElement, poly: number[][], class_?: string, delay?: number): SVGPathElement[];
export { polygon };
