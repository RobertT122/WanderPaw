import { vec2, keyIsDown } from "littlejsengine";

import { DynamicObject, Direction } from "./dynamicObjects.js";
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
        this.max_velocity = 0.15;

        // Movement parameters
        this.friction = 0.9;
    }

    renderRun = () => (this.spriteAtlasAnimation = spriteAtlas.dog.run);
    renderIdle = () => (this.spriteAtlasAnimation = spriteAtlas.dog.idle);

    update() {
        var xInput = 0;
        var yInput = 0;
        if (keyIsDown("ArrowRight") != keyIsDown("ArrowLeft")) {
            xInput = keyIsDown("ArrowRight") ? 1 : -1;
        }
        if (keyIsDown("ArrowUp") != keyIsDown("ArrowDown")) {
            yInput = keyIsDown("ArrowUp") ? 1 : -1;
        }

        // Default to running
        this.objectSpeed = this.max_velocity;
        this.renderRun();

        if (yInput == 1) {
            switch (xInput) {
                case 1:
                    this.direction = Direction.UpRight;
                    break;
                case -1:
                    this.direction = Direction.UpLeft;
                    break;
                default:
                    this.direction = Direction.Up;
                    break;
            }
        } else if (yInput == -1) {
            switch (xInput) {
                case 1:
                    this.direction = Direction.DownRight;
                    break;
                case -1:
                    this.direction = Direction.DownLeft;
                    break;
                default:
                    this.direction = Direction.Down;
                    break;
            }
        } else {
            switch (xInput) {
                case 1:
                    this.direction = Direction.Right;
                    break;
                case -1:
                    this.direction = Direction.Left;
                    break;
                default:
                    // Set to idle if no arrows down
                    this.objectSpeed = 0;
                    this.renderIdle();
                    break;
            }
        }

        console.log(this.objectSpeed);
        super.update();
    }

    render() {
        this.dynamicRender();
    }
}
