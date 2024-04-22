import { assert, expect } from 'chai';
import { describe } from 'mocha';
import { LlRbTree } from '../../src/index.js';
import { countNodes } from '../helpers/count-nodes.js';
import { countValues } from '../helpers/count-values.js';

const max = Math.max;


interface Interval {
    tS: number;
    tE: number;
    hL: number;
    hR: number;
    hEL: number;
    hER: number;
}


const initialInterval = { 
    tS: 0, tE: 1, 
    hL: 0, hR: 0, 
    hEL: Number.POSITIVE_INFINITY,
    hER: Number.POSITIVE_INFINITY
}


function compare(a: Interval, b: Interval) {
    const diff = (
        max(a.hL + a.hEL, a.hR + a.hER) - 
        max(b.hL + b.hEL, b.hR + b.hER)
    );

    if (Number.isNaN(diff)) { return 0; }

    return diff;
}


const iL = {
    tS: 0,
    tE: 0.5,
    hL: 0,
    hR: 0.3851983968628731,
    hEL: 0.43694591235438646,
    hER: 0.1764283253376686
};


const iR = {
    tS: 0.5,
    tE: 1,
    hL: 0.3851983968628731,
    hR: 0,
    hEL: 0.11991924679920472,
    hER: 0.2808091367496658
}


describe('Special cases', function() {
    it('it should pass some special cases',
	function() {
        let tree = new LlRbTree(compare, true, [initialInterval]);
        
        const interval = tree.max()!;

        tree.remove(interval);
        tree.insert(iL);
        tree.insert(iL);
        tree.insert(iL);
        tree.insert(iR);

        const nodeCount = countNodes(tree);
        const valCount = countValues(tree);

        expect(nodeCount).to.eql(2);
        expect(valCount).to.eql(4);
    });
});
