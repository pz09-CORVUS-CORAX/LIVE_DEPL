import { nodeToString } from "../../src/index.js";
import { Obj } from './obj.js';


const objNodeToStr = nodeToString<Obj>(t => t.toString());


export { objNodeToStr }
