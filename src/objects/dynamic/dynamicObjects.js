import { tile, drawTile, timeDelta, PI } from "littlejsengine";
import { GameObject } from "../gameObjects.js";

export class DynamicObject extends GameObject {
    cachedTime = 0;
    animationIncrement = 0;
    animationSpeed = 1;
    animationDirection = "DOWN";
    max_Velocity = 0.15;
    spriteAtlasAnimation;
    fixedSpeed;

    constructor(args) {
        super(args);
        this.setCollision(true, true);

        // this.objectSpeed = stopped, walk, run
        // this.animationState = animation type
    }

    update() {
        super.update();

        const angle_in_degrees = 180 / PI * this.velocity.angle();
        this.forwardDirection = Math.round((angle_in_degrees / 45 + 4) % 8);

        // Snap angles to 8 directional
        this.velocity.setAngle((this.forwardDirection - 4) * 45 * PI / 180, this.velocity.length());
    }
    
    faceDown = () => this.animationDirection = "DOWN";
    faceDownLeft = () => this.animationDirection = "DOWN_LEFT";
    faceLeft = () => this.animationDirection = "LEFT";
    faceUpLeft = () => this.animationDirection = "UP_LEFT";
    faceUp = () => this.animationDirection = "UP";
    faceUpRight = () => this.animationDirection = "UP_RIGHT";
    faceRight = () => this.animationDirection = "RIGHT";
    faceDownRight = () => this.animationDirection = "DOWN_RIGHT";

    moveDown(){
        this.faceDown();
        this.animationSpeed = 1;
        this.velocity.set(vec2(0,-1).scale(this.fixedSpeed));
    }
    moveDownLeft(){ 
        this.faceDownLeft();
        this.animationSpeed = 1;
        this.velocity.set(vec2(-0.7071, -0.7071).scale(this.fixedSpeed));
    }
    moveLeft(){ 
        this.faceLeft();
        this.animationSpeed = 1;
        this.velocity.set(vec2(-1, 0).scale(this.fixedSpeed));
    }
    moveUpLeft(){ 
        this.faceUpLeft();
        this.animationSpeed = 1;
        this.velocity.set(vec2(-0.7071, 0.7071).scale(this.fixedSpeed));
    }
    moveUp(){ 
        this.faceUp();
        this.animationSpeed = 1;
        this.velocity.set(vec2(0, 1).scale(this.fixedSpeed));
    }
    moveUpRight(){ 
        this.faceUpRight();
        this.animationSpeed = 1;
        this.velocity.set(vec2(0.7071, 0.7071).scale(this.fixedSpeed));
    }
    moveRight(){ 
        this.faceRight();
        this.animationSpeed = 1;
        this.velocity.set(vec2(1, 0).scale(this.fixedSpeed));
    }
    moveDownRight(){ 
        this.faceDownRight();
        this.animationSpeed = 1;
        this.velocity.set(vec2(0.7071, -0.7071).scale(this.fixedSpeed));
    }

    dynamicRender() {
        var pattern = this.spriteAtlasAnimation.pattern;
        var timing = this.spriteAtlasAnimation.timing;
        var mirror = false;
        
        this.animationIncrement = this.animationIncrement % pattern.length;
        var index = pattern[this.animationIncrement];

        this.cachedTime += timeDelta * 500 * this.animationSpeed;
        if (this.cachedTime >= timing[this.animationIncrement]) {
            this.cachedTime = 0;
            this.animationIncrement++;
            console.log(this.velocity.angle());
        }

        switch (this.animationDirection) {
            case "DOWN":
                //down
                mirror = false;
                this.tileInfo = tile(this.spriteAtlasAnimation.down[index]);
                break;
            case "DOWN_LEFT":
                //down left
                mirror = false;
                this.tileInfo = tile(this.spriteAtlasAnimation.downLeft[index]);
                break;
            case "LEFT":
                //left
                mirror = false;
                this.tileInfo = tile(this.spriteAtlasAnimation.left[index]);
                break;
            case "UP_LEFT":
                //up left
                mirror = false;
                this.tileInfo = tile(this.spriteAtlasAnimation.upLeft[index]);
                break;
            case "UP":
                //up
                mirror = false;
                this.tileInfo = tile(this.spriteAtlasAnimation.up[index]);
                break;
            case "UP_RIGHT":
                //up right
                mirror = true;
                this.tileInfo = tile(this.spriteAtlasAnimation.upLeft[index]);
                break;
            case "RIGHT":
                //right
                mirror = true;
                this.tileInfo = tile(this.spriteAtlasAnimation.left[index]);
                break;
            case "DOWN_RIGHT":
                //down right
                mirror = true;
                this.tileInfo = tile(this.spriteAtlasAnimation.downLeft[index]);
                break;
        }

        drawTile(this.pos, this.size, this.tileInfo, this.color, this.angle, mirror);
    }
}
