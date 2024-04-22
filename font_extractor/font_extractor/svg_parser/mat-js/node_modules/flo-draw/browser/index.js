/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Q: () => (/* reexport */ drawFs),
  h: () => (/* reexport */ enableDebugDrawFs)
});

;// CONCATENATED MODULE: ./src/draw/default-class.ts
const DEFAULT_CLASS = 'red thin10 nofill ';


;// CONCATENATED MODULE: ./src/draw/xmlns.ts
const XMLNS = 'http://www.w3.org/2000/svg';


;// CONCATENATED MODULE: ./src/draw/circle.ts


/**
 * Draws a circle
 * @param g An SVG group element wherein to draw the circle.
 * @param circle
 * @param classes
 * @param delay
 */
function circle(g, circle, classes = DEFAULT_CLASS, delay) {
    const c = circle.center;
    const r = circle.radius;
    const $circle = document.createElementNS(XMLNS, 'circle');
    $circle.setAttributeNS(null, "cx", c[0].toString());
    $circle.setAttributeNS(null, "cy", c[1].toString());
    $circle.setAttributeNS(null, "r", r.toString());
    $circle.setAttributeNS(null, "class", classes);
    g.appendChild($circle);
    if (delay) {
        setTimeout(() => $circle.remove(), delay);
    }
    return [$circle];
}


;// CONCATENATED MODULE: ./src/draw/dot.ts

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


;// CONCATENATED MODULE: ./src/draw/line.ts



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


;// CONCATENATED MODULE: ./src/draw/cross-hair.ts



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


;// CONCATENATED MODULE: ./src/draw/rect.ts


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


;// CONCATENATED MODULE: ./src/draw/polygon.ts


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


;// CONCATENATED MODULE: ./src/draw/loop.ts


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


;// CONCATENATED MODULE: ./src/draw/polyline.ts


