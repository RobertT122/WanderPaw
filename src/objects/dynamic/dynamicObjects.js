import { tile, drawTile, vec2, timeDelta } from "littlejsengine";
import { GameObject } from "../gameObjects.js";

export class DynamicObject extends GameObject {
    cachedTime = 0;
    animationIncrement = 0;
    animationSpeed = 1;
    animationDirection = "DOWN";

    constructor(args) {
        super(args);
        this.setCollision(true, true);
        this.size = vec2(2);
    }
    
    faceDown = () => this.animationDirection = "DOWN";
    faceDownLeft = () => this.animationDirection = "DOWN_LEFT";
    faceLeft = () => this.animationDirection = "LEFT";
    faceUpLeft = () => this.animationDirection = "UP_LEFT";
    faceUp = () => this.animationDirection = "UP";
    faceUpRight = () => this.animationDirection = "UP_RIGHT";
    faceRight = () => this.animationDirection = "RIGHT";
    faceDownRight = () => this.animationDirection = "DOWN_RIGHT";

    moveDown(speed){
        this.faceDown()
        this.animationSpeed = 1;
        this.pos += speed * vec2(0, -1);
    }
    moveDownLeft(speed){ 
        this.faceDownLeft()
        this.animationSpeed = 1;
        this.pos += speed * vec2(-0.7071, -0.7071);
    }
    moveLeft(speed){ 
        this.faceLeft();
        this.animationSpeed = 1;
        this.pos += speed * vec2(-1, 0);
    }
    moveUpLeft(speed){ 
        this.faceUpLeft();
        this.animationSpeed = 1;
        this.pos += speed * vec2(-0.7071, 0.7071);
    }
    moveUp(speed){ 
        this.faceUp();
        this.animationSpeed = 1;
        this.pos += speed * vec2(0, 1);
    }
    moveUpRight(speed){ 
        this.faceUpRight();
        this.animationSpeed = 1;
        this.pos += speed * vec2(0.7071, 0.7071);
    }
    moveRight(speed){ 
        this.faceRight();
        this.animationSpeed = 1;
        this.pos += speed * vec2(1, 0);
    }
    moveDownRight(speed){ 
        this.faceDownRight();
        this.animationSpeed = 1;
        this.pos += speed * vec2(0.7071, -0.7071);
    }

    dynamicRender(spriteAtlasAnimation) {
        var pattern = spriteAtlasAnimation.pattern;
        var timing = spriteAtlasAnimation.timing;
        var mirror = false;
        
        this.animationIncrement = this.animationIncrement % pattern.length;
        var index = pattern[this.animationIncrement];

        this.cachedTime += timeDelta * 500 * this.animationSpeed;
        if (this.cachedTime >= timing[this.animationIncrement]) {
            this.cachedTime = 0;
            this.animationIncrement++;
            console.log(this.velocity.angle());
        }

        //todo: calculate the direction to face:
        switch (this.animationDirection) {
            case "DOWN":
                //down
                mirror = false;
                this.tileInfo = tile(spriteAtlasAnimation.down[index]);
                break;
            case "DOWN_LEFT":
                //down left
                mirror = false;
                this.tileInfo = tile(spriteAtlasAnimation.downLeft[index]);
                break;
            case "LEFT":
                //left
                mirror = false;
                this.tileInfo = tile(spriteAtlasAnimation.left[index]);
                break;
            case "UP_LEFT":
                //up left
                mirror = false;
                this.tileInfo = tile(spriteAtlasAnimation.upLeft[index]);
                break;
            case "UP":
                //up
                mirror = false;
                this.tileInfo = tile(spriteAtlasAnimation.up[index]);
                break;
            case "UP_RIGHT":
                //up right
                mirror = true;
                this.tileInfo = tile(spriteAtlasAnimation.upLeft[index]);
                break;
            case "RIGHT":
                //right
                mirror = true;
                this.tileInfo = tile(spriteAtlasAnimation.left[index]);
                break;
            case "DOWN_RIGHT":
                //down right
                mirror = true;
                this.tileInfo = tile(spriteAtlasAnimation.downLeft[index]);
                break;
        }

        drawTile(this.pos, this.size, this.tileInfo, this.color, this.angle, mirror);
    }
}
