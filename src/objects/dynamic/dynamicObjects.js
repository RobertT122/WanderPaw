import { tile, drawTile, timeDelta, vec2 } from "littlejsengine";
import { GameObject } from "../gameObjects.js";

export class Direction {
    static Up = new Direction("up", false, vec2(0, 1));
    static UpRight = new Direction("upLeft", true, vec2(0.7071, 0.7071));
    static Right = new Direction("left", true, vec2(1, 0));
    static DownRight = new Direction("downLeft", true, vec2(0.7071, -0.7071));
    static Down = new Direction("down", false, vec2(0, -1));
    static DownLeft = new Direction("downLeft", false, vec2(-0.7071, -0.7071));
    static Left = new Direction("left", false, vec2(-1, 0));
    static UpLeft = new Direction("upLeft", false, vec2(-0.7071, 0.7071));

    constructor(animation_name, animation_mirrored, unit_vector) {
        this.animation_name = animation_name;
        this.animation_mirrored = animation_mirrored;
        this.unit_vector = unit_vector;
    }

    static determineDirection(tragectory) {
        const upness = Math.cos(tragectory.angle());
        const isRight = tragectory.x > 0;
        if (upness > 0.85) {
            return Direction.Up;
        } else if (upness > 0.25) {
            return isRight ? Direction.UpRight : Direction.UpLeft;
        } else if (upness > -0.25) {
            return isRight ? Direction.Right : Direction.Left;
        } else if (upness > -0.85) {
            return isRight ? Direction.DownRight : Direction.DownLeft;
        } else {
            return Direction.Down;
        }
    }
}

export class DynamicObject extends GameObject {
    constructor(args) {
        super(args);
        this.setCollision(true, true);

        this.cachedTime = 0;
        this.animationIncrement = 0;
        this.animationSpeed = 1;
        this.direction = Direction.Down;
        this.max_Velocity = 0.15;
        this.spriteAtlasAnimation;
        this.objectSpeed = 0;
        this.animationState;
    }

    update() {
        this.animationSpeed = 1;
        this.velocity = this.direction.unit_vector.scale(this.objectSpeed);
        super.update();
    }

    dynamicRender() {
        const pattern = this.spriteAtlasAnimation.pattern;
        const timing = this.spriteAtlasAnimation.timing;

        this.animationIncrement = this.animationIncrement % pattern.length;
        const index = pattern[this.animationIncrement];

        this.cachedTime += timeDelta * 500 * this.animationSpeed;
        if (this.cachedTime >= timing[this.animationIncrement]) {
            this.cachedTime = 0;
            this.animationIncrement++;
            console.log(this.velocity.angle());
        }

        this.tileInfo = tile(this.spriteAtlasAnimation[this.direction.animation_name][index]);
        drawTile(
            this.pos,
            this.size,
            this.tileInfo,
            this.color,
            this.angle,
            this.direction.animation_mirrored,
        );
    }
}
