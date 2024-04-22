import { LlRbTree } from "../../src/index.js";
import { getLeaves } from "./get-leaves.js";
import { route } from "./route.js";


function getTreeHeight<T>(tree: LlRbTree<T>) {
    const leaves = getLeaves(tree);
    let maxHeight = 0;;
    for (let leaf of leaves) {
        let height = 0;
        route(tree, leaf.datum, node => { 
            height += 1;
        });
        if (height > maxHeight) { maxHeight = height; }
    }

    return maxHeight;
}


export { getTreeHeight }