function polyline(g, poly, class_ = DEFAULT_CLASS, delay) {
    if (poly.length < 2) {
        return [];
    }
    const $path = document.createElementNS(XMLNS, 'path');
    let d = `M${poly[0][0]} ${poly[0][1]} L`;
    for (let i = 0; i < poly.length; i++) {
        d += `${poly[i][0]} ${poly[i][1]} `;
    }
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


;// CONCATENATED MODULE: ./src/draw/quad-bezier.ts




function quadBezier(g, ps, class_ = DEFAULT_CLASS, delay = 0, controlPointClass = undefined, controlPointRadius = 0, lineCLass = undefined) {
    const [[x0, y0], [x1, y1], [x2, y2]] = ps;
    const $path = document.createElementNS(XMLNS, 'path');
    $path.setAttributeNS(null, "d", `M${x0} ${y0} Q${x1} ${y1} ${x2} ${y2}`);
    if (class_) {
        $path.setAttributeNS(null, "class", class_);
    }
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


;// CONCATENATED MODULE: ./src/draw/cubic-bezier.ts





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


;// CONCATENATED MODULE: ./src/draw/bezier.ts




/**
 * Draws a bezier.
 *
 * @param g
 * @param bezier
 * @param class_
 * @param delay
 * @param controlPointClass a dot at each control point will be drawn if specified
 * @param lineClass a line to each control point will be drawn if specified
 * @returns
 */
function bezier(g, bezier, class_ = DEFAULT_CLASS, delay = 0, controlPointClass = undefined, controlPointRadius = 0, lineClass = undefined) {
    if (bezier.length === 2) {
        return line(g, bezier, class_, delay, controlPointClass, controlPointRadius);
    }
    else if (bezier.length === 3) {
        return quadBezier(g, bezier, class_, delay, controlPointClass, controlPointRadius, lineClass);
    }
    else if (bezier.length === 4) {
        return cubicBezier(g, bezier, class_, delay, controlPointClass, controlPointRadius, lineClass);
    }
    return [];
}


;// CONCATENATED MODULE: ./src/draw/beziers.ts

const COLORS = ['red', 'green', 'cyan', 'blue'];
/**
 * Draws beziers.
 * @param snap
 * @param beziers
 * @param delay
 */
function beziers(g, beziers, classes, delay) {
    const alternateColors = classes === undefined;
    const $beziers = [];
    for (let i = 0; i < beziers.length; i++) {
        const ps = beziers[i];
        const color = COLORS[i % COLORS.length];
        const class_ = alternateColors
            ? 'thin5 nofill ' + color
            : classes;
        $beziers.push(...bezier(g, ps, class_));
    }
    if (delay) {
        setTimeout(() => $beziers.forEach(e => e.remove()), delay);
    }
    return $beziers;
}


;// CONCATENATED MODULE: ./src/draw/evaluate-bezier.ts
/**
 * Returns an estimate of evaluating the given bezier at the given t value.
 * @param ps An order 1, 2 or bezier
 * @param t The parameter ∈ [0,1]
 */
function evaluateBezier(ps, t) {
    const s = 1 - t;
    if (ps.length === 4) {
        // cubic
        const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps;
        const x = x0 * s ** 3 + 3 * x1 * s ** 2 * t + 3 * x2 * s * t ** 2 + x3 * t ** 3;
        const y = y0 * s ** 3 + 3 * y1 * s ** 2 * t + 3 * y2 * s * t ** 2 + y3 * t ** 3;
        return [x, y];
    }
    if (ps.length === 3) {
        // quadratic
        const [[x0, y0], [x1, y1], [x2, y2]] = ps;
        const x = x0 * s ** 2 + 2 * x1 * s * t + x2 * t ** 2;
        const y = y0 * s ** 2 + 2 * y1 * s * t + y2 * t ** 2;
        return [x, y];
    }
    if (ps.length === 2) {
        // line
        const [[x0, y0], [x1, y1]] = ps;
        const x = x0 * s + x1 * t;
        const y = y0 * s + y1 * t;
        return [x, y];
    }
    return [NaN, NaN];
}


;// CONCATENATED MODULE: ./src/draw/split-at.ts
/**
 * Returns 2 new beziers split at the given t parameter, i.e. for the ranges
 * [0,t] and [t,1].
 * @param ps
 * @param t
 */
function splitAt(ps, t) {
    if (ps.length === 2) {
        return splitLineAt(ps, t);
    }
    else if (ps.length === 3) {
        return splitQuadAt(ps, t);
    }
    else if (ps.length === 4) {
        return splitCubicAt(ps, t);
    }
    return [];
}
/**
 * Returns 2 new cubic beziers split at the given t parameter, i.e. for the ranges
 * [0,t] and [t,1]. Uses de Casteljau's algorithm.
 *
 * A loose bound on the accuracy of the resultant points is given by:
 * |δP| = 2n*max_k(|b_k|)η, where n = 3 (cubic), b_k are the control points
 * abd η is Number.EPSILON.
 * @param ps A cubic bezier curve
 * @param t The t parameter where the curve should be split
 */
function splitCubicAt(ps, t) {
    const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps;
    const s = 1 - t;
    const t2 = t * t;
    const t3 = t2 * t;
    const s2 = s * s;
    const s3 = s2 * s;
    /** The split point */
    const p = [
        t3 * x3 + 3 * s * t2 * x2 + 3 * s2 * t * x1 + s3 * x0,
        t3 * y3 + 3 * s * t2 * y2 + 3 * s2 * t * y1 + s3 * y0
    ];
    const ps1 = [
        [x0, y0],
        [t * x1 + s * x0,
            t * y1 + s * y0],
        [t2 * x2 + 2 * s * t * x1 + s2 * x0,
            t2 * y2 + 2 * s * t * y1 + s2 * y0],
        p
    ];
    const ps2 = [
        p,
        [t2 * x3 + 2 * t * s * x2 + s2 * x1,
            t2 * y3 + 2 * t * s * y2 + s2 * y1],
        [t * x3 + s * x2,
            t * y3 + s * y2],
        [x3, y3]
    ];
    return [ps1, ps2];
}
function splitQuadAt(ps, t) {
    const [[x0, y0], [x1, y1], [x2, y2]] = ps;
    const s = 1 - t;
    /** The split point */
    const p = [
        s * s * x0 + 2 * s * t * x1 + t * t * x2,
        s * s * y0 + 2 * s * t * y1 + t * t * y2
    ];
    const ps1 = [
        [x0, y0],
        [s * x0 + t * x1,
            s * y0 + t * y1],
        p
    ];
    const ps2 = [
        p,
        [s * x1 + t * x2,
            s * y1 + t * y2],
        [x2, y2]
    ];
    return [ps1, ps2];
}
function splitLineAt(ps, t) {
    const [[x0, y0], [x1, y1]] = ps;
    const s = 1 - t;
    /** The split point */
    const p = [
        s * x0 + t * x1,
        s * y0 + t * y1
    ];
    const ps1 = [
        [x0, y0],
        p
    ];
    const ps2 = [
        p,
        [x1, y1]
    ];
    return [ps1, ps2];
}


;// CONCATENATED MODULE: ./src/draw/bezier-from-bezier-piece.ts


/**
 * Returns a new bezier from the given bezier by limiting its t range.
 *
 * Duplicated here so we don't circularly depend on flo-bezier.
 *
 * Uses de Casteljau's algorithm.
 *
 * @param ps a bezier
 * @param tRange a t range
 */
function bezierFromBezierPiece(ps, tRange) {
    // If tRange = [0,1] then return original bezier.
    if (tRange[0] === 0 && tRange[1] === 1) {
        return ps;
    }
    // If tRange[0] === tRange[1] then return a single point degenerated bezier.
    if (tRange[0] === tRange[1]) {
        const p = evaluateBezier(ps, tRange[0]);
        return [p, p, p, p];
    }
    if (tRange[0] === 0) {
        return splitAt(ps, tRange[1])[0];
    }
    if (tRange[1] === 1) {
        return splitAt(ps, tRange[0])[1];
    }
    // At this stage we know the t range is not degenerate and tRange[0] !== 0 
    // and tRange[1] !== 1
    return splitAt(splitAt(ps, tRange[0])[1], (tRange[1] - tRange[0]) / (1 - tRange[0]))[0];
}


;// CONCATENATED MODULE: ./src/draw/bezier-piece.ts





/**
 * Draws a bezier piece, i.e. a bezier within a specified t range.
 * @param snap
 * @param bezierPiece
 * @param class
 * @param delay
 */
function bezierPiece(g, ps_, tRange, class_ = DEFAULT_CLASS, delay) {
    const $elems = (tRange[0] === tRange[1])
        // Draw crosshair if t range bounds are equal.
        ? crossHair(g, evaluateBezier(ps_, tRange[0]), class_, 1.5)
        : bezier(g, bezierFromBezierPiece(ps_, tRange), class_);
    if (delay) {
        setTimeout(() => $elems.forEach(e => e.remove()), delay);
    }
    return $elems;
}


;// CONCATENATED MODULE: ./src/draw/text.ts


/**
 * Draws text
 * @param g a SVG group element wherein to draw
 * @param p
 * @param str
 * @param fontSize
 * @param classes
 * @param delay
 */
function text_text(g, p, str, fontSize, classes = DEFAULT_CLASS, delay) {
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


;// CONCATENATED MODULE: ./src/draw-fs.ts














const drawFs = {
    circle: circle,
    crossHair: crossHair,
    dot: dot,
    line: line,
    rect: rect,
    beziers: beziers,
    bezier: bezier,
    bezierPiece: bezierPiece,
    quadBezier: quadBezier,
    cubicBezier: cubicBezier,
    polygon: polygon,
    loop: loop,
    polyline: polyline,
    text: text_text
};


;// CONCATENATED MODULE: ./src/debug/debug.ts

/**
 * Returns a new debug object by spreading boolean operation debug information
 * onto the given (possibly undefined) debug object.
 * @param debugOn a (possibly undefined) debug object
 */
function enableDebugDrawFs(debugOn) {
    if (!debugOn) {
        return;
    }
    const debug = window._debug_;
    const debug_ = {
        ...debug,
        fs: {
            ...debug?.fs,
            draw: {
                ...drawFs
            }
        }
    };
    window._debug_ = debug_;
}


;// CONCATENATED MODULE: ./src/index.ts




var __webpack_exports__drawFs = __webpack_exports__.Q;
var __webpack_exports__enableDebugDrawFs = __webpack_exports__.h;
export { __webpack_exports__drawFs as drawFs, __webpack_exports__enableDebugDrawFs as enableDebugDrawFs };
