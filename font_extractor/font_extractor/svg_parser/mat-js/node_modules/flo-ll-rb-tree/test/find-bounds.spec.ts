import { assert, expect } from 'chai';
import { describe } from 'mocha';
import { compare } from './helpers/compare.js';
import { LlRbTree } from '../src/index.js';
import { insert1to7 } from './helpers/insert-1-to-7.js';
import { toDatum } from './helpers/to-datum.js';


describe('findBounds', function() {
    it('it should find bounds for some items in the tree', 
	function() {
        const tree = new LlRbTree(compare);
        {
            const bounds = tree.findBounds(4).map(toDatum);
            expect(bounds).to.eql([undefined,undefined]);
        }
        insert1to7(tree);
        {
            const bounds = tree.findBounds(4).map(toDatum);
            expect(bounds).to.eql([4,5]);
        }
        {
            const bounds = tree.findBounds(1).map(toDatum);
            expect(bounds).to.eql([1,2]);
        }
        {
            const bounds = tree.findBounds(2.5).map(toDatum);
            expect(bounds).to.eql([2,3]);
        }
        {
            tree.remove(7);
            // tree.toArrayInOrder();  //=> [1, 2, 3, 4, 5, 6]
            const bounds = tree.findBounds(5.99).map(toDatum);
            expect(bounds).to.eql([5,6]);
        }
        {
            tree.insert(7);
            // tree.toArrayInOrder();  //=> [1, 2, 3, 4, 5, 6, 7]
            const bounds = tree.findBounds(6.999).map(toDatum);
            expect(bounds).to.eql([6,7]);
        }
        {
            // tree.toArrayInOrder();  //=> [1, 2, 3, 4, 5, 6, 7]
            const bounds = tree.findBounds(7).map(toDatum);
            expect(bounds).to.eql([7,undefined]);
        }
        {
            // tree.toArrayInOrder();  //=> [1, 2, 3, 4, 5, 6, 7]
            const bounds = tree.findBounds(8).map(toDatum);
            expect(bounds).to.eql([7,undefined]);
        }
        {
            // tree.toArrayInOrder();  //=> [1, 2, 3, 4, 5, 6, 7]
            const bounds = tree.findBounds(0.99).map(toDatum);
            expect(bounds).to.eql([undefined,1]);
        }
    });
});
