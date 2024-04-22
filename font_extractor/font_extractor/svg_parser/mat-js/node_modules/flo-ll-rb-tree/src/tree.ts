// Concise, Destructive, Left Leaning Red Black Tree implementation.
// See: https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
// See: https://en.wikipedia.org/wiki/Left-leaning_red%E2%80%93black_tree
// See: http://www.teachsolaisgames.com/articles/balanced_left_leaning.html 


const LEFT = -1;
const RIGHT = 1;
type Dir = -1|1;

const BLACK = 1;
const RED = 0;
type Color = 0|1;


/**
 * Red Black Tree node.
 */
 class Node<T> {
	public color: Color = RED;
	public parent: Node<T> | undefined;
	public extras?: T[];
	"-1": Node<T> | undefined;
	"1" : Node<T> | undefined;

	constructor(public datum: T) {}
}


function isRed<T>(node: Node<T> | undefined): boolean {
	return !!node && node.color === RED;
}


class LlRbTree<T> {
	public root: Node<T> | undefined;
	/** 
	 * The number of nodes in the tree (that equals the number of values in the
	 * tree not counting duplicates).
	 */
	public nodeCount: number;  
	/** 
	 * The number of values in the tree.
	 */
	public valueCount: number;


	/** 
	 * @param compare a comparator function
	 * @param duplicatesAllowed defaults to `true`; if `false` then if a 
	 * duplicate is inserted (as per the equivalence relation induced by the 
	 * compare function) then replace it; if `true` then instead still insert 
	 * it (so there can be multiple nodes with the same value in the tree)
	 * @param data an optional initial array of data
	 */	
	constructor(
			public compare: (a: T, b: T) => number, 
			public duplicatesAllowed = true, 
			data?: T[]) {
				
		this.root = undefined;
		this.nodeCount = 0;
		this.valueCount = 0;
		
		if (!data) { return; }
		
		for (const datum of data) {
			this.insert(datum);
		}
	}


	public isEmpty() { return !this.root; }


	/**
	 * Find and returns the (first) node in the tree with the given datum using 
	 * the tree compare function. Returns `undefined` if the node was not found.
	 */
	public find(datum: T): Node<T> | undefined {
		const tree = this;

		let node = this.root;
		while (node) {
			const c = tree.compare(datum, node.datum);
			if (c === 0) { return node; }
				
			node = node[c > 0 ? RIGHT : LEFT];
		}

		return undefined;
	}


	/**
	 * Returns an ordered (by the tree compare function) array of data as 
	 * contained in the nodes of the tree by doing an in order traversal.
	 */
	public toArrayInOrder(): T[] {
		const values: T[] = [];
		f(this.root);
		
		function f(node: Node<T> | undefined): void {
			if (!node) { return; }

			f(node[LEFT]);
			values.push(node.datum);
			if (node.extras !== undefined) {
				values.push(...node.extras);
			}
			f(node[RIGHT]);
		}

		return values;
	}


	public insertMulti(data: T[]): void {
		const tree = this;
		for (const datum of data) {
			tree.insert(datum);
		}
	}


	/**
	 * Inserts a node with the given datum into the tree.
	 */
	public insert(datum: T): void {
		const tree = this;
		tree.root = f(tree.root, datum);
		tree.root.color = BLACK;
		tree.root.parent = undefined;
		
		function f(h: Node<T> | undefined, datum: T): Node<T> {
			if (h === undefined) {
				tree.valueCount++;
				tree.nodeCount++;
				return new Node(datum);
			}
			
			const c = tree.compare(datum, h.datum);

			if (c === 0) {
				if (tree.duplicatesAllowed) {
					tree.valueCount++;
					if (h.extras === undefined) {
						h.extras = [datum];
					} else {
						h.extras.push(datum);
					}
				} else {
					h.datum = datum;  // replace old value
				}
			} 
			
			if (c !== 0) {
				const dir = c > 0 ? RIGHT : LEFT;
				h[dir] = f(h[dir], datum);
				h[dir]!.parent = h;
			}
			
			if (isRed(h[RIGHT]) && !isRed(h[LEFT])) {
				h = rotate(LEFT, h);
			}
			if (isRed(h[LEFT]) && isRed(h[LEFT]![LEFT])) {
				h = rotate(RIGHT, h);
			}
			if (isRed(h[LEFT]) && isRed(h[RIGHT])) {
				flipColors(h);
			}
			
			return h;
		}
	}


