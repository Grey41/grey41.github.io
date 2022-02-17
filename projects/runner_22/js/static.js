"use strict"

class Wall extends Base {
    constructor(index) {
        super(world.findPos(index), WALL_SIZE)
    }

    update() {
        ctx.fillStyle = variableColor(WALL_COLOR, this.pos)
        ctx.fillRect(
            ~~(this.realPos.x - this.realSize / 2),
            ~~(this.realPos.y - this.realSize / 2),
            ~~this.realSize, ~~this.realSize)
    }
}

class Water extends Base {
    constructor(index) {
        super(world.findPos(index), WATER_SIZE)
    }

    update() {
        ctx.fillStyle = addAlpha(variableColor(WATER_COLOR, this.pos), 0.5)
        this.drawRect()
    }
}

class Machine extends Base {
    constructor(index, interval, good) {
        super(world.findPos(index), MACHINE_SIZE)

        this.interval = interval
        this.time = interval
        this.good = good
        this.active = !good
    }

    update() {
        if (this.active) {
            this.time --

            if (!this.time) {
                this.emit()
                this.time = this.interval
            }
        }

        if (this.collidesWith(player))
            game.activateMessage("machines")
    }
}

class Chimney extends Machine {
    constructor(index) {
        super(index, CHIMNEY_EMIT_INTERVAL, false)
    }

    update() {
        super.update()

        ctx.fillStyle = variableColor(MACHINE_FIRST_COLOR, this.pos)
        ctx.fillRect(
            this.realPos.x - this.realSize * 0.4,
            this.realPos.y - this.realSize / 2,
            this.realSize * 0.8, this.realSize)

        ctx.fillStyle = variableColor(MACHINE_SECOND_COLOR, this.pos)
        ctx.fillRect(
            this.realPos.x - this.realSize / 2,
            this.realPos.y - this.realSize / 2,
            this.realSize, this.realSize * 0.3)

        if (this.active) {
            ctx.fillStyle = plainColor(MACHINE_BAD_COLOR)
            ctx.shadowColor = plainColor(MACHINE_BAD_SHADOW)
            ctx.shadowBlur = MACHINE_SHADOW_BLUR
        }

        else ctx.fillStyle = variableColor(MACHINE_SECOND_COLOR, this.pos)
        ctx.fillRect(
            this.realPos.x - this.realSize * 0.2,
            this.realPos.y + this.realSize * 0.2,
            this.realSize * 0.4, this.realSize * 0.15)

        ctx.shadowBlur = 0
    }

    emit() {
        world.particles.push(new Smoke({
            x: this.pos.x + (Math.random() * 0.8 - 0.4) * MACHINE_SIZE,
            y: this.pos.y - MACHINE_SIZE * 0.4
        }, Math.PI + Math.random() - 0.5, CHIMNEY_SMOKE_COLOR))
    }
}

class Belcher extends Machine {
    constructor(index) {
        super(index, BELCHER_EMIT_INTERVAL, false)
    }

    update() {
        super.update()

        ctx.fillStyle = variableColor(MACHINE_FIRST_COLOR, this.pos)
        ctx.fillRect(
            this.realPos.x - this.realSize * 0.4,
            this.realPos.y - this.realSize / 2,
            this.realSize * 0.8, this.realSize)

        ctx.fillStyle = variableColor(MACHINE_SECOND_COLOR, this.pos)
        ctx.fillRect(
            this.realPos.x - this.realSize / 2,
            this.realPos.y - this.realSize / 4,
            this.realSize * 0.1, this.realSize / 4)

        ctx.fillRect(
            this.realPos.x + this.realSize * 0.4,
            this.realPos.y - this.realSize / 4,
            this.realSize * 0.1, this.realSize / 4)

        ctx.beginPath()
        ctx.arc(
            this.realPos.x, this.realPos.y + this.realSize / 4,
            this.realSize * 0.2, 0, Math.PI * 2)

        ctx.fill()

        if (this.active) {
            ctx.fillStyle = plainColor(MACHINE_BAD_COLOR)
            ctx.shadowColor = plainColor(MACHINE_BAD_SHADOW)
            ctx.shadowBlur = MACHINE_SHADOW_BLUR
        }

        else ctx.fillStyle = variableColor(MACHINE_SECOND_COLOR, this.pos)
        ctx.fillRect(
            this.realPos.x + this.realSize * 0.2,
            this.realPos.y - this.realSize * 0.2,
            this.realSize * 0.1, this.realSize * 0.1)

        ctx.shadowBlur = 0
    }

