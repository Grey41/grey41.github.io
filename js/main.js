addEventListener("DOMContentLoaded", () => {
    const footers = document.getElementsByTagName("footer")
    const number = parseInt(localStorage.getItem("type"))

    window.type = isNaN(number) ? new Date().getHours() > 6 && new Date().getHours() < 18 : number
    window.lost = (typeof ace === "undefined")

    for (footer of footers)
        footer.innerText = "\u00a9 Copyright " + new Date().getFullYear() + " GreyHope"

    document.querySelector(".theme").firstChild.className = (type ? "fas fa-sun" : "fas fa-moon")
    theme.href = "css/" + (type ? "light" : "dark") + ".css"

    if (lost) return

    window.editors = document.querySelectorAll(".editor")
    window.demos = Object.values(document.querySelectorAll(".iframe"))
    window.examples = Object.values(document.querySelectorAll(".example"))
    window.frames = Object.values(document.querySelectorAll(".demo"))

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
        const editor = Object.values(editors)[index]

        demos[index] = {iframe, editor, ace: ace.edit(editor)}
        demos[index].ace.session.setMode("ace/mode/html")
        demos[index].ace.setTheme(color())
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
        examples[index] = {example, ace: ace.edit(example)}
        examples[index].ace.session.setMode("ace/mode/" + (text[index].code.match(/<\w+>/) ? "html" : "javascript"))
        examples[index].ace.setTheme(color())
        examples[index].ace.setValue(text[index].code)
        examples[index].ace.setReadOnly(true)
        examples[index].ace.setOptions({maxLines: Infinity, firstLineNumber: text[index].start})
        examples[index].ace.gotoLine(0, 1, true)
        text[index].lines.forEach(line => examples[index].ace.session.addMarker(new range(line - 1, 0, line - 1, 1), "new", "fullLine"))
    })

    frames.forEach((frame, index) => write(frame, source[index]))
})

const color = () => "ace/theme/" + (type ? "chrome" : "monokai")

const bar = () => {
    let top = document.querySelector(".top")
    
    if (top.className === "top") top.className += " responsive"    
    else top.className = "top"
}

const change = event => {
    type = !type
    theme.href = "css/" + (type ? "light" : "dark") + ".css"
    event.firstChild.className = (type ? "fas fa-sun" : "fas fa-moon")
    localStorage.setItem("type", type ? 1 : 0)

    if (lost) return

    demos.forEach(item => item.ace.setTheme(color()))
    examples.forEach(item => item.ace.setTheme(color()))
}