window.addEventListener("DOMContentLoaded", () => {
	const footers = document.getElementsByTagName("footer")

	for (footer of footers)
		footer.innerText = "\u00a9 Copyright " + new Date().getFullYear() + " GreyHope"

	if (typeof ace === "undefined") return

	const editors = document.querySelectorAll(".editor")
	const demos = Object.values(document.querySelectorAll(".iframe"))
	const examples = Object.values(document.querySelectorAll(".example"))
	const frames = Object.values(document.querySelectorAll(".demo"))
	const range = ace.require("ace/range").Range

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

		if (iframe.id == "scroll") {
			demos[index].iframe.onmouseenter = () => document.body.style.overflow = "hidden"
			demos[index].iframe.onmouseleave = () => document.body.style.overflow = "auto"
		}

		write(iframe, code)
		return iframe
	}

	demos.forEach((iframe, index) => {
		const span = document.createElement("span")
		const editor = Object.values(editors)[index]

		span.className = "note"
		span.innerText = "Edit the code to change the result above."
		editor.after(span)

		demos[index] = {iframe, editor, ace: ace.edit(editor)}
		demos[index].ace.session.setMode("ace/mode/html")
		demos[index].ace.setTheme("ace/theme/monokai")
		demos[index].ace.setValue(edit[index].code)
		demos[index].ace.on("change", () => demos[index].iframe = reset(demos[index].iframe, demos[index].ace.getValue()))
		demos[index].ace.gotoLine(0, 1, true)
		demos[index].ace.setOptions({maxLines: 25})

		edit[index].lines.forEach(line => demos[index].ace.session.addMarker(new range(line - 1, 0, line - 1, 1), "new", "fullLine"))

		if (iframe.id == "scroll") {
			demos[index].iframe.onmouseenter = () => document.body.style.overflow = "hidden"
			demos[index].iframe.onmouseleave = () => document.body.style.overflow = "auto"
		}

		write(demos[index].iframe, demos[index].ace.getValue())
	})

	examples.forEach((example, index) => {
		const editor = ace.edit(example)

		editor.session.setMode("ace/mode/" + (text[index].code.match(/<\w+>/) ? "html" : "javascript"))
		editor.setTheme("ace/theme/monokai")
		editor.setValue(text[index].code)
		editor.setReadOnly(true)
		editor.setOptions({maxLines: Infinity, firstLineNumber: text[index].start})
		editor.gotoLine(0, 1, true)
		text[index].lines.forEach(line => editor.session.addMarker(new range(line - 1, 0, line - 1, 1), "new", "fullLine"))
	})

	frames.forEach((frame, index) => write(frame, source[index]))
})

const bar = () => {
	let top = document.querySelector(".top")
	
	if (top.className === "top") top.className += " responsive"	
	else top.className = "top"
}