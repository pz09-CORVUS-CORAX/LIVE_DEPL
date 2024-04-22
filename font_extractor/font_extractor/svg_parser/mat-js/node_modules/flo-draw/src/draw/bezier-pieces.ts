import { DEFAULT_CLASS } from './default-class.js';
import { bezierPiece } from './bezier-piece.js';


function bezierPieces(
        g            : SVGGElement, 
        bezierPieces : { ps : number[][], tRange : number[] }[],
        class_       : string = DEFAULT_CLASS,
        delay?       : number) {

    const $elems: SVGElement[] = [];

    for (let i=0; i<bezierPieces.length; i++) {
        $elems.push(...bezierPiece(
            g, bezierPieces[i].ps, 
            bezierPieces[i].tRange, 
            class_
        ));
    }

    if (delay) { 
        setTimeout(() => $elems.forEach(e => e.remove(), delay));
    }

    return $elems;
}


export { bezierPieces }
