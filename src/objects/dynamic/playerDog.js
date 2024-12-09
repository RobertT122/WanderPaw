import { vec2, keyIsDown } from "littlejsengine";

import { Direction } from "../direction.js";
import { DynamicObject } from "./dynamicObjects.js";
import { spriteAtlas } from "../../scripts/spriteAtlas.js";

export class PlayerDog extends DynamicObject {
    // Keep track of the most recent active player on the class
    static player1 = undefined;

    constructor(pos) {
        super({
            pos: pos,
            size: vec2(1),
        });
        this.spriteAtlasAnimation = spriteAtlas.dog.run;
        this.setCollision(true);
        PlayerDog.player1 = this;

        // Behavior variables
        this.run_velocity = 0.15;
    }

    run() {
        this.objectSpeed = this.run_velocity;
        this.spriteAtlasAnimation = spriteAtlas.dog.run;
    }

    idle() {
        this.objectSpeed = 0;
        this.spriteAtlasAnimation = spriteAtlas.dog.idle;
    }

    update() {
        super.update();
        var xInput = 0;
        var yInput = 0;
        if (keyIsDown("ArrowRight") != keyIsDown("ArrowLeft")) {
            xInput = keyIsDown("ArrowRight") ? 1 : -1;
        }
        if (keyIsDown("ArrowUp") != keyIsDown("ArrowDown")) {
            yInput = keyIsDown("ArrowUp") ? 1 : -1;
        }

        // Determine direction from arrow presses
        if (yInput == 1) {
            switch (xInput) {
                case 1:
                    this.direction = Direction.UpRight;
                    this.run();
                    break;
                case -1:
                    this.direction = Direction.UpLeft;
                    this.run();
                    break;
                default:
                    this.direction = Direction.Up;
                    this.run();
                    break;
            }
        } else if (yInput == -1) {
            switch (xInput) {
                case 1:
                    this.direction = Direction.DownRight;
                    this.run();
                    break;
                case -1:
                    this.direction = Direction.DownLeft;
                    this.run();
                    break;
                default:
                    this.direction = Direction.Down;
                    this.run();
                    break;
            }
        } else {
            switch (xInput) {
                case 1:
                    this.direction = Direction.Right;
                    this.run();
                    break;
                case -1:
                    this.direction = Direction.Left;
                    this.run();
                    break;
                default:
                    // Set to idle if no arrows down
                    this.idle();
                    break;
            }
        }
    }

    render() {
        this.dynamicRender();
    }
}
