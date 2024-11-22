import { EngineObject } from "littlejsengine";

export class GameObject extends EngineObject {
    constructor({
        pos = undefined,
        size = undefined,
        tileInfo = undefined,
        angle = undefined,
        color = undefined,
        renderOrder = undefined,
    } = {}) {
        super(pos, size, tileInfo, angle, color, renderOrder);
    }
}