	/**
	 * Removes an item from the tree based on the given datum and returns the
	 * item that was removed or `undefined` if nothing was removed.
	 * 
	 * @param datum 
	 * @param all defaults to `false`; if `true` and duplicates exist, remove all
	 * @param compareStrict if provided then only delete an item if it passes the 
	 * strict comparison function, i.e. if `compareStrict(item,node_value) === true`.
	 */
	public remove(
			datum: T, 
			all = false, 
			compareStrict?: (t1: T, t2: T) => boolean): T | undefined {

		const tree = this;

		if (tree.root === undefined) { return undefined; }

		let removed = undefined;
		const root = f(tree.root, datum); 
		if (root === null) { return undefined; }
		tree.root = root;
		if (tree.root !== undefined) { 
			tree.root.color = BLACK;
			tree.root.parent = undefined;
		}

		return removed;

		function f(h: Node<T>, datum: T): Node<T> | null | undefined {
			const theresExtras = tree.duplicatesAllowed && h.extras !== undefined;
			let c = tree.compare(datum, h.datum);
			
			if ((c < 0 && !h[LEFT]) || (c > 0 && !h[RIGHT])) {
				return h;  // end reached - no match
			}
			
			if (c < 0) {
				if (!isRed(h[LEFT]) && 
					!isRed(h[LEFT]![LEFT])) {
					h = moveRedLeft(h);
				}
				const g = f(h[LEFT]!, datum);
				if (g === null) { return null; }
				h[LEFT] = g;
				if (h[LEFT]) { 
					h[LEFT]!.parent = h; 
				}
				
				return fixUp(h);
			} 
			
			
			if (isRed(h[LEFT])) {
				h = rotate(RIGHT, h);
				c = tree.compare(datum, h.datum);
			}
			
			if (c === 0 && !h[RIGHT]) {
				if (theresExtras && !all) {
					// There are multiple items at this node.

					if (compareStrict === undefined || 
						(compareStrict(datum, h.datum) === true)) {

						removed = h.datum;
						h.datum = h.extras!.pop()!;
						tree.valueCount--;
						if (h.extras!.length === 0) { 
							h.extras = undefined; 
						}
						
						return h;
					} else {
						const extras = h.extras!;
						for (let i=0; i<extras.length; i++) {
							if (compareStrict(datum, extras[i]) === true) {
								removed = extras.splice(i,1)[0];
								tree.valueCount--;
								if (extras.length === 0) { 
									h.extras = undefined; 
								}

								return h;
							}
						}

						return null;
					}
				}

				if (compareStrict === undefined || 
					(compareStrict(datum, h.datum) === true)) {

					removed = h.datum;
					tree.valueCount -= 1 + (theresExtras ? h.extras!.length : 0);
					tree.nodeCount--;

					return undefined;
				} else {
					return null;  // no match
				}
			}
			
			if (!isRed(h[RIGHT]) && 
				!isRed(h[RIGHT]![LEFT])) {

				h = moveRedRight(h);
				c = tree.compare(datum, h.datum);
			}
			
			if (c === 0) {
				if (theresExtras && !all) {
					// There are multiple items at this node.

					if (compareStrict === undefined || 
						(compareStrict(datum, h.datum) === true)) {

						removed = h.datum;
						h.datum = h.extras!.pop()!;
						tree.valueCount--;
						if (h.extras!.length === 0) { 
							h.extras = undefined; 
						}
						//// const g = f(h[RIGHT]!, datum);
						// if (g === null) { return null; }
						//// h[RIGHT] = g!;
					} else {
						const extras = h.extras!;
						let found = false;
						for (let i=0; i<extras.length; i++) {
							if (compareStrict(datum, extras[i]) === true) {
								removed = extras.splice(i,1)[0];
								tree.valueCount--;
								if (extras.length === 0) { 
									h.extras = undefined; 
								}

								//// const g = f(h[RIGHT]!, extras[i]);
								// if (g === null) { return null; }
								//// h[RIGHT] = g!;

								found = true;
								break;
							}
						}

						if (!found) { return null; }
					}
				} else {
					if (compareStrict === undefined || 
						(compareStrict(datum, h.datum) === true)) {

						tree.valueCount -= 1 + (theresExtras ? h.extras!.length : 0);
						removed = h.datum;
						const minNode = tree.getMinNode(h[RIGHT]);
						// eslint-disable-next-line
						h.datum = minNode?.datum!;
						// eslint-disable-next-line
						if (tree.duplicatesAllowed) { h.extras = minNode?.extras!; }
						h[RIGHT] = removeMin(h[RIGHT]!);
						tree.nodeCount--;
					} else {
						return null;  // no match
					}
				}
			} else {
				const g = f(h[RIGHT]!, datum);
				if (g === null) { return null; }
				h[RIGHT] = g;
			}
			if (h[RIGHT]) { h[RIGHT]!.parent = h; }
			
			return fixUp(h);
		}
	}


