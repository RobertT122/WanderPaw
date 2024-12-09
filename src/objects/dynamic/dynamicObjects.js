import { tile, drawTile, timeDelta } from "littlejsengine";
import { GameObject } from "../gameObjects.js";
import { Direction } from "../direction.js";

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
