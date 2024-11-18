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
    rand,
    randVector,
    canvasFixedSize,
    cameraPos,
    drawRect,
    EngineObject,
    mousePos,
    drawTextScreen,
    mainCanvasSize,
    keyWasPressed,
} from "littlejsengine";

/*
    Little JS Breakout Tutorial
    - Shows how to make a simple breakout game
    - Includes sound and particles
    - Control with mouse or touch
*/

///////////////////////////////////////////////////////////////////////////////

// globals
const levelSize = vec2(38, 20); // size of play area
let player; // keep track of player's player
let flock = []; // keep track of all sheep objects

///////////////////////////////////////////////////////////////////////////////

class PlayerDog extends EngineObject {
    constructor() {
        super(mousePos, vec2(0.6)); // set object position and size
        this.setCollision(); // make object collide
        // this.mass = 0; // make object have static physics
        this.color = new Color(130 / 256, 70 / 256, 30 / 256, 1);
    }

    update() {
        this.pos = mousePos; // move player to mouse
    }
}

class Sheep extends EngineObject {
    constructor(pos) {
        super(pos, vec2(0.5)); // set object position and size

        this.color = new Color();

        this.startled_pct = 0;

        this.velocity = vec2(0);
        this.setCollision(); // make object collide
        flock.push(this);
    }
    update() {
        super.update();

        const max_velocity = 0.1;

        // Player interaction parameters
        const avoid_player_radius = 1.1;
        const avoid_player_factor = 0.1;

        const avoid_bark_radius = 8;
        const avoid_bark_factor = 1;

        const herding_player_radius = 6;

        // Boid/herding parameters
        const protected_sheep_radius = 0.6;
        const visible_sheep_radius = 3;

        const avoid_sheep_factor = 0.005;
        const match_sheep_factor = 0.05;
        const align_sheep_factor = 0.003;

        // Meandering parameters
        const meander_chance = 0.003;
        const meander_factor = 0.06;
        const meander_started_hurdle = 0.25;

        // Movement parameters
        const startled_cooldown = 0.995;
        const min_friction = 0.95;
        const max_friction = 0.995;

        const player_dist = this.pos.distance(player.pos);

        // Avoid the player within a protected range
        if (player_dist <= avoid_player_radius) {
            const avoid_player_force = this.pos
                .subtract(player.pos)
                .normalize()
                .scale((player_dist / avoid_player_radius) * avoid_player_factor);
            this.velocity = this.velocity.add(avoid_player_force);
        }

        // Avoid the player after bark
        if (keyWasPressed("KeyB") && player_dist <= avoid_bark_radius) {
            this.startled_pct = 1;
            const avoid_player_bark_force = this.pos
                .subtract(player.pos)
                .normalize()
                .scale(avoid_bark_factor);
            this.velocity = this.velocity.add(avoid_player_bark_force);
        }

        // Enable boid/herding behavior when nearby the player
        if (player_dist <= herding_player_radius) {
            const visible_sheep = flock.filter(
                (sheep) => this.pos.distance(sheep.pos) <= visible_sheep_radius,
            );
            const avoided_sheep = visible_sheep.filter(
                (sheep) => this.pos.distance(sheep.pos) <= protected_sheep_radius,
            );

            // Avoid other sheep within a protected range
            const avoid_sheep_force = avoided_sheep.reduce(
                (total, sheep) => total.add(this.pos.subtract(sheep.pos).scale(avoid_sheep_factor)),
                vec2(0),
            );

            // Align velocity of other sheep within a visual range
            const sheep_to_match_avg_velocity = visible_sheep
                .reduce((total, sheep) => total.add(sheep.velocity), vec2(0))
                .scale(1 / visible_sheep.length);

            const match_sheep_force = sheep_to_match_avg_velocity
                .subtract(this.velocity)
                .scale(match_sheep_factor);

            // Align direction with other sheep in visual range
            const sheep_to_align = visible_sheep;
            const sheep_to_align_avg_pos = sheep_to_align
                .reduce((total, sheep) => total.add(sheep.pos), vec2(0))
                .scale(1 / visible_sheep.length);

            const align_sheep_force = sheep_to_align_avg_pos
                .subtract(this.pos)
                .scale(align_sheep_factor);

            // Sheep show stronger herding behavior when startled
            const boid_force = avoid_sheep_force
                .add(match_sheep_force)
                .add(align_sheep_force)
                .scale(this.startled_pct);
            this.velocity = this.velocity.add(boid_force);
        }

        // Meander if not started
        if (this.startled_pct < meander_started_hurdle && rand(0, 1) < meander_chance) {
            const meander_force = randVector(meander_factor);
            this.velocity = this.velocity.add(meander_force);
        }

        // Cap velocity after applying other forces
        const friction = this.startled_pct * (max_friction - min_friction) + min_friction;
        this.startled_pct = startled_cooldown * this.startled_pct;
        this.velocity = this.velocity.scale(friction);
        this.velocity = this.velocity.clampLength(max_velocity);

        this.color = new Color(1, 1 - this.startled_pct, 1 - this.startled_pct, 1);
    }
}

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

    player = new PlayerDog(); // create player's player

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
            flock.length +
            "\navg startled %" +
            Math.round((flock.reduce((t, s) => t + s.startled_pct, 0) / flock.length) * 100) / 100,
        vec2(mainCanvasSize.x / 2, 70),
        30,
    ); // show score
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);
