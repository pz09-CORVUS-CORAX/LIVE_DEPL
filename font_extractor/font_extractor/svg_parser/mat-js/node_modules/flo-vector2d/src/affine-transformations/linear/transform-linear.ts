
/**
 * Transform and returns the vector after applying the linear transformation 
 * [[a,b],[c,d]] to the given 2d vector.
 * @param a top-left transformation matrix entry
 * @param b top-right transformation matrix entry
 * @param c bottom-left transformation matrix entry
 * @param d bottom-right transformation matrix entry
 * @param p a vector to transform
 */
function transformLinear([[a,b],[c,d]]: number[][]): (p: number[]) => number[];
function transformLinear([[a,b],[c,d]]: number[][], p: number[]): number[];
function transformLinear([[a,b],[c,d]]: number[][], p?: number[]) {

    function transform([x,y]: number[]) {
        return [
            a*x + b*y, 
            c*x + d*y
        ];
    }

    // Curry the function
    return p === undefined ? transform : transform(p); 
}


export { transformLinear }