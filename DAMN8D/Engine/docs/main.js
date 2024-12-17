async function loadText(url) {
	var xhr = new XMLHttpRequest();

	xhr.open("GET", url, false);
	xhr.onload = function (e) {
		data = this.responseText;
	};

	xhr.send();

	return xhr;
}

function markdown(data) {
	md = md.replace(/[#]{1}(.+)/g, "<h1>$1</h1>");

	return data;
}

(function main() {
	document.body.innerHTML = markdown(loadText("v0.0.0.0_a.md"));
})();
