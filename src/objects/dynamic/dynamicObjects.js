import { tile, drawTile, vec2, timeDelta } from "littlejsengine";
import { GameObject } from "../gameObjects.js";

export class DynamicObject extends GameObject {
    cachedTime = 0;
    animationIncrement = 0;
    animationSpeed = 1;
    mirror = false;
    forwardDirection = 0;

    constructor(args) {
        super(args);
        this.setCollision(true, true);
        this.size = vec2(2);
    }

    dynamicRender(spriteAtlasAnimation) {
        var pattern = spriteAtlasAnimation.pattern;
        var timing = spriteAtlasAnimation.timing;

        this.animationIncrement = this.animationIncrement % pattern.length;
        var index = pattern[this.animationIncrement];

        this.cachedTime += timeDelta * 500 * this.animationSpeed;
        if (this.cachedTime >= timing[this.animationIncrement]) {
            this.cachedTime = 0;
            this.animationIncrement++;
            console.log(this.velocity.angle());
        }

        //todo: calculate the direction to face:
        switch (this.forwardDirection) {
            case 0:
                //down
                this.mirror = false;
                this.tileInfo = tile(spriteAtlasAnimation.down[index]);
                break;
            case 1:
                //down left
                this.mirror = false;
                this.tileInfo = tile(spriteAtlasAnimation.downLeft[index]);
                break;
            case 2:
                //left
                this.mirror = false;
                this.tileInfo = tile(spriteAtlasAnimation.left[index]);
                break;
            case 3:
                //up left
                this.mirror = false;
                this.tileInfo = tile(spriteAtlasAnimation.upLeft[index]);
                break;
            case 4:
                //up
                this.mirror = false;
                this.tileInfo = tile(spriteAtlasAnimation.up[index]);
                break;
            case 5:
                //up right
                this.mirror = true;
                this.tileInfo = tile(spriteAtlasAnimation.upLeft[index]);
                break;
            case 6:
                //right
                this.mirror = true;
                this.tileInfo = tile(spriteAtlasAnimation.left[index]);
                break;
            case 7:
                //down right
                this.mirror = true;
                this.tileInfo = tile(spriteAtlasAnimation.downLeft[index]);
                break;
        }

        drawTile(this.pos, this.size, this.tileInfo, this.color, this.angle, this.mirror);
    }
}
