import {
    engineInit,
    vec2,
    Color,
    canvasFixedSize,
    cameraPos,
    drawRect,
    mousePos,
    drawTextScreen,
    mainCanvasSize,
    keyWasPressed,
} from "littlejsengine";

import { PlayerDog } from "./objects/dynamic/playerDog.js";
import { Sheep } from "./objects/dynamic/sheep.js";
import { Wall } from "./objects/static/wall.js";

import tiles from "./assets/sprites/tiles.png";

// Globals
const levelSize = vec2(38, 20); // Size of play area

function gameInit() {
    // Center camera in level
    cameraPos.set(levelSize.scale(0.5).x, levelSize.scale(0.5).y);

    // Use a 720p fixed size canvas
    canvasFixedSize.set(1280, 720);

    // Create player
    new PlayerDog(vec2(levelSize.x / 2, levelSize.y / 2));

    // create walls
    new Wall(vec2(-0.5, levelSize.y / 2), vec2(1, 100)); // Left
    new Wall(vec2(-0.5, levelSize.y + 0.5), vec2(1, 100)); // Bottom
    new Wall(vec2(levelSize.x + 0.5, levelSize.y / 2), vec2(1, 100)); // Left
    new Wall(vec2(levelSize.x / 2, levelSize.y + 0.5), vec2(100, 1)); // Right
}

function gameUpdate() {
    if (keyWasPressed("KeyF")) {
        new Sheep(mousePos);
    }
}

function gameUpdatePost() {
    cameraPos.set(PlayerDog.player1.pos.x, PlayerDog.player1.pos.y);
}

function gameRender() {
    // Draw background
    drawRect(cameraPos, vec2(100), new Color(160 / 256, 200 / 256, 140 / 256));
}

function gameRenderPost() {
    // Debug text for number of sheep and startled % statistics
    // drawTextScreen(
    //     "# sheep " +
    //         Sheep.flock.all().length +
    //         "\navg startled %" +
    //         Math.round(
    //             (Sheep.flock.all().reduce((t, s) => t + s.startled_pct, 0) /
    //                 Sheep.flock.all().length) *
    //                 100,
    //         ) /
    //             100,
    //     vec2(mainCanvasSize.x / 2, 70),
    //     30,
    // );
    drawTextScreen(
        "v=" + PlayerDog.player1.velocity +
        "\ntheta=" + PlayerDog.player1.velocity.angle() +
        "\ndir=" + PlayerDog.player1.forwardDirection,
        vec2(mainCanvasSize.x / 2, 70),
        30,
    );
}

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [tiles]);
