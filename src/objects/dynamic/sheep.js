import { vec2, Color, rand, randVector, keyWasPressed, Timer } from "littlejsengine";

import { Direction } from "../direction.js";
import { DynamicObject } from "./dynamicObjects.js";
import { PlayerDog } from "./playerDog.js";
import { spriteAtlas } from "../../scripts/spriteAtlas.js";

export class SheepIndexer {
    constructor() {
        this.arr = new Array();
    }
    add(obj) {
        this.arr.push(obj);
    }
    all() {
        return this.arr;
    }
    within(obj, radius) {
        return this.arr.filter((o) => {
            return (
                obj.pos.x >= o.pos.x - radius &&
                obj.pos.x <= o.pos.x + radius &&
                obj.pos.y >= o.pos.y - radius &&
                obj.pos.y <= o.pos.y + radius &&
                o.pos.distance(obj.pos) <= radius
            );
        });
    }
}

export class Sheep extends DynamicObject {
    static flock = new SheepIndexer();

    constructor(pos) {
        super({
            pos: pos,
            size: vec2(1),
        });
        this.spriteAtlasAnimation = spriteAtlas.sheep.idle;
        Sheep.flock.add(this);

        // Behavior variables
        this.prance_velocity = 0.07;
        this.waddle_velocity = 0.03;

        // Avoid player parameters
        this.avoid_player_radius = 3;

        this.avoid_player_seconds = 1;
        this.avoid_player_timer = new Timer();

        // Avoid bark parameters
        this.avoid_bark_radius = 8;
        this.avoid_bark_pct_prance = 0.6;

        this.avoid_bark_seconds = 2.5;
        this.avoid_bark_timer = new Timer();

        // Meander parameters
        this.meander_velocity = 0.025;
        this.meander_chance = 0.003;

        this.meander_seconds = 0.5;
        this.meander_timer = new Timer();
    }

    prance() {
        this.objectSpeed = this.prance_velocity;
        this.spriteAtlasAnimation = spriteAtlas.sheep.prance;
    }

    waddle() {
        this.objectSpeed = this.waddle_velocity;
        this.spriteAtlasAnimation = spriteAtlas.sheep.waddle;
    }

    graze() {
        this.objectSpeed = 0;
        this.spriteAtlasAnimation = spriteAtlas.sheep.graze;
    }

    sleep() {
        this.objectSpeed = 0;
        this.spriteAtlasAnimation = spriteAtlas.sheep.sleep;
    }

    getPlayerAntiDirection() {
        return Direction.determineDirection(this.pos.subtract(PlayerDog.player1.pos).normalize());
    }
    getRandomDirection() {
        return Direction.determineDirection(randVector(1));
    }

    update() {
        super.update();
        const player_dist = this.pos.distance(PlayerDog.player1.pos);

        // Start behavoir timers
        if (keyWasPressed("Space") && player_dist <= this.avoid_bark_radius) {
            // Start startled timer when player barks
            this.avoid_bark_timer.set(this.avoid_bark_seconds);
        } else if (player_dist <= this.avoid_player_radius) {
            // Avoid the player within a protected range
            this.avoid_player_timer.set(this.avoid_player_seconds);
        } else if (rand(0, 1) < this.meander_chance) {
            // Meander randomly
            this.meander_timer.set(this.meander_seconds);
        }

        if (this.avoid_bark_timer.active()) {
            // Avoid the player after bark
            this.direction = this.getPlayerAntiDirection();
            if (this.avoid_bark_timer.getPercent() < this.avoid_bark_pct_prance) {
                this.prance();
            } else {
                this.waddle();
            }
            this.color = new Color(
                1,
                this.avoid_bark_timer.getPercent(),
                this.avoid_bark_timer.getPercent(),
                1,
            );
        } else if (this.avoid_player_timer.active()) {
            this.direction = this.getPlayerAntiDirection();
            this.waddle();
        } else if (this.meander_timer.active()) {
            if (this.meander_timer.getPercent() == 1) {
                this.direction = this.getRandomDirection();
            }
            this.waddle();
        } else {
            // If no forces, stop and graze
            this.graze();
        }
    }

    render() {
        this.dynamicRender();
    }
}
