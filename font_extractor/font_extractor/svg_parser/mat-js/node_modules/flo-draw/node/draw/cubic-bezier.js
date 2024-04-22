import { DEFAULT_CLASS } from "./default-class.js";
import { XMLNS } from "./xmlns.js";
import { crossHair } from "./cross-hair.js";
import { dot } from "./dot.js";
import { line } from "./line.js";
function cubicBezier(g, ps, class_ = DEFAULT_CLASS, delay = 0, controlPointClass = undefined, controlPointRadius = 0, lineCLass = undefined) {
    const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps;
    if (x0 === x3 && x1 === x3 && x2 === x3 &&
        y0 === y3 && y1 === y3 && y2 === y3) {
        return crossHair(g, [x0, y0], class_, 0.2, delay);
    }
    const $path = document.createElementNS(XMLNS, 'path');
    $path.setAttributeNS(null, "d", `M${x0} ${y0} C${x1} ${y1} ${x2} ${y2} ${x3} ${y3}`);
    $path.setAttributeNS(null, "class", class_);
    let $dots = [];
    if (controlPointClass !== undefined) {
        for (const p of ps) {
            $dots.push(...dot(g, p, controlPointRadius, controlPointClass, delay));
        }
    }
    let $lines = [];
    if (lineCLass !== undefined) {
        for (let i = 0; i < ps.length - 1; i++) {
            $lines.push(...line(g, [ps[i], ps[i + 1]], lineCLass, delay));
        }
    }
    const $svgs = [$path, ...$dots, ...$lines];
    for (const $ of $svgs) {
        g.appendChild($);
    }
    if (delay) {
        setTimeout(() => { for (const $ of $svgs) {
            $.remove();
        } }, delay);
    }
    return $svgs;
}
export { cubicBezier };
//# sourceMappingURL=cubic-bezier.js.map