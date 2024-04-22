import { assert, expect } from 'chai';
import { describe } from 'mocha';
import { insert1to7 } from './helpers/insert-1-to-7.js';
import { LlRbTree } from '../src/index.js';
import { compare } from './helpers/compare.js';


describe('new', function() {
    it('it should construct some trees properly', 
	function() {
        {
            const tree = new LlRbTree(compare, true, [7,6,5,4,3,1,2]);
            expect(tree.toArrayInOrder()).to.eql([1,2,3,4,5,6,7]);
        }
        {
            const tree = new LlRbTree(compare);
            insert1to7(tree);
            expect(tree.toArrayInOrder()).to.eql([1,2,3,3,4,5,6,7]);
        }
        {
            const tree = new LlRbTree(compare, false, []);
            insert1to7(tree);
            expect(tree.toArrayInOrder()).to.eql([1,2,3,4,5,6,7]);
        }
        {
            const tree = new LlRbTree(compare, true, []);
            insert1to7(tree);
            expect(tree.toArrayInOrder()).to.eql([1,2,3,3,4,5,6,7]);
        }
        {
            const tree = new LlRbTree(compare, false, []);
            insert1to7(tree);
            expect(tree.toArrayInOrder()).to.eql([1,2,3,4,5,6,7]);
        }
        {
            const tree = new LlRbTree(compare, false, undefined);
            insert1to7(tree);
            expect(tree.toArrayInOrder()).to.eql([1,2,3,4,5,6,7]);
        }
    });
});
