"use strict"

class Plant extends Base {
    constructor(pos) {
        super({x: pos.x, y: pos.y - PLANT_BOUNDARY_SIZE / 2}, PLANT_BOUNDARY_SIZE)

        this.base = {angle: Math.PI, length: 0, split: []}
        this.maxStems = rand(PLANT_MIN_STEMS, PLANT_MAX_STEMS)
        this.stemCount = 1
    }

    update() {
        if (!this.onScreen()) return

        if (this.collidesWith(player))
            player.health += PLANT_HEALTH_INCREASE

        const updateSegment = (segment, pos) => {
            pos.x += Math.sin(segment.angle) * segment.length
            pos.y += Math.cos(segment.angle) * segment.length

            const speed = (1 - this.stemCount / this.maxStems) * Math.random()
            const item = world.grid[world.findIndex({x: Math.round(pos.x), y: Math.round(pos.y)})]

            segment.angle += (Math.random() - 0.5) * speed * 0.1
            ctx.lineTo(realPos(pos).x, realPos(pos).y)

            if (segment.leaf) {
                segment.leaf.size += (segment.leaf.goal - segment.leaf.size) * PLANT_FOLIAGE_GROWTH_SPEED
                segment.leaf.angle += (Math.random() - 0.5) * speed * 0.5

                if (!segment.leaf.time) {
                    world.particles.push(new Bubble({x: pos.x, y: pos.y}, Math.PI))
                    segment.leaf.time = PLANT_LEAF_BUBBLE_TIMER
                }

                if (item instanceof Water)
                    segment.leaf.time --

                ctx.save()
                ctx.translate(realPos(pos).x, realPos(pos).y)
                ctx.rotate(segment.leaf.angle)
                ctx.fillStyle = segment.leaf.color
                ctx.fillRect(
                    0, 0, realSize(segment.leaf.size),
                    realSize(segment.leaf.size))

                ctx.restore()

                world.particles.forEach((item, index) => {
                    if (item instanceof Smoke &&
                        pos.x + segment.leaf.size / 2 > item.left &&
                        pos.x - segment.leaf.size / 2 < item.right &&
                        pos.y + segment.leaf.size / 2 > item.top &&
                        pos.y - segment.leaf.size / 2 < item.bottom)
                            world.particles.splice(index, 1)
                })
            }

            if (segment.flower) {
                segment.flower.size += (segment.flower.goal - segment.flower.size) * PLANT_FOLIAGE_GROWTH_SPEED
                segment.flower.angle += (Math.random() - 0.5) * speed * 0.5

                ctx.save()
                ctx.translate(realPos(pos).x, realPos(pos).y)
                ctx.rotate(segment.flower.angle)
                ctx.fillStyle = segment.flower.color

                for (let i = 0; i < 3; i ++) {
                    ctx.rotate(Math.PI * 2 / 3)
                    ctx.fillRect(
                        0, 0, realSize(segment.flower.size),
                        realSize(segment.flower.size))
                }

                ctx.fillStyle = plainColor(PLANT_FLOWER_POLLEN_COLOR)
                ctx.fillRect(
                    realSize(segment.flower.size) / -2,
                    realSize(segment.flower.size) / -2,
                    realSize(segment.flower.size),
                    realSize(segment.flower.size))

                ctx.restore()
            }

            if (segment.split.length)
                segment.split.forEach(e => {
                    ctx.moveTo(realPos(pos).x, realPos(pos).y)
                    updateSegment(e, {x: pos.x, y: pos.y})
                })

            else if (segment.length > PLANT_STEM_LENGTH) {
                if (this.stemCount < this.maxStems) {
                    for (let i = 0; i < rand(1, 2); i ++) {
                        if (this.stemCount >= this.maxStems) break

                        segment.split.push({
                            angle: segment.angle + Math.random() - 0.5,
                            length: 0, split: []
                        })

                        this.stemCount ++
                    }

                    const randomSize = () => {
                        const min = PLANT_FOLIAGE_MIN_SIZE
                        return Math.random() * (PLANT_FOLIAGE_MAX_SIZE - min) + min
                    }

                    if (!rand(0, PLANT_LEAF_CHANCE))
                        segment.leaf = {
                            size: 0, goal: randomSize(),
                            color: plainColor(greenColor()),
                            time: PLANT_LEAF_BUBBLE_TIMER,
                            angle: Math.PI * Math.random() * 2
                        }

                    else if (!rand(0, PLANT_FLOWER_CHANCE) && !item)
                        segment.flower = {
                            size: 0, angle: 0,
                            color: plainColor(pastelColor()),
                            goal: randomSize()
                        }
                }
            }

            else segment.length += speed * 0.01 + 0.001
        }

        ctx.strokeStyle = plainColor(PLANT_COLOR)
        ctx.lineWidth = 2

        ctx.beginPath()
        ctx.moveTo(
            realPos(this.pos).x,
            realPos(this.pos).y + realSize(PLANT_BOUNDARY_SIZE / 2))

        updateSegment(this.base, {
            x: this.pos.x,
            y: this.pos.y + PLANT_BOUNDARY_SIZE / 2
        })

        ctx.stroke()
    }
}

