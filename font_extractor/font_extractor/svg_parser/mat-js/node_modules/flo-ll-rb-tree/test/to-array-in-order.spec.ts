import { describe } from 'mocha';
import { expect } from 'chai';
import { insert1to7 } from './helpers/insert-1-to-7.js';
import { LlRbTree } from '../src/index.js';
import { compare } from './helpers/compare.js';


describe('toArrayInOrder', function() {
    it('it should return the ordered data at the tree nodes', 
	function() {
        {
            const tree = new LlRbTree(compare);
            expect(tree.toArrayInOrder()).to.eql([]);
        }
        {
            const tree = new LlRbTree(compare, true, [7,6,5,4,3,1,2]);
            expect(tree.toArrayInOrder()).to.eql([1,2,3,4,5,6,7]);
        }
    });
});
