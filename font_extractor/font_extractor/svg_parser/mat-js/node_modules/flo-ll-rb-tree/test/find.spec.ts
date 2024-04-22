import { assert, expect } from 'chai';
import { describe } from 'mocha';
import { compareObjs } from './helpers/compare-objs.js';
import { LlRbTree } from '../src/index.js';
import { insert1to7Objs } from './helpers/insert-1-to-7-objs.js';
import { type Obj } from './helpers/obj.js';


describe('find', function() {
    it('it should find items in the tree based on value', 
	function() {
        {
            const tree = new LlRbTree(compareObjs);
            const itemNode = tree.find({ val: 2 });
            expect(itemNode).to.be.undefined;
            insert1to7Objs(tree);
            const item1 = tree.find({ val: 2 })!.datum;
            expect((item1).val).to.eql(2);
            const item2 = tree.find({ val: 2, name: 'apple pear' })!.datum;
            expect((item2).val).to.eql(2);

            const item3 = tree.find({ val: 6, name: 'apple pear' })!.datum;
            expect((item3).val).to.eql(6);
            // treeToString(tree, nodeObjToString);//?
        }
    });
});