class Lift extends Base {
    constructor(pos) {
        super(pos, LIFT_SIZE)

        this.pos = pos
        this.speed = LIFT_SPEED
    }

    update() {
        this.pos.y += this.speed

        world.gridCollide(this).forEach(i => {
            if (world.grid[i] instanceof Wall) {
                const margin = this.findOverlap(world.grid[i])

                this.pos.x -= margin.x
                this.pos.y -= margin.y

                if (margin.x || margin.y)
                    this.speed *= -1
            }
        })

        world.actors.forEach(e => {
            if (e instanceof Lift && e != this) {
                const margin = this.findOverlap(e)

                this.pos.x -= margin.x
                this.pos.y -= margin.y

                if (margin.x || margin.y) {
                    this.speed *= -1
                    e.speed *= -1
                }
            }
        })

        if (this.onScreen()) {
            ctx.fillStyle = plainColor(LIFT_COLOR)
            this.drawRect()
        }
    }
}

class Litter extends Base {
    constructor(pos) {
        super(pos, Math.random() * (LITTER_MAX_SIZE - LITTER_MIN_SIZE) + LITTER_MIN_SIZE)

        const color = Math.random() * 0.5
        const quarter = this.size / 4

        this.points = new Array(rand(LITTER_MIN_SEGMENTS, LITTER_MAX_SEGMENTS))
        this.color = [color, color, color]

        for (let i = 0; i < this.points.length; i ++) {
            const angle = i / this.points.length * 2 * Math.PI

            this.points[i] = {
                x: Math.sin(angle) * (Math.random() * quarter * 3 + quarter),
                y: Math.cos(angle) * (Math.random() * quarter * 3 + quarter)
            }
        }

        this.pos = {
            x: pos.x + Math.random() - 0.5,
            y: pos.y + 0.5 - this.points[0].y
        }
    }

    update() {
        if (this.onScreen()) {
            ctx.fillStyle = plainColor(this.color)
            ctx.beginPath()

            ctx.moveTo(
                this.realPos.x + realSize(this.points[this.points.length - 1]).x,
                this.realPos.y + realSize(this.points[this.points.length - 1]).y)

            this.points.forEach(item =>
                ctx.lineTo(
                    this.realPos.x + realSize(item.x),
                    this.realPos.y + realSize(item.y)))

            ctx.fill()
        }
    }
}

class Creature extends Base {
    constructor(pos, size) {
        super(pos, size)

        this.direction = 1
        this.angle = 0
    }

    turnAround() {
        if (this.direction) {
            const item = world.grid[world.findIndex({
                x: Math.round(this.pos.x + this.direction * this.size),
                y: Math.round(this.pos.y)
            })]

            if (item instanceof Wall)
                this.direction *= -1
        }
    }
}

