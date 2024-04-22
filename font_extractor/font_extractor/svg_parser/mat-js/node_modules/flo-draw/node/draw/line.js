import { DEFAULT_CLASS } from './default-class.js';
import { dot } from './dot.js';
import { XMLNS } from './xmlns.js';
/**
 *
 * @param snap
 * @param l
 * @param classes
 */
function line(g, l, classes = DEFAULT_CLASS, delay = 0, controlPointClass = undefined, controlPointRadius = 0) {
    const $line = document.createElementNS(XMLNS, 'line');
    $line.setAttributeNS(null, "x1", l[0][0].toString());
    $line.setAttributeNS(null, "y1", l[0][1].toString());
    $line.setAttributeNS(null, "x2", l[1][0].toString());
    $line.setAttributeNS(null, "y2", l[1][1].toString());
    $line.setAttributeNS(null, "class", classes);
    g.appendChild($line);
    let $dots = [];
    if (controlPointClass !== undefined) {
        for (const p of l) {
            $dots.push(...dot(g, p, controlPointRadius, controlPointClass, delay));
        }
    }
    for (const $ of $dots) {
        g.appendChild($);
    }
    const $svgs = [$line, ...$dots];
    if (delay) {
        setTimeout(() => { for (const $ of $svgs) {
            $.remove();
        } }, delay);
    }
    return $svgs;
}
export { line };
//# sourceMappingURL=line.js.map