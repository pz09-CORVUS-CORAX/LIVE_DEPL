import { LlRbTree, Node } from "./tree.js";
/**
 * Function to construct string from binary tree
 */
declare function treeToStr<T>(nodeToStrFunc: (node: Node<T>) => string): (tree: LlRbTree<T>) => string;
export { treeToStr };
