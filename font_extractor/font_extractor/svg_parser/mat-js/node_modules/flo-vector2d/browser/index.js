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
  "oH": () => (/* binding */ ccw),
  "Sc": () => (/* reexport */ centroid),
  "pb": () => (/* reexport */ circumCenter),
  "kC": () => (/* reexport */ cross),
  "Ph": () => (/* reexport */ det3),
  "qw": () => (/* reexport */ distanceBetween),
  "PI": () => (/* reexport */ distanceBetweenPointAndLine),
  "tl": () => (/* reexport */ doesSegSegIntersect),
  "AK": () => (/* reexport */ dot),
  "Dg": () => (/* binding */ equal),
  "JQ": () => (/* binding */ fromTo),
  "Gk": () => (/* binding */ getClosestTo),
  "AY": () => (/* binding */ getObjClosestTo),
  "un": () => (/* reexport */ inCenter),
  "sX": () => (/* binding */ interpolate),
  "Zh": () => (/* reexport */ len),
  "YH": () => (/* reexport */ lengthSquared),
  "QG": () => (/* reexport */ lineLineIntersection),
  "_r": () => (/* reexport */ manhattanDistanceBetween),
  "Tp": () => (/* reexport */ manhattanLength),
  "J6": () => (/* binding */ mean),
  "GY": () => (/* reexport */ reverse),
  "ay": () => (/* reexport */ reverseRotate),
  "U1": () => (/* reexport */ rotate),
  "$z": () => (/* reexport */ rotate90Degrees),
  "UF": () => (/* reexport */ rotateNeg90Degrees),
  "bA": () => (/* reexport */ scale),
  "NW": () => (/* reexport */ segSegIntersection),
  "Pz": () => (/* reexport */ squaredDistanceBetween),
  "$6": () => (/* reexport */ squaredDistanceBetweenPointAndLineSegment),
  "Hg": () => (/* reexport */ toLength),
  "wP": () => (/* reexport */ toUnitVector),
  "cm": () => (/* reexport */ transformAffine),
  "Zb": () => (/* reexport */ transformLinear),
  "Iu": () => (/* reexport */ translate)
});

;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/basic/two-product.js
const f = 134217729; // 2**27 + 1;
/**
 * Returns the exact result of multiplying two doubles.
 *
 * * the resulting array is the reverse of the standard twoSum in the literature.
 *
 * Theorem 18 (Shewchuk): Let a and b be p-bit floating-point numbers, where
 * p >= 6. Then the following algorithm will produce a nonoverlapping expansion
 * x + y such that ab = x + y, where x is an approximation to ab and y
 * represents the roundoff error in the calculation of x. Furthermore, if
 * round-to-even tiebreaking is used, x and y are non-adjacent.
 *
 * See https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf
 * @param a A double
 * @param b Another double
 */
function two_product_twoProduct(a, b) {
    const x = a * b;
    //const [ah, al] = split(a);
    const c = f * a;
    const ah = c - (c - a);
    const al = a - ah;
    //const [bh, bl] = split(b);
    const d = f * b;
    const bh = d - (d - b);
    const bl = b - bh;
    const y = (al * bl) - ((x - (ah * bh)) - (al * bh) - (ah * bl));
    //const err1 = x - (ah * bh);
    //const err2 = err1 - (al * bh);
    //const err3 = err2 - (ah * bl);
    //const y = (al * bl) - err3;
    return [y, x];
}

//# sourceMappingURL=two-product.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/fast-expansion-sum.js

// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const compress = (/* unused pure expression or super */ null && (eCompress));
/**
 * Returns the result of adding two expansions.
 *
 * Theorem 13: Let e = sum_(i=1)^m(e_i) and f = sum_(i=1)^n(f_i) be strongly
 * nonoverlapping expansions of m and n p-bit components, respectively, where
 * p >= 4. Suppose that the components of both e and f are sorted in order of
 * increasing magnitude, except that any of the e_i or f_i may be zero. On a
 * machine whose arithmetic uses the round-to-even rule, the following algorithm
 * will produce a strongly nonoverlapping expansion h such that
 * sum_(i=1)^(m+n)(e_i + f_i) = e + f, where the components of h are also in
 * order of increasing magnitude, except that any of the h_i may be zero.
 *
 * See https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf
 */
function fastExpansionSum(e, f) {
    //const g = merge(e,f);
    // inlined (above line)
    const lenE = e.length;
    const lenF = f.length;
    let i = 0;
    let j = 0;
    const g = [];
    while (i < lenE && j < lenF) {
        if (e[i] === 0) {
            i++;
            continue;
        }
        if (f[j] === 0) {
            j++;
            continue;
        }
        if (Math.abs(e[i]) <= Math.abs(f[j])) {
            g.push(e[i]);
            i++;
        }
        else {
            g.push(f[j]);
            j++;
        }
    }
    while (i < lenE) {
        g.push(e[i]);
        i++;
    }
    while (j < lenF) {
        g.push(f[j]);
        j++;
    }
    if (g.length === 0) {
        return [0];
    }
    // end inlined
    const len = g.length;
    if (len === 1) {
        return g;
    }
    //const h: number[] = new Array(len);
    const h = [];
    //const q: number;
    //[h[0], q] = fastTwoSum(g[1], g[0]);
    // inlined (above line)
    const a = g[1];
    const b = g[0];
    let q = a + b;
    //h[0] = b - (q - a);
    const hh = b - (q - a);
    if (hh !== 0) {
        h.push(hh);
    }
    //let j = 0;
    j = 0;
    for (let i = 2; i < len; i++) {
        //[h[i-1], q] = twoSum(q, g[i]);
        // inlined (above line)
        const b = g[i];
        const R = q + b;
        const _ = R - q;
        //h[i-1] = (q - (R - _)) + (b - _);
        const hh = (q - (R - _)) + (b - _);
        if (hh !== 0) {
            h.push(hh);
        }
        q = R;
    }
    //h[len-1] = q;
    //h.push(q);
    if (q !== 0 || h.length === 0) {
        h.push(q);
    }
    //return compress(h);
    return h;
}
/**
 * Returns the result of merging an expansion e and f into a single expansion,
 * in order of nondecreasing magnitude (possibly with interspersed zeros).
 * (This function is zero-eliminating)
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * @param e a floating point expansion
 * @param f another floating point expansion
 */