class Fish extends Creature {
    constructor(pos) {
        super(pos, Math.random() * (FISH_MAX_SIZE - FISH_MIN_SIZE) + FISH_MIN_SIZE)

        this.time = 0
        this.color = pastelColor()
    }

    update() {
        this.angle += FISH_SPEED / this.size
        this.pos.x += (1 - Math.sin(this.angle)) * 0.01 * this.size * this.direction

        if (!this.time) {
            world.particles.push(new Bubble(
                {x: this.pos.x + this.size / 2 * this.direction, y: this.pos.y},
                Math.PI))

            this.time = rand(0, FISH_BUBBLE_TIMER)
        }

        this.turnAround()

        const angle = (Math.sin(this.angle) + 1) / 3 + 0.4
        const dark = plainColor([
            this.color[0] * 0.9,
            this.color[1] * 0.9,
            this.color[2] * 0.9
        ])

        ctx.fillStyle = dark
        ctx.save()
        ctx.translate(
            this.realPos.x - this.realSize / 3 * this.direction,
            this.realPos.y)

        const drawTailFin = () =>
            ctx.fillRect(
                0, this.realSize / -8,
                this.realSize / -2 * this.direction,
                this.realSize / 4)

        ctx.rotate(-angle)
        drawTailFin()
        ctx.rotate(angle * 2)
        drawTailFin()
        ctx.restore()

        ctx.fillStyle = plainColor(this.color)
        this.drawRect()

        ctx.fillStyle = dark
        ctx.save()
        ctx.translate(this.realPos.x, this.realPos.y)
        ctx.rotate(Math.sin(this.angle / 2) / 2)
        ctx.fillRect(
            0, 0, realSize(FISH_FIN_SIZE * this.size) * -this.direction,
            realSize(FISH_FIN_SIZE * this.size))

        ctx.restore()

        ctx.fillStyle = plainColor(FISH_EYE_COLOR)
        ctx.fillRect(
            this.realPos.x + this.realSize / 5 * this.direction - realSize(FISH_EYE_SIZE * this.size / 2),
            this.realPos.y - this.realSize / 5 - realSize(FISH_EYE_SIZE * this.size / 2),
            realSize(FISH_EYE_SIZE * this.size),
            realSize(FISH_EYE_SIZE * this.size))

        this.time --
    }
}

class Character extends Creature {
    constructor(pos, size) {
        super(pos, size)

        this.velocity = 0
        this.look = 1
        this.dead = false
        this.onGround = false
        this.inWater = false
        this.spring = 1
    }

    puff() {
        world.particles.push(new Puff(
            {x: this.pos.x, y: this.pos.y + this.size / 2},
            {x: this.size, y: 0}, CHARACTER_PUFF_COLOR, 5))
    }

    die() {
        if (!this.dead) {
            this.dead = true
            this.angle = 0
        }
    }

    destroy() {
        if (!this.destroyed)
            this.destroyed = true
    }

    drawFeet() {
        const drawFoot = side => {
            const footSize = this.realSize * CHARACTER_FOOT_SIZE
            const value = this.direction && !this.dead ?
                (Math.cos(this.angle * 1.5) * side + 1) / 2 : 0

            ctx.fillRect(
                footSize / -2 + this.realSize * CHARACTER_FOOT_DISTANCE / 2 * side,
                this.realSize / 2 - footSize * value,
                footSize, footSize)
        }

        drawFoot(-1)
        drawFoot(1)
    }

