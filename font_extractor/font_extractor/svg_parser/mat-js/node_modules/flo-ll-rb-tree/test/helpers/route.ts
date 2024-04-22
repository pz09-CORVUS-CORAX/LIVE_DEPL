import { LlRbTree, LEFT, RIGHT, Node } from "../../src/index.js";


function route<T>(
        tree: LlRbTree<T>, 
        datum: T,
        g: (node: Node<T>) => any): boolean {

    let node = tree.root;
    const compare = tree.compare;
    while (node) {
        g(node);
        
        const c = compare(datum, node.datum);
        if (c === 0) {
            if (tree.duplicatesAllowed) {
                const nodeLeft = node[LEFT];
                const nodeRight = node[RIGHT];
                if (nodeRight !== undefined && compare(datum, nodeRight.datum) === 0) {
                    node = node[RIGHT];
                    continue;
                }
                if (nodeLeft !== undefined && compare(datum, nodeLeft.datum) === 0) {
                    node = node[LEFT];
                    continue;
                }
            }

            return true; 
        }
            
        node = node[c >= 0 ? RIGHT : LEFT];
    }

    return false;
}


export { route }
