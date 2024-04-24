import {
    findMats, getPathsFromStr, traverseEdges, toScaleAxis, getCurveToNext,
    isTerminating
} from './node_modules/flo-mat/browser/index.js';


/**
 * Returns an SVG path string of a line.
 * @param ps The line endpoints.
 */
function getLinePathStr(ps/*: number[][]*/) {
    let [[x0, y0], [x1, y1]] = ps;
    return `M${x0} ${y0} L${x1} ${y1}`;
}

/**
 * Returns an SVG path string of a quadratic bezier curve.
 * @param ps The quadratic bezier control points.
 */
function getQuadBezierPathStr(ps/*: number[][]*/) {
    let [[x0, y0], [x1, y1], [x2, y2]] = ps;
    return `M${x0} ${y0} Q${x1} ${y1} ${x2} ${y2}`;
}

/**
 * Returns an SVG path string of a cubic bezier curve.
 * @param ps The cubic bezier control points.
 */
function getCubicBezierPathStr(ps/*: number[][]*/) {
    let [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps;
    return `M${x0} ${y0} C${x1} ${y1} ${x2} ${y2} ${x3} ${y3}`;
}

function getLineProperPathStr(ps/*: number[][]*/) {
    let [[x0, y0], [x1, y1]] = ps;
    return `L${x1} ${y1}`;
}

/**
 * Returns an SVG path string of a quadratic bezier curve.
 * @param ps The quadratic bezier control points.
 */
function getQuadBezierProperPathStr(ps/*: number[][]*/) {
    let [[x0, y0], [x1, y1], [x2, y2]] = ps;
    return `Q${x1} ${y1} ${x2} ${y2}`;
}

/**
 * Returns an SVG path string of a cubic bezier curve.
 * @param ps The cubic bezier control points.
 */
function getCubicBezierProperPathStr(ps/*: number[][]*/) {
    let [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = ps;
    return `Q${x1} ${y1} ${x3} ${y3}`;
}

function getMatsInSvg(mats) {
    let str = '';
    mats.forEach(f);

    function f(mat/*: Mat*/) {
        let cpNode = mat.cpNode;
        let last_point = [];

        if (!cpNode) { return; }
        let fs = [, , getLinePathStr, getQuadBezierPathStr, getCubicBezierPathStr];
        let fsx = [, , getLineProperPathStr, getQuadBezierProperPathStr, getCubicBezierProperPathStr];

        traverseEdges(cpNode, function (cpNode) {
            if (isTerminating(cpNode)) { return; }
            let bezier = getCurveToNext(cpNode);
            if (!bezier) { return; }
            if (last_point.length == 0) 
            { 
                str += 'M' + bezier[0][0] + ' ' + bezier[0][1];
            }
            else if(last_point !== bezier[0]) 
            {
                str += 'Z';
                str += 'M' + bezier[0][0] + ' ' + bezier[0][1];
            }
            else
            {
                str += fsx[bezier.length](bezier);
            }
            last_point = bezier[bezier.length - 1];
        });
        str += 'Z';
    }
    return str;
}

function getRadiuses(mats)
{
    let radiuses = [];
    mats.forEach(f);
    function f(mat/*: Mat*/) {
        let cpNode = mat.cpNode;

        if (!cpNode) { return; }

        traverseEdges(cpNode, function (cpNode) {
            if (isTerminating(cpNode)) { return; }
            radiuses.push(cpNode.cp.circle);
        });
    }
    return radiuses;
}

function svgToMat(svgPathStr) {
    let bezierLoops = getPathsFromStr(svgPathStr);
    let mats = findMats(bezierLoops, 1);
    let mat = {};
    mat.svg = getMatsInSvg(mats, 'mat');
    mat.circles = getRadiuses(mats);
    return mat;
}

export { svgToMat };