function merge(e, f) {
    const lenE = e.length;
    const lenF = f.length;
    let i = 0;
    let j = 0;
    const merged = [];
    while (i < lenE && j < lenF) {
        if (e[i] === 0) {
            i++;
            continue;
        }
        if (f[j] === 0) {
            j++;
            continue;
        }
        if (Math.abs(e[i]) <= Math.abs(f[j])) {
            merged.push(e[i]);
            i++;
        }
        else {
            merged.push(f[j]);
            j++;
        }
    }
    while (i < lenE) {
        merged.push(e[i]);
        i++;
    }
    while (j < lenF) {
        merged.push(f[j]);
        j++;
    }
    if (merged.length === 0) {
        return [0];
    }
    return merged;
}

//# sourceMappingURL=fast-expansion-sum.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-negative-of.js
/**
 * Returns the negative of the given floating point expansion.
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * @param e a floating point expansion
 */
function eNegativeOf(e) {
    const m = e.length;
    const h = new Array(m);
    for (let i = 0; i < m; i++) {
        h[i] = -e[i];
    }
    return h;
}

//# sourceMappingURL=e-negative-of.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-diff.js


// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const negativeOf = eNegativeOf;
const add = fastExpansionSum;
/**
 * Returns the difference between two floating point expansions, i.e. e - f.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * @param e a floating point expansion
 * @param f another floating point expansion
 */
function eDiff(e, f) {
    const g = negativeOf(f);
    return add(e, g);
}

//# sourceMappingURL=e-diff.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-estimate.js
/**
 * Returns the result of the given floating point expansion rounded to a double
 * floating point number.
 *
 * The result is within 1 ulps of the actual value, e.g. imagine the worst case
 * situation where we add (in 4dot4) 1111.1000 + 0.000011111111... The result
 * will be 1111.1000 whereas as the correct result should be 1111.1001 and we
 * thus lost 1 ulp of accuracy. It does not matter that the expansion contain
 * several floats since none is overlapping.
 *
 * See Shewchuk https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf
 *
 * @param e a floating point expansion
 */
function eEstimate(e) {
    let Q = e[0];
    for (let i = 1; i < e.length; i++) {
        Q += e[i];
    }
    return Q;
}

//# sourceMappingURL=e-estimate.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/basic/two-diff.js
/**
 * Returns the exact result of subtracting b from a (as a floating point
 * expansion).
 * @param a
 * @param b
 */
function twoDiff(a, b) {
    const x = a - b;
    const bvirt = a - x;
    const y = (a - (x + bvirt)) + (bvirt - b);
    return [y, x];
}

//# sourceMappingURL=two-diff.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-compress.js
/**
 * Returns the result of compressing the given floating point expansion.
 *
 * * primarily for internal library use
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * Theorem 23 (Shewchuck): Let e = sum_(i=1)^m(e_i) be a nonoverlapping
 * expansion of m p-bit components, where m >= 3. Suppose that the components of
 * e are sorted in order of increasing magnitude, except that any of the e_i may
 * be zero. Then the following algorithm will produce a nonoverlapping expansion
 * (nonadjacent if round-to even tiebreaking is used) such that
 * h = sum_(i=1)^n(h_i) = e, where the components h_i are in order of increasing
 * magnitude. If h != 0, none of the h_i will be zero. Furthermore, the largest
 * component h_n approximates h with an error smaller than ulp(h_n).
 */
function e_compress_eCompress(e) {
    //return e;
    const e_ = e.slice();
    const m = e_.length;
    if (m === 1) {
        return e_;
    }
    let Q = e_[m - 1];
    let bottom = m;
    for (let i = m - 2; i >= 0; --i) {
        const a = Q;
        const b = e_[i];
        Q = a + b;
        const bv = Q - a;
        const q = b - bv;
        if (q) {
            e_[--bottom] = Q;
            Q = q;
        }
    }
    let top = 0;
    for (let i = bottom; i < m; ++i) {
        const a = e_[i];
        const b = Q;
        Q = a + b;
        const bv = Q - a;
        const q = b - bv;
        if (q) {
            e_[top++] = q;
        }
    }
    e_[top++] = Q;
    e_.length = top;
    return e_;
}

//# sourceMappingURL=e-compress.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/geometric-primitives/orient2d.js






const ccwerrboundA = 3.330669073875472e-16;
const ccwerrboundB = 2.220446049250315e-16;
const ccwerrboundC = 1.109335647967049e-31;
const resulterrbound = 3.330669073875471e-16;
/**
 * * Ported from [Shewchuk](http://docs.ros.org/kinetic/api/asr_approx_mvbb/html/Predicates_8cpp_source.html)
 * * see also https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf
 *
 * * Adaptive exact 2d orientation test.
 *
 * * Robust.
 *
 * Return a positive value if the points pa, pb, and pc occur in
 * counterclockwise order; a negative value if they occur in clockwise order;
 * and zero if they are collinear.  The result is also a rough approximation of
 * twice the signed area of the triangle defined by the three points.
 *
 * The result returned is the determinant of a matrix. This determinant is
 * computed adaptively, in the sense that exact arithmetic is used only to the
 * degree it is needed to ensure that the returned value has the correct sign.
 * Hence, orient2d() is usually quite fast, but will run more slowly when the
 * input points are collinear or nearly so.
 */
