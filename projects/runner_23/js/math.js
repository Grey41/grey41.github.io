"use strict"

function rand(a, b) {
    return ~~(Math.random() * (b - a + 1)) + a
}

function odd(value) {
    return ~~(value / 2) * 2 + 1
}

function greenColor() {
    return [
        Math.random() * 0.6 + 0.4,
        Math.random() * 0.3 + 0.7,
        Math.random() * 0.4
    ]
}

function pastelColor() {
    return [
        Math.random() * 0.7 + 0.3,
        Math.random() * 0.7 + 0.3,
        Math.random() * 0.7 + 0.3
    ]
}

function plainColor(a) {
    return `rgb(${a[0] * 255}, ${a[1] * 255}, ${a[2] * 255})`
}

function addAlpha(a, b) {
    return a.replace(/\)/, `, ${b})`)
}

function variableColor(array, pos) {
    const dist = Math.hypot(pos.x - player.pos.x, pos.y - player.pos.y)
    const color = 0.8 / (dist < 1 ? 1 : dist) + game.level / LEVELS * 0.2

    return plainColor(array.map(e => e * color))
}

function realPos(pos) {
    return {
        x: (pos.x - camera.pos.x) * world.scale + innerWidth / 2,
        y: (pos.y - camera.pos.y) * world.scale + innerHeight / 2
    }
}

function realSize(size) {
    return size * world.scale
}