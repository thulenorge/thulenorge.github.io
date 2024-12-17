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
	return data;
}

(function main() {
	load(document.querySelector("select").value);
})();
