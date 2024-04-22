/**
 * Returns an estimate of evaluating the given bezier at the given t value.
 * @param ps An order 1, 2 or bezier
 * @param t The parameter ∈ [0,1]
 */
declare function evaluateBezier(ps: number[][], t: number): number[];
export { evaluateBezier };