function orient2d(A, B, C) {
    const detleft = (A[0] - C[0]) * (B[1] - C[1]);
    const detright = (A[1] - C[1]) * (B[0] - C[0]);
    const det = detleft - detright;
    let detsum;
    if (detleft > 0) {
        if (detright <= 0) {
            // Anti-clockwise
            return det;
        }
        else {
            detsum = detleft + detright;
        }
    }
    else if (detleft < 0) {
        if (detright >= 0) {
            // Clockwise
            return det;
        }
        else {
            detsum = -detleft - detright;
        }
    }
    else {
        // Anti-clockwise, clockwise or straight
        return det;
    }
    if (Math.abs(det) >= ccwerrboundA * detsum) {
        // Anti-clockwise or clockwise
        return det;
    }
    return orient2dAdapt(A, B, C, detsum);
}
function orient2dAdapt(A, B, C, detsum) {
    const acx = A[0] - C[0];
    const bcx = B[0] - C[0];
    const acy = A[1] - C[1];
    const bcy = B[1] - C[1];
    const b = eDiff(two_product_twoProduct(acx, bcy), two_product_twoProduct(acy, bcx));
    let det = eEstimate(b);
    if (Math.abs(det) >= ccwerrboundB * detsum) {
        // Anti-clockwise or clockwise
        return det;
    }
    const acxtail = twoDiff(A[0], C[0])[0];
    const bcxtail = twoDiff(B[0], C[0])[0];
    const acytail = twoDiff(A[1], C[1])[0];
    const bcytail = twoDiff(B[1], C[1])[0];
    if (acxtail === 0 && acytail === 0 &&
        bcxtail === 0 && bcytail === 0) {
        // Straight
        return det;
    }
    const errbound = ccwerrboundC * detsum + resulterrbound * Math.abs(det);
    det += (acx * bcytail + bcy * acxtail) - (acy * bcxtail + bcx * acytail);
    if (Math.abs(det) >= errbound) {
        return det;
    }
    const a = eDiff(two_product_twoProduct(acxtail, bcy), two_product_twoProduct(acytail, bcx));
    const c = fastExpansionSum(b, a);
    const d = eDiff(two_product_twoProduct(acx, bcytail), two_product_twoProduct(acy, bcxtail));
    const e = fastExpansionSum(c, d);
    const f = eDiff(two_product_twoProduct(acxtail, bcytail), two_product_twoProduct(acytail, bcxtail));
    let D = fastExpansionSum(e, f);
    D = e_compress_eCompress(D);
    return D[D.length - 1];
}

//# sourceMappingURL=orient2d.js.map
;// CONCATENATED MODULE: ./src/dot.ts
/**
 * Returns the dot (inner) product between two 2-vectors.
 * @param a the first vector
 * @param b the second vector
 */
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
}


;// CONCATENATED MODULE: ./src/cross.ts
/**
 * Returns the cross product signed magnitude between two 2-vectors.
 * @param a the first vector
 * @param b the second vector
 */
function cross(a, b) {
    return a[0] * b[1] - a[1] * b[0];
}


;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/scale-expansion.js




const scale_expansion_f = 134217729; // 2**27 + 1;
// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const tp = (/* unused pure expression or super */ null && (twoProduct));
const ts = (/* unused pure expression or super */ null && (twoSum));
const fts = (/* unused pure expression or super */ null && (fastTwoSum));
const scale_expansion_compress = (/* unused pure expression or super */ null && (eCompress));
/**
 * Returns the result of multiplying an expansion by a double.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * Theorem 19 (Shwechuk): Let e = sum_(i=1)^m(e_i) be a nonoverlapping expansion
 * of m p-bit components, and const b be a p-bit value where p >= 4. Suppose that
 * the components of e are sorted in order of increasing magnitude, except that
 * any of the e_i may be zero. Then the following algorithm will produce a
 * nonoverlapping expansion h such that h = sum_(i=1)^(2m)(h_i) = be, where the
 * components of h are also in order of increasing magnitude, except that any of
 * the h_i may be zero. Furthermore, if e is nonadjacent and round-to-even
 * tiebreaking is used, then h is non-adjacent.
 *
 * @param e a double floating point expansion
 * @param b a double
 */
function scaleExpansion(e, b) {
    const m = e.length;
    //const h: number[] = new Array(2*m);
    let q_;
    //[h[0], q] = tp(e[0], b);
    // inlined (above line)
    const a = e[0];
    let q = a * b;
    const c = scale_expansion_f * a;
    const ah = c - (c - a);
    const al = a - ah;
    const d = scale_expansion_f * b;
    const bh = d - (d - b);
    const bl = b - bh;
    const h = [];
    //h[0] = (al*bl) - ((q - (ah*bh)) - (al*bh) - (ah*bl));
    const hh = (al * bl) - ((q - (ah * bh)) - (al * bh) - (ah * bl));
    if (hh !== 0) {
        h.push(hh);
    }
    for (let i = 1; i < m; i++) {
        //const [t, T] = tp(e[i], b);
        // inlined (above line)
        const a = e[i];
        const T = a * b;
        const c = scale_expansion_f * a;
        const ah = c - (c - a);
        const al = a - ah;
        const d = scale_expansion_f * b;
        const bh = d - (d - b);
        const bl = b - bh;
        const t = (al * bl) - ((T - (ah * bh)) - (al * bh) - (ah * bl));
        //[h[2*i-1], q_] = ts(q, t);
        // inlined (above line)
        const x = q + t;
        const bv = x - q;
        //h[2*i-1] = (q - (x - bv)) + (t - bv);
        //h.push((q - (x - bv)) + (t - bv));
        const hh = (q - (x - bv)) + (t - bv);
        if (hh !== 0) {
            h.push(hh);
        }
        q_ = x;
        //[h[2*i], q] = fts(T, q_);
        // inlined (above line)
        const xx = T + q_;
        //h[2*i] = q_ - (xx - T);
        //h.push(q_ - (xx - T));
        const hhh = q_ - (xx - T);
        if (hhh !== 0) {
            h.push(hhh);
        }
        q = xx;
    }
    //h[2*m - 1] = q;
    //h.push(q);
    if (q !== 0 || h.length === 0) {
        h.push(q);
    }
    //return eCompress(h);
    return h;
}
/**
 * Returns the result of multiplying an expansion by a double.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * Theorem 19 (Shwechuk): Let e = sum_(i=1)^m(e_i) be a nonoverlapping expansion
 * of m p-bit components, and const b be a p-bit value where p >= 4. Suppose that
 * the components of e are sorted in order of increasing magnitude, except that
 * any of the e_i may be zero. Then the following algorithm will produce a
 * nonoverlapping expansion h such that h = sum_(i=1)^(2m)(h_i) = be, where the
 * components of h are also in order of increasing magnitude, except that any of
 * the h_i may be zero. Furthermore, if e is nonadjacent and round-to-even
 * tiebreaking is used, then h is non-adjacent.
 *
 * @param e a double floating point expansion
 * @param b a double
 */
