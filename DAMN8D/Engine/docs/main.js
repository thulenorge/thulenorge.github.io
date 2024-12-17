async function loadText(url) {
	var response = await fetch(url);
	return await response.text();
}

function markdown(data) {
	return data;
}

(async function main() {
	document.body.innerHTML = markdown(await loadText("v0.0.0.0_a.md"));
})();