    update() {
        if (!this.dead) {
            if (this.direction) {
                this.look = this.direction
                this.angle += CHARACTER_WOBBLE
                this.pos.x += CHARACTER_SPEED * this.direction * this.size
            }

            else this.angle = 0
        }

        this.velocity += GRAVITY * this.size
        if (this.velocity > MAX_VELOCITY) this.velocity = MAX_VELOCITY
        this.pos.y += this.velocity

        if (this.spring < 1)
            this.spring += CHARACTER_SPRING_SPEED * this.size

        if (this.dead)
            this.angle -= (Math.PI / 2 * this.look + this.angle) * CHARACTER_ROTATE_SPEED

        const collide = {ground: false, squish: 0}
        this.inWater = false

        const merged = margin => {
            this.pos.x -= margin.x
            this.pos.y -= margin.y

            if (margin.y) {
                this.velocity = 0
                collide.squish = margin.y

                if (margin.y > 0)
                    collide.ground = true
            }
        }

        world.gridCollide(this).forEach(i => {
            if (world.grid[i] instanceof Wall)
                merged(this.findOverlap(world.grid[i]))

            else if (world.grid[i] instanceof Water && this.collidesWith(world.grid[i]))
                this.inWater = world.grid[i]
        })

        world.actors.forEach(e => {
            if (e instanceof Lift) {
                const margin = this.findOverlap(e)

                if (margin.x || margin.y) {
                    this.pos.y += e.speed

                    if (collide.squish && Math.sign(margin.y) != Math.sign(collide.squish) &&
                        Math.abs(margin.y) > 0.3)
                            this.destroy()
                }

                merged(margin)
            }
        })

        if (!this.onGround && collide.ground) {
            this.spring = 0
            this.puff()
        }

        this.onGround = collide.ground
    }
}

class Duck extends Character {
    constructor(pos) {
        super(pos, Math.random() * (DUCK_MAX_SIZE - DUCK_MIN_SIZE) + DUCK_MIN_SIZE)

        this.peck = {active: false, value: 0}
        this.time = 0
        this.bob = 0
    }

    destroy() {
        if (!this.destroyed)
            world.particles.push(new Puff(
                this.pos, {x: this.size, y: this.size},
                DUCK_COLOR, 10))

        super.destroy()
    }

    update() {
        if (this.destroyed || !this.onScreen()) return
        super.update()

        if (!this.dead) {
            if (this.inWater) {
                this.bob += DUCK_BOB_SPEED
                this.velocity *= 0.8
                this.velocity += (this.inWater.top - this.bottom) * GRAVITY * this.size * 8
                this.pos.y += Math.sin(this.bob) * 0.012
            }

            if (!this.time) {
                const action = rand(0, 5)
                this.time = rand(1, 80)
                
                if (!action) this.direction = 1
                else if (action == 1) this.direction = -1

                else if (action <= 5) {
                    if (this.direction) this.direction = 0
                    else if (!this.inWater) this.peck.active = true
                }
            }

            if (this.peck.active) {
                this.peck.value += DUCK_PECK_SPEED

                if (this.peck.value > Math.PI) {
                    let plant = false

                    this.peck.value = 0
                    this.peck.active = false

                    world.actors.forEach(e => {
                        if (e instanceof Litter && this.collidesWith(e))
                            this.die()

                        else if (this.size > EGG_SIZE && e instanceof Plant && this.collidesWith(e))
                            plant = true
                    })

                    if (plant && !rand(0, 3))
                        world.particles.push(new Egg(
                            {x: this.pos.x, y: this.pos.y},
                            {x: this.look * -EGG_HORIZONTAL_SPEED, y: -EGG_VERTICAL_SPEED}))
                }
            }

            world.particles.forEach(e => {
                if (e instanceof Smoke && this.collidesWith(e))
                    this.die()
            })

            this.turnAround()
        }
        
        const headSize = this.realSize * DUCK_HEAD_SIZE
        const eyeSize = this.realSize * DUCK_EYE_SIZE
        const headPos = this.realSize * 0.4 * this.look

        ctx.save()
        
        if (this.dead) {
            ctx.translate(this.realPos.x, this.realPos.y)
            ctx.rotate(this.angle)
        }

        else {
            ctx.translate(
                this.realPos.x,
                this.realPos.y - this.realSize * CHARACTER_FOOT_SIZE * this.spring)

            ctx.rotate(Math.sin(this.angle) / 10)
        }

        ctx.fillStyle = plainColor(DUCK_SECOND_COLOR)
        this.drawFeet()

        ctx.fillStyle = plainColor(DUCK_COLOR)
        ctx.fillRect(
            this.realSize / -2, this.realSize / -2,
            this.realSize, this.realSize)

        ctx.translate(0, this.realSize / -2 + headSize / 2)
        ctx.rotate((Math.sin(this.peck.value) + 0.1) * this.look)
        ctx.fillRect(headPos - headSize / 2, -headSize, headSize, headSize)

        ctx.fillStyle = plainColor(DUCK_SECOND_COLOR)
        ctx.fillRect(
            headPos + headSize * 0.75 * this.look - headSize / 4,
            -headSize / 2, headSize / 2, headSize / 4)

        ctx.fillStyle = plainColor(DUCK_EYE_COLOR)
        ctx.fillRect(
            headPos - eyeSize / 2, -headSize / 2 - eyeSize / 2,
            eyeSize, this.dead ? eyeSize / 2 : eyeSize)

        ctx.restore()
        this.time --
    }
}