function scaleExpansion2(b, e) {
    const m = e.length;
    //const h: number[] = new Array(2*m);
    let q_;
    //[h[0], q] = tp(e[0], b);
    // inlined (above line)
    const a = e[0];
    let q = a * b;
    const c = scale_expansion_f * a;
    const ah = c - (c - a);
    const al = a - ah;
    const d = scale_expansion_f * b;
    const bh = d - (d - b);
    const bl = b - bh;
    const h = [];
    //h[0] = (al*bl) - ((q - (ah*bh)) - (al*bh) - (ah*bl));
    const hh = (al * bl) - ((q - (ah * bh)) - (al * bh) - (ah * bl));
    if (hh !== 0) {
        h.push(hh);
    }
    for (let i = 1; i < m; i++) {
        //const [t, T] = tp(e[i], b);
        // inlined (above line)
        const a = e[i];
        const T = a * b;
        const c = scale_expansion_f * a;
        const ah = c - (c - a);
        const al = a - ah;
        const d = scale_expansion_f * b;
        const bh = d - (d - b);
        const bl = b - bh;
        const t = (al * bl) - ((T - (ah * bh)) - (al * bh) - (ah * bl));
        //[h[2*i-1], q_] = ts(q, t);
        // inlined (above line)
        const x = q + t;
        const bv = x - q;
        //h[2*i-1] = (q - (x - bv)) + (t - bv);
        //h.push((q - (x - bv)) + (t - bv));
        const hh = (q - (x - bv)) + (t - bv);
        if (hh !== 0) {
            h.push(hh);
        }
        q_ = x;
        //[h[2*i], q] = fts(T, q_);
        // inlined (above line)
        const xx = T + q_;
        //h[2*i] = q_ - (xx - T);
        //h.push(q_ - (xx - T));
        const hhh = q_ - (xx - T);
        if (hhh !== 0) {
            h.push(hhh);
        }
        q = xx;
    }
    //h[2*m - 1] = q;
    //h.push(q);
    if (q !== 0 || h.length === 0) {
        h.push(q);
    }
    //return eCompress(h);
    return h;
}

//# sourceMappingURL=scale-expansion.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/expansion-product.js



// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const multByDouble = scaleExpansion;
const expansion_product_add = fastExpansionSum;
const expansion_product_compress = (/* unused pure expression or super */ null && (eCompress));
/**
 * Returns the product of two double floating point expansions.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * As per Shewchuk in the above paper: "To find the product of two expansions
 * e and f, use SCALE-EXPANSION (with zero elimination) to form the expansions
 * ef_1, ef_2, ..., then sum these using a distillation tree."
 *
 * A distillation tree used with fastExpansionSum will give O(k*log k) vs O(k^2)
 * operations.
 *
 * Implemented naively and not as described by Shewchuk (i.e. the algorithm
 * takes O(k^2) operations).
 * @param e a double floating point expansion
 * @param f another double floating point expansion
 */
function expansionProduct(e, f) {
    let sum = [0];
    for (let i = 0; i < e.length; i++) {
        sum = expansion_product_add(sum, multByDouble(f, e[i]));
    }
    //return compress(sum);
    return sum;
}

//# sourceMappingURL=expansion-product.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-sign.js
/**
 * Returns the sign of the given expansion.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * From Shewchuk: "A nonoverlapping expansion is desirable because it is easy to
 * determine its sign (take the sign of the largest component) ... "
 *
 * @param e A floating point expansion with zeroes eliminated.
 */
function e_sign_eSign(e) {
    return e[e.length - 1];
}

//# sourceMappingURL=e-sign.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-compare.js


/**
 * Returns 0 if a === b, a +tive value if a > b or a negative value if a < b.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * "The easiest way to compare two expansions is to subtract one from the other,
 * and test the sign of the result. An expansion’s sign can be easily tested
 * because of the nonoverlapping property; simply check the sign of the
 * expansion's most significant nonzero component..."
 *
 * @param a a floating point expansion
 * @param b another floating point expansion
 */
function eCompare(a, b) {
    return e_sign_eSign(eDiff(a, b));
}

//# sourceMappingURL=e-compare.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/double-expansion/e-abs.js


// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗
const sign = (/* unused pure expression or super */ null && (eSign));
const e_abs_negativeOf = eNegativeOf;
/**
 * Returns the absolute value of the given floating point expansion.
 *
 * * see [Shewchuk](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)
 *
 * @param e a floating point expansion
 */