	/**
	 * Returns the two ordered nodes bounding the datum. 
	 * 
	 * * If the datum falls on a node, that node and the next (to the right) is 
	 * returned.
	 * * If the given datum is smaller than all nodes then the first item in the
	 * bounds array is `undefined` and the next is the smallest node
	 * * If the given datum is larger than all nodes then the second item in the
	 * bounds array is `undefined` and the first item is the largest node
	 * 
	 */
	public findBounds(datum: T): (Node<T> | undefined)[] {
		const tree = this;
		let node = tree.root;
		const bounds: (Node<T> | undefined)[] = [undefined, undefined];
		
		if (node === undefined) { 
			return bounds; 
		}
		
		while (node) {
			const c = tree.compare(datum, node.datum);
			if (c >= 0) { 
				bounds[0] = node;
			} else {
				bounds[1] = node;
			}
			
			node = node[c >= 0 ? RIGHT : LEFT];
		}

		return bounds;
	}


	/**
	 * Returns the two ordered nodes bounding the datum. 
	 * 
	 * * If the datum falls on a node, returns the nodes before and after this 
	 * one. 
	 * * If the given datum is smaller than all nodes then the first item in the
	 * bounds array is `undefined` and the next is the smallest node
	 * * If the given datum is larger than all nodes then the second item in the
	 * bounds array is `undefined` and the first item is the largest node
	 * 
	 * @param tree
	 * @param datum
	 */
	public findBoundsExcl(datum: T): (Node<T> | undefined)[] {
		const tree = this;
		const node = tree.root;

		const bounds: (Node<T> | undefined)[] = [undefined, undefined];
		
		if (node === undefined) { 
			return bounds; 
		}
		
		f(node);
		
		function f(node: Node<T>) {
			while (node) {
				const c = tree.compare(datum, node.datum);

				if (c === 0) {
					// Search on both sides
					f(node[LEFT]!);
					f(node[RIGHT]!);
					return;
				}
				
				if (c > 0) { 
					bounds[0] = node;
				} else if (c < 0) {
					bounds[1] = node;
				}
				
				node = node[c > 0 ? RIGHT : LEFT]!;
			}	
		}
		

		return bounds;
	}


	/**
	 * Returns an array of all matching data found.
	 * 
	 * If duplicates are not allowed it's better to just use `find`.
	 * 
	 * @param datum 
	 */
	public findAll(datum: T): T[] {
		const tree = this;

		let node = this.root;
		while (node) {
			const c = tree.compare(datum, node.datum);
			if (c === 0) { 
				return [
					node.datum, 
					...(node.extras ? node.extras : [])
				];
			}
				
			node = node[c > 0 ? RIGHT : LEFT];
		}

		return [];
	}


	/** @internal */
	private getMinOrMaxNode(dir: Dir): (node?: Node<T> | undefined | undefined) => Node<T> | undefined {
		return (node: Node<T> | undefined | undefined): Node<T> | undefined => {
			if (node === undefined) { 
				node = this.root;
			}
			if (!node) { 
				return undefined;
			}
			
			while (node[dir]) {
				node = node[dir]!;
			}

			return node;	
		}
	}
	
	
	// eslint-disable-next-line
	public getMinNode = this.getMinOrMaxNode(LEFT);
	// eslint-disable-next-line
	public getMaxNode = this.getMinOrMaxNode(RIGHT);


