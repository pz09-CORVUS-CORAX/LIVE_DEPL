import { isRed } from "./tree.js";
function nodeToStr(valToStr) {
    return (node) => {
        let str;
        if (node.extras !== undefined) {
            str = `{${[node.datum, ...(node.extras)].map(valToStr)}}`;
        }
        else {
            str = valToStr(node.datum);
        }
        return str + (isRed(node) ? '•' : '·');
    };
}
export { nodeToStr };
//# sourceMappingURL=node-to-str.js.map