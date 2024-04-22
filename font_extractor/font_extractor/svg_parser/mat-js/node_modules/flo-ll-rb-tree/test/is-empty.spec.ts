import { assert, expect } from 'chai';
import { describe } from 'mocha';
import { compare } from './helpers/compare.js';
import { LlRbTree } from '../src/index.js';
import { insert1to7 } from './helpers/insert-1-to-7.js';
import { vals1to7 } from './helpers/vals-1-to-7.js';


describe('isEmpty', function() {
    it('it should check if the given tree is empty or not', 
	function() {
        {
            const tree = new LlRbTree(compare);
            expect(tree.isEmpty()).to.be.true;
            insert1to7(tree);
            expect(tree.isEmpty()).to.be.false;
        }
    });
});
