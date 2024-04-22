import { LlRbTree, LEFT, RIGHT, Node } from "../../src/index.js";
import { traverseInOrder } from "./traverse-in-order.js";


function getLeaves<T>(tree: LlRbTree<T>) {
    const nodes: Node<T>[] = [];

    traverseInOrder(tree, node => {
        const leftNode = node[LEFT];
        const rightNode = node[RIGHT];
        if (leftNode === undefined && rightNode === undefined) {
            nodes.push(node);
        }
    });

    return nodes;
}


export { getLeaves }
