import { assert, expect } from 'chai';
import { describe } from 'mocha';
import { compare } from './helpers/compare.js';
import { LlRbTree } from '../src/index.js';
import { insert1to7 } from './helpers/insert-1-to-7.js';


describe('max', function() {
    it('it should find the maximum value in the tree', 
	function() {
        {
            const tree = new LlRbTree(compare);
            expect(tree.max()).to.be.undefined;
            insert1to7(tree);
            expect(tree.max()).to.eql(7);
        }
    });
});
