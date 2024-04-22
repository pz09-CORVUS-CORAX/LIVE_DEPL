// Modified from https://www.geeksforgeeks.org/binary-tree-string-brackets/
import { LEFT, RIGHT } from "./tree.js";
/**
 * Function to construct string from binary tree
 */
function treeToStr(nodeToStrFunc) {
    return (tree) => {
        const root = tree.root;
        let treeStr = '';
        f(root);
        return treeStr;
        function f(node) {
            if (node === undefined) {
                return;
            }
            treeStr += nodeToStrFunc(node);
            // if leaf node, then return
            if (node[LEFT] === undefined && node[RIGHT] == undefined) {
                return;
            }
            // left subtree
            if (node[LEFT] !== undefined) {
                treeStr += '(';
                f(node[LEFT]);
                treeStr += ')';
            }
            // right subtree
            if (node[RIGHT] !== undefined) {
                treeStr += '[';
                f(node[RIGHT]);
                treeStr += ']';
            }
        }
    };
}
export { treeToStr };
//# sourceMappingURL=tree-to-string.js.map