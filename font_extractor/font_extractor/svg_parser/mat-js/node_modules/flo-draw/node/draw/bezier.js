import { DEFAULT_CLASS } from "./default-class.js";
import { line } from "./line.js";
import { quadBezier } from "./quad-bezier.js";
import { cubicBezier } from "./cubic-bezier.js";
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
function bezier(g, bezier, class_ = DEFAULT_CLASS, delay = 0, controlPointClass = undefined, controlPointRadius = 0, lineClass = undefined) {
    if (bezier.length === 2) {
        return line(g, bezier, class_, delay, controlPointClass, controlPointRadius);
    }
    else if (bezier.length === 3) {
        return quadBezier(g, bezier, class_, delay, controlPointClass, controlPointRadius, lineClass);
    }
    else if (bezier.length === 4) {
        return cubicBezier(g, bezier, class_, delay, controlPointClass, controlPointRadius, lineClass);
    }
    return [];
}
export { bezier };
//# sourceMappingURL=bezier.js.map