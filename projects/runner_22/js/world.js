"use strict"

const EMPTY = 0
const WALL = 1
const LIFT = 2
const PLAYER = 3
const LITTER = 4
const WATER = 5
const CHIMNEY = 6
const BELCHER = 7
const GENERATOR = 8
const ITEM = 9
const FISH = 10
const PLANT = 11
const DUCK = 12

class Base {
    constructor(pos, size) {
        this.pos = pos
        this.size = size
    }

    onScreen() {
        return (
            this.realPos.x - this.realSize / 2 < innerWidth &&
            this.realPos.x + this.realSize / 2 > 0 &&
            this.realPos.y - this.realSize / 2 < innerHeight &&
            this.realPos.y + this.realSize / 2 > 0)
    }

    drawRect() {
        ctx.fillRect(
            this.realPos.x - this.realSize / 2,
            this.realPos.y - this.realSize / 2,
            this.realSize, this.realSize)
    }

    collidesWith(e) {
        return (
            this.left < e.right && this.right > e.left &&
            this.top < e.bottom && this.bottom > e.top)
    }

    findOverlap(e) {
        const bottom = this.bottom - e.top
        const top = this.top - e.bottom
        const right = this.right - e.left
        const left = this.left - e.right

        if (bottom < 0 || top > 0 || right < 0 || left > 0)
            return {x: 0, y: 0}

        const x = right < -left ? right : left
        const y = bottom < -top ? bottom : top

        if (Math.abs(x) < Math.abs(y)) return {x, y: 0}
        return {x: 0, y}
    }

    get realPos() {
        return realPos(this.pos)
    }

    get realSize() {
        return realSize(this.size)
    }

    get left() {
        return this.pos.x - this.size / 2
    }

    get top() {
        return this.pos.y - this.size / 2
    }

    get right() {
        return this.pos.x + this.size / 2
    }

    get bottom() {
        return this.pos.y + this.size / 2
    }
}

class World {
    constructor() {
        this.source = []
        this.grid = []
        this.actors = []
        this.particles = []

        this.base = {x: WORLD_INITIAL_SIZE, y: WORLD_INITIAL_SIZE}
        this.size = {x: 0, y: 0}
        this.scale = BLOCK_SIZE
    }

    update() {
        const updateGrid = front => {
            const left = Math.floor(camera.pos.x - innerWidth / 2 / this.scale)
            const right = Math.ceil(camera.pos.x + innerWidth / 2 / this.scale) + 1
            const top = Math.floor(camera.pos.y - innerHeight / 2 / this.scale)
            const bottom = Math.ceil(camera.pos.y + innerHeight / 2 / this.scale) + 1

            this.iterateGrid(left, right, top, bottom, (x, y) => {
                const object = this.grid[this.findIndex({x, y})]

                if (front) {
                    if (object instanceof Wall || object instanceof Water)
                        object.update()
                }

                else if (object instanceof Machine || object instanceof Item)
                    object.update()
            })
        }

        this.particles.forEach(e => e.update())
        this.particles.forEach((e, i) => e.time <= 0 && this.particles.splice(i, 1))

        updateGrid(false)

        player.update()
        this.actors.forEach(e => e.update())

        updateGrid(true)
    }

    iterateGrid(left, right, top, bottom, method) {
        left = left < 0 ? 0 : left
        right = right > this.size.x ? this.size.x : right
        top = top < 0 ? 0 : top
        bottom = bottom > this.size.y ? this.size.y : bottom

        for (let x = left; x < right; x ++)
            for (let y = top; y < bottom; y ++)
                method(x, y)
    }

