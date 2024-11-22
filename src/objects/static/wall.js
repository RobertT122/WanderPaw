import { Color } from "littlejsengine";

import { StaticObject } from "./staticObjects.js";

export class Wall extends StaticObject {
    constructor(pos, size) {
        super({ pos: pos, size: size, color: new Color(0.5, 0.5, 0.5) });

        // Make object have static physics
        this.mass = 0;
    }
}
