import { lengthSquared } from "../distance-and-length/length-squared.js";
import { det3 } from "../matrix/det.js";


/**
* Returns the circumcenter of the given 2d triangle.
* @param triangle 
*/
function circumCenter(triangle: number[][]): number[] {
    // See wikipedia
    const p1 = triangle[0];
    const p2 = triangle[1];
    const p3 = triangle[2];

    const sqLen = lengthSquared;

    const Sx = 0.5 * det3(
            [sqLen(p1), p1[1], 1],  
            [sqLen(p2), p2[1], 1],
            [sqLen(p3), p3[1], 1]
    );


    const Sy = 0.5 * det3(
            [p1[0], sqLen(p1), 1],  
            [p2[0], sqLen(p2), 1],
            [p3[0], sqLen(p3), 1]
    );

    const a = det3(
            [p1[0], p1[1], 1],  
            [p2[0], p2[1], 1],
            [p3[0], p3[1], 1]
    ); 

    return [Sx/a, Sy/a];
}


export { circumCenter }