function eAbs(e) {
    if (e[e.length - 1] < 0) {
        return e_abs_negativeOf(e);
    }
    return e;
}

//# sourceMappingURL=e-abs.js.map
;// CONCATENATED MODULE: ./node_modules/big-float-ts/node/basic/two-sum.js
/**
 * Returns the exact result of adding two doubles.
 *
 * * the resulting array is the reverse of the standard twoSum in the literature.
 *
 * Theorem 7 (Knuth): Let a and b be p-bit floating-point numbers. Then the
 * following algorithm will produce a nonoverlapping expansion x + y such that
 * a + b = x + y, where x is an approximation to a + b and y is the roundoff
 * error in the calculation of x.
 *
 * See https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf
 */
function two_sum_twoSum(a, b) {
    const x = a + b;
    const bv = x - a;
    return [(a - (x - bv)) + (b - bv), x];
}
// inlined
//const R = a + b; const _ = R - a; const r = (a - (R - _)) + (b - _); return [r,R]

//# sourceMappingURL=two-sum.js.map
;// CONCATENATED MODULE: ./src/lines-and-segments/seg-seg-intersection.ts


const epr = expansionProduct;
const td = twoDiff;
/**
* Returns the point where two line segments intersect or undefined if they
* don't intersect or if they intersect at infinitely many points.
* * see Geometric primitves http://algs4.cs.princeton.edu/91primitives
* * **certified**
* @param ab The first line
* @param cd The second line
*/
function segSegIntersection(ab, cd) {
    const [a, b] = ab;
    const [c, d] = cd;
    const [a0, a1] = a;
    const [b0, b1] = b;
    const [c0, c1] = c;
    const [d0, d1] = d;
    //const denom  = (b[0] - a[0])*(d[1] - c[1]) - (b[1] - a[1])*(d[0] - c[0]);
    const denom = eDiff(epr(td(b0, a0), td(d1, c1)), epr(td(b1, a1), td(d0, c0)));
    //const rNumer = (a[1] - c[1])*(d[0] - c[0]) - (a[0] - c[0])*(d[1] - c[1]);
    const rNumer = eDiff(epr(td(a1, c1), td(d0, c0)), epr(td(a0, c0), td(d1, c1)));
    //const sNumer = (a[1] - c[1]) * (b[0] - a[0]) - (a[0] - c[0]) * (b[1] - a[1]); 
    const sNumer = eDiff(epr(td(a1, c1), td(b0, a0)), epr(td(a0, c0), td(b1, a1)));
    if (denom[denom.length - 1] === 0) {
        // parallel
        if (rNumer[rNumer.length - 1] === 0) {
            // collinear
            // TODO Check if x-projections and y-projections intersect
            // and return the line of intersection if they do.
            return undefined;
        }
        return undefined;
    }
    //let r = rNumer / denom;
    //let s = sNumer / denom;
    // if (0 <= r && r <= 1 && 0 <= s && s <= 1)
    if (e_sign_eSign(rNumer) * e_sign_eSign(denom) >= 0 && eCompare(eAbs(denom), eAbs(rNumer)) >= 0 &&
        e_sign_eSign(sNumer) * e_sign_eSign(denom) >= 0 && eCompare(eAbs(denom), eAbs(sNumer)) >= 0) {
        const r = eEstimate(rNumer) / eEstimate(denom);
        //return [a0 + r*(b0 - a0), a1 + r*(b1 - a1)];
        return [
            eEstimate(two_sum_twoSum(eEstimate(epr(td(b0, a0), rNumer)) / eEstimate(denom), a0)),
            eEstimate(two_sum_twoSum(eEstimate(epr(td(b1, a1), rNumer)) / eEstimate(denom), a1))
        ];
    }
    return undefined;
}


;// CONCATENATED MODULE: ./src/lines-and-segments/does-seg-seg-intersect.ts

/**
 * Returns true if the two given 2d line segments intersect, false otherwise.
 * * **robust** uses exact adaptive floating point arithmetic.
 * @param a a line segment
 * @param b another line segment
 */
function doesSegSegIntersect(a, b) {
    if ((orient2d(a[0], a[1], b[0]) * orient2d(a[0], a[1], b[1])) > 0) {
        return false;
    }
    if ((orient2d(b[0], b[1], a[0]) * orient2d(b[0], b[1], a[1])) > 0) {
        return false;
    }
    return true;
}


;// CONCATENATED MODULE: ./src/lines-and-segments/line-line-intersection.ts
/**
 * Find point where two lines intersect. Returns he point where the two lines
 * intersect or undefined if they don't intersect or are the same line.
 * see Wikipedia https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
 * @param l1 A line
 * @param l2 Another line
 */
function lineLineIntersection(l1, l2) {
    const [[x1, y1], [x2, y2]] = l1;
    const [[x3, y3], [x4, y4]] = l2;
    const x1_ = x2 - x1;
    const y1_ = y2 - y1;
    const x2_ = x4 - x3;
    const y2_ = y4 - y3;
    const denom = x2_ * y1_ - y2_ * x1_;
    if (denom === 0) {
        // parallel
        return undefined;
    }
    const b = ((y3 - y1) * x1_ - (x3 - x1) * y1_) / denom;
    return [
        x3 + b * x2_,
        y3 + b * y2_
    ];
}


;// CONCATENATED MODULE: ./src/affine-transformations/translate/translate.ts
// From: https://en.wikipedia.org/wiki/Affine_transformation
// "If X is the point set of an affine space, then every affine transformation 
// on X can be represented as the composition of a linear transformation on X 
// and a translation of X"
function translate(a, b) {
    function f(b) {
        return [a[0] + b[0], a[1] + b[1]];
    }
    // Curry the function
    return b === undefined ? f : f(b);
}


