"use strict"

const fontSource = {
    A: "#### ##### ## #",
    B: "#### ### # ####",
    C: "####  #  #  ###",
    D: "## # ## ## ### ",
    E: "####  ## #  ###",
    F: "####  ## #  #  ",
    G: "####  #  # ####",
    H: "# ## ##### ## #",
    I: "### #  #  # ###",
    J: "  #  #  ## ####",
    K: "# ## ### # ## #",
    L: "#  #  #  #  ###",
    M: "## ### # ## # ##   ##   #",
    N: "#### ## ## ## #",
    O: "#### ## ## ####",
    P: "#### #####  #  ",
    Q: "#### ####  #  #",
    R: "#### ### # ## #",
    S: "####  ###  ####",
    T: "### #  #  #  # ",
    U: "# ## ## ## ####",
    V: "# ## ## ## # # ",
    W: "#   ## # ## # ## # # # # ",
    X: "# ## # # # ## #",
    Y: "# ## #### #  # ",
    Z: "###  # # #  ###",
    0: "#### ## ## ####",
    1: "##  #  #  # ###",
    2: "###  #####  ###",
    3: "###  # ##  ####",
    4: "#  #  # ####  #",
    5: "####  ##   ### ",
    6: "####  #### ####",
    7: "###  # #  #  # ",
    8: "#### ##### ####",
    9: "#### ####  ####",
    " ": "          ",
    "/": "  #  # # #  #  ",
    ":": " # # "
}

function drawText(text, x, y, size) {
    for (let char of text) {
        const length = ~~(fontSource[char].length / 5)

        for (let j in fontSource[char])
            if (fontSource[char][j] == "#")
                ctx.fillRect(
                    ~~(j % length * size + x),
                    ~~(~~(j / length) * size + y),
                    size, size)

        x += length * size + size
    }
}

function textWidth(text) {
    return [...text].reduce((a, b) => (a + ~~(fontSource[b].length / 5) + 1), 0)
}