import { DEFAULT_CLASS } from './default-class.js';
import { XMLNS } from './xmlns.js';
function rect(g, rect, classes = DEFAULT_CLASS, delay) {
    const [[x0, y0], [x1, y1]] = rect;
    const x = x0 < x1 ? x0 : x1;
    const y = y0 < y1 ? y0 : y1;
    const width = Math.abs(x0 - x1);
    const height = Math.abs(y0 - y1);
    const $rect = document.createElementNS(XMLNS, 'rect');
    $rect.setAttributeNS(null, "x", x.toString());
    $rect.setAttributeNS(null, "y", y.toString());
    $rect.setAttributeNS(null, "width", width.toString());
    $rect.setAttributeNS(null, "height", height.toString());
    if (classes) {
        $rect.setAttributeNS(null, "class", classes);
    }
    g.appendChild($rect);
    if (delay) {
        setTimeout(() => $rect.remove(), delay);
    }
    return [$rect];
}
export { rect };
//# sourceMappingURL=rect.js.map