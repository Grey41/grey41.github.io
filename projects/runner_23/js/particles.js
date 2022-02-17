"use strict"

class Particle extends Base {
    constructor(pos, size, time, speed) {
        super(pos, size)

        this.time = time
        this.speed = speed
    }

    update() {
        this.pos.x += this.speed.x
        this.pos.y += this.speed.y
        this.time --
    }

    singleParticle(method) {
        const merged = margin => {
            this.pos.x -= margin.x
            this.pos.y -= margin.y

            if (margin.x)
                this.speed.x = -Math.sign(margin.x) * Math.abs(this.speed.x) * PARTICLE_DAMPING

            if (margin.y)
                this.speed.y = -Math.sign(margin.y) * Math.abs(this.speed.y) * PARTICLE_DAMPING
        }

        world.gridCollide(this).forEach(i => {
            if (world.grid[i] instanceof Wall) {
                const margin = this.findOverlap(world.grid[i])
                method && method(margin)
                merged(margin)
            }
        })

        world.actors.forEach(e => {
            if (e instanceof Lift) {
                const margin = this.findOverlap(e)
                method && method(margin)
                merged(margin)

                if (margin.x || margin.y)
                    this.pos.y += e.speed
            }
        })

        this.speed.y += GRAVITY * this.size
        this.speed.x *= PARTICLE_DAMPING
        this.speed.y *= PARTICLE_DAMPING
    }
}

class Egg extends Particle {
    constructor(pos, speed) {
        super(pos, EGG_SIZE, EGG_HATCH_TIMER, speed)
    }

    update() {
        super.update()
        this.singleParticle()

        ctx.fillStyle = plainColor(EGG_COLOR)
        this.drawRect()

        if (!this.time) {
            const duck = new Duck({x: this.pos.x, y: this.pos.y})

            world.particles.push(new Puff(
                {x: this.pos.x, y: this.pos.y},
                {x: EGG_SIZE, y: EGG_SIZE},
                ITEM_PUFF_COLOR, 5))

            world.actors.push(duck)
            duck.size = EGG_SIZE
            duck.velocity = -EGG_HATCH_SPEED
        }
    }
}

class Smoke extends Particle {
    constructor(pos, angle, color) {
        super(pos, SMOKE_MIN_SIZE, SMOKE_LIFETIME * Math.random(), {
            x: Math.sin(angle) * SMOKE_SPEED,
            y: Math.cos(angle) * SMOKE_SPEED
        })
        
        this.color = color
    }

    update() {
        super.update()

        const total = Math.abs(this.speed.x) + Math.abs(this.speed.y)
        this.size += (SMOKE_MAX_SIZE - this.size) * SMOKE_GROWTH_SPEED

        if (total > SMOKE_SPEED) {
            this.speed.x *= SMOKE_SPEED / total
            this.speed.y *= SMOKE_SPEED / total
        }

        if (this.collidesWith(player)) {
            player.health -= SMOKE_HEALTH_DECREASE

            if (player.health < 0)
                player.die()
        }

        world.gridCollide(this).forEach(i => {
            if (world.grid[i] instanceof Wall) {
                const margin = this.findOverlap(world.grid[i])

                if (margin.x)
                    this.speed.x -= margin.x * SMOKE_COLLISION_RESPONSE

                if (margin.y)
                    this.speed.y -= margin.y * SMOKE_COLLISION_RESPONSE
            }
        })

        ctx.fillStyle = addAlpha(plainColor(this.color), this.time / SMOKE_LIFETIME)
        this.drawRect()
    }
}

class Bubble extends Particle {
    constructor(pos, angle) {
        super(pos, BUBBLE_MIN_SIZE, BUBBLE_LIFETIME * Math.random(), {
            x: Math.sin(angle) * BUBBLE_SPEED,
            y: Math.cos(angle) * BUBBLE_SPEED
        })
    }

