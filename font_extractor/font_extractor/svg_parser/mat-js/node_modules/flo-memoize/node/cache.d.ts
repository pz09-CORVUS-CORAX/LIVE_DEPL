/**
 * Returns the same result for the same paramters (where the parameters are
 * considered the same if they have the same length and contain the same
 * ordered elements when elements are compared with `===` (e.g. objects are
 * compared *by reference*).
 *
 * @param f the function to cache
 * @param size the size (length) of the cache before older values will be
 * `shift`ed out into the nether
 */
declare function cache<V, F extends (...params: any[]) => V>(f: F, size?: number): typeof f;
export { cache };
