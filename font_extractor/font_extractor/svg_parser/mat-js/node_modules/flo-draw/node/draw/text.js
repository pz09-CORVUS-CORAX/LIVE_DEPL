import { DEFAULT_CLASS } from "./default-class.js";
import { XMLNS } from "./xmlns.js";
/**
 * Draws text
 * @param g a SVG group element wherein to draw
 * @param p
 * @param str
 * @param fontSize
 * @param classes
 * @param delay
 */
function text(g, p, str, fontSize, classes = DEFAULT_CLASS, delay) {
    const $text = document.createElementNS(XMLNS, 'text');
    $text.setAttributeNS(null, "x", p[0].toString());
    $text.setAttributeNS(null, "y", p[1].toString());
    $text.setAttributeNS(null, "font-size", fontSize.toString());
    $text.setAttributeNS(null, "class", classes);
    $text.textContent = str;
    g.appendChild($text);
    if (delay) {
        setTimeout(() => $text.remove(), delay);
    }
    return [$text];
}
export { text };
//# sourceMappingURL=text.js.map