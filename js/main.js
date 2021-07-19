window.addEventListener("DOMContentLoaded", () => {
	const footers = document.getElementsByTagName("footer")

	for (footer of footers)
		footer.innerText = "\u00a9 Copyright " + new Date().getFullYear() + " GreyHope"

	if (typeof ace === "undefined") return

	const iframes = document.querySelectorAll(".iframe")
	const editors = document.querySelectorAll(".editor")
	const list = document.querySelectorAll(".example")
	const array = document.querySelectorAll(".demo")

	const demos = Object.values(iframes)
	const examples = Object.values(list)
	const frames = Object.values(array)

	const write = (iframe, code) => {
		const content = iframe.contentWindow || iframe.contentDocument
		content.document.open()
		content.document.write(code)
		content.document.close()
	}

	const reset = (iframe, code) => {
		const frame = document.createElement("iframe")
		frame.className = iframe.className
		frame.id = iframe.id

		iframe.before(frame)
		iframe.remove()
		iframe = frame

		write(iframe, code)
		return iframe
	}

	demos.forEach((iframe, index) => {
		const span = document.createElement("span")
		const editor = Object.values(editors)[index]

		span.className = "note"
		span.innerText = "Edit the code to change the result above."
		editor.after(span)

		demos[index] = {iframe, editor, ace: ace.edit(editor), hold: false}
		demos[index].ace.session.setMode("ace/mode/" + text[iframe.id].type)
		demos[index].ace.setTheme("ace/theme/monokai")
		demos[index].ace.setValue(text[iframe.id].code)
		demos[index].ace.on("change", () => demos[index].iframe = reset(demos[index].iframe, demos[index].ace.getValue()))
		write(demos[index].iframe, demos[index].ace.getValue())
	})

	examples.forEach(example => {
		const editor = ace.edit(example)

		editor.session.setMode("ace/mode/" + text[example.id].type)
		editor.setTheme("ace/theme/monokai")
		editor.setValue(text[example.id].code)
		editor.setReadOnly(true)
		editor.setOptions({maxLines: Infinity})
	})

	frames.forEach(frame =>	write(frame, text[frame.id].code))

	document.addEventListener("mousedown", () => demos.forEach(item => item.hold = true))
	document.addEventListener("mousemove", () => demos.forEach(item => item.hold && item.ace.resize()))
	document.addEventListener("mouseup", () => demos.forEach(item => item.hold = false))
})

const bar = () => {
	let top = document.querySelector(".top")
	
	if (top.className === "top") top.className += " responsive"	
	else top.className = "top"
}

