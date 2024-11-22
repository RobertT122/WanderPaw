import { vec2, Color, keyIsDown } from "littlejsengine";

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
        this.setCollision(false);
        PlayerDog.player1 = this;

        // Behavior variables
        this.max_velocity = 0.15;

        // Movement parameters
        this.friction = 0.9;
    }

    update() {
        super.update();
        // Move player to mouse
        const move_input_force = vec2(
            keyIsDown("ArrowRight") - keyIsDown("ArrowLeft"),
            keyIsDown("ArrowUp") - keyIsDown("ArrowDown"),
        ).scale(0.075);
        this.velocity = this.velocity.add(move_input_force).clampLength(this.max_velocity);
        this.velocity = this.velocity.scale(this.friction);
    }
}