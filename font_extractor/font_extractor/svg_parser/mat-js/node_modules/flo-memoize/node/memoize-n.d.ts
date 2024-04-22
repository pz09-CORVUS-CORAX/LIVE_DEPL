type F2<R, S extends object, T extends object> = (a: S, b: T) => R;
/**
 * Memoize (by reference on the ordered input parameters) the given arity 2
 * function
 *
 * * primitive input parameters are not currently supported
 */
declare function memoize2<R, S extends object, T extends object>(f: F2<R, S, T>): F2<R, S, T>;
/**
 * Memoize (by reference on the ordered input parameters) the given function
 * up to arity 6.
 *
 * * primitive input parameters are not currently supported
 */
declare function memoizeN<F extends ((...args: any[]) => any)>(f: F): F;
export { memoize2, memoizeN };