const text = {
	physics_1: {
		type: "html",
		code: (
			"<!DOCTYPE html>\n\t<body>\n\t\t<canvas id = canvas></canvas>\n\n\t\t<script>\n\t\t\tconst ROWS = 10\n\t\t\tconst COLUMNS = 10\n\t\t\tc" +
			"onst RADIUS = 10\n\t\t\tconst GRAVITY = 0.2\n\t\t\tconst DAMPING = 0.99\n\n\t\t\tclass Ball {\n\t\t\t\tconstructor(x, y) {\n\t\t\t\t\t" +
			"this.x = x\n\t\t\t\t\tthis.y = y\n\t\t\t\t\tthis.speed = {x: 0.1, y: 0}\n\t\t\t\t}\n\n\t\t\t\tupdate() {\n\t\t\t\t\t// make the ball f" +
			"all\n\t\t\t\t\tthis.speed.y += GRAVITY\n\n\t\t\t\t\t// slow it down slightly\n\t\t\t\t\tthis.x += this.speed.x *= DAMPING\n\t\t\t\t\tt" +
			"his.y += this.speed.y *= DAMPING\n\n\t\t\t\t\t// check collision with every other ball\n\t\t\t\t\tballs.forEach(ball => { \n\n\t\t\t\t" +
			"\t\t// make sure it doesn't collide with itself\n\t\t\t\t\t\tif (ball == this) return\n\n\t\t\t\t\t\t// find distance and angle betwee" +
			"n both balls\n\t\t\t\t\t\tconst distance = Math.sqrt((this.x - ball.x) ** 2 + (this.y - ball.y) ** 2)\n\t\t\t\t\t\tconst angle = Math." +
			"atan2(ball.y - this.y, ball.x - this.x)\n\n\t\t\t\t\t\t// if the balls are too close, it means they have collided\n\t\t\t\t\t\tif (dis" +
			"tance < RADIUS * 2) {\n\n\t\t\t\t\t\t\t// find how much they overlap\n\t\t\t\t\t\t\tconst x = Math.cos(angle) * (RADIUS * 2 - distance" +
			") / 2\n\t\t\t\t\t\t\tconst y = Math.sin(angle) * (RADIUS * 2 - distance) / 2\n\n\t\t\t\t\t\t\t// make them move apart from each other " +
			"\n\t\t\t\t\t\t\tthis.x -= x\n\t\t\t\t\t\t\tthis.y -= y\n\t\t\t\t\t\t\tball.x += x\n\t\t\t\t\t\t\tball.y += y\n\n\t\t\t\t\t\t\t// alter" +
			" their speed\n\t\t\t\t\t\t\tthis.speed.x -= x\n\t\t\t\t\t\t\tthis.speed.y -= y\n\t\t\t\t\t\t\tball.speed.x += x\n\t\t\t\t\t\t\tball.sp" +
			"eed.y += y\n\t\t\t\t\t\t}\n\t\t\t\t\t})\n\n\t\t\t\t\t// check collision with floor\n\t\t\t\t\tif (this.y > innerHeight * 0.9) { \n\t\t" +
			"\t\t\t\tthis.y = innerHeight * 0.9\n\t\t\t\t\t\tthis.speed.y = Math.abs(this.speed.y) * -1\n\t\t\t\t\t}\n\n\t\t\t\t\t// left wall \n\t" +
			"\t\t\t\tif (this.x < RADIUS) {\n\t\t\t\t\t\tthis.x = RADIUS\n\t\t\t\t\t\tthis.speed.x = Math.abs(this.speed.x)\n\t\t\t\t\t} \n\n\t\t\t" +
			"\t\t// right wall\n\t\t\t\t\telse if (this.x > innerWidth - RADIUS) {\n\t\t\t\t\t\tthis.x = innerWidth - RADIUS\n\t\t\t\t\t\tthis.spee" +
			"d.x = Math.abs(this.speed.x) * -1\n\t\t\t\t\t}\n\n\t\t\t\t\t// draw ball with javascript arc\n\t\t\t\t\tcontext.fillStyle = \"#aaa\"\n" +
			"\t\t\t\t\tcontext.beginPath()\n\t\t\t\t\tcontext.arc(this.x, this.y, RADIUS, 0, 2 * Math.PI)\n\t\t\t\t\tcontext.fill()\n\t\t\t\t} \n\t" +
			"\t\t}\n\n\t\t\tfunction resize() {\n\t\t\t\t// set canvas dimentions\n\t\t\t\tcanvas.width = innerWidth\n\t\t\t\tcanvas.height = inner" +
			"Height\n\t\t\t}\n\n\t\t\tfunction loop() {\n\t\t\t\t// clear screen\n\t\t\t\tcanvas.width = canvas.width\n\n\t\t\t\t// update all the " +
			"balls\n\t\t\t\tballs.forEach(ball => ball.update())\n\n\t\t\t\trequestAnimationFrame(loop)\n\t\t\t}\n\n\t\t\tfunction start() { \n\t\t" +
			"\t\t// style the body and get rid of margins\n\t\t\t\twith (document.body.style) {\n\t\t\t\t\tmargin = 0\n\t\t\t\t\toverflow = \"hidde" +
			"n\"\n\t\t\t\t\tbackground = \"#555\"\n\t\t\t\t}\n\n\t\t\t\t// position all the balls in a grid\n\t\t\t\tfor (let y = 0; y < ROWS; y ++" +
			" )\n\t\t\t\t\tfor (let x = 0; x < COLUMNS; x ++)\n\t\t\t\t\t\tballs.push(new Ball(\n\t\t\t\t\t\t\tinnerWidth / 2 - ROWS * RADIUS + RAD" +
			"IUS * 2 * y,\n\t\t\t\t\t\t\tinnerHeight / 3 - COLUMNS * RADIUS * 2 + RADIUS * 2 * x\n\t\t\t\t\t\t))\n\n\t\t\t\t// when screen resizes," +
			" run the resize function\n\t\t\t\taddEventListener(\"resize\", resize)\n\t\t\t\tresize()\n\n\t\t\t\t// activate game loop\n\t\t\t\tloo" +
			"p()\n\t\t\t}\n\n\t\t\tconst context = canvas.getContext(\"2d\")\n\t\t\tconst balls = []\n\n\t\t\tstart()\n\t\t</script>\n\t</body>\n</" +
			"html>"
		)
	},

	waves_1: {
		type: "html",
		code: (
			"<!DOCTYPE html>\n\t<body>\n\t\t<canvas id = canvas></canvas>\n\n\t\t<script>\n\t\t\tconst RESOLUTION = 200\n\t\t\tconst DAMPING = 0.99" +
			"\n\t\t\tconst SPREAD = 0.5\n\t\t\tconst SPRING = 0.1\n\n\t\t\tfunction resize() {\n\t\t\t\t// empty the list of waves\n\t\t\t\tpoints." +
			"length = 0\n\n\t\t\t\t// set canvas dimentions\n\t\t\t\tcanvas.width = innerWidth\n\t\t\t\tcanvas.height = innerHeight\n\n\t\t\t\t// p" +
			"osition all the wave segments\n\t\t\t\tfor (let i = 0; i < RESOLUTION; i ++)\n\t\t\t\t\tpoints.push({height: Math.random() * 0.2 - 0.1" +
			", speed: 0})\n\t\t\t}\n\n\t\t\tfunction loop() {\n\t\t\t\t// clear screen\n\t\t\t\tcanvas.width = canvas.width\n\n\t\t\t\tpoints.forEa" +
			"ch((point, index) => {\n\t\t\t\t\t// change speed based on sections on either side\n\t\t\t\t\tpoint.speed += (points[index == 0 ? RESO" +
			"LUTION - 1 : index - 1].height - point.height) * SPREAD\n\t\t\t\t\tpoint.speed += (points[index == RESOLUTION - 1 ? 0 : index + 1].hei" +
			"ght - point.height) * SPREAD\n\n\t\t\t\t\t// make the wave move towards the centre\n\t\t\t\t\tpoint.speed += -point.height * SPRING \n" +
			"\n\t\t\t\t\t// slow the wave down, this makes the splash slowly fade away\n\t\t\t\t\tpoint.speed *= DAMPING\n\t\t\t\t})\n\n\t\t\t\tpoi" +
			"nts.forEach((point, index) => {\n\t\t\t\t\t// smooth out all the bumps\n\t\t\t\t\tpoint.height += (points[index == 0 ? RESOLUTION - 1 " +
			": index - 1].height - point.height) * 0.1\n\t\t\t\t\tpoint.height += (points[index == RESOLUTION - 1 ? 0 : index + 1].height - point.h" +
			"eight) * 0.1\n\t\t\t\t})\n\n\t\t\t\t// starting coordinate of the shape (left, bottom)\n\t\t\t\tcontext.moveTo(0, innerHeight)\n\n\t\t" +
			"\t\tpoints.forEach((point, index) => {\n\t\t\t\t\t// update height of the section\n\t\t\t\t\tpoint.height += point.speed\n\n\t\t\t\t\t" +
			"// mark position on the screen\n\t\t\t\t\tcontext.lineTo(\n\t\t\t\t\t\tindex * innerWidth / (RESOLUTION - 1),\n\t\t\t\t\t\tinnerHeight" +
			" / 2 - point.height * innerHeight / 2\n\t\t\t\t\t)\n\t\t\t\t})\n\n\t\t\t\t// end coordinate of the shape (right, bottom)\n\t\t\t\tcont" +
			"ext.lineTo(innerWidth, innerHeight)\n\n\t\t\t\t// set outline width\n\t\t\t\tcontext.lineWidth = 5\n\n\t\t\t\t// draw the outline \n\t" +
			"\t\t\tcontext.strokeStyle = \"#569\"\n\t\t\t\tcontext.stroke()\n\n\t\t\t\t// fill in the shape\n\t\t\t\tcontext.fillStyle = \"#9ab\"\n" +
			"\t\t\t\tcontext.fill()\n\n\t\t\t\trequestAnimationFrame(loop)\n\t\t\t}\n\n\t\t\tfunction start() {\n\t\t\t\t// style the body and get " +
			"rid of margins\n\t\t\t\twith (document.body.style) {\n\t\t\t\t\tmargin = 0\n\t\t\t\t\toverflow = \"hidden\"\n\t\t\t\t\tbackground = \"" +
			"#555\"\n\t\t\t\t}\n\n\t\t\t\t// when screen resizes, run the resize function\n\t\t\t\taddEventListener(\"resize\", resize)\n\t\t\t\tre" +
			"size()\n\n\t\t\t\t// when the mouse clicks on screen, make a wave\n\t\t\t\taddEventListener(\"mousedown\", event => {\n\t\t\t\t\tpoint" +
			"s[Math.round(event.offsetX / innerWidth * RESOLUTION)].speed = -0.5\n\t\t\t\t})\n\n\t\t\t\t// activate game loop\n\t\t\t\tloop()\n\t\t" +
			"\t}\n\n\t\t\tconst context = canvas.getContext(\"2d\")\n\t\t\tconst points = []\n\n\t\t\tstart()\n\t\t</script>\n\t</body>\n</html>"
		)
	},

	waves_2: {
		type: "html",
		code: (
			"<!DOCTYPE html>\n\t<body>\n\t\t<canvas id = canvas></canvas>\n\n\t\t<script>\n\t\t\tconst RESOLUTION = 50\n\t\t\tconst DAMPING = 0.99 " +
			"\n\t\t\tconst SPREAD = 0.1\n\t\t\tconst SPRING = 0.01\n\n\t\t\tfunction resize() {\n\t\t\t\tpoints.length = 0\n\n\t\t\t\tcanvas.width " +
			"= innerWidth\n\t\t\t\tcanvas.height = innerHeight\n\n\t\t\t\tfor (let i = 0; i < RESOLUTION; i ++)\n\t\t\t\t\tpoints.push({height: Mat" +
			"h.random() * 0.2 - 0.1, speed: 0})\n\t\t\t}\n\n\t\t\tfunction loop() {\n\t\t\t\tcanvas.width = canvas.width\n\t\t\t\tcontext.lineWidth" +
			" = 2\n\t\t\t\t\n\t\t\t\tpoints.forEach((point, index) => {\n\t\t\t\t\tpoint.speed += (points[index == 0 ? RESOLUTION - 1 : index - 1]." +
			"height - point.height) * SPREAD\n\t\t\t\t\tpoint.speed += (points[index == RESOLUTION - 1 ? 0 : index + 1].height - point.height) * SP" +
			"READ\n\t\t\t\t\tpoint.speed += -point.height * SPRING\n\t\t\t\t\tpoint.speed *= DAMPING\n\t\t\t\t})\n\n\t\t\t\tpoints.forEach((point, " +
			"index) => {\n\t\t\t\t\tpoint.height += (points[index == 0 ? RESOLUTION - 1 : index - 1].height - point.height) * 0.1\n\t\t\t\t\tpoint." +
			"height += (points[index == RESOLUTION - 1 ? 0 : index + 1].height - point.height) * 0.1\n\t\t\t\t})\n\n\t\t\t\tpoints.forEach((point, " +
			"index) => {\n\t\t\t\t\tpoint.height += point.speed\n\n\t\t\t\t\tconst x = index * innerWidth / (RESOLUTION - 1)\n\t\t\t\t\tconst y = i" +
			"nnerHeight / 2 - point.height * innerHeight / 2\n\n\t\t\t\t\tcontext.fillStyle = \"#f00\"\n\t\t\t\t\tcontext.beginPath()\n\t\t\t\t\tco" +
			"ntext.moveTo(x, y)\n\t\t\t\t\tcontext.lineTo(x, innerHeight)\n\t\t\t\t\tcontext.stroke()\n\n\t\t\t\t\tcontext.fillStyle = \"#a00\"\n\t" +
			"\t\t\t\tcontext.fillRect(x - 5, y - 5, 10, 10)\n\t\t\t\t})\n\n\t\t\t\trequestAnimationFrame(loop)\n\t\t\t}\n\n\t\t\tfunction start() {" +
			"\n\t\t\t\twith (document.body.style) {\n\t\t\t\t\tmargin = 0\n\t\t\t\t\toverflow = \"hidden\"\n\t\t\t\t\tbackground = \"#9ab\"\n\t\t\t" +
			"\t}\n\n\t\t\t\taddEventListener(\"resize\", resize)\n\t\t\t\tresize()\n\n\t\t\t\taddEventListener(\"mousedown\", event => { \n\t\t\t\t" +
			"\tpoints[Math.round(event.offsetX / innerWidth * RESOLUTION)].speed = -0.5\n\t\t\t\t})\n\n\t\t\t\tloop()\n\t\t\t}\n\n\t\t\tconst conte" +
			"xt = canvas.getContext(\"2d\")\n\t\t\tconst points = []\n\n\t\t\tstart()\n\t\t</script>\n\t</body>\n</html>"
		)
	},

	mandelbrot_1: {
		type: "html",
		code: (
			"<!DOCTYPE html>\n\t<body>\n\t\t<canvas id = canvas></canvas>\n\n\t\t<script>\n\t\t\tconst WIDTH = 40\n\t\t\tconst SIZE = 10\n\n\t\t\tf" +
			"unction resize() {\n\t\t\t\tcanvas.width = innerWidth\n\t\t\t\tcanvas.height = innerHeight\n\t\t\t}\n\n\t\t\tfunction position(index) " +
			"{\n\t\t\t\treturn {x: (index % WIDTH - WIDTH / 2) / WIDTH * 4, y: (Math.floor(index / WIDTH) - WIDTH / 2) / WIDTH * 4}\n\t\t\t} \n\n\t" +
			"\t\tfunction loop() {\n\t\t\t\tcanvas.width = canvas.width\n\n\t\t\t\tsquares.forEach((item, index) => {\n\t\t\t\t\tif (item.x ** 2 + " +
			"item.y ** 2 < 4 && item.value < 10) {\n\t\t\t\t\t\tlet x = item.x ** 2 - item.y ** 2\n\t\t\t\t\t\tlet y = 2 * item.x * item.y \n\n\t\t" +
			"\t\t\t\titem.x = position(index).x + x\n\t\t\t\t\t\titem.y = position(index).y + y\n\t\t\t\t\t\titem.value ++\n\t\t\t\t\t}\n\n\t\t\t\t" +
			"\tif (time % 12 == 0) {\n\t\t\t\t\t\titem.x = position(index).x\n\t\t\t\t\t\titem.y = position(index).y\n\t\t\t\t\t\titem.value = 0 \n" +
			"\t\t\t\t\t}\n\n\t\t\t\t\tconst value = item.value * 25.5\n\t\t\t\t\tcontext.fillStyle = \"rgb(\" + value + \", \" + value + \", \" + v" +
			"alue + \")\"\n\n\t\t\t\t\tcontext.fillRect(\n\t\t\t\t\t\tMath.floor(index % WIDTH * SIZE + (innerWidth - WIDTH * SIZE - SIZE) / 2), \n" +
			"\t\t\t\t\t\tMath.floor(Math.floor(index / WIDTH) * SIZE + (innerHeight - WIDTH * SIZE - SIZE) / 2),\n\t\t\t\t\t\tSIZE, SIZE \n\t\t\t\t" +
			"\t)\n\t\t\t\t})\n\n\t\t\t\tcontext.strokeStyle = \"#800\"\n\t\t\t\tcontext.beginPath()\n\t\t\t\tcontext.moveTo(0, innerHeight / 2)\n\t" +
			"\t\t\tcontext.lineTo(innerWidth, innerHeight / 2)\n\t\t\t\tcontext.moveTo(innerWidth / 2, 0)\n\t\t\t\tcontext.lineTo(innerWidth / 2, i" +
			"nnerHeight)\n\t\t\t\tcontext.stroke()\n\n\t\t\t\ttime ++\n\t\t\t}\n\n\t\t\tfunction start() {\n\t\t\t\tcanvas.style.width = \"100%\"\n" +
			"\n\t\t\t\twith (document.body.style) {\n\t\t\t\t\tmargin = 0\n\t\t\t\t\toverflow = \"hidden\"\n\t\t\t\t\tbackground = \"#000\"\n\t\t\t" +
			"\t}\n\n\t\t\t\taddEventListener(\"resize\", resize)\n\t\t\t\tresize()\n\n\t\t\t\tfor (let i = 0; i < WIDTH ** 2; i ++)\n\t\t\t\t\tsqua" +
			"res.push({x: position(i).x, y: position(i).y, value: 0})\n\n\t\t\t\tsetInterval(loop, 500)\n\t\t\t}\n\n\t\t\tconst context = canvas.ge" +
			"tContext(\"2d\")\n\t\t\tconst squares = []\n\t\t\tlet time = 0\n\n\t\t\tstart()\n\t\t</script>\n\t</body>\n</html>"
		)
	},

	mandelbrot_2: {
		type: "html",
		code: (
			"<!DOCTYPE html>\n\t<body>\n\t\t<canvas id = canvas></canvas>\n\n\t\t<script>\n\t\t\tconst WIDTH = 10\n\t\t\tconst SIZE = 40\n\n\t\t\tf" +
			"unction resize() {\n\t\t\t\tcanvas.width = innerWidth\n\t\t\t\tcanvas.height = innerHeight\n\t\t\t}\n\n\t\t\tfunction position(index) " +
			"{\n\t\t\t\treturn {x: (index % WIDTH - WIDTH / 2) / WIDTH * 4, y: (Math.floor(index / WIDTH) - WIDTH / 2) / WIDTH * 4}\n\t\t\t} \n\n\t" +
			"\t\tfunction loop() {\n\t\t\t\tcanvas.width = canvas.width\n\n\t\t\t\tif (current.positions[0].x ** 2 + current.positions[0].y ** 2 < " +
			"4 && squares[current.index] < 10) {\n\t\t\t\t\tlet x = current.positions[0].x ** 2 - current.positions[0].y ** 2\n\t\t\t\t\tlet y = 2 " +
			"* current.positions[0].x * current.positions[0].y\n\n\t\t\t\t\tcurrent.positions.unshift({x: position(current.index).x + x, y: positio" +
			"n(current.index).y + y})\n\t\t\t\t\tsquares[current.index] ++\n\t\t\t\t}\n\n\t\t\t\telse {\n\t\t\t\t\tif (squares.length == current.in" +
			"dex + 1) {\n\t\t\t\t\t\tcurrent.index = 0\n\t\t\t\t\t\tsquares.length = 0\n\n\t\t\t\t\t\tfor (let i = 0; i < WIDTH ** 2; i ++)\n\t\t\t" +
			"\t\t\t\tsquares.push(0)\n\t\t\t\t\t}\n\n\t\t\t\t\telse current.index ++\n\t\t\t\t\tcurrent.positions = [position(current.index)]\n\t\t" +
			"\t\t}\n\n\t\t\t\tsquares.forEach((item, index) => {\n\t\t\t\t\tconst value = item * 25.5\n\t\t\t\t\tcontext.fillStyle = \"rgb(\" + val" +
			"ue + \", \" + value + \", \" + value + \")\"\n\n\t\t\t\t\tcontext.fillRect(\n\t\t\t\t\t\tMath.floor(index % WIDTH * SIZE + (innerWidth" +
			" - WIDTH * SIZE - SIZE) / 2),\n\t\t\t\t\t\tMath.floor(Math.floor(index / WIDTH) * SIZE + (innerHeight - WIDTH * SIZE - SIZE) / 2),\n\t" +
			"\t\t\t\t\tSIZE, SIZE\n\t\t\t\t\t)\n\t\t\t\t})\n\n\t\t\t\tcontext.strokeStyle = \"#800\"\n\t\t\t\tcontext.fillStyle = \"#800\" \n\t\t\t" +
			"\tcontext.lineWidth = 3\n\t\t\t\tcontext.beginPath()\n\n\t\t\t\tcurrent.positions.forEach(item => {\n\t\t\t\t\tconst x = innerWidth / " +
			"2 + item.x * WIDTH * SIZE / 4\n\t\t\t\t\tconst y = innerHeight / 2 + item.y * WIDTH * SIZE / 4\n\t\t\t\t\tcontext.fillRect(x - 5, y - " +
			"5, 10, 10)\n\t\t\t\t\tcontext.lineTo(x, y)\n\t\t\t\t})\n\t\t\t\t\n\t\t\t\tcontext.stroke()\n\t\t\t}\n\n\t\t\tfunction start() { \n\t\t" +
			"\t\tcanvas.style.width = \"100%\"\n\n\t\t\t\twith (document.body.style) {\n\t\t\t\t\tmargin = 0\n\t\t\t\t\toverflow = \"hidden\"\n\t\t" +
			"\t\t\tbackground = \"#000\"\n\t\t\t\t}\n\n\t\t\t\taddEventListener(\"resize\", resize)\n\t\t\t\tresize()\n\n\t\t\t\tfor (let i = 0; i " +
			"< WIDTH ** 2; i ++)\n\t\t\t\t\tsquares.push(0)\n\n\t\t\t\tsetInterval(loop, 500)\n\t\t\t} \n\n\t\t\tconst context = canvas.getContext(" +
			"\"2d\")\n\t\t\tconst current = {index: 0, positions: [position(0)]}\n\t\t\tconst squares = []\n\t\t\tlet time = 0\n\n\t\t\tstart()\n\t" +
			"\t</script>\n\t</body>\n</html>"
		)
	},

	mandelbrot_3: {
		type: "javascript",
		code: (
			"// starting position of square\nconst original_x = 0.2\nconst original_y = 0.6\n\n// copy the position\nlet copy_x = original_x\nlet c" +
			"opy_y = original_y\n\n// make a loop that does a maximum of 10 iterations\nfor (index = 0; index < 10; index ++) {\n\n\t// perform the" +
			" main calculations\n\tlet set_x = copy_x * copy_x - copy_y * copy_y\n\tlet set_y = 2 * copy_x * copy_y\n\n\tcopy_x = set_x + original_" +
			"x\n\tcopy_y = set_y + original_y\n\n\t// if the position is out of bounds, cancel the loop\n\tif (copy_x * copy_x + copy_y * copy_y > " +
			"4)\n\t\tbreak;\n}"
		)
	},

	mandelbrot_4: {
		type: "html",
		code: (
			"<!DOCTYPE html>\n\t<body>\n\t\t<canvas id = canvas></canvas>\n\n\t\t<script>\n\t\t\tfunction resize() { \n\t\t\t\t// set canvas diment" +
			"ions\n\t\t\t\tcanvas.width = innerWidth\n\t\t\t\tcanvas.height = innerHeight\n\n\t\t\t\t//reset line position\n\t\t\t\tx = 0\n\t\t\t} " +
			"\n\n\t\t\tfunction loop() {\n\t\t\t\t// this loop fills the whole column with pixels\n\t\t\t\tfor (let y = 0; y < innerHeight; y ++)\n" +
			"\t\t\t\t\tcontext.fillRect(x, y, 1, 1)\n\n\t\t\t\t// increase line position each frame\n\t\t\t\tx ++ \n\n\t\t\t\trequestAnimationFrame" +
			"(loop)\n\t\t\t}\n\n\t\t\tfunction start() {\n\t\t\t\t// starting position of line\n\t\t\t\tx = 0 \n\n\t\t\t\t// style the body and get" +
			" rid of margins\n\t\t\t\twith (document.body.style) {\n\t\t\t\t\tmargin = 0\n\t\t\t\t\toverflow = \"hidden\"\n\t\t\t\t}\n\n\t\t\t\t// " +
			"when screen resizes, run the resize function\n\t\t\t\taddEventListener(\"resize\", resize)\n\t\t\t\tresize()\n\n\t\t\t\t// activate ga" +
			"me loop\n\t\t\t\tloop()\n\t\t\t}\n\n\t\t\tconst context = canvas.getContext(\"2d\")\n\t\t\tstart()\n\t\t</script>\n\t</body>\n</html>"
		)
	},

	mandelbrot_5: {
		type: "html",
		code: (
			"<!DOCTYPE html>\n\t<body>\n\t\t<canvas id = canvas></canvas>\n\n\t\t<script>\n\t\t\t// detail of set\n\t\t\tconst PRECISION = 20\n\n\t" +
			"\t\tfunction resize() { \n\t\t\t\t// set canvas dimentions\n\t\t\t\tcanvas.width = innerWidth\n\t\t\t\tcanvas.height = innerHeight\n\n" +
			"\t\t\t\t//reset line position\n\t\t\t\tx = 0\n\t\t\t}\n\n\t\t\tfunction loop() {\n\t\t\t\t// this loop fills the whole column with pix" +
			"els\n\t\t\t\tfor (let y = 0; y < innerHeight; y ++) {\n\t\t\t\t\tconst original_x = (x - innerWidth * 0.6) / 150\n\t\t\t\t\tconst orig" +
			"inal_y = (y - innerHeight * 0.5) / 150\n\n\t\t\t\t\tlet copy_x = original_x\n\t\t\t\t\tlet copy_y = original_y\n\n\t\t\t\t\t// do the " +
			"main calculations\n\t\t\t\t\tfor (index = 0; index < PRECISION; index ++) {\n\t\t\t\t\t\tlet set_x = copy_x ** 2 - copy_y ** 2\n\t\t\t" +
			"\t\t\tlet set_y = 2 * copy_x * copy_y\n\n\t\t\t\t\t\tcopy_x = set_x + original_x\n\t\t\t\t\t\tcopy_y = set_y + original_y \n\n\t\t\t\t" +
			"\t\t// change the statement below to make the set have a different pattern\n\t\t\t\t\t\tif (copy_x ** 2 + copy_y ** 2 > 4) break\n\t\t" +
			"\t\t\t}\n\n\t\t\t\t\t// fill in the pixel\n\t\t\t\t\tlet tone = index / PRECISION * 255\n\t\t\t\t\tcontext.fillStyle = \"rgb(\" + tone" +
			" + \", \" + tone + \", \" + tone + \")\"\n\t\t\t\t\tcontext.fillRect(x, y, 1, 1)\n\t\t\t\t}\n\n\t\t\t\t// increase line position each " +
			"frame\n\t\t\t\tx ++ \n\n\t\t\t\trequestAnimationFrame(loop)\n\t\t\t}\n\n\t\t\tfunction start() {\n\t\t\t\t// starting position of line" +
			"\n\t\t\t\tx = 0 \n\n\t\t\t\t// style the body and get rid of margins\n\t\t\t\twith (document.body.style) {\n\t\t\t\t\tmargin = 0\n\t\t" +
			"\t\t\toverflow = \"hidden\"\n\t\t\t\t}\n\n\t\t\t\t// when screen resizes, run the resize function\n\t\t\t\taddEventListener(\"resize\"" +
			", resize)\n\t\t\t\tresize()\n\n\t\t\t\t// activate game loop\n\t\t\t\tloop()\n\t\t\t} \n\n\t\t\tconst context = canvas.getContext(\"2d" +
			"\")\n\t\t\tstart()\n\t\t</script>\n\t</body>\n</html>"
		)
	}
}