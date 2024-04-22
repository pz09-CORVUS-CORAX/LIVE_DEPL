/**
 * Draws a bezier.
 *
 * @param g
 * @param bezier
 * @param class_
 * @param delay
 * @param controlPointClass a dot at each control point will be drawn if specified
 * @param lineClass a line to each control point will be drawn if specified
 * @returns
 */
declare function bezier(g: SVGGElement, bezier: number[][], class_?: string, delay?: number, controlPointClass?: string | undefined, controlPointRadius?: number, lineClass?: string | undefined): SVGElement[];
export { bezier };
