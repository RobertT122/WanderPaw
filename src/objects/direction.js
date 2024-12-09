import { vec2 } from "littlejsengine";

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
