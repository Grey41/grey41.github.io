window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-W2C6ZR2P0X');

window.addEventListener("DOMContentLoaded", () => {
	document.body.innerHTML = document.body.innerHTML
	.replace(/¦/g, "<font color = '77b13e'>")
	.replace(/%/g, "<font color = '999999'>")
	.replace(/{/g, "<font color = '3e77b1'>")
	.replace(/}/g, "</font>")
	.replace("^", new Date().getFullYear().toString())
})

const bar = () => {
	let top = document.querySelector(".top")
	
	if (top.className === "top") top.className += " responsive"	
	else top.className = "top"
}