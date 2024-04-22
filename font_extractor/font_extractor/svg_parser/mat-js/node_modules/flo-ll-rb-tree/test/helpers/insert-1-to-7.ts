import { LlRbTree } from "../../src/index.js";
import { vals1to7 } from './vals-1-to-7.js';


function insert1to7(tree: LlRbTree<number>): void {
    for (let val of vals1to7) {
        tree.insert(val);
    }
}


export { insert1to7 }
