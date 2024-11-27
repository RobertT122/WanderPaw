import { vec2, Color, rand, randVector, keyWasPressed } from "littlejsengine";

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
            color: new Color(),
        });
        console.log(this.pos);
        Sheep.flock.add(this);
        console.log(this.pos);

        // State variables
        this.startled_pct = 0;

        // Behavior variables
        this.max_velocity = 0.1;

        // Player interaction parameters
        this.avoid_player_radius = 1.1;
        this.avoid_player_factor = 0.1;

        this.avoid_bark_radius = 8;
        this.avoid_bark_factor = 1;

        this.herding_player_radius = 6;

        // Boid/herding parameters
        this.protected_sheep_radius = 0.6;
        this.visible_sheep_radius = 3;

        this.avoid_sheep_factor = 0.005;
        this.match_sheep_factor = 0.07;
        this.align_sheep_factor = 0.01;

        // Meandering parameters
        this.meander_chance = 0.003;
        this.meander_factor = 0.06;
        this.meander_started_hurdle = 0.25;

        // Movement parameters
        this.startled_cooldown = 0.995;
        this.min_friction = 0.95;
        this.max_friction = 0.995;
    }

    update() {
        super.update();
        const player_dist = this.pos.distance(PlayerDog.player1.pos);

        // Avoid the player within a protected range
        if (player_dist <= this.avoid_player_radius) {
            const avoid_player_force = this.pos
                .subtract(PlayerDog.player1.pos)
                .normalize()
                .scale(this.avoid_player_factor);
            this.velocity = this.velocity.add(avoid_player_force);
        }

        // Avoid the player after bark
        if (keyWasPressed("Space") && player_dist <= this.avoid_bark_radius) {
            this.startled_pct = 1;
            const avoid_player_bark_force = this.pos
                .subtract(PlayerDog.player1.pos)
                .normalize()
                .scale(this.avoid_bark_factor);
            this.velocity = this.velocity.add(avoid_player_bark_force);
        }

        // Enable boid/herding behavior when nearby the player
        if (player_dist <= this.herding_player_radius) {
            const visible_sheep = Sheep.flock.within(this, this.visible_sheep_radius);
            const avoided_sheep = Sheep.flock.within(this, this.protected_sheep_radius);

            // Avoid other sheep within a protected range
            const avoid_sheep_force = avoided_sheep.reduce(
                (total, sheep) =>
                    total.add(this.pos.subtract(sheep.pos).scale(this.avoid_sheep_factor)),
                vec2(0),
            );

            // Align velocity of other sheep within a visual range
            const sheep_to_match_avg_velocity = visible_sheep
                .reduce((total, sheep) => total.add(sheep.velocity), vec2(0))
                .scale(1 / visible_sheep.length);

            const match_sheep_force = sheep_to_match_avg_velocity
                .subtract(this.velocity)
                .scale(this.match_sheep_factor);

            // Align direction with other sheep in visual range
            const sheep_to_align = visible_sheep;
            const sheep_to_align_avg_pos = sheep_to_align
                .reduce((total, sheep) => total.add(sheep.pos), vec2(0))
                .scale(1 / visible_sheep.length);

            const align_sheep_force = sheep_to_align_avg_pos
                .subtract(this.pos)
                .scale(this.align_sheep_factor);

            // Sheep show stronger herding behavior when startled
            const boid_force = avoid_sheep_force
                .add(match_sheep_force)
                .add(align_sheep_force)
                .scale(this.startled_pct);
            this.velocity = this.velocity.add(boid_force);
        }

        // Meander if not started
        if (this.startled_pct < this.meander_started_hurdle && rand(0, 1) < this.meander_chance) {
            const meander_force = randVector(this.meander_factor);
            this.velocity = this.velocity.add(meander_force);
        }

        // Cap velocity after applying other forces
        const friction =
            this.startled_pct * (this.max_friction - this.min_friction) + this.min_friction;
        this.startled_pct = this.startled_cooldown * this.startled_pct;
        this.velocity = this.velocity.scale(friction);
        this.velocity = this.velocity.clampLength(this.max_velocity);

        this.color = new Color(1, 1 - this.startled_pct, 1 - this.startled_pct, 1);
    }

    renderGraze = () => this.spriteAtlasAnimation = spriteAtlas.sheep.graze;
    renderPrance = () => this.spriteAtlasAnimation = spriteAtlas.sheep.prance;
    renderWaddle = () => this.spriteAtlasAnimation = spriteAtlas.sheep.waddle;
    renderSleep = () => this.spriteAtlasAnimation = spriteAtlas.sheep.sleep;

    waddleSlow() {
        this.renderWaddle();
        this.fixedSpeed = 1;
    }

    render() {
        this.dynamicRender()
    }
}
