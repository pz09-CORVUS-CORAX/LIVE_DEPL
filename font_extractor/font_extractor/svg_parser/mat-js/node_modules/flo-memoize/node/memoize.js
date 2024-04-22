/**
 * Memoize (by reference on the input parameter) the given arity 1 function.
 *
 * * the input parameter must be an `object` (so it can be used as a key to
 * `WeakMap` and thus garbage collected later; this is especially important
 * in functional programming where a lot of garbage collection takes place;
 *
 * * use `memoizePrimitive` instead if it is not important that the keys
 * will *never* be garbage collected
 */
function memoize(f) {
    const results = new WeakMap();
    return function (t) {
        let r = results.get(t);
        if (r !== undefined) {
            //console.log('cache hit');
            return r;
        }
        //console.log('cache miss');
        r = f(t);
        results.set(t, r);
        return r;
    };
}
export { memoize };
//# sourceMappingURL=memoize.js.map