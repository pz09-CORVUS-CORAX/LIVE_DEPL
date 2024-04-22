import { DEFAULT_CLASS } from './default-class.js';
import { XMLNS } from './xmlns.js';
function loop(g, curves, class_ = DEFAULT_CLASS, delay) {
    if (!curves.length) {
        return [];
    }
    const $path = document.createElementNS(XMLNS, 'path');
    let d = `M${curves[0][0][0]} ${curves[0][0][1]} `;
    for (let i = 0; i < curves.length; i++) {
        const curve = curves[i];
        d += `${getType(curve.length)} `;
        for (let j = 1; j < curve.length; j++) {
            d += `${curve[j][0]} ${curve[j][1]} `;
        }
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
function getType(len) {
    if (len === 2) {
        return 'L';
    }
    if (len === 3) {
        return 'Q';
    }
    if (len === 4) {
        return 'C';
    }
}
export { loop };
//# sourceMappingURL=loop.js.map