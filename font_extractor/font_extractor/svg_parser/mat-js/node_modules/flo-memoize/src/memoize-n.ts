
type F0<R> = () => R;
type F1<R,S extends object> = (a: S) => R;
type F2<R,S extends object,T extends object> = (a: S, b: T) => R;
type F3<R,S extends object,T extends object, U extends object> = (a: S, b: T, c: U) => R;
type F4<R,S extends object,T extends object, U extends object, V extends object> = (a: S, b: T, c: U, d: V) => R;
type F5<R,S extends object,T extends object, U extends object, V extends object, W extends object> = (a: S, b: T, c: U, d: V, e: W) => R;
type F6<R,S extends object,T extends object, U extends object, V extends object, W extends object, X extends object> = (a: S, b: T, c: U, d: V, e: W, g: X) => R;


/**
 * Memoize (by reference on the ordered input parameters) the given arity 0
 * function
 * 
 * * primitive input parameters are not currently supported
 */
function memoize0<R>(f: F0<R>): F0<R> {
	let r: R;
    let executed = false;
	
	return function(): R {
        if (!executed) {
            r = f();
            executed = true;
        }

        return r;
	}
}


/**
  * Memoize (by reference on the input parameter) the given arity 1 function.
 * 
 * * the input parameter must be an `object` (so it can be used as a key to 
 * `WeakMap` and thus garbage collected later; this is especially important
 * in functional programming where a lot of garbage collection takes place;
 * 
 * * use `memoizePrimitive` instead if primitive parameter values need to be
 * supported and it is not important that the keys will *never* be garbage
 * collected
 */
function memoize1<R,S extends object>(f: F1<R,S>): F1<R,S> {
	const map = new WeakMap<S,R>();
	
	return function(t: S): R {
		let r: R;

		if (!map.has(t)) {
			//console.log('cache hit');
            r = f(t);
		    map.set(t,r);
		} else {
            r = map.get(t)!;
        }

		//console.log('cache miss');
		return r;
	}
}


/**
 * Memoize (by reference on the ordered input parameters) the given arity 2
 * function
 * 
 * * primitive input parameters are not currently supported
 */
function memoize2<
        R,
        S extends object,
        T extends object,
    >(f: F2<R,S,T>): F2<R,S,T> {

	const mapA = new WeakMap<S,WeakMap<T,R>>();
	
	return function(a: S, b: T): R {
		let mapB = mapA.get(a);

        if (mapB === undefined) {
            // console.log('cache miss A');
            mapB = new WeakMap();
            mapA.set(a,mapB);
        }
        // else { console.log('cache hit A'); }

        let r: R;
        if (!mapB.has(b)) {
            // console.log('cache miss B');
            r = f(a,b);
            mapB.set(b,r);
        } else {
            // console.log('cache hit B');
            r = mapB.get(b)!;
        }

		return r;
	}
}


/**
 * Memoize (by reference on the ordered input parameters) the given arity 3
 * function
 * 
 * * primitive input parameters are not currently supported
 */
function memoize3<
        R,
        S extends object,
        T extends object,
        U extends object,
    >(f: F3<R,S,T,U>): F3<R,S,T,U> {

	const mapA = new WeakMap<S,WeakMap<T,WeakMap<U,R>>>();
	
	return function(a: S, b: T, c: U): R {
		let mapB = mapA.get(a);

        if (mapB === undefined) {
            mapB = new WeakMap();
            mapA.set(a, mapB);
        }

        let mapC = mapB.get(b);
        if (mapC === undefined) {
            mapC = new WeakMap();
            mapB.set(b, mapC);
        }

        let r: R;
        if (!mapC.has(c)) {
            // console.log('cache miss C');
            r = f(a,b,c);
            mapC.set(c,r);
        } else {
            // console.log('cache hit C');
            r = mapC.get(c)!;
        }

		return r;
	}
}


/**
 * Memoize (by reference on the ordered input parameters) the given arity 4
 * function
 * 
 * * primitive input parameters are not currently supported
 */
function memoize4<
        R,
        S extends object,
        T extends object,
        U extends object,
        V extends object,
    >(f: F4<R,S,T,U,V>): F4<R,S,T,U,V> {

	const mapA = new WeakMap<S,WeakMap<T,WeakMap<U,WeakMap<V,R>>>>();
	
	return function(a: S, b: T, c: U, d: V): R {
		let mapB = mapA.get(a);

        if (mapB === undefined) {
            mapB = new WeakMap();
            mapA.set(a, mapB);
        }

        let mapC = mapB.get(b);
        if (mapC === undefined) {
            mapC = new WeakMap();
            mapB.set(b, mapC);
        }

        let mapD = mapC.get(c);
        if (mapD === undefined) {
            mapD = new WeakMap();
            mapC.set(c, mapD);
        }

        let r: R;
        if (!mapD.has(d)) {
            // console.log('cache miss D');
            r = f(a,b,c,d);
            mapD.set(d,r);
        } else {
            // console.log('cache hit D');
            r = mapD.get(d)!;
        }

		return r;
	}
}


