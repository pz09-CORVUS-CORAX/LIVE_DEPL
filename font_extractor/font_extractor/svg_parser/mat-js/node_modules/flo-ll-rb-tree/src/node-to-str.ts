import { Node, isRed } from "./tree.js";


function nodeToStr<T>(valToStr: (t: T) => string) {
    return (node: Node<T>) => { 

        let str: string;
        if (node.extras !== undefined) {
            str = `{${[node.datum, ...(node.extras)].map(valToStr)}}`;
        } else {
            str = valToStr(node.datum);
        }

        return str + (isRed(node) ? '•' : '·');
    }
}


export { nodeToStr }