    emit() {
        const side = rand(0, 1) ? -1 : 1

        world.particles.push(new Smoke({
            x: this.pos.x + this.size * 0.4 * side,
            y: this.pos.y - this.size / 8
        }, Math.PI / 2 * side + Math.random() - 0.5, BELCHER_SMOKE_COLOR))
    }
}

class Generator extends Machine {
    constructor(index) {
        super(index, GENERATOR_EMIT_INTERVAL, true)
        this.angle = 0
    }

    update() {
        super.update()

        ctx.fillStyle = variableColor(MACHINE_SECOND_COLOR, this.pos)
        ctx.fillRect(
            this.realPos.x - this.realSize * 0.4,
            this.realPos.y - this.realSize * 0.3,
            this.realSize * 0.8, this.realSize * 0.8)

        ctx.beginPath()
        ctx.fillStyle = ctx.strokeStyle = variableColor(MACHINE_FIRST_COLOR, this.pos)
        ctx.moveTo(this.realPos.x - this.realSize * 0.3, this.realPos.y - this.realSize / 2)
        ctx.lineTo(this.realPos.x + this.realSize * 0.3, this.realPos.y - this.realSize / 2)
        ctx.lineTo(this.realPos.x + this.realSize * 0.2, this.realPos.y - this.realSize * 0.3)
        ctx.lineTo(this.realPos.x - this.realSize * 0.2, this.realPos.y - this.realSize * 0.3)
        ctx.fill()

        ctx.save()
        ctx.lineWidth = 3
        ctx.translate(this.realPos.x, this.realPos.y + this.realSize * 0.1)
        ctx.rotate(this.angle)

        for (let i = 0; i < 3; i ++) {
            ctx.beginPath()
            ctx.arc(0, 0, this.realSize * 0.2, 0, Math.PI / 3)
            ctx.moveTo(this.realSize * 0.15, this.realSize * 0.05)
            ctx.lineTo(this.realSize * 0.2, 0)
            ctx.lineTo(this.realSize * 0.25, this.realSize * 0.05)
            ctx.stroke()
            ctx.rotate(Math.PI * 2 / 3)
        }

        ctx.restore()

        if (this.active) {
            this.angle -= GENERATOR_ROTATE_SPEED

            ctx.fillStyle = plainColor(MACHINE_GOOD_COLOR)
            ctx.shadowColor = plainColor(MACHINE_GOOD_SHADOW)
            ctx.shadowBlur = MACHINE_SHADOW_BLUR
        }

        else ctx.fillStyle = variableColor(MACHINE_FIRST_COLOR, this.pos)
        ctx.fillRect(
            this.realPos.x - this.realSize * 0.05,
            this.realPos.y + this.realSize * 0.05,
            this.realSize * 0.1, this.realSize * 0.1)

        ctx.shadowBlur = 0
    }

    emit() {
        world.particles.push(new Bubble({
            x: this.pos.x + (Math.random() * 0.4 - 0.2) * this.size,
            y: this.pos.y - this.size * 0.4
        }, Math.PI + Math.random() - 0.5))
    }
}

class Item extends Base {
    constructor(index) {
        super(world.findPos(index), ITEM_SIZE)
        this.angle = Math.random() * 2 * Math.PI
    }

    update() {
        this.angle += ITEM_SPEED

        ctx.save()
        ctx.fillStyle = plainColor(ITEM_COLOR)

        ctx.translate(
            this.realPos.x + realSize(Math.cos(this.angle * 0.7) * ITEM_WOBBLE),
            this.realPos.y + realSize(Math.sin(this.angle) * ITEM_WOBBLE))

        ctx.rotate(Math.sin(this.angle * 0.9) / 3)

        ctx.fillRect(
            this.realSize / -2, this.realSize / -2,
            this.realSize, this.realSize)

        ctx.restore()

        if (this.collidesWith(player)) {
            game.activateMessage("bombs")

            world.grid[world.findIndex(this.pos)] = EMPTY
            player.bombs ++

            world.particles.push(new Puff(
                this.pos, {x: ITEM_SIZE, y: ITEM_SIZE}, ITEM_PUFF_COLOR, 5))
        }
    }
}