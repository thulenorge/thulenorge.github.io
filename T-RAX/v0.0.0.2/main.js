var TRACK_COUNTER = 0;

function add_track() {
	var _input = prompt("Track title here:") || [];

	var aud = new Audio();

	var input = document.createElement("input");

	input.setAttribute("accept", "audio/wav");

	input.type = "file";

	input.oninput = function (e) {
		var reader = new FileReader();

		reader.readAsDataURL(e.target.files[0]);

		reader.onload = function (e) {
			aud.src = reader.result;
		};
	};

	document.body.appendChild(input);
	input.click();
	document.body.removeChild(input);

	var pl = document.querySelector("#Playlist");

	var track = document.createElement("div");
	track.className = "Track";

	track.appendChild(aud);

	var title = document.createElement("h3");

	var name = document.createElement("span");

	name.innerText = (_input.length == 0) ? "Untitled " + TRACK_COUNTER : _input.toString();

	name.onclick = function (e) {
		var _new_input = prompt("Rename track to:");

		name.innerText = (_new_input.length == 0) ? "Untitled " + TRACK_COUNTER : _new_input.toString();
	};

	var menu = document.createElement("span");

	menu.className = "ImageButton";
	menu.innerText = "\uF141";

	menu.style.cssFloat = "right";

	menu.onclick = function (e) {
		if (track.className == "Track") {
			track.className = "Track Selected";
		} else {
			track.className = "Track";
		}

		if (!document.querySelector(".Dialog")) {
			var dialog = document.createElement("div");

			dialog.className = "Dialog";

			var dialog_title = document.createElement("h1");
			dialog_title.innerText = "Remove this track?";

			var dialog_description = document.createElement("p");
			dialog_description.innerText = "This action is not cancelable and you must create new track for return. Are you sure?";

			var dialog_button = document.createElement("button");
			dialog_button.innerText = "Yes";

			dialog_button.onclick = function (e) {
				pl.removeChild(track);

				delete track;
				delete title;
				delete name;
				delete menu;
				delete volume;

				document.body.removeChild(dialog);

				delete dialog;
				delete dialog_title;
				delete dialog_description;
				delete dialog_button;

				track.removeChild(aud);

				delete aud;
				delete input;
			};

			dialog.appendChild(dialog_title);
			dialog.appendChild(dialog_description);
			dialog.appendChild(dialog_button);

			document.body.appendChild(dialog);
		}
	};

	title.appendChild(name);
	title.appendChild(menu);

	var volume = document.createElement("input");

	volume.className = "Slider";

	volume.oninput = function (e) {
		aud.volume = volume.value * 0.01;
	};

	volume.max = 100;
	volume.min = 0;
	volume.type = "range";
	volume.value = 90;

	var mute = document.createElement("button");

	mute.className = "Button";
	mute.innerText = "M";

	mute.style.background = "#FFFFFF";

	mute.onclick = function (e) {
		if (aud.muted) {
			aud.muted = false;
			mute.style.background = "#FFFFFF";
		} else {
			aud.muted = true;
			mute.style.background = "#F44336";
		}
	};

	track.appendChild(title);
	track.appendChild(volume);
	track.appendChild(mute);

	pl.appendChild(track);

	TRACK_COUNTER++;
}

function engine(callback) {
	var aud = document.querySelectorAll("audio");
	for (var i = 0; i < aud.length; i++) {
		callback(aud[i]);
	}
}

