window.dataLayer = window.dataLayer || []
function gtag() {dataLayer.push(arguments)}
gtag("js", new Date())
gtag("config", "G-C34XCNZ9G4")

function bar() {
    const top = document.querySelector(".top")
    
    if (top.className == "top") top.className += " responsive"    
    else top.className = "top"
}

function reset(iframe, code) {
    const frame = iframe.cloneNode(true)
    iframe.before(frame)
    iframe.remove()
    iframe = frame

    const content = iframe.contentWindow || iframe.contentDocument
    content.document.open()
    content.document.write(code)
    content.document.close()

    return iframe
}

function editor(name, html, lines = []) {
    const range = ace.require("ace/range").Range
    const edit = ace.edit(html.lastElementChild)
    const content = html.firstElementChild.contentWindow || html.firstElementChild.contentDocument

    edit.session.setMode("ace/mode/html")
    edit.setTheme("ace/theme/tomorrow")
    edit.setValue(data.editors[name])
    edit.gotoLine(0, 1, true)
    edit.setOptions({maxLines: 25})

    lines.forEach(line => edit.session.addMarker(new range(line - 1, 0, line - 1, 1), "new", "fullLine"))
    edit.on("change", () => html.firstElementChild = reset(html.firstElementChild, edit.getValue()))

    content.document.open()
    content.document.write(data.editors[name])
    content.document.close()
}

function snippet(name, html, start, lines = []) {
    const range = ace.require("ace/range").Range
    const edit = ace.edit(html)

    edit.session.setMode(`ace/mode/${data.snippets[name].match(/<.+>/) ? "html" : "javascript"}`)
    edit.setTheme("ace/theme/tomorrow")
    edit.setValue(data.snippets[name])
    edit.setOptions({maxLines: Infinity, firstLineNumber: start})
    edit.setReadOnly(true)
    edit.gotoLine(0, 1, true)

    lines.forEach(line => edit.session.addMarker(new range(line - 1, 0, line - 1, 1), "new", "fullLine"))
}

function frame(name, html) {
    const content = html.contentWindow || html.contentDocument

    content.document.open()
    content.document.write(data.frames[name])
    content.document.close()
}