;// CONCATENATED MODULE: ./src/affine-transformations/linear/rotate.ts
function rotate(sinθ, cosθ, p) {
    function rotateByθ(p) {
        return [
            p[0] * cosθ - p[1] * sinθ,
            p[0] * sinθ + p[1] * cosθ
        ];
    }
    // Curry the function
    return p === undefined ? rotateByθ : rotateByθ(p);
}


;// CONCATENATED MODULE: ./src/affine-transformations/linear/scale.ts
/**
 * Returns a scaled version of the given 2-vector.
 * @param p a vector
 * @param c a scale factor
 */
function scale(p, c) {
    return [c * p[0], c * p[1]];
}


;// CONCATENATED MODULE: ./src/affine-transformations/linear/reverse.ts
/**
 * Returns the given 2-vector reversed (i.e. scaled by -1).
 * @param p a vector
 */
function reverse(p) {
    return [-p[0], -p[1]];
}


;// CONCATENATED MODULE: ./src/affine-transformations/linear/reverse-rotate.ts
/**
 * Returns a rotated (clockwise) version of the given 2-vector given the
 * sine and cosine of the angle.
 * @param p a 2d vector
 * @param sinθ
 * @param cosθ
 */
function reverseRotate(sinθ, cosθ, p) {
    return [
        +p[0] * cosθ + p[1] * sinθ,
        -p[0] * sinθ + p[1] * cosθ
    ];
}


;// CONCATENATED MODULE: ./src/affine-transformations/linear/rotate-90-degrees.ts
/**
 * Returns a 90 degrees rotated version of the given 2-vector.
 * @param p a 2d vector
 */
function rotate90Degrees(p) {
    return [-p[1], p[0]];
}


;// CONCATENATED MODULE: ./src/affine-transformations/linear/rotate-neg-90-degrees.ts
/**
* Returns a negative 90 degrees rotated version of the given 2-vector.
* @param p a 2d vector
*/
function rotateNeg90Degrees(p) {
    return [p[1], -p[0]];
}


;// CONCATENATED MODULE: ./src/affine-transformations/linear/transform-linear.ts
function transformLinear([[a, b], [c, d]], p) {
    function transform([x, y]) {
        return [
            a * x + b * y,
            c * x + d * y
        ];
    }
    // Curry the function
    return p === undefined ? transform : transform(p);
}


;// CONCATENATED MODULE: ./src/affine-transformations/transform-affine.ts
function transformAffine([[a, b], [c, d]], [r, s], p) {
    function transform([x, y]) {
        return [
            a * x + b * y + r,
            c * x + d * y + s
        ];
    }
    // Curry the function
    return p === undefined ? transform : transform(p);
}


;// CONCATENATED MODULE: ./src/distance-and-length/to-unit-vector.ts
/**
 * Returns the given 2-vector scaled to a length of one.
 * @param p a vector
 */
function toUnitVector(p) {
    const scaleFactor = 1 / (Math.sqrt(p[0] * p[0] + p[1] * p[1]));
    return [p[0] * scaleFactor, p[1] * scaleFactor];
}


;// CONCATENATED MODULE: ./src/distance-and-length/to-length.ts
/**
 * Returns the given 2-vector scaled to the given length.
 * @param p a vector
 * @param length the length to scale to
 */
function toLength(p, length) {
    const c = length / Math.sqrt(p[0] * p[0] + p[1] * p[1]);
    return [c * p[0], c * p[1]];
}


;// CONCATENATED MODULE: ./src/distance-and-length/distance-between.ts
/**
 * Returns the distance between two 2d points.
 * @param p a point
 * @param q another point
 */
function distanceBetween(p, q) {
    const x = q[0] - p[0];
    const y = q[1] - p[1];
    return Math.sqrt(x * x + y * y);
}


;// CONCATENATED MODULE: ./src/distance-and-length/len.ts
/**
 * Returns the length of the given 2-vector.
 * @param p a 2d vector
 */
function len(p) {
    return Math.sqrt(p[0] * p[0] + p[1] * p[1]);
}


;// CONCATENATED MODULE: ./src/distance-and-length/length-squared.ts
/**
 * Returns the squared length of the given 2-vector.
 * @param p a vector
 */
function lengthSquared(v) {
    return v[0] * v[0] + v[1] * v[1];
}


;// CONCATENATED MODULE: ./src/distance-and-length/manhattan-distance-between.ts
/**
 * Returns the Manhattan distance between two 2d points.
 * @param p a point.
 * @param q another point.
 */
function manhattanDistanceBetween(p, q) {
    return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]);
}


;// CONCATENATED MODULE: ./src/distance-and-length/manhattan-length.ts
/**
 * Returns the Manhattan length of the given 2-vector.
 * @param p a vector
 */
function manhattanLength(p) {
    return Math.abs(p[0]) + Math.abs(p[1]);
}


;// CONCATENATED MODULE: ./src/distance-and-length/distance-between-point-and-line.ts
/**
 * Returns the distance between the given point and line.
 * * see https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points
 * @param p a point
 * @param l a line
 */
function distanceBetweenPointAndLine(p, l) {
    const [x0, y0] = p;
    const [[x1, y1], [x2, y2]] = l;
    const y = y2 - y1;
    const x = x2 - x1;
    const a = (y * x0 - x * y0 + x2 * y1 - y2 * x1);
    const b = Math.sqrt(x * x + y * y);
    return Math.abs(a / b);
}


;// CONCATENATED MODULE: ./src/distance-and-length/squared-distance-between.ts
/**
 * Returns the squared distance between two 2d points.
 * @param p a point
 * @param q another point
 */
function squaredDistanceBetween(p, q) {
    const x = q[0] - p[0];
    const y = q[1] - p[1];
    return x * x + y * y;
}


;// CONCATENATED MODULE: ./src/distance-and-length/squared-distance-between-point-and-line-segment.ts

