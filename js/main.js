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

	const input = (demo) => {
		const frame = document.createElement("iframe")
		frame.className = "iframe"

		demo.iframe.before(frame)
		demo.iframe.remove()
		demo.iframe = frame

		write(demo.iframe, demo.ace.getValue())
	}

	demos.forEach((iframe, index) => {
		const span = document.createElement("span")
		span.className = "note"
		span.innerText = "Edit the code to change the result above."

		const editor = Object.values(editors)[index]
		editor.after(span)

		demos[index] = {iframe, editor, ace: ace.edit(editor), hold: false}
		demos[index].ace.session.setMode("ace/mode/html")
		demos[index].ace.setTheme("ace/theme/monokai")
		demos[index].ace.setValue(demos[index].ace.getValue().trim())
		demos[index].ace.on("change", () => input(demos[index]))
		input(demos[index])

		document.addEventListener("mousedown", () => demos[index].hold = true)
		document.addEventListener("mousemove", () => demos[index].hold && demos[index].ace.resize())

		document.addEventListener("mouseup", () => {
			demos[index].hold = false
			input(demos[index])
		})
	})

	examples.forEach(example => {
		const editor = ace.edit(example)

		console.log(editor.getValue())

		editor.session.setMode("ace/mode/javascript")
		editor.setTheme("ace/theme/monokai")
		editor.setValue(editor.getValue().trim())
		editor.setReadOnly(true)
		editor.setOptions({maxLines: Infinity})
	})

	frames.forEach(frame =>	write(frame, frame.innerHTML))
})

const bar = () => {
	let top = document.querySelector(".top")
	
	if (top.className === "top") top.className += " responsive"	
	else top.className = "top"
}