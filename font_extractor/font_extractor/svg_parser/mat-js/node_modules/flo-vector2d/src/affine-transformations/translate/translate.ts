
// From: https://en.wikipedia.org/wiki/Affine_transformation
// "If X is the point set of an affine space, then every affine transformation 
// on X can be represented as the composition of a linear transformation on X 
// and a translation of X"


/**
 * Returns the result of adding two 2-vectors. This function is curried.
 * @param a - A 2d vector
 * @param b - Another 2d vector
 */
function translate(a: number[]): ((b: number[]) => number[]);
function translate(a: number[], b: number[]): number[];
function translate(a: number[], b?: number[]) {

    function f(b: number[]): number[] {
        return [a[0]+b[0], a[1]+b[1]];
    }

    // Curry the function
    return b === undefined ? f : f(b); 
}


export { translate }
