"use strict"

function keyHandler(code, type) {
    if (code == "ArrowLeft" || code == "KeyA" || code == "KeyQ") {
        game.deactivateMessage("arrows")
        game.keys.left = type
    }

    else if (code == "ArrowRight" || code == "KeyD") {
        game.deactivateMessage("arrows")
        game.keys.right = type
    }
}

addEventListener("touchstart", e => {
    e.preventDefault()
    
    if (game.start || game.end)
        game.startPlaying()

    else {
        for (var i = 0; i < e.changedTouches.length; i ++) {
            const point = e.changedTouches[i]

            const checkButton = i =>
                point.pageX > innerWidth / 5 * i - innerWidth / 10 &&
                point.pageX < innerWidth / 5 * i + innerWidth / 10 &&
                point.pageY > innerHeight - BUTTON_SIZE * 2 &&
                point.pageY < innerHeight

            if (checkButton(1)) {
                game.deactivateMessage("arrows")
                game.keys.left = point
            }

            else if (checkButton(2)) {
                game.deactivateMessage("arrows")
                game.keys.right = point
            }

            else if (checkButton(3)) {
                player.action()
                game.keys.space = point
            }

            else if (checkButton(4)) {
                player.jump()
                game.keys.up = point
            }
        }
    }
})

addEventListener("touchend", e => {
    e.preventDefault()

    for (var i = 0; i < e.changedTouches.length; i ++) {
        const checkRelease = key => {
            if (key && key.identifier == e.changedTouches[i].identifier)
                return false
    
            return key
        }

        game.keys.left = checkRelease(game.keys.left)
        game.keys.right = checkRelease(game.keys.right)
        game.keys.space = checkRelease(game.keys.space)
        game.keys.up = checkRelease(game.keys.up)
    }
})

addEventListener("keydown", e => {
    if (e.repeat) return

    if (e.code == "ArrowUp" || e.code == "KeyW" || e.code == "KeyZ")
        player.jump()

    else if (e.code == "Space")
        game.start || game.end ? game.startPlaying() : player.action()

    else if (e.code == "KeyR")
        player.destroy()

    else keyHandler(e.code, true)
})

addEventListener("keyup", e => keyHandler(e.code, false))