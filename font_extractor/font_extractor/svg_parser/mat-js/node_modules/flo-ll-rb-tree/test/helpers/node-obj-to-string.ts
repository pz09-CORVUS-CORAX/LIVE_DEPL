import { Node, isRed } from "../../src/index.js";
import { Obj } from "./obj.js";


function nodeObjToString(node: Node<Obj>) { 
    let str: string;
    if (node.extras !== undefined) {
        str = `{${[node.datum.val, ...(node.extras.map(o => o.val))].toString()}}`;
    } else {
        str = node.datum.val.toString();
    }

    return str + (isRed(node) ? '•' : '·');
}


export { nodeObjToString }
