import { assert, expect } from 'chai';
import { describe } from 'mocha';
import { compareObjs } from './helpers/compare-objs.js';
import { LlRbTree } from '../src/index.js';
import { insert1to7Objs } from './helpers/insert-1-to-7-objs.js';
import { isBlackHeightCorrect, isNoRedEdge } from './helpers/constraints.js';
import { vals1to7Objs } from './helpers/vals-1-to-7-objs.js';
import { countValues } from './helpers/count-values.js';


describe('remove', function() {
    it('it should remove items in the tree based on value', 
	function() {
        {
            const tree = new LlRbTree(compareObjs);

            expect(tree.remove({ val: 112 })).to.not.throw;

            insert1to7Objs(tree);
            tree.remove({ val: 2 });
            expect(tree.toArrayInOrder().map(o => o.val)).to.eql([1,3,3,4,5,6,7]);
            tree.remove({ val: 5, name: 'apple pear' });
            expect(tree.toArrayInOrder().map(o => o.val)).to.eql([1,3,3,4,6,7]);

            expect(tree.remove({ val: 112 })).to.not.throw;

            tree.remove({ val: 1, name: 'apple pear' });
            tree.remove({ val: 3, name: 'apple pear' });
            tree.remove({ val: 3, name: 'apple pear' });
            tree.remove({ val: 4, name: 'apple pear' });
            tree.remove({ val: 6, name: 'apple pear' });
            expect(tree.toArrayInOrder().map(o => o.val)).to.eql([7]);

            tree.remove({ val: 7, name: 'apple pear' });
            expect(tree.toArrayInOrder().map(o => o.val)).to.eql([]);

            tree.insert({ val: 7, name: 'apple pear' });
            expect(tree.toArrayInOrder().map(o => o.val)).to.eql([7]);

            tree.remove({ val: 7, name: 'pear apple' });
            expect(tree.toArrayInOrder().map(o => o.val)).to.eql([]);

            expect(tree.root).to.be.undefined;
        }
    });

    it('it should remove multiple items in the tree based if requested', 
    function() {
        const tree = new LlRbTree(compareObjs);
        let vals: number[];


        insert1to7Objs(tree);
        const vals1to7Objs2 = vals1to7Objs.slice();
        vals1to7Objs2.splice(1,1);
        for (let val of vals1to7Objs2) {
            tree.insert(val);
        }

        tree.insert({ val: 3.5 });

        //tree.insertMulti([1,1,2,2,3,3,3,3.5,4,4,5,5,6,6,7,7].map(v => ({ val: v })));

        // treeToString(tree, nodeObjToString);
        assert(isBlackHeightCorrect(tree), 'tree does not pass \'black height\' constraint');
        assert(isNoRedEdge(tree), 'tree does not pass \'no red edge\' constraint')

        vals = tree.toArrayInOrder().map(o => o.val);
        expect(vals).to.eql([1,1,2,2,3,3,3,3.5,4,4,5,5,6,6,7,7]);
        
        tree.remove({ val: 3 }, true);
        // treeToString(tree, nodeObjToString);
        vals = tree.toArrayInOrder().map(o => o.val);
        expect(vals).to.eql([1,1,2,2,3.5,4,4,5,5,6,6,7,7]);
    });

    it('it should remove multiple items in the tree based if requested', 
    function() {
        const vals = [1,2,3,3,3,3,3,4,5,6].map(v => ({ val: v, name: v.toString() }));
        const tree = new LlRbTree(compareObjs, true, vals);
        
        // const vCount = countValues(tree);
        expect(tree.toArrayInOrder().map(o => o.val)).to.eql(
            [1,2,3,3,3,3,3,4,5,6]
        );
        tree.remove({ val: 3, name: 'apple' });
        expect(tree.toArrayInOrder().map(o => o.val)).to.eql(
            [1,2,3,3,3,3,4,5,6]
        );
        tree.remove({ val: 3, name: 'pear' });
        expect(tree.toArrayInOrder().map(o => o.val)).to.eql(
            [1,2,3,3,3,4,5,6]
        );

        tree.remove(
            { val: 3, name: 'guava' }, false, 
            (a,b) => (a.val - b.val === 0) && (a.name === b.name)
        );
        expect(tree.toArrayInOrder().map(o => o.val)).to.eql(
            [1,2,3,3,3,4,5,6]  // should not have removed
        );

        tree.remove(
            { val: 3, name: '322' }, false, 
            (a,b) => (a.val - b.val === 0) && (a.name === b.name)
        );
        expect(tree.toArrayInOrder().map(o => o.val)).to.eql(
            [1,2,3,3,3,4,5,6]
        );
    });
});
