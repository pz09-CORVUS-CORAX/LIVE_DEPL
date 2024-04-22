import { DEFAULT_CLASS } from './default-class.js';
import { crossHair } from './cross-hair.js';
import { bezier } from './bezier.js';
import { evaluateBezier } from './evaluate-bezier.js';
import { bezierFromBezierPiece } from './bezier-from-bezier-piece.js';
/**
 * Draws a bezier piece, i.e. a bezier within a specified t range.
 * @param snap
 * @param bezierPiece
 * @param class
 * @param delay
 */
function bezierPiece(g, ps_, tRange, class_ = DEFAULT_CLASS, delay) {
    const $elems = (tRange[0] === tRange[1])
        // Draw crosshair if t range bounds are equal.
        ? crossHair(g, evaluateBezier(ps_, tRange[0]), class_, 1.5)
        : bezier(g, bezierFromBezierPiece(ps_, tRange), class_);
    if (delay) {
        setTimeout(() => $elems.forEach(e => e.remove()), delay);
    }
    return $elems;
}
export { bezierPiece };
//# sourceMappingURL=bezier-piece.js.map