import { assert, expect } from 'chai';
import { describe } from 'mocha';
import { compare } from './helpers/compare.js';
import { LlRbTree } from '../src/index.js';
import { insert1to7 } from './helpers/insert-1-to-7.js';


describe('getMaxNode', function() {
    it('it should find the maximum node in the tree', 
	function() {
        {
            const tree = new LlRbTree(compare);
            expect(tree.getMaxNode()).to.be.undefined;
            insert1to7(tree);
            expect(tree.getMaxNode()!.datum).to.eql(7);
        }
    });
});
