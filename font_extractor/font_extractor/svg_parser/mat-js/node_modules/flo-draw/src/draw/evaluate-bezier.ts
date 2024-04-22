
/**
 * Returns an estimate of evaluating the given bezier at the given t value.
 * @param ps An order 1, 2 or bezier
 * @param t The parameter ∈ [0,1]
 */
function evaluateBezier(ps: number[][], t: number): number[] {
    const s = 1-t;

    if (ps.length === 4) {
        // cubic
        const [[x0,y0],[x1,y1],[x2,y2],[x3,y3]] = ps;
        const x = x0*s**3 + 3*x1*s**2*t + 3*x2*s*t**2 + x3*t**3;
        const y = y0*s**3 + 3*y1*s**2*t + 3*y2*s*t**2 + y3*t**3;
        return [x,y];
    } 
    
    if (ps.length === 3) {
        // quadratic
        const [[x0,y0],[x1,y1],[x2,y2]] = ps;
        const x = x0*s**2 + 2*x1*s*t + x2*t**2;
        const y = y0*s**2 + 2*y1*s*t + y2*t**2;
        return [x,y];
    } 
    
    if (ps.length === 2) {
        // line
        const [[x0,y0],[x1,y1]] = ps;
        const x = x0*s + x1*t;
        const y = y0*s + y1*t;
        return [x,y];
    }

    return [NaN, NaN];
}


export { evaluateBezier }
