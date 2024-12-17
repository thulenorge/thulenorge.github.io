async function loadText(url) {
	var response = await fetch(url);
	return await response.text();
}

async function markdown(data) {
	md = md.replace(/[#]{1}(.+)/g, "<h1>$1</h1>");

	return data;
}

(async function main() {
	document.body.innerHTML = markdown(await loadText("v0.0.0.0_a.md"));
})();
