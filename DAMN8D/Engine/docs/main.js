function load(url) {
	fetch(url).then(function (response) {
		return response.text();
	}).then(function (data) {
		document.querySelector("#Markdown").innerHTML = markdown(data);
	}).catch(function (error) {
		documnt.querySelector("#Markdown").innerText = "Page not found!";
	});
}

function markdown(data) {
	data = data.replace(/[#]{6}(.+)/g, "<h6>$1</h6>");
	data = data.replace(/[#]{5}(.+)/g, "<h5>$1</h5>");
	data = data.replace(/[#]{4}(.+)/g, "<h4>$1</h4>");
	data = data.replace(/[#]{3}(.+)/g, "<h3>$1</h3>");
	data = data.replace(/[#]{2}(.+)/g, "<h2>$1</h2>");
	data = data.replace(/[#]{1}(.+)/g, "<h1>$1</h1>");
	
	return data;
}

(function main() {
	document.querySelector("select").onchange = function (e) {
		load(e.options[e.selectedIndex].value);
	};
})();
