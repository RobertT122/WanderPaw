/*
    Little JS Breakout Game
    - A simple breakout game
    - Includes sound and particles
    - Uses a post processing effect
    - Control with mouse, touch, or gamepad
*/

import {
    engineInit,
    vec2,
    Color,
    canvasFixedSize,
    cameraPos,
    drawRect,
    EngineObject,
    mousePos,
    drawTextScreen,
    mainCanvasSize,
    keyWasPressed,
} from "littlejsengine";

import { PlayerDog } from "./objects/dynamic/playerDog.js";
import { Sheep } from "./objects/dynamic/sheep.js";

/*
    Little JS Breakout Tutorial
    - Shows how to make a simple breakout game
    - Includes sound and particles
    - Control with mouse or touch
*/

///////////////////////////////////////////////////////////////////////////////

// globals
const levelSize = vec2(38, 20); // size of play area

///////////////////////////////////////////////////////////////////////////////

class Wall extends EngineObject {
    constructor(pos, size) {
        super(pos, size); // set object position and size

        this.setCollision(); // make object collide
        this.mass = 0; // make object have static physics
        this.color = new Color(0.5, 0.5, 0.5); // make object invisible
    }
}

///////////////////////////////////////////////////////////////////////////////
function gameInit() {
    cameraPos.set(levelSize.scale(0.5).x, levelSize.scale(0.5).y); // center camera in level
    canvasFixedSize.set(1280, 720); // use a 720p fixed size canvas

    new PlayerDog(mousePos); // create player's player

    // create walls
    new Wall(vec2(-0.5, levelSize.y / 2), vec2(1, 100)); // top
    new Wall(vec2(-0.5, levelSize.y + 0.5), vec2(1, 100)); // bottom
    new Wall(vec2(levelSize.x + 0.5, levelSize.y / 2), vec2(1, 100)); // left
    new Wall(vec2(levelSize.x / 2, levelSize.y + 0.5), vec2(100, 1)); // right
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
    if (keyWasPressed("KeyS")) {
        new Sheep(mousePos);
    }
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost() {}

///////////////////////////////////////////////////////////////////////////////
function gameRender() {
    drawRect(cameraPos, vec2(100), new Color(160 / 256, 200 / 256, 140 / 256)); // draw background
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost() {
    drawTextScreen(
        "# sheep " +
            Sheep.flock.all().length +
            "\navg startled %" +
            Math.round(
                (Sheep.flock.all().reduce((t, s) => t + s.startled_pct, 0) /
                    Sheep.flock.all().length) *
                    100,
            ) /
                100,
        vec2(mainCanvasSize.x / 2, 70),
        30,
    ); // show score
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);
