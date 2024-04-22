import { circle } from "./circle.js";
/**
 * Draws a dot.
 */
function dot(g, p, r = 3, color = 'red', delay) {
    const [$dot] = circle(g, { center: p, radius: r }, 'dot ' + color, delay);
    if (delay) {
        setTimeout(() => $dot.remove(), delay);
    }
    return [$dot];
}
export { dot };
//# sourceMappingURL=dot.js.map