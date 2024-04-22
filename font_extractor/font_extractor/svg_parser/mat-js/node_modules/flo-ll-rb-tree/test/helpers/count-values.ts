import { LlRbTree } from "../../src";
import { traverseInOrder } from "./traverse-in-order.js";


function countValues<T>(tree: LlRbTree<T>) {
    let count = 0;

    traverseInOrder(tree, node => {
        count++;
        if (node.extras !== undefined) {
            count += node.extras.length;
        }
    });

    return count;
}


export { countValues }
