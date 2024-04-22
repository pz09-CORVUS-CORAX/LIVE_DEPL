import { assert, expect } from 'chai';
import { describe } from 'mocha';
import { compare } from './helpers/compare.js';
import { LlRbTree } from '../src/index.js';
import { insert1to7 } from './helpers/insert-1-to-7.js';
import { toDatum } from './helpers/to-datum.js';


describe('findBoundsExcl', function() {
    it('it should find bounds (exlcluding the given datum) for some items in the tree', 
	function() {
        const tree = new LlRbTree(compare);
        {
            const bounds = tree.findBoundsExcl(4).map(toDatum);
            expect(bounds).to.eql([undefined,undefined]);
        }
        insert1to7(tree);
        {
            const bounds = tree.findBoundsExcl(4).map(toDatum);
            expect(bounds).to.eql([3,5]);
        }
        {
            const bounds = tree.findBoundsExcl(1).map(toDatum);
            expect(bounds).to.eql([undefined,2]);
        }
        {
            const bounds = tree.findBoundsExcl(2.5).map(toDatum);
            expect(bounds).to.eql([2,3]);
        }
        {
            tree.remove(7);
            // tree.toArrayInOrder();  //=> [1, 2, 3, 4, 5, 6]
            const bounds = tree.findBoundsExcl(5.99).map(toDatum);
            expect(bounds).to.eql([5,6]);
        }
        {
            tree.insert(7);
            // tree.toArrayInOrder();  //=> [1, 2, 3, 4, 5, 6, 7]
            const bounds = tree.findBoundsExcl(6.999).map(toDatum);
            expect(bounds).to.eql([6,7]);
        }
        {
            // tree.toArrayInOrder();  //=> [1, 2, 3, 4, 5, 6, 7]
            const bounds = tree.findBoundsExcl(7).map(toDatum);
            expect(bounds).to.eql([6,undefined]);
        }
        {
            // tree.toArrayInOrder();  //=> [1, 2, 3, 4, 5, 6, 7]
            const bounds = tree.findBoundsExcl(8).map(toDatum);
            expect(bounds).to.eql([7,undefined]);
        }
        {
            // tree.toArrayInOrder();  //=> [1, 2, 3, 4, 5, 6, 7]
            const bounds = tree.findBoundsExcl(0.99).map(toDatum);
            expect(bounds).to.eql([undefined,1]);
        }
    });
});
