/**
 * Draws a bezier piece, i.e. a bezier within a specified t range.
 * @param snap
 * @param bezierPiece
 * @param class
 * @param delay
 */
declare function bezierPiece(g: SVGGElement, ps_: number[][], tRange: number[], class_?: string, delay?: number): SVGElement[];
export { bezierPiece };
