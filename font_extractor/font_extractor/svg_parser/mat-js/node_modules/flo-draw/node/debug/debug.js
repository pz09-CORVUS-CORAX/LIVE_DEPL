import { drawFs } from "../draw-fs.js";
/**
 * Returns a new debug object by spreading boolean operation debug information
 * onto the given (possibly undefined) debug object.
 * @param debugOn a (possibly undefined) debug object
 */
function enableDebugDrawFs(debugOn) {
    if (!debugOn) {
        return;
    }
    const debug = window._debug_;
    const debug_ = {
        ...debug,
        fs: {
            ...debug?.fs,
            draw: {
                ...drawFs
            }
        }
    };
    window._debug_ = debug_;
}
export { enableDebugDrawFs };
//# sourceMappingURL=debug.js.map