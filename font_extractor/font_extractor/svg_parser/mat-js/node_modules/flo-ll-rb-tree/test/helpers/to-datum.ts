import { Node } from "../../src/index.js";


function toDatum<T>(node: Node<T> | undefined): T | T[] | undefined {
    return node === undefined ? undefined : node.datum;
}


export { toDatum }
