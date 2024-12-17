function load(url) {
	fetch(url).then(function (response) {
		return response.text();
	}).then(function (data) {
		document.querySelector("#Markdown").innerHTML = data;
	}).catch(function (error) {
		documnt.querySelector("#Markdown").innerText = "Page not found!";
	});
}

(function main() {
	load(document.querySelector("select").value);
})();
