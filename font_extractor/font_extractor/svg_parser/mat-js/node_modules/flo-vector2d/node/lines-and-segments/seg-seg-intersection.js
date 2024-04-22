import { expansionProduct } from 'big-float-ts';
import { twoDiff, eSign, eCompare, eEstimate, eDiff, eAbs, twoSum } from 'big-float-ts';
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
    if (eSign(rNumer) * eSign(denom) >= 0 && eCompare(eAbs(denom), eAbs(rNumer)) >= 0 &&
        eSign(sNumer) * eSign(denom) >= 0 && eCompare(eAbs(denom), eAbs(sNumer)) >= 0) {
        const r = eEstimate(rNumer) / eEstimate(denom);
        //return [a0 + r*(b0 - a0), a1 + r*(b1 - a1)];
        return [
            eEstimate(twoSum(eEstimate(epr(td(b0, a0), rNumer)) / eEstimate(denom), a0)),
            eEstimate(twoSum(eEstimate(epr(td(b1, a1), rNumer)) / eEstimate(denom), a1))
        ];
    }
    return undefined;
}
export { segSegIntersection };
//# sourceMappingURL=seg-seg-intersection.js.map