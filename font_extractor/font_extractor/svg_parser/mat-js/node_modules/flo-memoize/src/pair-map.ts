
/**
 * Adds an ordered pair of values to the map.
 * 
 * @param map The map representing the pairs.
 * @param v1
 * @param v2
 * @param v3
 */
function pairMap_set<T extends object, U extends object, V>(
        map: WeakMap<T,WeakMap<U,V>>, 
        v1: T,
        v2: U,
        v3: V) {

    let v1Map = map.get(v1);
    if (!v1Map) { 
        v1Map = new Map<U,V>();
        map.set(v1, v1Map);
    }
    v1Map.set(v2, v3);
}


/**
 * Returns true if the unordered pair is in the set of pairs (represented by a
 * map).
 * 
 * @param map The map representing the pairs.
 * @param v1
 * @param v2
 */
function pairMap_get<T extends object, U extends object, V>(
        map: WeakMap<T,WeakMap<U,V>>, 
        v1: T,
        v2: U): V | undefined {

    const v1Map = map.get(v1);
    if (!v1Map) { 
        return undefined;
    }

    return v1Map.get(v2);
}


export { pairMap_set, pairMap_get }