    newLevel() {
        const UP = 0
        const DOWN = 1
        const LEFT = 2
        const RIGHT = 4

        const total = this.base.x * this.base.y
        const maze = new Array(total).fill(WALL)
        const overlay = new Array(total).fill(EMPTY)

        const point = {
            vertical: 0,
            insertedLift: false
        }

        game.level ++

        if (this.base.x > 12 && rand(0, 2)) {
            const index = pos => pos.y * this.base.x + pos.x

            const chamber = {
                x: odd(rand(2, this.base.x - 8)),
                y: odd(rand(2, this.base.y - 8))
            }

            for (let x = chamber.x; x < chamber.x + 3; x ++)
                for (let y = chamber.y; y < chamber.y + 3; y ++)
                    maze[index({x, y})] = y == chamber.y + 2 ?
                        game.level >= FISH_MIN_LEVEL && !rand(0, 20 / game.level) ?
                        FISH : WATER : EMPTY

            for (let i = 0; i < rand(1, 2); i ++) {
                const block = {x: 0, y: 0}

                if (!rand(0, 2)) {
                    block.x = odd(rand(chamber.x, chamber.x + 2))
                    block.y = chamber.y - 1
                    overlay[index(block)] = LIFT
                }

                else {
                    block.x = rand(0, 1) ? chamber.x - 1 : chamber.x + 3
                    block.y = chamber.y
                }

                maze[index(block)] = EMPTY
            }
        }

        while (maze[point.index] != WALL) {
            const x = odd(rand(0, this.base.x - 4))
            const y = odd(rand(0, this.base.y - 4))

            point.index = y * this.base.x + x
        }

        maze[point.index] = null
        overlay[point.index] = PLAYER

        while (maze.includes(null)) {
            let empty = []
            let pending = 0

            if (point.index >= this.base.x * 2) {
                if (maze[point.index - this.base.x * 2] == WALL) empty.push(UP)
                if (maze[point.index - this.base.x] == null) pending = UP
            }

            if (point.index < total - this.base.x * 2) {
                if (maze[point.index + this.base.x * 2] == WALL) empty.push(DOWN)
                if (maze[point.index + this.base.x] == null) pending = DOWN
            }

            if (point.index % this.base.x >= 2) {
                if (maze[point.index - 2] == WALL) empty.push(LEFT)
                if (maze[point.index - 1] == null) pending = LEFT
            }

            if (point.index % this.base.x < this.base.x - 2) {
                if (maze[point.index + 2] == WALL) empty.push(RIGHT)
                if (maze[point.index + 1] == null) pending = RIGHT
            }

            const resetLift = () => {
                point.vertical = 0
                point.insertedLift = false
            }

            const movePoint = (direction, type) => {
                maze[point.index] = type

                for (let i = 0; i < 2; i ++) {
                    if (direction == UP) point.index -= this.base.x
                    else if (direction == DOWN) point.index += this.base.x
                    else if (direction == LEFT) point.index -= 1
                    else if (direction == RIGHT) point.index += 1

                    maze[point.index] = type
                }
            }

            if (empty.length) {
                let direction = empty[~~(Math.random() * empty.length)]

                if (point.vertical) {
                    if (empty.includes(LEFT) && empty.includes(RIGHT))
                        direction = rand(0, 1) ? LEFT : RIGHT

                    else if (empty.includes(LEFT)) direction = LEFT
                    else if (empty.includes(RIGHT)) direction = RIGHT
                }

                movePoint(direction, null)

                if (direction == UP || direction == DOWN) point.vertical ++
                else resetLift()

                if (point.vertical > 1 && !point.insertedLift) {
                    overlay[point.index] = LIFT
                    resetLift()
                }
            }

            else {
                movePoint(pending, EMPTY)
                resetLift()
            }
        }

        const randomSizes = s => new Array(s).fill().map((e, i) => i % 2 ? rand(2, 3) : 1)
        const xGaps = randomSizes(this.base.x)
        const yGaps = randomSizes(this.base.y)

        this.size.x = xGaps.reduce((a, e) => a + e, 0)
        this.size.y = yGaps.reduce((a, e) => a + e, 1)

        const distortArray = (array, shouldCopy) => {
            const temp = []

            const setRandom = (a, e) => {
                a[~~(Math.random() * a.length)] = e
                return a
            }
            
            for (let i = 0; i < array.length; i += this.base.x)
                temp.push(array.slice(i, i + this.base.x))

            return temp.flatMap((e, i) => {
                const bit = new Array(yGaps[i]).fill(shouldCopy ? e : new Array(e.length).fill(EMPTY))
                return setRandom(bit, e)
            }).flat(1).flatMap((e, i) => {
                const bit = new Array(xGaps[i % this.base.x]).fill(shouldCopy ? e : EMPTY)
                return setRandom(bit, e)
            })
        }

        this.source = distortArray(maze, true)
        distortArray(overlay, false).forEach((e, i) => this.source[i] = e ? e : this.source[i])

        this.base.x += WORLD_SIZE_INCREMENT
        this.base.y += WORLD_SIZE_INCREMENT

        this.source.forEach((e, i) => {
            if (i < this.size.y * this.size.x - this.size.x && e == EMPTY) {
                if (!rand(0, 100))
                    this.source[i] = ITEM

                else if (game.level >= DUCK_MIN_LEVEL && !rand(0, 500 / game.level))
                    this.source[i] = DUCK

                else if (this.source[i + this.size.x] == WALL) {
                    if (rand(0, 1))
                        this.source[i] = LITTER

                    else if (game.level >= CHIMNEY_MIN_LEVEL && !rand(0, CHIMNEY_CHANCE))
                        this.source[i] = CHIMNEY

                    else if (game.level >= BELCHER_MIN_LEVEL && !rand(0, BELCHER_CHANCE))
                        this.source[i] = BELCHER

                    else if (game.level >= GENERATOR_MIN_LEVEL && !rand(0, GENERATOR_CHANCE))
                        this.source[i] = GENERATOR

                    else if (game.level >= PLANT_MIN_LEVEL && !rand(0, 100 / game.level))
                        this.source[i] = PLANT
                }
            }
        })

        this.resetLevel()
    }

