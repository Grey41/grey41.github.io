"use strict"

const ctx = canvas.getContext("2d")
const player = new Player()
const camera = new Camera()
const world = new World()
const game = new Game()

oncontextmenu = e => e.preventDefault()

onresize = () => {
    const ratio = devicePixelRatio

    canvas.width = innerWidth * ratio
    canvas.height = innerHeight * ratio
    ctx.scale(ratio, ratio)
}

onresize()