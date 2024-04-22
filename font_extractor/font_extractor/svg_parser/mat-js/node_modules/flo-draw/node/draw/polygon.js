import { DEFAULT_CLASS } from './default-class.js';
import { XMLNS } from './xmlns.js';
/**
 * Draws a polygon
 * @param g
 * @param poly the polygon specified as an array of points - the last point does
 * not have to be specified
 * @param class_
 * @param delay
 */
function polygon(g, poly, class_ = DEFAULT_CLASS, delay) {
    const $path = document.createElementNS(XMLNS, 'path');
    let d = `M${poly[0][0]} ${poly[0][1]} L`;
    for (let i = 0; i < poly.length; i++) {
        d += `${poly[i][0]} ${poly[i][1]} `;
    }
    d += ' z';
    $path.setAttributeNS(null, "d", d);
    if (class_) {
        $path.setAttributeNS(null, "class", class_);
    }
    g.appendChild($path);
    if (delay) {
        setTimeout(() => $path.remove(), delay);
    }
    return [$path];
}
export { polygon };
//# sourceMappingURL=polygon.js.map