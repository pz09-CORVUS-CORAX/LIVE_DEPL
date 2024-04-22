import { LlRbTree } from "../../src";
import { traverseInOrder } from "./traverse-in-order.js";


function countNodes<T>(tree: LlRbTree<T>) {
    let count = 0;

    traverseInOrder(tree, node => count++);

    return count;
}


export { countNodes }
