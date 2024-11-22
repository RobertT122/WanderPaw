import { GameObject } from "../gameObjects.js";

export class StaticObject extends GameObject {
    constructor(args) {
        super(args);
        this.setCollision(true, true);
    }
}
