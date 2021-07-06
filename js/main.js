window.addEventListener("DOMContentLoaded", loaded)

function loaded() {
	document.body.innerHTML = document.body.innerHTML
	.replace(/¦/g, "<font color = '77b13e'>")
	.replace(/%/g, "<font color = '999999'>")
	.replace(/{/g, "<font color = '3e77b1'>")
	.replace(/}/g, "</font>")
	.replace("^", new Date().getFullYear().toString())

    window.onscroll = function() {
		if (document.scrollingElement.scrollTop > 100) $(".back").fadeIn()
		else $(".back").fadeOut()
	}
}

function bar() {
	let top = document.querySelector(".top")
	
	if (top.className === "top") top.className += " responsive"	
	else top.className = "top"
}