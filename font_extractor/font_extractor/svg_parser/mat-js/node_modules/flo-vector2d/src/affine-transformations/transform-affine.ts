
/**
 * Transform and returns the vector after applying the full affine 
 * transformation [[a,b],[c,d]] + [r,s] to the given 2d vector.
 * @param a top-left transformation matrix entry
 * @param b top-right transformation matrix entry
 * @param c bottom-left transformation matrix entry
 * @param d bottom-right transformation matrix entry
 * @param r x coordinate of translation vector
 * @param s y coordinate of translation vector
 * @param p a vector to transform
 */
function transformAffine([[a,b],[c,d]]: number[][], [r,s]: number[]): (p: number[]) => number[];
function transformAffine([[a,b],[c,d]]: number[][], [r,s]: number[], p: number[]): number[];
function transformAffine([[a,b],[c,d]]: number[][], [r,s]: number[], p?: number[]) {

    function transform([x,y]: number[]) {
        return [
            a*x + b*y + r, 
            c*x + d*y + s
        ];
    }

    // Curry the function
    return p === undefined ? transform : transform(p); 
}


export { transformAffine }
