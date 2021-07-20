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
		demos[index].ace.session.setMode("ace/mode/html")
		demos[index].ace.setTheme("ace/theme/monokai")
		demos[index].ace.setValue(edit[index].code)
		demos[index].ace.on("change", () => demos[index].iframe = reset(demos[index].iframe, demos[index].ace.getValue()))
		demos[index].ace.clearSelection()

		const range = ace.require("ace/range").Range
		edit[index].lines.forEach(line => demos[index].ace.session.addMarker(new range(line - 1, 0, line - 1, 1), "new", "fullLine"))

		write(demos[index].iframe, demos[index].ace.getValue())
	})

	examples.forEach((example, index) => {
		const editor = ace.edit(example)

		editor.session.setMode("ace/mode/javascript")
		editor.setTheme("ace/theme/monokai")
		editor.setValue(text[index])
		editor.setReadOnly(true)
		editor.setOptions({maxLines: Infinity})
		demos[index].ace.clearSelection()
	})

	frames.forEach((frame, index) => write(frame, source[index]))

	document.addEventListener("mousedown", () => demos.forEach(item => item.hold = true))
	document.addEventListener("mousemove", () => demos.forEach(item => item.hold && item.ace.resize()))
	document.addEventListener("mouseup", () => demos.forEach(item => item.hold = false))
})

const bar = () => {
	let top = document.querySelector(".top")
	
	if (top.className === "top") top.className += " responsive"	
	else top.className = "top"
}