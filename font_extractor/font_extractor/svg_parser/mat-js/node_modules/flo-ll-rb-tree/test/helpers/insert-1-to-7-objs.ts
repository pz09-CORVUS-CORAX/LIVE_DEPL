import { LlRbTree } from "../../src/index.js";
import { vals1to7Objs } from "./vals-1-to-7-objs.js";
import { type Obj } from './obj.js';


function insert1to7Objs(tree: LlRbTree<Obj>): void {
    for (let val of vals1to7Objs) {
        tree.insert(val);
    }
}


export { insert1to7Objs }