/**
 * Memoize (by reference on the ordered input parameters) the given arity 5
 * function
 * 
 * * primitive input parameters are not currently supported
 */
function memoize5<
        R,
        S extends object,
        T extends object,
        U extends object,
        V extends object,
        W extends object
    >(f: F5<R,S,T,U,V,W>): F5<R,S,T,U,V,W> {

	const mapA = new WeakMap<S,WeakMap<T,WeakMap<U,WeakMap<V,WeakMap<W,R>>>>>();
	
	return function(a: S, b: T, c: U, d: V, e: W): R {
		let mapB = mapA.get(a);

        if (mapB === undefined) {
            mapB = new WeakMap();
            mapA.set(a, mapB);
        }

        let mapC = mapB.get(b);
        if (mapC === undefined) {
            mapC = new WeakMap();
            mapB.set(b, mapC);
        }

        let mapD = mapC.get(c);
        if (mapD === undefined) {
            mapD = new WeakMap();
            mapC.set(c, mapD);
        }

        let mapE = mapD.get(d);
        if (mapE === undefined) {
            mapE = new WeakMap();
            mapD.set(d, mapE);
        }

        let r: R;
        if (!mapE.has(e)) {
            // console.log('cache miss E');
            r = f(a,b,c,d,e);
            mapE.set(e,r);
        } else {
            // console.log('cache hit E');
            r = mapE.get(e)!;
        }

		return r;
	}
}


/**
 * Memoize (by reference on the ordered input parameters) the given arity 6
 * function
 * 
 * * primitive input parameters are not currently supported
 */
function memoize6<
        R,
        S extends object,
        T extends object,
        U extends object,
        V extends object,
        W extends object,
        X extends object
    >(f: F6<R,S,T,U,V,W,X>): F6<R,S,T,U,V,W,X> {

	const mapA = new WeakMap<S,WeakMap<T,WeakMap<U,WeakMap<V,WeakMap<W,WeakMap<X,R>>>>>>();
	
	return function(a: S, b: T, c: U, d: V, e: W, g: X): R {
		let mapB = mapA.get(a);

        if (mapB === undefined) {
            mapB = new WeakMap();
            mapA.set(a, mapB);
        }

        let mapC = mapB.get(b);
        if (mapC === undefined) {
            mapC = new WeakMap();
            mapB.set(b, mapC);
        }

        let mapD = mapC.get(c);
        if (mapD === undefined) {
            mapD = new WeakMap();
            mapC.set(c, mapD);
        }

        let mapE = mapD.get(d);
        if (mapE === undefined) {
            mapE = new WeakMap();
            mapD.set(d, mapE);
        }

        let mapG = mapE.get(e);
        if (mapG === undefined) {
            mapG = new WeakMap();
            mapE.set(e, mapG);
        }

        let r: R;
        if (!mapG.has(g)) {
            r = f(a,b,c,d,e,g);
            mapG.set(g,r);
        } else {
            r = mapG.get(g)!;
        }

		return r;
	}
}


/**
 * Memoize (by reference on the ordered input parameters) the given function
 * up to arity 6.
 * 
 * * primitive input parameters are not currently supported
 */
function memoizeN<
        F extends ((...args: any[]) => any)>(f: F): F {

    const len = f.length as 0|1|2|3|4|5|6;
    if (len > 6) {
        throw new Error('A maximum of 6 formal parameters are supported')
    }
  
    if (len === 0) {
        // @ts-ignore
        return memoize0(f);
    }
    if (len === 1) {
        // @ts-ignore
        return memoize1(f);
    }
    if (len === 2) {
        // @ts-ignore
        return memoize2(f);
    }
    if (len === 3) {
        // @ts-ignore
        return memoize3(f);
    }
    if (len === 4) {
        // @ts-ignore
        return memoize4(f);
    }
    if (len === 5) {
        // @ts-ignore
        return memoize5(f);
    }
    // if (len === 6) {
        // @ts-ignore
        return memoize6(f);
    // }
}


export { memoize2, memoizeN }


