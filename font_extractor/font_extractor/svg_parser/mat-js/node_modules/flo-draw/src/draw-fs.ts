import { circle } from './draw/circle.js';
import { crossHair } from './draw/cross-hair.js';
import { dot } from './draw/dot.js';
import { line } from './draw/line.js';
import { rect } from './draw/rect.js';
import { polygon } from './draw/polygon.js';
import { loop } from './draw/loop.js';
import { polyline } from './draw/polyline.js';
import { beziers } from './draw/beziers.js';
import { cubicBezier } from './draw/cubic-bezier.js';
import { bezier } from './draw/bezier.js';
import { bezierPiece } from './draw/bezier-piece.js';
import { quadBezier } from './draw/quad-bezier.js';
import { text } from './draw/text.js';


const drawFs = {
	circle,
	crossHair,
	dot,
	line,
	rect,
	beziers,
	bezier,
	bezierPiece,
	quadBezier,
	cubicBezier,
	polygon,
	loop,
	polyline,
	text
}


export { drawFs }
