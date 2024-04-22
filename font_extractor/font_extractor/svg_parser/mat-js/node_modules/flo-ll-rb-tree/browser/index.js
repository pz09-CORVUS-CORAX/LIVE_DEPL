/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "E5": () => (/* reexport */ BLACK),
  "RL": () => (/* reexport */ LEFT),
  "dn": () => (/* reexport */ LlRbTree),
  "NB": () => (/* reexport */ Node),
  "hM": () => (/* reexport */ RED),
  "pX": () => (/* reexport */ RIGHT),
  "xC": () => (/* reexport */ isRed),
  "iK": () => (/* reexport */ nodeToStr),
  "Wl": () => (/* reexport */ numberNodeToStr),
  "Qx": () => (/* reexport */ treeToStr)
});

;// CONCATENATED MODULE: ./src/tree.ts
// Concise, Destructive, Left Leaning Red Black Tree implementation.
// See: https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
// See: https://en.wikipedia.org/wiki/Left-leaning_red%E2%80%93black_tree
// See: http://www.teachsolaisgames.com/articles/balanced_left_leaning.html 
const LEFT = -1;
const RIGHT = 1;
const BLACK = 1;
const RED = 0;
/**
 * Red Black Tree node.
 */
class Node {
    constructor(datum) {
        this.datum = datum;
        this.color = RED;
    }
}
function isRed(node) {
    return !!node && node.color === RED;
}
class LlRbTree {
    /**
     * @param compare a comparator function
     * @param duplicatesAllowed defaults to `true`; if `false` then if a
     * duplicate is inserted (as per the equivalence relation induced by the
     * compare function) then replace it; if `true` then instead still insert
     * it (so there can be multiple nodes with the same value in the tree)
     * @param data an optional initial array of data
     */
    constructor(compare, duplicatesAllowed = true, data) {
        this.compare = compare;
        this.duplicatesAllowed = duplicatesAllowed;
        // eslint-disable-next-line
        this.getMinNode = this.getMinOrMaxNode(LEFT);
        // eslint-disable-next-line
        this.getMaxNode = this.getMinOrMaxNode(RIGHT);
        this.root = undefined;
        this.nodeCount = 0;
        this.valueCount = 0;
        if (!data) {
            return;
        }
        for (const datum of data) {
            this.insert(datum);
        }
    }
    isEmpty() { return !this.root; }
    /**
     * Find and returns the (first) node in the tree with the given datum using
     * the tree compare function. Returns `undefined` if the node was not found.
     */
    find(datum) {
        const tree = this;
        let node = this.root;
        while (node) {
            const c = tree.compare(datum, node.datum);
            if (c === 0) {
                return node;
            }
            node = node[c > 0 ? RIGHT : LEFT];
        }
        return undefined;
    }
    /**
     * Returns an ordered (by the tree compare function) array of data as
     * contained in the nodes of the tree by doing an in order traversal.
     */
    toArrayInOrder() {
        const values = [];
        f(this.root);
        function f(node) {
            if (!node) {
                return;
            }
            f(node[LEFT]);
            values.push(node.datum);
            if (node.extras !== undefined) {
                values.push(...node.extras);
            }
            f(node[RIGHT]);
        }
        return values;
    }
    insertMulti(data) {
        const tree = this;
        for (const datum of data) {
            tree.insert(datum);
        }
    }
    /**
     * Inserts a node with the given datum into the tree.
     */
    insert(datum) {
        const tree = this;
        tree.root = f(tree.root, datum);
        tree.root.color = BLACK;
        tree.root.parent = undefined;
        function f(h, datum) {
            if (h === undefined) {
                tree.valueCount++;
                tree.nodeCount++;
                return new Node(datum);
            }
            const c = tree.compare(datum, h.datum);
            if (c === 0) {
                if (tree.duplicatesAllowed) {
                    tree.valueCount++;
                    if (h.extras === undefined) {
                        h.extras = [datum];
                    }
                    else {
                        h.extras.push(datum);
                    }
                }
                else {
                    h.datum = datum; // replace old value
                }
            }
            if (c !== 0) {
                const dir = c > 0 ? RIGHT : LEFT;
                h[dir] = f(h[dir], datum);
                h[dir].parent = h;
            }
            if (isRed(h[RIGHT]) && !isRed(h[LEFT])) {
                h = rotate(LEFT, h);
            }
            if (isRed(h[LEFT]) && isRed(h[LEFT][LEFT])) {
                h = rotate(RIGHT, h);
            }
            if (isRed(h[LEFT]) && isRed(h[RIGHT])) {
                flipColors(h);
            }
            return h;
        }
    }
    /**
     * Removes an item from the tree based on the given datum and returns the
     * item that was removed or `undefined` if nothing was removed.
     *
     * @param datum
     * @param all defaults to `false`; if `true` and duplicates exist, remove all
     * @param compareStrict if provided then only delete an item if it passes the
     * strict comparison function, i.e. if `compareStrict(item,node_value) === true`.
     */
    remove(datum, all = false, compareStrict) {
        const tree = this;
        if (tree.root === undefined) {
            return undefined;
        }
        let removed = undefined;
        const root = f(tree.root, datum);
        if (root === null) {
            return undefined;
        }
        tree.root = root;
        if (tree.root !== undefined) {
            tree.root.color = BLACK;
            tree.root.parent = undefined;
        }
        return removed;
        function f(h, datum) {
            const theresExtras = tree.duplicatesAllowed && h.extras !== undefined;
            let c = tree.compare(datum, h.datum);
            if ((c < 0 && !h[LEFT]) || (c > 0 && !h[RIGHT])) {
                return h; // end reached - no match
            }
            if (c < 0) {
                if (!isRed(h[LEFT]) &&
                    !isRed(h[LEFT][LEFT])) {
                    h = moveRedLeft(h);
                }
                const g = f(h[LEFT], datum);
                if (g === null) {
                    return null;
                }
                h[LEFT] = g;
                if (h[LEFT]) {
                    h[LEFT].parent = h;
                }
                return fixUp(h);
            }
            if (isRed(h[LEFT])) {
                h = rotate(RIGHT, h);
                c = tree.compare(datum, h.datum);
            }
            if (c === 0 && !h[RIGHT]) {
                if (theresExtras && !all) {
                    // There are multiple items at this node.
                    if (compareStrict === undefined ||
                        (compareStrict(datum, h.datum) === true)) {
                        removed = h.datum;
                        h.datum = h.extras.pop();
                        tree.valueCount--;
                        if (h.extras.length === 0) {
                            h.extras = undefined;
                        }
                        return h;
                    }
                    else {
                        const extras = h.extras;
                        for (let i = 0; i < extras.length; i++) {
                            if (compareStrict(datum, extras[i]) === true) {
                                removed = extras.splice(i, 1)[0];
                                tree.valueCount--;
                                if (extras.length === 0) {
                                    h.extras = undefined;
                                }
                                return h;
                            }
                        }
                        return null;
                    }
                }
                if (compareStrict === undefined ||
                    (compareStrict(datum, h.datum) === true)) {
                    removed = h.datum;
                    tree.valueCount -= 1 + (theresExtras ? h.extras.length : 0);
                    tree.nodeCount--;
                    return undefined;
                }
                else {
                    return null; // no match
                }
            }
            if (!isRed(h[RIGHT]) &&
                !isRed(h[RIGHT][LEFT])) {
                h = moveRedRight(h);
                c = tree.compare(datum, h.datum);
            }
            if (c === 0) {
                if (theresExtras && !all) {
                    // There are multiple items at this node.
                    if (compareStrict === undefined ||
                        (compareStrict(datum, h.datum) === true)) {
                        removed = h.datum;
                        h.datum = h.extras.pop();
                        tree.valueCount--;
                        if (h.extras.length === 0) {
                            h.extras = undefined;
                        }
                        //// const g = f(h[RIGHT]!, datum);
                        // if (g === null) { return null; }
                        //// h[RIGHT] = g!;
                    }
                    else {
                        const extras = h.extras;
                        let found = false;
                        for (let i = 0; i < extras.length; i++) {
                            if (compareStrict(datum, extras[i]) === true) {
                                removed = extras.splice(i, 1)[0];
                                tree.valueCount--;
                                if (extras.length === 0) {
                                    h.extras = undefined;
                                }
                                //// const g = f(h[RIGHT]!, extras[i]);
                                // if (g === null) { return null; }
                                //// h[RIGHT] = g!;
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            return null;
                        }
                    }
                }
                else {
                    if (compareStrict === undefined ||
                        (compareStrict(datum, h.datum) === true)) {
                        tree.valueCount -= 1 + (theresExtras ? h.extras.length : 0);
                        removed = h.datum;
                        const minNode = tree.getMinNode(h[RIGHT]);
                        // eslint-disable-next-line
                        h.datum = minNode?.datum;
                        // eslint-disable-next-line
                        if (tree.duplicatesAllowed) {
                            h.extras = minNode?.extras;
                        }
                        h[RIGHT] = removeMin(h[RIGHT]);
                        tree.nodeCount--;
                    }
                    else {
                        return null; // no match
                    }
                }
            }
            else {
                const g = f(h[RIGHT], datum);
                if (g === null) {
                    return null;
                }
                h[RIGHT] = g;
            }
            if (h[RIGHT]) {
                h[RIGHT].parent = h;
            }
            return fixUp(h);
        }
    }
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
    findBounds(datum) {
        const tree = this;
        let node = tree.root;
        const bounds = [undefined, undefined];
        if (node === undefined) {
            return bounds;
        }
        while (node) {
            const c = tree.compare(datum, node.datum);
            if (c >= 0) {
                bounds[0] = node;
            }
            else {
                bounds[1] = node;
            }
            node = node[c >= 0 ? RIGHT : LEFT];
        }
        return bounds;
    }
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
    findBoundsExcl(datum) {
        const tree = this;
        const node = tree.root;
        const bounds = [undefined, undefined];
        if (node === undefined) {
            return bounds;
        }
        f(node);
        function f(node) {
            while (node) {
                const c = tree.compare(datum, node.datum);
                if (c === 0) {
                    // Search on both sides
                    f(node[LEFT]);
                    f(node[RIGHT]);
                    return;
                }
                if (c > 0) {
                    bounds[0] = node;
                }
                else if (c < 0) {
                    bounds[1] = node;
                }
                node = node[c > 0 ? RIGHT : LEFT];
            }
        }
        return bounds;
    }
    /**
     * Returns an array of all matching data found.
     *
     * If duplicates are not allowed it's better to just use `find`.
     *
     * @param datum
     */
    findAll(datum) {
        const tree = this;
        let node = this.root;
        while (node) {
            const c = tree.compare(datum, node.datum);
            if (c === 0) {
                return [
                    node.datum,
                    ...(node.extras ? node.extras : [])
                ];
            }
            node = node[c > 0 ? RIGHT : LEFT];
        }
        return [];
    }
    /** @internal */
    getMinOrMaxNode(dir) {
        return (node) => {
            if (node === undefined) {
                node = this.root;
            }
            if (!node) {
                return undefined;
            }
            while (node[dir]) {
                node = node[dir];
            }
            return node;
        };
    }
    /**
     * Returns the minimum value in the tree starting at the given node. If the
     * tree is empty, `undefined` will be returned.
     *
     * If the min value is required for the entire tree call this function
     * as `tree.min(tree.root)`
     *
     * @param node
     */
    min(node) {
        if (node === undefined) {
            node = this.root;
        }
        const minNode = this.getMinNode(node);
        if (minNode !== undefined) {
            return minNode.datum;
        }
        return undefined;
    }
    /**
     * Returns the maximum value in the tree starting at the given node. If the
     * tree is empty, `undefined` will be returned.
     *
     * If the max value is required for the entire tree call this function
     * as `tree.max(tree.root)`
     *
     * @param node
     */
    max(node) {
        if (node === undefined) {
            node = this.root;
        }
        const maxNode = this.getMaxNode(node);
        if (maxNode !== undefined) {
            return maxNode.datum;
        }
        return undefined;
    }
}
/**
 * Returns the node that is at the top after the rotation.
 *
 * Destructively rotates the given node, say h, in the
 * given direction as far as tree rotations go.
 *
 * @param dir
 * @param h
 *
 * @internal
 */
function rotate(dir, h) {
    const x = h[-dir];
    h[-dir] = x[dir];
    if (x[dir]) {
        x[dir].parent = h;
    }
    x[dir] = h;
    h.parent = x;
    x.color = h.color;
    h.color = RED;
    return x;
}
/**
 * @param h
 *
 * @internal
 */
function removeMin(h) {
    if (!h[LEFT]) {
        return undefined;
    }
    if (!isRed(h[LEFT]) &&
        !isRed(h[LEFT][LEFT])) {
        h = moveRedLeft(h);
    }
    h[LEFT] = removeMin(h[LEFT]);
    if (h[LEFT]) {
        h[LEFT].parent = h;
    }
    return fixUp(h);
}
/**
 * Destructively flips the color of the given node and both
 * it's childrens' colors.
 *
 * @param h
 *
 * @internal
 */
function flipColors(h) {
    h.color = (h.color + 1) % 2;
    h[LEFT].color = (h[LEFT].color + 1) % 2;
    h[RIGHT].color = (h[RIGHT].color + 1) % 2;
}
/**
 * @param h
 *
 * @internal
 */
function moveRedLeft(h) {
    flipColors(h);
    if (isRed(h[RIGHT][LEFT])) {
        const a = rotate(RIGHT, h[RIGHT]);
        h[RIGHT] = a;
        a.parent = h;
        h = rotate(LEFT, h);
        flipColors(h);
    }
    return h;
}
/**
 * Returns the node that is at the top after the move.
 *
 * @param h
 *
 * @internal
 */
function moveRedRight(h) {
    flipColors(h);
    if (isRed(h[LEFT][LEFT])) {
        h = rotate(RIGHT, h);
        flipColors(h);
    }
    return h;
}
/**
 * Returns the node that is at the top after the fix.
 *
 * Fix right-leaning red nodes.
 *
 * @internal
 */
function fixUp(h) {
    if (isRed(h[RIGHT])) {
        h = rotate(LEFT, h);
    }
    if (isRed(h[LEFT]) && isRed(h[LEFT][LEFT])) {
        h = rotate(RIGHT, h);
    }
    // Split 4-nodes.
    if (isRed(h[LEFT]) && isRed(h[RIGHT])) {
        flipColors(h);
    }
    return h;
}


;// CONCATENATED MODULE: ./src/node-to-str.ts

function nodeToStr(valToStr) {
    return (node) => {
        let str;
        if (node.extras !== undefined) {
            str = `{${[node.datum, ...(node.extras)].map(valToStr)}}`;
        }
        else {
            str = valToStr(node.datum);
        }
        return str + (isRed(node) ? '•' : '·');
    };
}


;// CONCATENATED MODULE: ./src/number-node-to-str.ts

const numberNodeToStr = nodeToStr(t => t.toString());


;// CONCATENATED MODULE: ./src/tree-to-string.ts
// Modified from https://www.geeksforgeeks.org/binary-tree-string-brackets/

/**
 * Function to construct string from binary tree
 */
function treeToStr(nodeToStrFunc) {
    return (tree) => {
        const root = tree.root;
        let treeStr = '';
        f(root);
        return treeStr;
        function f(node) {
            if (node === undefined) {
                return;
            }
            treeStr += nodeToStrFunc(node);
            // if leaf node, then return
            if (node[LEFT] === undefined && node[RIGHT] == undefined) {
                return;
            }
            // left subtree
            if (node[LEFT] !== undefined) {
                treeStr += '(';
                f(node[LEFT]);
                treeStr += ')';
            }
            // right subtree
            if (node[RIGHT] !== undefined) {
                treeStr += '[';
                f(node[RIGHT]);
                treeStr += ']';
            }
        }
    };
}


;// CONCATENATED MODULE: ./src/index.ts






var __webpack_exports__BLACK = __webpack_exports__.E5;
var __webpack_exports__LEFT = __webpack_exports__.RL;
var __webpack_exports__LlRbTree = __webpack_exports__.dn;
var __webpack_exports__Node = __webpack_exports__.NB;
var __webpack_exports__RED = __webpack_exports__.hM;
var __webpack_exports__RIGHT = __webpack_exports__.pX;
var __webpack_exports__isRed = __webpack_exports__.xC;
var __webpack_exports__nodeToStr = __webpack_exports__.iK;
var __webpack_exports__numberNodeToStr = __webpack_exports__.Wl;
var __webpack_exports__treeToStr = __webpack_exports__.Qx;
export { __webpack_exports__BLACK as BLACK, __webpack_exports__LEFT as LEFT, __webpack_exports__LlRbTree as LlRbTree, __webpack_exports__Node as Node, __webpack_exports__RED as RED, __webpack_exports__RIGHT as RIGHT, __webpack_exports__isRed as isRed, __webpack_exports__nodeToStr as nodeToStr, __webpack_exports__numberNodeToStr as numberNodeToStr, __webpack_exports__treeToStr as treeToStr };