/**
 * Returns the squared distance between the given point and line segment.
 * @param p a point
 * @param l a line
 */
function squaredDistanceBetweenPointAndLineSegment(p, l) {
    const sqDst = squaredDistanceBetween;
    const v = l[0];
    const w = l[1];
    const l2 = sqDst(v, w);
    if (l2 == 0) {
        return sqDst(p, v);
    }
    let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    const d2 = sqDst(p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]);
    return d2;
}


;// CONCATENATED MODULE: ./src/matrix/det.ts
/**
 * Calculate the determinant of three 3d vectors, i.e. 3x3 matrix
 * @param x a 2d vector
 * @param y another 2d vector
 * @param z another 2d vector
 */
function det3(x, y, z) {
    return (x[0] * (y[1] * z[2] - y[2] * z[1])) -
        (x[1] * (y[0] * z[2] - y[2] * z[0])) +
        (x[2] * (y[0] * z[1] - y[1] * z[0]));
}


;// CONCATENATED MODULE: ./src/triangle-centers/circum-center.ts


/**
* Returns the circumcenter of the given 2d triangle.
* @param triangle
*/
function circumCenter(triangle) {
    // See wikipedia
    const p1 = triangle[0];
    const p2 = triangle[1];
    const p3 = triangle[2];
    const sqLen = lengthSquared;
    const Sx = 0.5 * det3([sqLen(p1), p1[1], 1], [sqLen(p2), p2[1], 1], [sqLen(p3), p3[1], 1]);
    const Sy = 0.5 * det3([p1[0], sqLen(p1), 1], [p2[0], sqLen(p2), 1], [p3[0], sqLen(p3), 1]);
    const a = det3([p1[0], p1[1], 1], [p2[0], p2[1], 1], [p3[0], p3[1], 1]);
    return [Sx / a, Sy / a];
}


;// CONCATENATED MODULE: ./src/triangle-centers/in-center.ts

/**
 * Returns the incenter of the given triangle.
 * * see Wikipedia - https://en.wikipedia.org/wiki/Incenter
 * @param triangle
 */
function inCenter(triangle) {
    const dst = distanceBetween;
    const p = triangle[0];
    const q = triangle[1];
    const r = triangle[2];
    const a = dst(q, r);
    const b = dst(p, r);
    const c = dst(p, q);
    const lengthSum = a + b + c;
    return [
        (a * p[0] + b * q[0] + c * r[0]) / lengthSum,
        (a * p[1] + b * q[1] + c * r[1]) / lengthSum
    ];
}


;// CONCATENATED MODULE: ./src/triangle-centers/centroid.ts
/**
* Returns the centroid of the given polygon, e.g. triangle. The polygon
* must be simple, i.e. not self-intersecting.
* @param polygon_
*/
function centroid(polygon) {
    const polygon_ = [];
    if (polygon.length === 1) {
        return polygon[0];
    }
    // remove duplicate points
    let prevP = polygon[polygon.length - 1];
    for (let i = 0; i < polygon.length; i++) {
        const [_x, _y] = prevP;
        const [x, y] = polygon[i];
        prevP = [x, y];
        if (x !== _x || y !== _y) {
            polygon_.push([x, y]);
        }
    }
    if (polygon_.length === 2) {
        const p1 = polygon_[0];
        const p2 = polygon_[1];
        const x = p1[0] + p2[0];
        const y = p1[1] + p2[1];
        return [x / 2, y / 2];
    }
    if (polygon_.length === 3) {
        const p1 = polygon_[0];
        const p2 = polygon_[1];
        const p3 = polygon_[2];
        const x = p1[0] + p2[0] + p3[0];
        const y = p1[1] + p2[1] + p3[1];
        return [x / 3, y / 3];
    }
    // polygon.length assumed > 3 and assumed to be non-self-intersecting
    // See wikipedia
    // First calculate the area, A, of the polygon
    let A = 0;
    for (let i = 0; i < polygon_.length; i++) {
        const p0 = polygon_[i];
        const p1 = (i === polygon_.length - 1)
            ? polygon_[0]
            : polygon_[i + 1];
        A = A + (p0[0] * p1[1] - p1[0] * p0[1]);
    }
    A = A / 2;
    const C = [0, 0];
    for (let i = 0; i < polygon_.length; i++) {
        const p0 = polygon_[i];
        const p1 = (i === polygon_.length - 1)
            ? polygon_[0]
            : polygon_[i + 1];
        C[0] = C[0] + (p0[0] + p1[0]) * (p0[0] * p1[1] - p1[0] * p0[1]);
        C[1] = C[1] + (p0[1] + p1[1]) * (p0[0] * p1[1] - p1[0] * p0[1]);
    }
    return [C[0] / (6 * A), C[1] / (6 * A)];
}


;// CONCATENATED MODULE: ./src/index.ts
//==================================
// 2d vector pure functions library
//==================================





























/**
 * Three 2d points are a counter-clockwise turn if ccw > 0, clockwise if
 * ccw < 0, and colinear if ccw === 0 because ccw is a determinant that gives
 * twice the signed area of the triangle formed by the points a, b and c.
 * * **certified**
 * @param A The first point
 * @param B The second point
 * @param C The third point
 */
const ccw = orient2d;
/**
 * Returns the second 2-vector minus the first.
 * @param p the first vector
 * @param q the second vector
  */
function fromTo(p, q) {
    return [q[0] - p[0], q[1] - p[1]];
}
/**
 * Performs linear interpolation between two 2d points and returns the
 * resulting point.
 * @param p the first point.
 * @param q the second point.
 * @param t the interpolation fraction (often in [0,1]).
 */
function interpolate(p, q, t) {
    return [
        p[0] + (q[0] - p[0]) * t,
        p[1] + (q[1] - p[1]) * t
    ];
}
/**
 * Returns the mean of two 2d points.
 * @param ps the two points
 */
