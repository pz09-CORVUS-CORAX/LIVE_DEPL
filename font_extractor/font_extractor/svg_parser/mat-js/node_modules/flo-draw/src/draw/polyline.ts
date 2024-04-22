import { DEFAULT_CLASS } from './default-class.js';
import { XMLNS } from './xmlns.js';


function polyline(
        g      : SVGGElement,
        poly   : number[][], 
        class_ = DEFAULT_CLASS,
        delay? : number) {

    if (poly.length < 2) { return []; }

    const $path = document.createElementNS(XMLNS, 'path');
    let d = `M${poly[0][0]} ${poly[0][1]} L`;
    for (let i=0; i<poly.length; i++) {
        d += `${poly[i][0]} ${poly[i][1]} `;
    }

    $path.setAttributeNS(null, "d", d);
    if (class_) { $path.setAttributeNS(null, "class", class_); }

    g.appendChild($path);

    if (delay) { setTimeout(() => $path.remove(), delay); }

    return [$path];
}


export { polyline }
