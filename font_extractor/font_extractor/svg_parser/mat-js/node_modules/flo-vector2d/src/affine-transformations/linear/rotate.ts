
/**
 * Returns a rotated (anti-clockwise) version of the given 2d vector given the 
 * sine and cosine of the angle.
 * @param sinθ
 * @param cosθ
 * @param p
 */
function rotate(sinθ: number, cosθ: number): (p: number[]) => number[];
function rotate(sinθ: number, cosθ: number, p: number[]): number[];
function rotate(sinθ: number, cosθ: number, p?: number[]) {

    function rotateByθ(p: number[]) {
        return [
            p[0]*cosθ - p[1]*sinθ, 
            p[0]*sinθ + p[1]*cosθ
        ];
    }

    // Curry the function
    return p === undefined ? rotateByθ : rotateByθ(p); 
}


export { rotate }
