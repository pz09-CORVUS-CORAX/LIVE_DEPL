/**
 * Draws a circle
 * @param g An SVG group element wherein to draw the circle.
 * @param circle
 * @param classes
 * @param delay
 */
declare function circle(g: SVGGElement, circle: {
    radius: number;
    center: number[];
}, classes?: string, delay?: number): SVGCircleElement[];
export { circle };
