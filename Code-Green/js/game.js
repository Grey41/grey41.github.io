"use strict"

class Game {
    constructor() {
        this.mobile = "ontouchstart" in window
        this.splashScreen = {index: 0, timer: INITIAL_DELAY}
        this.fade = {reason: 0, value: 0, pause: 0}
        this.keys = {left: false, right: false, space: false, up: false}
        this.message = {current: "", time: 0, value: 0, active: false}
        this.main = {start: true, end: false, play: false}
        this.level = 0

        this.messages = {
            arrows: {message: `Use the ${this.mobile ? "arrows" : "arrow keys"} to move.`, displayed: false},
            bombs: {message: `That's a seed bomb! Press ${this.mobile ? "the square" : "space"} to throw it.`, displayed: false},
            machines: {message: `Press ${this.mobile ? "the square" : "space"} to deactivate the enemy machine.`, displayed: false},
            smoke: {message: "Try to avoid the toxic smoke.", displayed: false}
        }

        const cycle = () => {
            this.cycle()
            requestAnimationFrame(cycle)
        }

        cycle()
    }

    cycle() {
        const phase = this.level / LEVELS

        ctx.fillStyle = `rgb(${phase * 220}, ${phase * 240}, ${phase * 255})`
        ctx.fillRect(0, 0, innerWidth, innerHeight)

        if (this.main.start)
            return this.updateScreen(["CODE", "GREEN"], "START")

        camera.update()
        world.update()

        const bombs = "SEED BOMBS: " + player.bombs
        ctx.fillStyle = plainColor(TEXT_COLOR)

        drawText(bombs, innerWidth - textWidth(bombs) * TEXT_SIZE, TEXT_SIZE, TEXT_SIZE)
        drawText(`LEVEL: ${this.level}/${LEVELS}`, TEXT_SIZE, TEXT_SIZE, TEXT_SIZE)

        if (player.health < 0 || player.dead || player.destroyed) player.health = 0
        else if (player.health > 1) player.health = 1

        ctx.lineWidth = TEXT_SIZE
        ctx.strokeStyle = ctx.fillStyle = player.health < 0.2 ? plainColor(TEXT_BAD_COLOR) : plainColor(TEXT_COLOR)
        ctx.strokeRect(innerWidth / 2 - 150, TEXT_SIZE, 300, TEXT_SIZE * 5)
        ctx.fillRect(innerWidth / 2 - 150, TEXT_SIZE, player.health * 300, TEXT_SIZE * 5)

        if (this.mobile) {
            const x = innerWidth / 5
            const y = innerHeight - BUTTON_SIZE
            const findColor = e => plainColor(e ? BUTTON_PRESS_COLOR : BUTTON_COLOR)

            ctx.lineWidth = BUTTON_THICKNESS
            ctx.strokeStyle = findColor(this.keys.space)
            ctx.strokeRect(
                x * 3 - BUTTON_SIZE * 0.4, y - BUTTON_SIZE * 0.4,
                BUTTON_SIZE * 0.8, BUTTON_SIZE * 0.8)

            ctx.strokeStyle = findColor(this.keys.left)
            ctx.beginPath()
            ctx.moveTo(x + BUTTON_SIZE / 4, y - BUTTON_SIZE / 2)
            ctx.lineTo(x - BUTTON_SIZE / 4, y)
            ctx.lineTo(x + BUTTON_SIZE / 4, y + BUTTON_SIZE / 2)
            ctx.stroke()

            ctx.strokeStyle = findColor(this.keys.right)
            ctx.beginPath()
            ctx.moveTo(x * 2 - BUTTON_SIZE / 4, y - BUTTON_SIZE / 2)
            ctx.lineTo(x * 2 + BUTTON_SIZE / 4, y)
            ctx.lineTo(x * 2 - BUTTON_SIZE / 4, y + BUTTON_SIZE / 2)
            ctx.stroke()

            ctx.strokeStyle = findColor(this.keys.up)
            ctx.beginPath()
            ctx.moveTo(x * 4 - BUTTON_SIZE / 2, y + BUTTON_SIZE / 4)
            ctx.lineTo(x * 4, y - BUTTON_SIZE / 4)
            ctx.lineTo(x * 4 + BUTTON_SIZE / 2, y + BUTTON_SIZE / 4)
            ctx.stroke()
        }

        if (this.message.active) {
            this.message.time --

            if (this.message.value < 1)
                this.message.value += TRANSITION_SPEED

            if (this.message.time < 0)
                this.message.active = false
        }

        if (this.message.value > 0) {
            if (!this.message.active)
                this.message.value -= TRANSITION_SPEED

            ctx.textAlign = "center"
            ctx.font = MESSAGE_SIZE + "px sans-serif"
            ctx.fillStyle = addAlpha(plainColor(TEXT_COLOR), this.message.value)
            ctx.fillText(this.message.current, innerWidth / 2, innerHeight / 2 - 100)
        }

        if (this.main.end) {
            ctx.fillStyle = addAlpha(plainColor(END_COLOR), this.main.end.value)
            ctx.fillRect(0, 0, innerWidth, innerHeight)

            if (this.main.end.value > 1)
                this.updateScreen(["MISSION", "COMPLETE"], "PLAY AGAIN")

            return this.main.end.value += END_SPEED
        }

        if (this.fade.reason) {
            if (this.fade.pause)
                this.fade.pause --

            else {
                this.fade.value += TRANSITION_SPEED

                if (this.fade.value > 1) {
                    player.dead = false
                    player.destroyed = false
                    player.health = 1

                    this.fade.reason > 0 ? world.newLevel() : world.resetLevel()
                    this.fade.reason = false
                }
            }
        }

        if (this.fade.value > 0) {
            if (!this.fade.reason)
                this.fade.value -= TRANSITION_SPEED

            ctx.fillStyle = addAlpha(plainColor(TRANSITION_COLOR), this.fade.value)
            ctx.fillRect(0, 0, innerWidth, innerHeight)
        }
    }

