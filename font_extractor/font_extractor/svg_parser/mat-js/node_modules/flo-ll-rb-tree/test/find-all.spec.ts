import { assert, expect } from 'chai';
import { describe } from 'mocha';
import { vals1to7Objs } from './helpers/vals-1-to-7-objs.js';
import { compareObjs } from './helpers/compare-objs.js';
import { LlRbTree } from '../src/index.js';
import { compare } from './helpers/compare.js';
import { vals1to7 } from './helpers/vals-1-to-7.js';


describe('findAll', function() {
    it('it should find all matching data', 
	function() {
        {
            let vals: number[];

            const tree = new LlRbTree(compareObjs);

            vals = tree.findAll({ val: 3 }).map(o => o.val);
            expect(vals).to.eql([]);
            
            tree.insertMulti(vals1to7Objs);
            tree.insertMulti(vals1to7Objs);
            tree.insertMulti(vals1to7Objs);
            expect((tree.toArrayInOrder()).map(o => o.val)).to.eql([
                1,1,1,
                2,2,2,
                3,3,3,3,3,3,
                4,4,4,
                5,5,5,
                6,6,6,
                7,7,7,
            ]);

            vals = tree.findAll({ val: 3 }).map(o => o.val);
            expect(vals).to.eql([3,3,3,3,3,3]);

            vals = tree.findAll({ val: 4 }).map(o => o.val);
            expect(vals).to.eql([4,4,4]);

            tree.insertMulti([{ val: 99 }]);
            vals = tree.findAll({ val: 99 }).map(o => o.val);
            expect(vals).to.eql([99]);
        }
    });
});
