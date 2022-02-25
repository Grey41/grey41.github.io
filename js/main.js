"use strict"

const mutation = new MutationObserver(() => {
    if (!document.body) return

    const theme = localStorage.getItem("theme")
    const dark = matchMedia("(prefers-color-scheme: dark)").matches
    const current = theme ? theme : dark ? "dark" : "light"
    const icon = document.querySelector(".theme")

    document.body.setAttribute("theme", current)
    icon.className += ` fa-solid fa-${current == "dark" ? "moon" : "sun"}`
    mutation.disconnect()
})

mutation.observe(document.documentElement, {childList: true})

function toggleBars(element) {
    const top = element.parentNode

    if (top.className == "top")
        top.className += " active"

    else top.className = "top"
}

function toggleTheme(element) {
    const theme = document.body.getAttribute("theme")
    const current = theme == "dark" ? "light" : "dark"

    localStorage.setItem("theme", current)
    document.body.setAttribute("theme", current)

    element.className = element.className.replace(
        /(moon|sun)/, current == "dark" ? "moon" : "sun")
}

function insertCode(code) {
    const all = document.getElementsByTagName("iframe")
    all[all.length - 1].srcdoc = code
}

onload = () => {
    year.textContent = new Date().getFullYear()
    
    const format = text => text.replace(
        /( ){16}.*/g, a => a.substring(16)).replace(/\n([\s\S]*)\n/g, "$1").replace(/&sol;/g, "/")

    let element; while (element = document.querySelector("script[type]")) {
        const text = format(element.textContent)

        if (element.type == "editor") {
            const div = document.createElement("div")
            const pre = document.createElement("pre")
            const textarea = document.createElement("textarea")
            const iframe = document.createElement("iframe")

            div.className = "editor"
            div.appendChild(pre)
            div.appendChild(textarea)

            textarea.onscroll = () => {
                pre.scrollTop = textarea.scrollTop
                pre.scrollLeft = textarea.scrollLeft
            }

            textarea.oninput = () => {
                const text = hljs.highlight(textarea.value, {language: "html"}).value
                pre.innerHTML = text + (text.endsWith("\n") ? " " : "")
                iframe.srcdoc = textarea.value

                textarea.onscroll()
            }

            textarea.value = text
            textarea.spellcheck = false
            textarea.oninput()

            element.parentNode.replaceChild(div, element)
            div.before(iframe)
        }

        else if (element.type == "result") {
            const iframe = document.createElement("iframe")
            element.parentNode.replaceChild(iframe, element)
            iframe.srcdoc = text
        }

        else {
            const pre = document.createElement("pre")
            element.parentNode.replaceChild(pre, element)
            pre.textContent = text
            
            if (element.type != "text") {
                pre.className = "snippet"

                pre.innerHTML = text.replace(/</g, "&lt;").replace(
                    /‡[\s\S]*?‡/g, a => `<span class=code>${hljs.highlight(
                        a.slice(1, -1).replace(/&lt;/g, "<"),
                        {language: element.type}).value}</span>`)
            }
        }
    }
}