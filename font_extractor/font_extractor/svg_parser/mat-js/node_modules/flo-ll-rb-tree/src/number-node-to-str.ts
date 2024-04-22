import { nodeToStr } from "./node-to-str.js";


const numberNodeToStr = nodeToStr<number>(t => t.toString());


export { numberNodeToStr }
