declare const LEFT = -1;
declare const RIGHT = 1;
declare const BLACK = 1;
declare const RED = 0;
type Color = 0 | 1;
/**
 * Red Black Tree node.
 */
declare class Node<T> {
    datum: T;
    color: Color;
    parent: Node<T> | undefined;
    extras?: T[];
    "-1": Node<T> | undefined;
    "1": Node<T> | undefined;
    constructor(datum: T);
}
declare function isRed<T>(node: Node<T> | undefined): boolean;
declare class LlRbTree<T> {
    compare: (a: T, b: T) => number;
    duplicatesAllowed: boolean;
    root: Node<T> | undefined;
    /**
     * The number of nodes in the tree (that equals the number of values in the
     * tree not counting duplicates).
     */
    nodeCount: number;
    /**
     * The number of values in the tree.
     */
    valueCount: number;
    /**
     * @param compare a comparator function
     * @param duplicatesAllowed defaults to `true`; if `false` then if a
     * duplicate is inserted (as per the equivalence relation induced by the
     * compare function) then replace it; if `true` then instead still insert
     * it (so there can be multiple nodes with the same value in the tree)
     * @param data an optional initial array of data
     */
    constructor(compare: (a: T, b: T) => number, duplicatesAllowed?: boolean, data?: T[]);
    isEmpty(): boolean;
    /**
     * Find and returns the (first) node in the tree with the given datum using
     * the tree compare function. Returns `undefined` if the node was not found.
     */
    find(datum: T): Node<T> | undefined;
    /**
     * Returns an ordered (by the tree compare function) array of data as
     * contained in the nodes of the tree by doing an in order traversal.
     */
    toArrayInOrder(): T[];
    insertMulti(data: T[]): void;
    /**
     * Inserts a node with the given datum into the tree.
     */
    insert(datum: T): void;
    /**
     * Removes an item from the tree based on the given datum and returns the
     * item that was removed or `undefined` if nothing was removed.
     *
     * @param datum
     * @param all defaults to `false`; if `true` and duplicates exist, remove all
     * @param compareStrict if provided then only delete an item if it passes the
     * strict comparison function, i.e. if `compareStrict(item,node_value) === true`.
     */
    remove(datum: T, all?: boolean, compareStrict?: (t1: T, t2: T) => boolean): T | undefined;
    /**
     * Returns the two ordered nodes bounding the datum.
     *
     * * If the datum falls on a node, that node and the next (to the right) is
     * returned.
     * * If the given datum is smaller than all nodes then the first item in the
     * bounds array is `undefined` and the next is the smallest node
     * * If the given datum is larger than all nodes then the second item in the
     * bounds array is `undefined` and the first item is the largest node
     *
     */
    findBounds(datum: T): (Node<T> | undefined)[];
    /**
     * Returns the two ordered nodes bounding the datum.
     *
     * * If the datum falls on a node, returns the nodes before and after this
     * one.
     * * If the given datum is smaller than all nodes then the first item in the
     * bounds array is `undefined` and the next is the smallest node
     * * If the given datum is larger than all nodes then the second item in the
     * bounds array is `undefined` and the first item is the largest node
     *
     * @param tree
     * @param datum
     */
    findBoundsExcl(datum: T): (Node<T> | undefined)[];
    /**
     * Returns an array of all matching data found.
     *
     * If duplicates are not allowed it's better to just use `find`.
     *
     * @param datum
     */
    findAll(datum: T): T[];
    /** @internal */
    private getMinOrMaxNode;
    getMinNode: (node?: Node<T> | undefined | undefined) => Node<T> | undefined;
    getMaxNode: (node?: Node<T> | undefined | undefined) => Node<T> | undefined;
    /**
     * Returns the minimum value in the tree starting at the given node. If the
     * tree is empty, `undefined` will be returned.
     *
     * If the min value is required for the entire tree call this function
     * as `tree.min(tree.root)`
     *
     * @param node
     */
    min(node?: Node<T> | undefined | undefined): T | undefined;
    /**
     * Returns the maximum value in the tree starting at the given node. If the
     * tree is empty, `undefined` will be returned.
     *
     * If the max value is required for the entire tree call this function
     * as `tree.max(tree.root)`
     *
     * @param node
     */
    max(node?: Node<T> | undefined | undefined): T | undefined;
}
export { LlRbTree, Node, LEFT, RIGHT, RED, BLACK, isRed };
