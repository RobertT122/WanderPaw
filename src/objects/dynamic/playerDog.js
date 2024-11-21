import { vec2, Color, mousePos } from "littlejsengine";

import { DynamicObject } from "./dynamicObjects.js";

export class PlayerDog extends DynamicObject {
    // Keep track of the most recent active player on the class
    static player1 = undefined;

    constructor(pos) {
        super({
            pos: pos,
            size: vec2(0.6),
            color: new Color(130 / 256, 70 / 256, 30 / 256, 1),
        });
        PlayerDog.player1 = this;
        console.log("Creating dog");
        this.pos = mousePos;
    }

    update() {
        // Move player to mouse
        this.pos = mousePos;
    }
}