function mean(ps) {
    const p = ps[0];
    const q = ps[1];
    return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
}
/**
* Returns true if two 2-vectors are identical (by value), false otherwise.
* @param a a 2d vector
* @param b another 2d vector
*/
function equal(a, b) {
    return (a[0] === b[0] && a[1] === b[1]);
}
/**
 * Returns the closest point to the array of 2d points or if the array is empty
 * returns undefined.
 * @param p
 * @param ps
 */
function getClosestTo(p, ps) {
    let closestPoint = undefined;
    let closestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < ps.length; i++) {
        const q = ps[i];
        const d = squaredDistanceBetween(p, q);
        if (d < closestDistance) {
            closestPoint = q;
            closestDistance = d;
        }
    }
    return closestPoint;
}
/**
 * Returns the closest point to the array of 2d points by providing a distance
 * function. If the given array is empty, returns undefined.
 * @param p
 * @param ps
 * @param f a function that takes the object and returns a point in order to
 * apply the Euclidian distance.
 */
function getObjClosestTo(p, ps, f) {
    let closestObj = undefined; // Closest Point
    let closestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < ps.length; i++) {
        const o = ps[i];
        const d = squaredDistanceBetween(p, f(o));
        if (d < closestDistance) {
            closestObj = o;
            closestDistance = d;
        }
    }
    return closestObj;
}


var __webpack_exports__ccw = __webpack_exports__.oH;
var __webpack_exports__centroid = __webpack_exports__.Sc;
var __webpack_exports__circumCenter = __webpack_exports__.pb;
var __webpack_exports__cross = __webpack_exports__.kC;
var __webpack_exports__det3 = __webpack_exports__.Ph;
var __webpack_exports__distanceBetween = __webpack_exports__.qw;
var __webpack_exports__distanceBetweenPointAndLine = __webpack_exports__.PI;
var __webpack_exports__doesSegSegIntersect = __webpack_exports__.tl;
var __webpack_exports__dot = __webpack_exports__.AK;
var __webpack_exports__equal = __webpack_exports__.Dg;
var __webpack_exports__fromTo = __webpack_exports__.JQ;
var __webpack_exports__getClosestTo = __webpack_exports__.Gk;
var __webpack_exports__getObjClosestTo = __webpack_exports__.AY;
var __webpack_exports__inCenter = __webpack_exports__.un;
var __webpack_exports__interpolate = __webpack_exports__.sX;
var __webpack_exports__len = __webpack_exports__.Zh;
var __webpack_exports__lengthSquared = __webpack_exports__.YH;
var __webpack_exports__lineLineIntersection = __webpack_exports__.QG;
var __webpack_exports__manhattanDistanceBetween = __webpack_exports__._r;
var __webpack_exports__manhattanLength = __webpack_exports__.Tp;
var __webpack_exports__mean = __webpack_exports__.J6;
var __webpack_exports__reverse = __webpack_exports__.GY;
var __webpack_exports__reverseRotate = __webpack_exports__.ay;
var __webpack_exports__rotate = __webpack_exports__.U1;
var __webpack_exports__rotate90Degrees = __webpack_exports__.$z;
var __webpack_exports__rotateNeg90Degrees = __webpack_exports__.UF;
var __webpack_exports__scale = __webpack_exports__.bA;
var __webpack_exports__segSegIntersection = __webpack_exports__.NW;
var __webpack_exports__squaredDistanceBetween = __webpack_exports__.Pz;
var __webpack_exports__squaredDistanceBetweenPointAndLineSegment = __webpack_exports__.$6;
var __webpack_exports__toLength = __webpack_exports__.Hg;
var __webpack_exports__toUnitVector = __webpack_exports__.wP;
var __webpack_exports__transformAffine = __webpack_exports__.cm;
var __webpack_exports__transformLinear = __webpack_exports__.Zb;
var __webpack_exports__translate = __webpack_exports__.Iu;
export { __webpack_exports__ccw as ccw, __webpack_exports__centroid as centroid, __webpack_exports__circumCenter as circumCenter, __webpack_exports__cross as cross, __webpack_exports__det3 as det3, __webpack_exports__distanceBetween as distanceBetween, __webpack_exports__distanceBetweenPointAndLine as distanceBetweenPointAndLine, __webpack_exports__doesSegSegIntersect as doesSegSegIntersect, __webpack_exports__dot as dot, __webpack_exports__equal as equal, __webpack_exports__fromTo as fromTo, __webpack_exports__getClosestTo as getClosestTo, __webpack_exports__getObjClosestTo as getObjClosestTo, __webpack_exports__inCenter as inCenter, __webpack_exports__interpolate as interpolate, __webpack_exports__len as len, __webpack_exports__lengthSquared as lengthSquared, __webpack_exports__lineLineIntersection as lineLineIntersection, __webpack_exports__manhattanDistanceBetween as manhattanDistanceBetween, __webpack_exports__manhattanLength as manhattanLength, __webpack_exports__mean as mean, __webpack_exports__reverse as reverse, __webpack_exports__reverseRotate as reverseRotate, __webpack_exports__rotate as rotate, __webpack_exports__rotate90Degrees as rotate90Degrees, __webpack_exports__rotateNeg90Degrees as rotateNeg90Degrees, __webpack_exports__scale as scale, __webpack_exports__segSegIntersection as segSegIntersection, __webpack_exports__squaredDistanceBetween as squaredDistanceBetween, __webpack_exports__squaredDistanceBetweenPointAndLineSegment as squaredDistanceBetweenPointAndLineSegment, __webpack_exports__toLength as toLength, __webpack_exports__toUnitVector as toUnitVector, __webpack_exports__transformAffine as transformAffine, __webpack_exports__transformLinear as transformLinear, __webpack_exports__translate as translate };