	/**
	 * Returns the minimum value in the tree starting at the given node. If the
	 * tree is empty, `undefined` will be returned.
	 * 
	 * If the min value is required for the entire tree call this function 
	 * as `tree.min(tree.root)`
	 * 
	 * @param node
	 */
	public min(node?: Node<T> | undefined | undefined): T | undefined {
		if (node === undefined) {
			node = this.root;
		}
		const minNode = this.getMinNode(node);
		if (minNode !== undefined) { 
			return minNode.datum;
		}
		
		return undefined;
	}


	/**
	 * Returns the maximum value in the tree starting at the given node. If the
	 * tree is empty, `undefined` will be returned.
	 * 
	 * If the max value is required for the entire tree call this function 
	 * as `tree.max(tree.root)`
	 * 
	 * @param node
	 */
	public max(node?: Node<T> | undefined | undefined): T | undefined {
		if (node === undefined) { 
			node = this.root;
		}
		const maxNode = this.getMaxNode(node);
		if (maxNode !== undefined) { 
			return maxNode.datum;
		}
		
		return undefined;
	}
}


/**
 * Returns the node that is at the top after the rotation.
 * 
 * Destructively rotates the given node, say h, in the 
 * given direction as far as tree rotations go.
 * 
 * @param dir
 * @param h
 * 
 * @internal
 */
function rotate<T>(dir: Dir, h: Node<T>): Node<T> {
	const x = h[-dir as Dir]!;
	
	h[-dir as Dir] = x[dir];
	if (x[dir]) { x[dir]!.parent = h; }
	x[dir] = h;
	h.parent = x;
	
	x.color = h.color;
	h.color = RED;
	
	return x;
}


/**
 * @param h 
 * 
 * @internal
 */
function removeMin<T>(h: Node<T>): Node<T> | undefined {
	if (!h[LEFT]) {
		return undefined;
	}
	if (!isRed(h[LEFT]) && 
		!isRed(h[LEFT]![LEFT])) {
		h = moveRedLeft(h);
	}
	h[LEFT] = removeMin(h[LEFT]!);
	if (h[LEFT]) { h[LEFT]!.parent = h; }
	
	return fixUp(h);
}


/**
 * Destructively flips the color of the given node and both
 * it's childrens' colors. 
 * 
 * @param h
 * 
 * @internal
 */
function flipColors<T>(h: Node<T>): void {
	h.color = (h.color + 1)%2 as Color;
	h[LEFT ]!.color = (h[LEFT ]!.color + 1)%2 as Color;
	h[RIGHT]!.color = (h[RIGHT]!.color + 1)%2 as Color;
}


/**
 * @param h
 * 
 * @internal
 */
function moveRedLeft<T>(h: Node<T>): Node<T> {
	flipColors(h);
	if (isRed(h[RIGHT]![LEFT])) {
		const a = rotate(RIGHT, h[RIGHT]!);
		h[RIGHT] = a;
		a.parent = h;
		h = rotate(LEFT, h);
		flipColors(h);
	}
	
	return h;
}


/**
 * Returns the node that is at the top after the move.
 * 
 * @param h
 * 
 * @internal
 */
function moveRedRight<T>(h: Node<T>): Node<T> {
	flipColors(h);
	if (isRed(h[LEFT]![LEFT])) {
		h = rotate(RIGHT, h);
		flipColors(h);
	}
	
	return h;
}


/**
 * Returns the node that is at the top after the fix.
 * 
 * Fix right-leaning red nodes.
 * 
 * @internal
 */
function fixUp<T>(h: Node<T>): Node<T> {
	if (isRed(h[RIGHT])) {
		h = rotate(LEFT, h);
	}

	if (isRed(h[LEFT]) && isRed(h[LEFT]![LEFT])) {
		h = rotate(RIGHT, h);
	}

	// Split 4-nodes.
	if (isRed(h[LEFT]) && isRed(h[RIGHT])) {
		flipColors(h);
	}

	return h;
}


export { 
	LlRbTree, Node, 
	LEFT, RIGHT, RED, BLACK, 
	isRed
}