class Player extends Character {
    constructor() {
        super({x: 0, y: 0}, PLAYER_SIZE)

        this.extraJump = true
        this.destroyed = false
        this.health = 1
        this.bombs = 0

        this.eyes = {
            pos: {x: {goal: 1, value: 1}, y: {goal: 0, value: 0}},
            blink: {active: false, value: 0},
            squint: {active: false, value: 1},
            time: 0
        }
    }

    action() {
        if (!this.dead && !this.destroyed) {
            let machine = false

            world.gridCollide(this).forEach(i => {
                if (world.grid[i] instanceof Machine && this.collidesWith(world.grid[i])) {
                    world.grid[i].active = !world.grid[i].active
                    machine = true
    
                    game.deactivateMessage("machines")
                    game.checkCompleted()
                }
            })
    
            if (!machine && this.bombs) {
                game.deactivateMessage("bombs")
                this.bombs --
    
                world.particles.push(new Bomb(
                    {x: this.pos.x, y: this.pos.y},
                    {x: this.look * BOMB_HORIZONTAL_SPEED, y: -BOMB_VERTICAL_SPEED}))
            }
        }
    }

    die() {
        if (!this.dead) {
            game.resetLevel()
            game.activateMessage("smoke")
            this.eyes.pos.y.goal = -1
        }

        super.die()
    }

    destroy() {
        if (!this.destroyed) {
            game.resetLevel()
            camera.shake()
            
            world.particles.push(new Puff(
                this.pos, {x: this.size, y: this.size},
                PLAYER_COLOR, 20))
        }

        super.destroy()
    }

    jump() {
        if (!this.dead && !this.destroyed) {
            if (this.onGround || this.extraJump) {
                this.velocity = -PLAYER_JUMP_FORCE
                this.puff()
            }
    
            if (!this.onGround && this.extraJump)
                this.extraJump = false
        }
    }

