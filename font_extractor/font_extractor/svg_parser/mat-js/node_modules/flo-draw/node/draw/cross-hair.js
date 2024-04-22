import { DEFAULT_CLASS } from './default-class.js';
import { circle } from './circle.js';
import { line } from './line.js';
/**
 * Draws a crosshair.
 */
function crossHair(g, p, classes = DEFAULT_CLASS, r = 3, delay) {
    const circle_ = { center: p, radius: r };
    const $circle = circle(g, circle_, classes);
    const l1 = [[p[0] - r, p[1]], [p[0] + r, p[1]]];
    const l2 = [[p[0], p[1] - r], [p[0], p[1] + r]];
    const $l1 = line(g, l1, classes);
    const $l2 = line(g, l2, classes);
    if (delay) {
        setTimeout(() => {
            $circle.forEach(e => e.remove());
            $l1.forEach(e => e.remove());
            $l2.forEach(e => e.remove());
        }, delay);
    }
    return [...$circle, ...$l1, ...$l2];
}
export { crossHair };
//# sourceMappingURL=cross-hair.js.map