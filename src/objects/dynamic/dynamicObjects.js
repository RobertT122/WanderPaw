import { GameObject } from "../gameObjects.js";

export class DynamicObject extends GameObject {
    constructor(args) {
        super(args);
        this.setCollision(true, true);
    }

    update() {
        super.update();
    }

    destroy() {
        super.destroy();
    }
}
