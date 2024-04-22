import { assert, expect } from 'chai';
import { describe } from 'mocha';
import { vals1to7Objs } from './helpers/vals-1-to-7-objs.js';
import { compareObjs } from './helpers/compare-objs.js';
import { LlRbTree } from '../src/index.js';
import { compare } from './helpers/compare.js';
import { vals1to7 } from './helpers/vals-1-to-7.js';


describe('new', function() {
    it('it should insert multiple nodes into the tree', 
	function() {
        {
            const tree = new LlRbTree(compareObjs);
            tree.insertMulti(vals1to7Objs);
            expect((tree.toArrayInOrder()).map(o => o.val)).to.eql([1,2,3,3,4,5,6,7]);
        }
        {
            const tree = new LlRbTree(compareObjs, false, []);
            tree.insertMulti([]);
            expect((tree.toArrayInOrder()).map(o => o.val)).to.eql([]);
        }
        {
            const tree = new LlRbTree(compareObjs, true, []);
            tree.insertMulti(vals1to7Objs);
            const vals = (tree.toArrayInOrder()).map(o => o.val);
            expect(vals).to.eql([1,2,3,3,4,5,6,7]);
        }
        {
            const tree = new LlRbTree(compareObjs, false, []);
            tree.insertMulti(vals1to7Objs);
            expect((tree.toArrayInOrder()).map(o => o.val)).to.eql([1,2,3,4,5,6,7]);
        }
        {
            const tree = new LlRbTree(compareObjs, false, undefined);
            tree.insertMulti(vals1to7Objs);
            expect((tree.toArrayInOrder()).map(o => o.val)).to.eql([1,2,3,4,5,6,7]);
        }
        {
            const tree = new LlRbTree(compare);
            tree.insertMulti(vals1to7);
            for (let i=0; i<10; i++) { tree.insert(7); }
            expect((tree.toArrayInOrder())).to.eql([
                1,
                2,
                3,3,
                4,
                5,
                6,
                7,7,7,7,7,7,7,7,7,7,7
            ]);

            for (let i=0; i<9; i++) { tree.remove(7, false); }
            expect((tree.toArrayInOrder())).to.eql([
                1,
                2,
                3,3,
                4,
                5,
                6,
                7,7
            ]);

            for (let i=0; i<2; i++) { tree.remove(3); }
            expect((tree.toArrayInOrder())).to.eql([
                1,
                2,
                // 3,3,
                4,
                5,
                6,
                7,7
            ]);
        }
    });
});