    updateScreen(title, reason) {
        const width = textWidth(title.join(" "))

        ctx.fillStyle = plainColor(TITLE_COLOR)
        this.splashScreen.timer --
        
        drawText(
            title[0].substring(0, this.splashScreen.index),
            innerWidth / 2 - width / 2 * TITLE_SIZE,
            innerHeight / 2 - 7 * TITLE_SIZE, TITLE_SIZE)

        if (this.splashScreen.index > title[0].length + title[1].length + 5) {
            const start = (this.mobile ? "TAP" : "PRESS SPACE") + " TO " + reason
            ctx.fillStyle = plainColor(TITLE_COLOR)

            drawText(
                start, innerWidth / 2 - textWidth(start) / 2 * INSTRUCTION_SIZE,
                innerHeight / 2, INSTRUCTION_SIZE)

            ctx.fillStyle = plainColor(TITLE_GREEN_COLOR)
            this.main.play = true
        }

        drawText(
            title[1].substring(0, this.splashScreen.index - title[0].length),
            innerWidth / 2 - (width / 2 - textWidth(title[0] + " ")) * TITLE_SIZE,
            innerHeight / 2 - 7 * TITLE_SIZE, TITLE_SIZE)

        if (!this.splashScreen.timer) {
            this.splashScreen.index ++
            this.splashScreen.timer = rand(5, 20)
        }
    }

    startPlaying() {
        this.main.start = false
        this.main.end = false
        this.main.play = false
        this.fade.reason = 1
        this.fade.value = 1
        this.level = 0

        world.base.x = WORLD_INITIAL_SIZE
        world.base.y = WORLD_INITIAL_SIZE
        player.bombs = 0

        setTimeout(() => this.activateMessage("arrows"), 1000)
    }

    resetLevel() {
        if (!this.fade.reason) {
            this.fade.reason = -1
            this.fade.pause = REFRESH_PAUSE
        }
    }

    checkCompleted() {
        let goal = false

        world.actors.forEach(e => {
            if (e instanceof Litter)
                goal = true
        })

        world.grid.forEach(e => {
            if (e instanceof Machine && e.good != e.active)
                goal = true
        })

        if (!goal) {
            if (this.level == LEVELS) {
                this.splashScreen.index = 0
                this.splashScreen.timer = INITIAL_DELAY
                this.main.end = {value: 0}
            }

            else if (!this.fade.reason)
                this.fade.reason = 1
        }
    }

    activateMessage(n) {
        if (!this.messages[n].displayed) {
            this.messages[n].displayed = true
            this.message.current = this.messages[n].message
            this.message.active = true
            this.message.time = MESSAGE_LIFETIME
        }
    }

    deactivateMessage(n) {
        if (this.message.current == this.messages[n].message)
            this.message.time = 0
    }
}