    update() {
        super.update()

        this.size += (BUBBLE_MAX_SIZE - this.size) * BUBBLE_GROWTH_SPEED

        ctx.lineWidth = 2
        ctx.strokeStyle = addAlpha(plainColor(BUBBLE_COLOR), this.time / BUBBLE_LIFETIME)
        ctx.strokeRect(
            this.realPos.x - this.realSize / 2,
            this.realPos.y - this.realSize / 2,
            this.realSize, this.realSize)
    }
}

class Bomb extends Particle {
    constructor(pos, speed) {
        super(pos, BOMB_SIZE, BOMB_TIMER, speed)
        this.onGround = false
    }

    update() {
        let ground = false
        super.update()

        this.singleParticle(margin => {
            if (margin.y > 0)
                ground = true
        })

        if (!this.onGround && ground)
            world.particles.push(new Puff(
                {x: this.pos.x, y: this.pos.y},
                {x: this.size, y: this.size},
                ITEM_PUFF_COLOR, 5))

        this.onGround = ground

        if (!this.time) {
            camera.shake()

            const left = Math.round(this.pos.x - BOMB_EXPLOSION_SIZE / 2)
            const right = Math.round(this.pos.x + BOMB_EXPLOSION_SIZE / 2)
            const top = Math.round(this.pos.y - BOMB_EXPLOSION_SIZE / 2)
            const bottom = Math.round(this.pos.y + BOMB_EXPLOSION_SIZE / 2)

            world.iterateGrid(left, right, top, bottom, (x, y) => {
                const index = world.findIndex({x, y})
                const below = world.grid[index + world.size.x]

                if (!(world.grid[index] instanceof Wall)) {
                    world.particles.push(new Spark({x, y}))

                    if (below instanceof Wall)
                        for (let i = 0; i < rand(PLANT_MIN_CHANCE, PLANT_MAX_CHANCE); i ++)
                            world.actors.push(new Plant(
                                {x: x + Math.random() - 0.5, y: y + 0.5}))
                }
            })
        }

        ctx.fillStyle = plainColor(ITEM_COLOR)
        this.drawRect()
    }
}

class Puff {
    constructor(pos, area, color, density) {
        this.color = color
        this.time = PUFF_LIFETIME
        this.data = []

        for (let i = 0; i < density; i ++) {
            const item = new Base({
                x: pos.x + (Math.random() - 0.5) * area.x,
                y: pos.y + (Math.random() - 0.5) * area.y
            }, PUFF_SIZE * (Math.random() / 2 + 0.5))

            this.data.push(item)
            item.speed = PUFF_SPEED * Math.random()
        }
    }

    update() {
        ctx.fillStyle = plainColor(this.color)

        this.data.forEach(item => {
            const size = realSize(this.time / PUFF_LIFETIME * item.size)
            item.pos.y -= item.speed

            ctx.fillRect(
                realPos(item.pos).x - size / 2,
                realPos(item.pos).y - size / 2,
                size, size)
        })

        this.time --
    }
}

class Spark {
    constructor(pos) {
        this.data = []
        this.time = SPARK_LIFETIME
        this.pos = pos

        for (let i = 0; i < SPARK_DENSITY; i ++)
            this.data.push({
                pos: {x: Math.random() - 0.5, y: Math.random() - 0.5},
                speed: SPARK_SPEED * Math.random(),
                size: SPARK_SIZE * (Math.random() / 2 + 0.5),
                color: plainColor(greenColor())
            })
    }

    update() {
        this.data.forEach(item => {
            const size = realSize(this.time / SPARK_LIFETIME * item.size)
            item.pos.y -= item.speed
            item.pos.x += (Math.random() - 0.5) * SPARK_WOBBLE

            ctx.fillStyle = this.time > SPARK_LIFETIME * 0.9 ? "#fff" : item.color
            ctx.fillRect(
                realPos(this.pos).x + realSize(item.pos.x) - size / 2,
                realPos(this.pos).y + realSize(item.pos.y) - size / 2,
                size, size)
        })

        this.time --
    }
}