(function main() {
	var _open = document.querySelector("#Open");
	var add = document.querySelector("#AddTrack");
	var end = document.querySelector("#End");
	var pause = document.querySelector("#Pause");
	var play = document.querySelector("#Play");
	var playlist = document.querySelector("#Playlist");
	var project = document.querySelector("#ProjectTitle");
	var save = document.querySelector("#Save");
	var start = document.querySelector("#Start");
	var timeline = document.querySelector("#Timeline");
	var trax = document.querySelector("#T-RAX");

	var TRACKS;

	_open.onclick = function (e) {
		var input = document.createElement("input");
		input.type = "file";
		input.oninput = function (e) {
			var reader = new FileReader();

			reader.readAsText(e.target.files[0]);

			reader.onload = function (e) {
				TRACKS = reader.result.split("\n");

				playlist.innerText = "";

				project.innerText = TRACKS[0];
				TRACKS.shift();

				for (var i = 0; i < TRACKS.length; i++) {
					var aud = new Audio();

					var track = document.createElement("div");
					track.className = "Track";

					track.appendChild(aud);

					var title = document.createElement("h3");

					var name = document.createElement("span");
					name.innerText = TRACKS[i].split(";")[0];

					name.onclick = function (e) {
						var _new_input = prompt("Rename track to:") || [];

						this.innerText = (_new_input.length == 0) ? "Untitled " + TRACK_COUNTER : _new_input.toString();
					};

					var menu = document.createElement("span");

					menu.className = "ImageButton";
					menu.innerText = "\uF141";

					menu.style.cssFloat = "right";

					menu.onclick = function (e) {
						if (this.parentElement.parentElement.className == "Track") this.parentElement.parentElement.className = "Track Selected";
						else this.parentElement.parentElement.className = "Track";

						if (!document.querySelector(".Dialog")) {
							var dialog = document.createElement("div");

							dialog.className = "Dialog";

							var dialog_title = document.createElement("h1");
							dialog_title.innerText = "Remove this track?";
							dialog_title.style.color = "Black";

							var dialog_description = document.createElement("p");
							dialog_description.innerText = "This action is not cancelable and you must create new track for return. Are you sure?";
							dialog_description.style.color = "Black";

							var dialog_button = document.createElement("button");
							dialog_button.innerText = "Yes";

							dialog_button.onclick = function (e) {
								playlist.removeChild(this.parentElement.parentElement);
							};

							this.parentElement.parentElement.appendChild(dialog);

							dialog.appendChild(dialog_title);
							dialog.appendChild(dialog_description);
							dialog.appendChild(dialog_button);
						}
					};

					title.appendChild(name);
					title.appendChild(menu);

					track.appendChild(title);

					aud.src = "data:audio/wav;base64," + TRACKS[i].split(";")[2];

					var volume = document.createElement("input");

					volume.className = "Slider";

					volume.oninput = function (e) {
						aud.volume = this.value * 0.01;
					};

					volume.min = 0;
					volume.max = 100;
					volume.type = "range";
					volume.value = TRACKS[i].split(";")[1];

					track.appendChild(volume);

					var mute = document.createElement("button");

					mute.className = "Button";
					mute.innerText = "M";

					mute.style.background = "#FFFFFF";

					mute.onclick = function (e) {
						if (aud.muted) {
							aud.muted = false;
							mute.style.background = "#FFFFFF";
						} else {
							aud.muted = true;
							mute.style.background = "#F44336";
						}
					};

					track.appendChild(mute);

					playlist.appendChild(track);

					TRACK_COUNTER++;
				}
			};
		};

		document.body.appendChild(input);
		input.click();
		document.body.removeChild(input);
	};

	add.onclick = function (e) {
		add_track();
	};

	end.onclick = function (e) {
		timeline.value = timeline.max;
		engine(function (audio) {
			audio.currentTime = timeline.max;
		});
	};

	pause.onclick = function (e) {
		engine (function (audio) {
			audio.pause();
		});
	};

	play.onclick = function (e) {
		engine(function (audio) {
			audio.play();
		});
	};

	project.onclick = function (e) {
		var _new_input = prompt("Rename project to:") || [];

		this.innerText = (_new_input.length == 0) ? "Untitled Project " + new Date() : _new_input.toString();
	};

	save.onclick = function (e) {
		var data = [];

		data.push(project.innerText);

		for (var i = 0; i < playlist.children.length; i++) {
			data.push([
				playlist.children[i].children[1].children[0].innerText,
				playlist.children[i].children[2].value,
				playlist.children[i].children[0].src.replace("data:audio/wav;base64,", "")
			].join(";"));
		}

		var a = document.createElement("a");

		a.download = project.innerText + ".t-rax";
		a.href = "data:text/plain;charset=utf-8," + data.join("\n");

		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	start.onclick = function (e) {
		timeline.value = timeline.min;
		engine(function (audio) {
			audio.currentTime = timeline.min;
		});
	};

	timeline.oninput = function (e) {
		engine(function (audio) {
			if (audio.duration < timeline.value) audio.currentTime = 0;
			else audio.currentTime = timeline.value;
		});
	};

	trax.onclick = function (e) {
		if (trax.getAttribute("opened") == "false") {
			trax.innerText= "T-Rax - v0.0.0.1 (v0.0-a)";
			trax.setAttribute("opened", "true");
			
			var really  = confirm("Donate to developer\n\nAre you sure?");

			if (really) window.open("https://www.donationalerts.com/r/thulenorge");
		} else {
			trax.innerText = "T-Rax";
			trax.setAttribute("opened", "false");
		}
	};

	requestAnimationFrame(function refresh() {
		requestAnimationFrame(refresh);
		engine(function (audio) {
			timeline.max = (audio.duration > timeline.max) ? audio.duration : timeline.max;
			timeline.value = audio.currentTime;
		});
		timeline.step = 1 / 60;
	});
})();