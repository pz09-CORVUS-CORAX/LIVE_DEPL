/**
 * Returns 2 new beziers split at the given t parameter, i.e. for the ranges
 * [0,t] and [t,1].
 * @param ps
 * @param t
 */
declare function splitAt(ps: number[][], t: number): number[][][];
export { splitAt };
