
/**
 * Find point where two lines intersect. Returns he point where the two lines 
 * intersect or undefined if they don't intersect or are the same line. 
 * see Wikipedia https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
 * @param l1 A line 
 * @param l2 Another line
 */ 
function lineLineIntersection(l1: number[][], l2: number[][]): number[] | undefined {

	const [[x1, y1], [x2, y2]] = l1; 
	const [[x3, y3], [x4, y4]] = l2;
	
	const x1_ = x2 - x1;
	const y1_ = y2 - y1;
	const x2_ = x4 - x3;
	const y2_ = y4 - y3;
	
	const denom = x2_*y1_ - y2_*x1_;
	if (denom === 0) {
		// parallel
		return undefined;
	} 
	
	const b = ((y3-y1)*x1_ - (x3-x1)*y1_) / denom;
	
	return [
		x3 + b*x2_, 
		y3 + b*y2_
	];
}


export { lineLineIntersection }