const data = {
    editors: {
        physics: `<!DOCTYPE html>
<html>
	<body>
		<canvas id = canvas></canvas>

		<script>
			const ROWS = 10
			const COLUMNS = 10
			const RADIUS = 10
			const GRAVITY = 0.2
			const DAMPING = 0.99

			class Ball {
				constructor(x, y) {
					this.x = x
					this.y = y
					this.speed = {x: 0.1, y: 0}
				}

				update() {
					// make the ball fall
					this.speed.y += GRAVITY

					// slow it down slightly
					this.x += this.speed.x *= DAMPING
					this.y += this.speed.y *= DAMPING

					// check collision with every other ball
					balls.forEach(ball => { 

						// make sure it doesn't collide with itself
						if (ball == this) return

						// find distance and angle between both balls
						const distance = Math.hypot(this.x - ball.x, this.y - ball.y)
						const angle = Math.atan2(ball.y - this.y, ball.x - this.x)

						// if the balls are too close, it means they have collided
						if (distance < RADIUS * 2) {

							// find how much they overlap
							const x = Math.cos(angle) * (RADIUS * 2 - distance) / 2
							const y = Math.sin(angle) * (RADIUS * 2 - distance) / 2

							// make them move apart from each other 
							this.x -= x
							this.y -= y
							ball.x += x
							ball.y += y

							// alter their speed
							this.speed.x -= x
							this.speed.y -= y
							ball.speed.x += x
							ball.speed.y += y
						}
					})

					// check collision with floor
					if (this.y > canvas.height * 0.9) { 
						this.y = canvas.height * 0.9
						this.speed.y = Math.abs(this.speed.y) * -1
					}

					// left wall 
					if (this.x < RADIUS) {
						this.x = RADIUS
						this.speed.x = Math.abs(this.speed.x)
					} 

					// right wall
					else if (this.x > canvas.width - RADIUS) {
						this.x = canvas.width - RADIUS
						this.speed.x = Math.abs(this.speed.x) * -1
					}

					// draw ball with arc
					context.fillStyle = "#aaa"
					context.beginPath()
					context.arc(this.x, this.y, RADIUS, 0, 2 * Math.PI)
					context.fill()
				} 
			}

			function resize() {
				// set canvas dimentions
				canvas.width = innerWidth
				canvas.height = innerHeight
			}

			function loop() {
				// clear screen
				context.clearRect(0, 0, canvas.width, canvas.height)

				// update all the balls
				balls.forEach(ball => ball.update())

				requestAnimationFrame(loop)
			}

			function start() { 
				// style the body and get rid of margins
				document.body.style.margin = 0
                document.body.style.overflow = "hidden"
                document.body.style.background = "#555"

                // when screen resizes, run the resize function
				addEventListener("resize", resize)
				resize()

				// position all the balls in a grid
				for (let y = 0; y < ROWS; y ++)
					for (let x = 0; x < COLUMNS; x ++)
						balls.push(new Ball(
							canvas.width / 2 - ROWS * RADIUS + RADIUS * 2 * y,
							canvas.height / 3 - COLUMNS * RADIUS * 2 + RADIUS * 2 * x
						))

				// activate game loop
				loop()
			}

			const context = canvas.getContext("2d")
			const balls = []

			start()
		</script>
	</body>
</html>`,

        maze: `<!DOCTYPE html>
<html>
    <body>
        <canvas id = canvas></canvas>

        <script>
            const WIDTH = 35
            const HEIGHT = 35
            const SPEED = 10

            function resize() {
                // set canvas dimentions
                canvas.width = innerWidth
                canvas.height = innerHeight
            }

            function loop() {
                // clear screen
                context.clearRect(0, 0, canvas.width, canvas.height)

                // set size of the squares
                let size = Math.floor(canvas.height / HEIGHT)

                // set x and y offset of the maze
                let x = Math.round(canvas.width / 2 - WIDTH * size / 2)
                let y = Math.round(canvas.height / 2 - HEIGHT * size / 2)

                maze.data.forEach((item, index) => {
                    // if the maze item is empty, don't draw the square
                    if (item == "empty") return

                    // set colors of the different squares
                    if (index == maze.head) context.fillStyle = "#000"
                    else if (item == "visited") context.fillStyle = "#999"
                    else context.fillStyle = "#f77"

                    // draw the square on the maze
                    context.fillRect(
                        x + index % WIDTH * size,
                        y + Math.floor(index / WIDTH) * size,
                        size, size
                    )
                })

                // don't bother to go any further if maze is complete
                if (!maze.data.includes("visited")) return

                // array that stores empty spaces around the head
                let empty = []

                // array that stores visited space next to the head
                let visited

                // check if the head isn't too close to the top
                if (maze.head >= WIDTH * 2) {
                    // check for empty and visited spaces above the head
                    if (maze.data[maze.head - WIDTH * 2] == "empty") empty.push("up")
                    if (maze.data[maze.head - WIDTH] == "visited") visited = "up"
                }

                // check if the head isn't too close to the bottom
                if (maze.head < HEIGHT * WIDTH - WIDTH * 2) {
                    // check for empty and visited spaces below the head
                    if (maze.data[maze.head + WIDTH * 2] == "empty") empty.push("down")
                    if (maze.data[maze.head + WIDTH] == "visited") visited = "down"
                }

                // check if the head isn't too far to the left
                if (maze.head % WIDTH > 1) {
                    // check for empty and visited spaces to the left of the head
                    if (maze.data[maze.head - 2] == "empty") empty.push("left")
                    if (maze.data[maze.head - 1] == "visited") visited = "left" 
                }

                // check if the head isn't too far to the right
                if (maze.head % WIDTH < WIDTH - 2) {
                    // check for empty and visited spaces to the right of the head
                    if (maze.data[maze.head + 2] == "empty") empty.push("right")
                    if (maze.data[maze.head + 1] == "visited") visited = "right"
                }

                function move(direction, type) { 
                    maze.data[maze.head] = type

                    // make the head move two squares in a certain direction
                    for (let i = 0; i < 2; i ++) {
                        maze.head += (
                            direction == "up" ? -WIDTH :
                            direction == "down" ? WIDTH :
                            direction == "left" ? -1 : 1
                        )

                        maze.data[maze.head] = type
                    }
                }

                // check if there are some empty spaces around the head
                if (empty.length > 0) {
                    // make the head move two squares in a random empty direction
                    move(empty[Math.floor(Math.random() * empty.length)], "visited")
                }

                // if there aren't empty spaces around the head, move to a square that is already visited
                else {
                    // make the head move two squares in that visited direction
                    move(visited, "final")
                }
            }

            function start() {
                // style the body and get rid of margins
				document.body.style.margin = 0
                document.body.style.overflow = "hidden"
                document.body.style.background = "#555"

                // fill maze with empty elements
                for (let i = 0; i < WIDTH * HEIGHT; i ++)
                    maze.data[i] = "empty"

                // starting head position becomes visited
                maze.data[maze.head] = "visited"

                // when screen resizes, run the resize function
                addEventListener("resize", resize)
                resize() 

                // activate game loop
                setInterval(loop, 1000 / SPEED)
            }

            const context = canvas.getContext("2d")

            // initialize the maze with empty values and place head in top left corner
            const maze = {head: 0, data: []}

            start() 
        </script>
    </body>
</html>`,

        wave: `<!DOCTYPE html>
<html>
    <body>
        <canvas id = canvas></canvas>

        <script>
            const RESOLUTION = 200
            const DAMPING = 0.99
            const SPREAD = 0.5
            const SPRING = 0.1

            function resize() {
                // empty the list of waves
                points.length = 0

                // set canvas dimentions
                canvas.width = innerWidth
                canvas.height = innerHeight

                // position all the wave segments
                for (let i = 0; i < RESOLUTION; i ++)
                    points.push({height: Math.random() * 0.2 - 0.1, speed: 0})
            }

            function loop() {
                // clear screen
                context.clearRect(0, 0, canvas.width, canvas.height)

                points.forEach((point, index) => {
                    // change speed based on sections on either side
                    point.speed += (points[index == 0 ? RESOLUTION - 1 : index - 1].height - point.height) * SPREAD
                    point.speed += (points[index == RESOLUTION - 1 ? 0 : index + 1].height - point.height) * SPREAD

                    // make the wave move towards the centre
                    point.speed += -point.height * SPRING 

                    // slow the wave down, this makes the splash slowly fade away
                    point.speed *= DAMPING
                })

                points.forEach((point, index) => {
                    // smooth out all the bumps
                    point.height += (points[index == 0 ? RESOLUTION - 1 : index - 1].height - point.height) * 0.1
                    point.height += (points[index == RESOLUTION - 1 ? 0 : index + 1].height - point.height) * 0.1
                })

                // starting coordinate of the shape (left, bottom)
                context.beginPath()
                context.moveTo(0, canvas.height)

                points.forEach((point, index) => {
                    // update height of the section
                    point.height += point.speed

                    // mark position on the screen
                    context.lineTo(
                        index * canvas.width / (RESOLUTION - 1),
                        canvas.height / 2 - point.height * canvas.height / 2
                    )
                })

                // end coordinate of the shape (right, bottom)
                context.lineTo(canvas.width, canvas.height)

                // set outline width
                context.lineWidth = 5

                // draw the outline 
                context.strokeStyle = "#569"
                context.stroke()

                // fill in the shape
                context.fillStyle = "#9ab"
                context.fill()

                requestAnimationFrame(loop)
            }

            function start() {
                // style the body and get rid of margins
                document.body.style.margin = 0
                document.body.style.overflow = "hidden"
                document.body.style.background = "#555"

                // when screen resizes, run the resize function
                addEventListener("resize", resize)
                resize()

                // when the mouse clicks on screen, make a wave
                addEventListener("pointerdown", event =>
                    points[Math.round(event.offsetX / canvas.width * RESOLUTION)].speed = -0.5)

                // activate game loop
                loop()
            }

            const context = canvas.getContext("2d")
            const points = []

            start()
        </script>
    </body>
</html>`,

        path: `<!DOCTYPE html>
<html>
	<body>
		<canvas id = canvas></canvas>

		<script>
			const WIDTH = 40
			const HEIGHT = 40
			const DIAGONAL = false
			const SPEED = 10

			function resize() {
				// set canvas dimentions
				canvas.width = innerWidth
				canvas.height = innerHeight
			}

			function loop() {
				// clear screen
				context.clearRect(0, 0, canvas.width, canvas.height)

				// set size of the squares
				const size = Math.floor(canvas.height / HEIGHT)

				// function that finds an x and y position based on an index value
				function position(index) {
					// set the offset for the squares
					const x = Math.round(canvas.width / 2 - WIDTH * size / 2)
					const y = Math.round(canvas.height / 2 - HEIGHT * size / 2)

					return {
						x: x + index % WIDTH * size,
						y: y + Math.floor(index / WIDTH) * size
					}
				}

				// draw the maze
				context.fillStyle = "#ccc"

				map.forEach((item, index) => {
					// if the maze item is empty, don't draw the square
					if (item == "empty") return

					// draw the square on the maze 
					context.fillRect(position(index).x, position(index).y, size, size)
				})

				// draw the closed squares 
				context.fillStyle = "#999"
				solid.forEach(item => context.fillRect(position(item.index).x, position(item.index).y, size, size))

				// start calculating the active squares
				context.fillStyle = "#cca"
				const extra = []

				active.forEach((item, pos) => {
					// draw the yellow active square
					context.fillRect(position(item.index).x, position(item.index).y, size, size)

					// check if this square is on the goal square
					if (item.index == goal) complete = solid.length

					// add this square to the closed array
					solid.push(item)

					// the code below adds positions to the path array
					const path = []
					const up = item.index > WIDTH
					const down = item.index < WIDTH * HEIGHT - WIDTH
					const left = item.index % WIDTH > 0
					const right = item.index % WIDTH < WIDTH - 1

					if (up) path.push(item.index - WIDTH)
					if (down) path.push(item.index + WIDTH)
					if (left) path.push(item.index - 1)
					if (right) path.push(item.index + 1)

					// if DIAGONAL is set to true, add the diagonal positions
					if (DIAGONAL) {
						if (up && left) path.push(item.index - WIDTH - 1)
						if (up && right) path.push(item.index - WIDTH + 1)
						if (down && left) path.push(item.index + WIDTH - 1)
						if (down && right) path.push(item.index + WIDTH + 1)
					}

					// now we iterate through each position and skip any that we already found or ones that hit a wall
					for (index of path) {
						let found = false

						for (item of extra)
							if (item.index == index) {
								found = true
								break
							}

						for (item of active)
							if (item.index == index) {
								found = true
								break
							}

						for (item of solid)
							if (item.index == index) {
								found = true
								break
							}

						if (map[index] == "wall" || found)
							continue

						// add this position to the active array
						extra.push({index, join: solid.length - 1})
					}
				})

				// all the active squares are reset for the next frame
				active = extra

				// draw the goal square
				context.fillStyle = "#fe5"
				context.fillRect(position(goal).x, position(goal).y, size, size)

				// draw the player
				context.fillStyle = "#000"
				context.fillRect(position(player).x, position(player).y, size, size)

				// if the path has been calculated, draw it
				if (complete) {
					let next = complete

                    // set the width of the line
                    context.lineWidth = 2

					// draw a red line from the goal to the player
                    context.beginPath()
					context.strokeStyle = "#f00"

					// when next is equal to -1, the line is finished
					while (next != -1) {
						const pos = position(solid[next].index)
						context.lineTo(pos.x + size / 2, pos.y + size / 2)

						// go to the next square in the path
						next = solid[next].join
					}

					context.stroke()
				}
			}

			function start() {
				// style the body and get rid of margins
				document.body.style.margin = 0
                document.body.style.overflow = "hidden"
                document.body.style.background = "#777"

				// fill maze with empty elements
				for (let i = 0; i < WIDTH * HEIGHT; i ++)
					map[i] = (Math.random() < 0.3 && i != player && i != goal) ? "wall" : "empty"

				// when screen resizes, run the resize function
				addEventListener("resize", resize)
				resize()

				// activate game loop
				setInterval(loop, 1000 / SPEED)
			}

			const context = canvas.getContext("2d")

			// initialize the maze with empty values and place head in top left corner
			const map = []

			// set the position of the player and goal square
			const player = Math.floor(Math.random() * WIDTH * HEIGHT)
			const goal = Math.floor(Math.random() * WIDTH * HEIGHT)

			// set up the active path finding array
			let active = [{index: player, join: -1}]

			// set up the closed path array
			let solid = []

			// the goal index value
			let complete = 0

			start()
		</script>
	</body>
</html>`,

        mandelbrot: `<!DOCTYPE html>
<html>
	<body>
		<canvas id = canvas></canvas>

		<script>
			// detail and zoom of set
			const PRECISION = 20
			const ZOOM = 150

			function resize() { 
				// set canvas dimentions
				canvas.width = innerWidth
				canvas.height = innerHeight

				//reset line position
				x = 0
			}

			function loop() {
				// this loop fills the whole column with pixels
				for (let y = 0; y < canvas.height; y ++) {
					const original_x = (x - canvas.width * 0.6) / ZOOM
					const original_y = (y - canvas.height * 0.5) / ZOOM

					let copy_x = original_x
					let copy_y = original_y

					// do the main calculations
					for (index = 0; index < PRECISION; index ++) {
						let set_x = copy_x ** 2 - copy_y ** 2
						let set_y = 2 * copy_x * copy_y

						copy_x = set_x + original_x
						copy_y = set_y + original_y 

						// change the statement below to make the set have a different pattern
						if (copy_x ** 2 + copy_y ** 2 > 4) break
					}

					// fill in the pixel
					let tone = index / PRECISION * 255
					context.fillStyle = \`rgb(\${tone}, \${tone}, \${tone})\`
					context.fillRect(x, y, 1, 1)
				}

				// increase line position each frame
				x ++ 

				requestAnimationFrame(loop)
			}

			function start() { 
				// starting position of line
				x = 0 

				// style the body and get rid of margins
				document.body.style.margin = 0
				document.body.style.overflow = "hidden"

				// when screen resizes, run the resize function 
				addEventListener("resize", resize)
				resize()

				// activate game loop
				loop()
			} 

			const context = canvas.getContext("2d")
			start()
		</script>
	</body>
</html>`,

        mandelbrot_color: `<!DOCTYPE html>
<html>
    <body>
        <canvas id = canvas></canvas>

        <script>
            // detail of set
            const PRECISION = 500 

            function resize() { 
                // set canvas dimentions
                canvas.width = innerWidth
                canvas.height = innerHeight

                //reset line position
                x = 0
            }

            function loop() {
                // this loop fills the whole column with pixels
                for (let y = 0; y < canvas.height; y ++) {
                    const original_x = (x - position.x * zoom - canvas.width * 0.6) / zoom
                    const original_y = (y - position.y * zoom - canvas.height * 0.5) / zoom

                    let copy_x = original_x
                    let copy_y = original_y

                    // do the main calculations
                    for (index = 0; index < PRECISION; index ++) {
                        let set_x = copy_x ** 2 - copy_y ** 2
                        let set_y = 2 * copy_x * copy_y

                        copy_x = set_x + original_x
                        copy_y = set_y + original_y 

                        // change the statement below to make the set have a different pattern
                        if (copy_x ** 2 + copy_y ** 2 > 4) break
                    }

                    // fill in the pixel
                    const tone = index % 50
                    context.fillStyle = \`rgb(\${index % 70 * tone * 0.2}, \${index % 50 * tone * 0.12}, \${index % 30 * tone * 0.1})\`
                    context.fillRect(x, y, 1, 1)
                }

                // increase line position each frame
                x ++ 

                requestAnimationFrame(loop)
            }

            function start() {
                // starting position of line
                x = 0 

                // style the body and get rid of margins
                document.body.style.margin = 0
                document.body.style.overflow = "hidden"

                // when screen resizes, run the resize function
                addEventListener("resize", resize)
                resize()

                addEventListener("mousedown", event => {
                    zoom += zoom * 2
                    position.x -= (event.clientX - canvas.width * 0.6) / zoom * 2
                    position.y -= (event.clientY - canvas.height * 0.5) / zoom * 2
                    
                    // reset line position
                    x = 0
                })

                // activate game loop
                loop()
            } 

            const context = canvas.getContext("2d") 

            // starting position and zoom
            const position = {x: 0, y: 0}
            let zoom = 150

            start()
        </script>
    </body>
</html>`
    },

    snippets: {
        mandelbrot: `// starting position of square
const original_x = 0.2
const original_y = 0.6

// copy the position
let copy_x = original_x
let copy_y = original_y

// make a loop that does a maximum of 10 iterations
for (index = 0; index < 10; index ++) {

    // perform the main calculations
    let set_x = copy_x * copy_x - copy_y * copy_y
    let set_y = 2 * copy_x * copy_y

    copy_x = set_x + original_x
    copy_y = set_y + original_y

    // if the position is out of bounds, cancel the loop
    if (copy_x * copy_x + copy_y * copy_y > 4)
        break;
}`,

        bigint: `// scale of everything
const offset = 100

// starting position of square
const original_x = 0.2 * offset
const original_y = 0.6 * offset

// copy the position
let copy_x = original_x
let copy_y = original_y

// make a loop that does a maximum of 10 iterations
for (index = 0; index < 10; index ++) {

    // perform the main calculations
    let set_x = (copy_x * copy_x) / offset - (copy_y * copy_y) / offset
    let set_y = (2 * copy_x * copy_y) / offset

    copy_x = set_x + original_x
    copy_y = set_y + original_y 

    // if the position is out of bounds, cancel the loop
    if ((copy_x * copy_x) / offset + (copy_y * copy_y) / offset > 4 * offset) 
        break;
}`,

        chat_server_1: `const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)`,

        chat_server_2: `const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)

app.use(express.static(__dirname + "/public"))
app.get("/", (request, response) => response.render("index.html"))`,

        chat_server_3: `const io = require("socket.io")(server)

app.use(express.static(__dirname + "/public"))
app.get("/", (request, response) => response.render("index.html"))

server.listen(5000, () => console.log("Server listening..."))`,

        chat_server_4: `<!DOCTYPE html>
<html>
    <head>
        <title>Chat App</title>
    </head>

    <body>
        <h1>Welcome</h1>
        Welcome to the new application.
    </body>
</html>`,

        chat_main_1: `<!DOCTYPE html>
<html>
    <head>
        <title>Chat App</title>
    </head>

    <body>
        <div id = main></div>
    </body>
</html>`,

        chat_main_2: `<!DOCTYPE html>
<html>
    <head>
        <title>Chat App</title>

        <style>
            html {
                height: 100%;
            }

            body { 
                margin: 0;
                background: #555;
                height: 100%;
            }

            #main {
                max-width: 64em;
                margin: 0 auto;
                background: #aaa;
                height: 100%;
                overflow: auto;
            }
        </style>
    </head>`,

        chat_main_3: `    <body>
		<div id = main></div>
		<div id = base></div>
	</body>
</html>`,

        chat_main_4: `        <style>
            html {
                height: 100%;
            }

            body { 
                margin: 0;
                background: #555;
                height: 100%;
            }

            #main {
                max-width: 64em;
                margin: 0 auto;
                background: #aaa;
                height: calc(100% - 4.5em);
                overflow: auto;
            }

            #base {
                max-width: 64em;
                margin: 0 auto;
                background: #bbb;
                height: 4.5em;
            }
        </style>
    </head>`,

        chat_main_5: `    <body>
		<div id = main></div>
		<div id = base>
			<form id = form>
				<input id = input type = text placeholder = "Type Message">
			</form>
		</div>
	</body>`,

        chat_main_6: `        <style>
            html {
                height: 100%;
            }

            body { 
                margin: 0;
                background: #555;
                height: 100%;
            }

            #main {
                max-width: 64em;
                margin: 0 auto;
                background: #aaa;
                height: calc(100% - 4.5em);
                overflow: auto;
            }

            #base {
                max-width: 64em;
                margin: 0 auto;
                background: #bbb;
                height: 4.5em;
            }

            #base #form {
                padding: 1rem;
            }

            #base #input {
                border-radius: 0.3em;
                border: solid #888;
                font-size: 16px;
                box-sizing: border-box;
                width: 100%;
                padding: 0.4em;
                height: 2.5em;
            }
        </style>
    </head>`,

        chat_main_7: `    <body>
		<div id = main>
			<div id = box><div>This is a test message.</div></div>
		</div>

		<div id = base>
			<form id = form>
				<input id = input type = text placeholder = "Type Message">
			</form>
		</div>
	</body>`,

        chat_main_8: `        <style>
            html {
                height: 100%;
            }

            body { 
                margin: 0;
                background: #555;
                height: 100%;
            }

            #main {
                max-width: 64em;
                margin: 0 auto;
                background: #aaa;
                height: calc(100% - 4.5em);
                overflow: auto;
            }

            #base {
                max-width: 64em;
                margin: 0 auto;
                background: #bbb;
                height: 4.5em;
            }

            #base #form {
                padding: 1rem;
            }

            #base #input {
                border-radius: 0.3em;
                border: solid #888;
                font-size: 16px;
                box-sizing: border-box;
                width: 100%;
                padding: 0.4em;
                height: 2.5em;
            }

            #box {
                padding: 1em 1em 0 1em;
            }

            #box div {
                background: #eee;
                padding: 0.4em;
                border-radius: 0.3em;
                overflow: hidden;
                font-size: 16px;
            }
        </style>`,

        chat_socket_1: `<!DOCTYPE html>
<html>
    <head>
        <title>Chat App</title>
        <script src = socket.io/socket.io.js></script>`,

        chat_socket_2: `    <body>
		<div id = main>
			<div id = box><div>This is a test message.</div></div>
		</div>

		<div id = base>
			<form id = form>
				<input id = input type = text placeholder = "Type Message">
			</form>
		</div>

		<script>
			const socket = io()
		</script>
	</body>
</html>`,

        chat_socket_3: `        <script>
            const socket = io()

            form.addEventListener("submit", event => {
                event.preventDefault() 
                console.log(input.value)
            })
        </script>`,

        chat_socket_4: `        <script>
            const socket = io()

            form.addEventListener("submit", event => {
                event.preventDefault() 
                socket.emit("message", input.value)
            })
        </script>`,

        chat_socket_5: `app.use(express.static(__dirname + "/public"))
app.get("/", (request, response) => response.render("index.html"))

io.on("connection", socket => {
    console.log("Client connected")
})

server.listen(5000, () => console.log("Server listening..."))`,

        chat_socket_6: `io.on("connection", socket => {
    console.log("Client connected")

    socket.on("message", data => {
        console.log(data) 
    })
})

server.listen(5000, () => console.log("Server listening..."))`,

        chat_socket_7: `io.on("connection", socket => {
    console.log("Client connected")

    socket.on("message", data => {
        io.emit("input", data)
    })
})`,

        chat_socket_8: `        <script>
            const socket = io()

            form.addEventListener("submit", event => {
                event.preventDefault() 
                socket.emit("message", input.value)
            })

            socket.on("input", data => {
                console.log(data)
            }) 
        </script>`,

        chat_socket_9: `            form.addEventListener("submit", event => {
                event.preventDefault()
                socket.emit("message", input.value) 
            })

            socket.on("input", data => {
                const box = document.createElement("div")
                const div = document.createElement("div")
                
                box.id = "box"
                div.innerText = data

                box.appendChild(div)
                main.appendChild(box)
            })`,

        chat_socket_10: `	<body>
        <div id = main></div>

        <div id = base>
            <form id = form>
                <input id = input type = text placeholder = "Type Message">
            </form>
        </div>

        <script>
            const socket = io()

            form.addEventListener("submit", event => {
                event.preventDefault()
                socket.emit("message", input.value)

                input.value = ""
            })

            socket.on("input", data => {
                const box = document.createElement("div")
                const div = document.createElement("div")
                
                box.id = "box"
                div.innerText = data

                box.appendChild(div)
                main.appendChild(box)
            })
        </script>
    </body>`,

        chat_publish: `io.on("connection", socket => {
    console.log("Client connected")

    socket.on("message", data => {
        io.emit("input", data)
    })
})

server.listen(process.env.PORT || 5000, () => console.log("Server listening..."))`,

        chat: `console.log("hello")`
    },

    frames: {
        wave: `<!DOCTYPE html>
<html>
    <body>
        <canvas id = canvas></canvas>

        <script>
            const RESOLUTION = 50
            const DAMPING = 0.99 
            const SPREAD = 0.1
            const SPRING = 0.01

            function resize() {
                points.length = 0

                canvas.width = innerWidth
                canvas.height = innerHeight

                for (let i = 0; i < RESOLUTION; i ++)
                    points.push({height: Math.random() * 0.2 - 0.1, speed: 0})
            }

            function loop() {
                context.clearRect(0, 0, canvas.width, canvas.height)
                context.lineWidth = 2
                
                points.forEach((point, index) => {
                    point.speed += (points[index == 0 ? RESOLUTION - 1 : index - 1].height - point.height) * SPREAD
                    point.speed += (points[index == RESOLUTION - 1 ? 0 : index + 1].height - point.height) * SPREAD
                    point.speed += -point.height * SPRING
                    point.speed *= DAMPING
                })

                points.forEach((point, index) => {
                    point.height += (points[index == 0 ? RESOLUTION - 1 : index - 1].height - point.height) * 0.1
                    point.height += (points[index == RESOLUTION - 1 ? 0 : index + 1].height - point.height) * 0.1
                })

                points.forEach((point, index) => {
                    point.height += point.speed

                    const x = index * canvas.width / (RESOLUTION - 1)
                    const y = canvas.height / 2 - point.height * canvas.height / 2

                    context.fillStyle = "#f00"
                    context.beginPath()
                    context.moveTo(x, y)
                    context.lineTo(x, canvas.height)
                    context.stroke()

                    context.fillStyle = "#a00"
                    context.fillRect(x - 5, y - 5, 10, 10)
                })

                requestAnimationFrame(loop)
            }

            function start() {
                document.body.style.margin = 0
                document.body.style.overflow = "hidden"
                document.body.style.background = "#9ab"

                addEventListener("resize", resize)
                resize()

                addEventListener("pointerdown", event =>
                    points[Math.round(event.offsetX / canvas.width * RESOLUTION)].speed = -0.5)

                loop()
            }

            const context = canvas.getContext("2d")
            const points = []

            start()
        </script>
    </body>
</html>`,

        mandelbrot_axis: `<!DOCTYPE html>
<html>
	<body>
		<canvas id = canvas></canvas>

		<script>
			const WIDTH = 50
			const SIZE = 10

			function resize() {
				canvas.width = innerWidth
				canvas.height = innerHeight
			}

			function position(index) {
				return {x: (index % WIDTH - WIDTH / 2) / WIDTH * 4, y: (Math.floor(index / WIDTH) - WIDTH / 2) / WIDTH * 4}
			} 

			function loop() {
				context.clearRect(0, 0, canvas.width, canvas.height)

				squares.forEach((item, index) => {
					if (item.x ** 2 + item.y ** 2 < 4 && item.value < 10) {
						let x = item.x ** 2 - item.y ** 2
						let y = 2 * item.x * item.y 

						item.x = position(index).x + x
						item.y = position(index).y + y
						item.value ++
					}

					if (time % 12 == 0) {
						item.x = position(index).x
						item.y = position(index).y
						item.value = 0 
					}

					context.fillStyle = "rgb(255, 255, 255, " + item.value / 10 + ")"

					context.fillRect( 
						Math.floor(index % WIDTH * SIZE + (canvas.width - WIDTH * SIZE - SIZE) / 2),
						Math.floor(Math.floor(index / WIDTH) * SIZE + (canvas.height - WIDTH * SIZE - SIZE) / 2),
						SIZE, SIZE
					)
				})

				context.strokeStyle = "#800"
				context.beginPath()
				context.moveTo(0, canvas.height / 2)
				context.lineTo(canvas.width, canvas.height / 2)
				context.moveTo(canvas.width / 2, 0)
				context.lineTo(canvas.width / 2, canvas.height)
				context.stroke()

				time ++
			}

			function start() {
				canvas.style.width = "100%"
				document.body.style.margin = 0
				document.body.style.overflow = "hidden"
				document.body.style.background = "#333"

				addEventListener("resize", resize)
				resize()

				for (let i = 0; i < WIDTH ** 2; i ++)
					squares.push({x: position(i).x, y: position(i).y, value: 0})

				setInterval(loop, 500)
			}

			const context = canvas.getContext("2d")
			const squares = []
			let time = 0

			start()
		</script>
	</body>
</html>`,

        mandelbrot_calculate: `<!DOCTYPE html>
<html>
    <body>
        <canvas id = canvas></canvas>

        <script>
            const WIDTH = 10
            const SIZE = 50

            function resize() {
                canvas.width = innerWidth
                canvas.height = innerHeight
            }

            function position(index) {
                return {x: (index % WIDTH - WIDTH / 2) / WIDTH * 4, y: (Math.floor(index / WIDTH) - WIDTH / 2) / WIDTH * 4}
            } 

            function loop() {
                context.clearRect(0, 0, canvas.width, canvas.height)

                if (current.positions[0].x ** 2 + current.positions[0].y ** 2 < 4 && squares[current.index] < 10) {
                    let x = current.positions[0].x ** 2 - current.positions[0].y ** 2
                    let y = 2 * current.positions[0].x * current.positions[0].y

                    current.positions.unshift({x: position(current.index).x + x, y: position(current.index).y + y})
                    squares[current.index] ++
                }

                else {
                    if (squares.length == current.index + 1) {
                        current.index = 0
                        squares.length = 0

                        for (let i = 0; i < WIDTH ** 2; i ++)
                            squares.push(0)
                    }

                    else current.index ++
                    current.positions = [position(current.index)]
                }

                squares.forEach((item, index) => {
                    context.fillStyle = "rgb(255, 255, 255, " + item / 10 + ")"

                    context.fillRect(
                        Math.floor(index % WIDTH * SIZE + (canvas.width - WIDTH * SIZE - SIZE) / 2),
                        Math.floor(Math.floor(index / WIDTH) * SIZE + (canvas.height - WIDTH * SIZE - SIZE) / 2),
                        SIZE, SIZE
                    )
                }) 

                context.strokeStyle = "#800"
                context.fillStyle = "#800"
                context.lineWidth = 3
                context.beginPath()

                current.positions.forEach(item => {
                    const x = canvas.width / 2 + item.x * WIDTH * SIZE / 4
                    const y = canvas.height / 2 + item.y * WIDTH * SIZE / 4
                    context.fillRect(x - 5, y - 5, 10, 10)
                    context.lineTo(x, y)
                })
                
                context.stroke()
            }

            function start() {
                canvas.style.width = "100%"
                document.body.style.margin = 0
                document.body.style.overflow = "hidden"
                document.body.style.background = "#333"

                addEventListener("resize", resize)
                resize()

                for (let i = 0; i < WIDTH ** 2; i ++)
                    squares.push(0) 

                setInterval(loop, 500)
            }

            const context = canvas.getContext("2d")
            const current = {index: 0, positions: [position(0)]}
            const squares = []
            let time = 0

            start()
        </script>
    </body>
</html>`,

        chat: `<!DOCTYPE html>
<html>
    <head>
        <title>Chat App</title>
    </head>

    <body>
        <h1>Welcome</h1>
        Welcome to the new application.
    </body>
</html>`,
    }
}