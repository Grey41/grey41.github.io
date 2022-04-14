"use strict"

class Camera {
    constructor() {
        this.pos = {x: 0, y: 0}
        this.shakeValue = 0
    }

    update() {
        this.pos.x += (player.pos.x - this.pos.x) * CAMERA_SPEED
        this.pos.y += (player.pos.y - this.pos.y) * CAMERA_SPEED

        if (this.shakeValue) {
            this.shakeValue --
            this.pos.x += (Math.random() - 0.5) * CAMERA_SHAKE
            this.pos.y += (Math.random() - 0.5) * CAMERA_SHAKE
        }
    }

    shake() {
        this.shakeValue = CAMERA_SHAKE_DURATION
    }
}