// TEST
/*
function Test() {
    function delay() {
        let t=0; for (let i=0; i<1_000_000; i++) { t+=1; }
    }

    interface NumA { v: number }
    interface NumB { v: number, u1: 0 }
    interface NumC { v: number, u2: 0 }
    interface NumD { v: number, u3: 0 }
    interface NumE { v: number, u4: 0 }
    interface NumF { v: number, u5: 0 }

    const A0: NumA = { v: 0 };
    const A1: NumA = { v: 1 };
    const A2: NumA = { v: 2 };
    const A4: NumA = { v: 4 };
    const A8: NumA = { v: 8 };

    const B0: NumB = { v: 0, u1: 0 };
    const B1: NumB = { v: 1, u1: 0 };
    const B2: NumB = { v: 2, u1: 0 };
    const B4: NumB = { v: 4, u1: 0 };
    const B8: NumB = { v: 8, u1: 0 };

    const C0: NumC = { v: 0, u2: 0 };
    const C1: NumC = { v: 1, u2: 0 };
    const C2: NumC = { v: 2, u2: 0 };
    const C4: NumC = { v: 4, u2: 0 };
    const C8: NumC = { v: 8, u2: 0 };

    const D0: NumD = { v: 0, u3: 0 };
    const D1: NumD = { v: 1, u3: 0 };
    const D2: NumD = { v: 2, u3: 0 };
    const D4: NumD = { v: 4, u3: 0 };
    const D8: NumD = { v: 8, u3: 0 };

    const E0: NumE = { v: 0, u4: 0 };
    const E1: NumE = { v: 1, u4: 0 };
    const E2: NumE = { v: 2, u4: 0 };
    const E4: NumE = { v: 4, u4: 0 };
    const E8: NumE = { v: 8, u4: 0 };


    function add0() {
        delay();
        return 4;
    }

    function add1(a: NumA) {
        delay();
        return a.v;
    }

    function add2(a: NumA, b: NumB) {
        delay();
        return a.v + b.v;
    }

    function add3(a: NumA, b: NumB, c: NumC) {
        delay();
        return a.v + b.v + c.v;
    }

    function add4(a: NumA, b: NumB, c: NumC, d: NumD) {
        delay();
        return a.v + b.v + c.v + d.v;
    }

    function add5(a: NumA, b: NumB, c: NumC, d: NumD, e: NumE) {
        delay();
        return a.v + b.v + c.v + d.v + e.v;
    }

    function add6(a: NumA, b: NumB, c: NumC, d: NumD, e: NumE, f: NumF) {
        delay();
        return a.v + b.v + c.v + d.v + e.v + f.v;
    }

    const add0$$ = memoizeN(add0);
    const add1$$ = memoizeN(add1);
    const add2$$ = memoizeN(add2);
    const add3$$ = memoizeN(add3);
    const add4$$ = memoizeN(add4);
    const add5$$ = memoizeN(add5);
    // const add6$$ = memoizeN(add6);

    // ------------------------------------------
    add0$$();  //?.$
    add0$$();  //?.$
    add0$$();  //?.$
    add0$$();  //?.$
    // ------------------------------------------
    add1$$(A0);  //?.$
    add1$$(A1);  //?.$
    add1$$(A1);  //?.$
    add1$$(A2);  //?.$
    // ------------------------------------------
    add2$$(A0,B1); //?.$
    add2$$(A0,B1); //?.$
    add2$$(A0,B2); //?.$
    add2$$(A0,B1); //?.$
    add2$$(A0,B2); //?.$
    add2$$(A1,B0); //?.$
    add2$$(A0,B4); //?.$
    add2$$(A2,B4); //?.$
    add2$$(A2,B8); //?.$

    add2$$(A8,B4); //?.$
    add2$$(A8,B4); //?.$
    add2$$(A8,B4); //?.$

    add2$$(A8,B0); //?.$
    add2$$(A8,B1); //?.$
    add2$$(A8,B2); //?.$
    add2$$(A8,B1); //?.$
    // ------------------------------------------
    add3$$(A0,B1,C1); //?.$
    add3$$(A0,B1,C1); //?.$
    add3$$(A0,B2,C1); //?.$
    add3$$(A0,B1,C1); //?.$
    add3$$(A0,B1,C1); //?.$
    add3$$(A0,B1,C1); //?.$
    add3$$(A0,B1,C1); //?.$
    add3$$(C1,B1,C1); //?.$
    add3$$(C1,B1,C1); //?.$
    // ------------------------------------------
    add4$$(A4,B1,C1,D4); //?.$
    add4$$(A8,B1,C1,D4); //?.$
    add4$$(A8,B2,C1,D4); //?.$
    add4$$(A8,B2,C1,D4); //?.$
    add4$$(A4,B1,C1,D4); //?.$
    // ------------------------------------------
    add5$$(A4,B1,C1,D4,E1); //?.$
    add5$$(A8,B1,C1,D4,E1); //?.$
    add5$$(A8,B2,C1,D4,E1); //?.$
    add5$$(A8,B2,C1,D4,E1); //?.$
    add5$$(A8,B2,C1,D4,E1); //?.$
    add5$$(A4,B1,C1,D4,E2); //?.$
    // ------------------------------------------

    add5$$(A8,B2,C1,D4,E8); //?.
    for (let i=0; i<1000; i++) {
        add5$$(A8,B2,C1,D4,E8); //?.
    }
}
Test();
*/