    resetLevel() {
        this.grid = new Array(this.source.length).fill(EMPTY)
        this.actors = []
        this.particles = []

        this.source.forEach((e, i) => {
            this.grid[i] = e == WALL ? new Wall(i) :
                e == CHIMNEY ? new Chimney(i) :
                e == BELCHER ? new Belcher(i) :
                e == GENERATOR ? new Generator(i) :
                e == WATER || e == FISH ? new Water(i) : 
                e == ITEM ? new Item(i) : EMPTY

            if (e == LIFT)
                this.actors.push(new Lift(this.findPos(i)))

            else if (e == DUCK)
                this.actors.push(new Duck(this.findPos(i)))

            else if (e == FISH) {
                const fish = new Fish(this.findPos(i))

                fish.pos.y += (Math.random() - 0.5) * (1 - fish.size)
                this.actors.push(fish)
            }

            else if (e == PLANT)
                this.actors.push(new Plant({
                    x: this.findPos(i).x + Math.random() - 0.5,
                    y: this.findPos(i).y + 0.5
                }))

            else if (e == LITTER)
                for (let j = 0; j < rand(LITTER_MIN_COUNT, LITTER_MAX_COUNT); j ++)
                    this.actors.push(new Litter(this.findPos(i)))

            else if (e == PLAYER) {
                player.pos = this.findPos(i)
                camera.pos = this.findPos(i)
            }
        })
    }

    findIndex(pos) {
        return pos.y * this.size.x + pos.x
    }

    findPos(i) {
        return {x: i % this.size.x, y: ~~(i / this.size.x)}
    }

    gridCollide(e) {
        return [
            {x: Math.floor(e.pos.x), y: Math.floor(e.pos.y)},
            {x: Math.floor(e.pos.x), y: Math.ceil(e.pos.y)},
            {x: Math.ceil(e.pos.x), y: Math.floor(e.pos.y)},
            {x: Math.ceil(e.pos.x), y: Math.ceil(e.pos.y)}
        ].map(e => this.findIndex(e))
    }
}