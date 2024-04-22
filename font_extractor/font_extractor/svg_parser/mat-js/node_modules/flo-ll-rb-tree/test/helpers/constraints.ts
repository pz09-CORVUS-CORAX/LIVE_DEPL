import { LlRbTree } from "../../src/index.js";
import { getLeaves } from "./get-leaves.js";
import { route } from './route.js';
import { traverseInOrder } from './traverse-in-order.js';


// see e.g. http://opendatastructures.org/versions/edition-0.1e/ods-java/9_2_RedBlackTree_Simulated_.html#SECTION001222000000000000000

/**
 * Property 9..3 (black-height)
 * 
 * There are the same number of black nodes on every root to leaf path. 
 * (The sum of the colors on any root to leaf path is the same.)
 */
function isBlackHeightCorrect<T>(
        tree: LlRbTree<T>) {

    const leaves = getLeaves(tree);
    let prevColor = undefined;
    for (let leaf of leaves) {
        let color = 0;
        route(tree, leaf.datum, node => { 
            color += node.color
        });
        if (prevColor !== undefined && color !== prevColor) {
            return false;
        }
        prevColor = color;
    }

    return true;
}


/**
 * **Property 9..4 (no-red-edge)**
 * 
 * No two red nodes are adjacent. (For any node `u`, except the root, 
 * `u`.color + `u`.parent.color >= 1)
 */
function isNoRedEdge<T>(tree: LlRbTree<T>) {
    let passed = true;
    traverseInOrder(tree, node => {
        if (node.parent !== undefined) {
            if (!(node.color + node.parent.color >= 1)) {
                passed = false;
            }
        }
    });

    return passed;
}


export { isBlackHeightCorrect, isNoRedEdge }