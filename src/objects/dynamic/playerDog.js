import { vec2, keyIsDown } from "littlejsengine";

import { DynamicObject } from "./dynamicObjects.js";
import { spriteAtlas } from "../../scripts/spriteAtlas.js";

export class PlayerDog extends DynamicObject {
    // Keep track of the most recent active player on the class
    static player1 = undefined;

    constructor(pos) {
        super({
            pos: pos,
            size: vec2(0.6),
        });
        this.setCollision(false);
        PlayerDog.player1 = this;

        // Behavior variables
        this.max_velocity = 0.15;

        // Movement parameters
        this.friction = 0.9;
    }

    renderRun = () => this.dynamicRender(spriteAtlas.dog.run);
    renderIdle = () => this.dynamicRender(spriteAtlas.dog.idle);

    calculateMovement() {
        var xInput = keyIsDown("ArrowRight") ? (keyIsDown("ArrowLeft") ? 0 : 1) : (keyIsDown("ArrowLeft") ? -1 : 0);
        var yInput = keyIsDown("ArrowUp") ? (keyIsDown("ArrowDown") ? 0 : 1) : (keyIsDown("ArrowDown") ? -1 : 0);

        if (yInput == 1){
            switch (xInput){
                case 1:
                    this.moveUpRight();
                    break;
                case -1:
                    this.moveUpLeft();
                    break;
                default:
                    this.moveUp();
                    break;
            }
        }else if (xInput == -1) {
            switch (xInput){
                case 1:
                    this.moveDownRight();
                    break;
                case -1:
                    this.moveDownLeft();
                    break;
                default:
                    this.moveDown();
                    break;
            }
        }else {
            switch (xInput){
                case 1:
                    this.moveRight();
                    break;
                case -1:
                    this.moveLeft();
                    break;
                default:
                    break;
            }
        }
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

    render() {
        this.renderRun();
    }
}
