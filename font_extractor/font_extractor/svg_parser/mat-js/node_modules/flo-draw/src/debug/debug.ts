import { drawFs } from "../draw-fs.js";


interface Debug {
    /* Generated elements for later inspection */
    fs: { draw: typeof drawFs };
}


/**
 * Returns a new debug object by spreading boolean operation debug information
 * onto the given (possibly undefined) debug object.
 * @param debugOn a (possibly undefined) debug object
 */
function enableDebugDrawFs(debugOn: boolean) {
    if (!debugOn) { return; }

    const debug: Debug = (window as any)._debug_;

    const debug_ = { 
        ...debug, 
        fs: {
            ...debug?.fs,
            draw: {
                ...drawFs
            }
        }
    };

    (window as any)._debug_ = debug_;
}


export { enableDebugDrawFs }