    update() {
        if (this.destroyed) return
        super.update()

        this.direction = game.keys.left ? -1 : game.keys.right ? 1 : 0
        if (this.onGround) this.extraJump = true

        if (this.direction) {
            this.eyes.time = rand(1, 500)

            if (this.look != this.direction)
                this.eyes.pos.x.goal = this.direction
        }

        if (this.inWater) {
            this.velocity *= 0.9
            this.velocity -= GRAVITY * PLAYER_SIZE * 0.7
        }

        world.actors.forEach((e, i) => {
            if (e instanceof Litter && e.onScreen() && this.collidesWith(e)) {
                world.particles.push(new Puff(
                    e.pos, {x: e.size, y: e.size}, e.color, 5))

                world.actors.splice(i, 1)
                game.checkCompleted()
            }
        })

        const movePupil = pupil => {
            const dist = pupil.goal - pupil.value

            if (Math.abs(dist) < PLAYER_PUPIL_SPEED) return pupil.goal
            return pupil.value + Math.sign(dist) * PLAYER_PUPIL_SPEED
        }

        this.eyes.pos.x.value = movePupil(this.eyes.pos.x)
        this.eyes.pos.y.value = movePupil(this.eyes.pos.y)

        if (!this.dead) {
            if (!this.eyes.time) {
                const action = rand(0, 10)
                this.eyes.time = rand(1, 400)
                
                if (!action) this.eyes.squint.active = true
                else if (action <= 4) this.eyes.blink.active = true
                else if (action <= 7) this.eyes.pos.x.goal = Math.random() * 2 - 1
                else if (action <= 10) this.eyes.pos.y.goal = Math.random() * 2 - 1
            }

            if (this.eyes.blink.active) {
                this.eyes.blink.value += PLAYER_BLINK_SPEED

                if (this.eyes.blink.value > Math.PI) {
                    this.eyes.blink.value = 0
                    this.eyes.blink.active = false
                }
            }

            if (this.eyes.squint.active) {
                this.eyes.squint.value -= PLAYER_SQUINT_SPEED

                if (this.eyes.squint.value < -10)
                    this.eyes.squint.active = false
            }

            else if (this.eyes.squint.value != 1) {
                this.eyes.squint.value += PLAYER_SQUINT_SPEED

                if (this.eyes.squint.value > 1)
                    this.eyes.squint.value = 1
            }

            this.health += PLAYER_HEALTH_INCREASE
            this.eyes.time --
        }

        const drawEye = side => {
            const eyeSize = this.realSize * PLAYER_EYE_SIZE
            const eyeLevel = this.realSize * PLAYER_EYE_LEVEL
            const pupilSize = this.realSize * PLAYER_PUPIL_SIZE

            const offset = this.realSize / 10 * this.look + this.realSize / 5 * side
            const value = this.dead ? eyeSize : this.eyes.squint.value * eyeSize
            const height = value < pupilSize ? pupilSize : value

            ctx.fillStyle = plainColor(PLAYER_EYE_COLOR)
            ctx.fillRect(
                offset - eyeSize / 2, eyeLevel - height / 2,
                eyeSize, height)

            ctx.fillStyle = plainColor(PLAYER_PUPIL_COLOR)
            ctx.fillRect(
                offset - pupilSize / 2 + (eyeSize - pupilSize) / 2 * this.eyes.pos.x.value,
                eyeLevel - pupilSize / 2 + (height - pupilSize) / 2 * this.eyes.pos.y.value,
                pupilSize, pupilSize)

            ctx.fillStyle = plainColor(PLAYER_COLOR)
            ctx.fillRect(
                offset - eyeSize / 2 - 1,
                eyeLevel - eyeSize / 2 - 1, eyeSize + 2,
                this.dead ? eyeSize * 0.9 : eyeSize * Math.sin(this.eyes.blink.value))
        }

        ctx.save()
        
        if (this.dead) {
            ctx.translate(this.realPos.x, this.realPos.y)
            ctx.rotate(this.angle)
        }

        else {
            ctx.translate(
                this.realPos.x,
                this.realPos.y - this.realSize * CHARACTER_FOOT_SIZE * this.spring)

            ctx.rotate(Math.sin(this.angle) / 10)
        }

        ctx.fillStyle = plainColor(PLAYER_FOOT_COLOR)
        this.drawFeet()

        ctx.fillStyle = plainColor(PLAYER_COLOR)
        ctx.shadowColor = plainColor(PLAYER_SHADOW_COLOR)
        ctx.shadowBlur = PLAYER_SHADOW_BLUR
        ctx.fillRect(
            this.realSize / -2, this.realSize / -2,
            this.realSize, this.realSize)

        ctx.shadowBlur = 0

        drawEye(-1)
        drawEye(1)

        ctx.restore()
    }
}