function initShaders(gl, shaders) {
	var program = gl.createProgram();

	for (var i = 0; i < shaders.length; i++) {
		try {
			gl.attachShader(program, loadShader(gl, shaders[i].type, shaders[i].data));
		} catch (e) {
			return null;
		}
	}

	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(program) + ".");
	}

	gl.useProgram(program);

	var vertex = gl.getAttribLocation(program, "a_VertexPosition");

	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		-1, -1,
		1, -1,
		-1, 1,
		-1, 1,
		1, -1,
		1, 1
	]), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(vertex);
	gl.vertexAttribPointer(vertex, 2, gl.FLOAT, false, 0, 0);

	return program;
}

function initTexture(gl, program, name, url, id) {
	var texture = gl.createTexture();

	var img = new Image();

	img.onload = function (e) {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

		if (isPowerOf2(img.width) && isPowerOf2(img.height)) gl.generateMipmap(gl.TEXTURE_2D);
		else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}

		switch (id) {
			case 0: {
				gl.activeTexture(gl.TEXTURE0);
				break;
			} case 1: {
				gl.activeTexture(gl.TEXTURE1);
				break;
			} case 2: {
				gl.activeTexture(gl.TEXTURE2);
				break;
			} case 3: {
				gl.activeTexture(gl.TEXTURE3);
				break;
			} case 4: {
				gl.activeTexture(gl.TEXTURE4);
				break;
			} case 5: {
				gl.activeTexture(gl.TEXTURE5);
				break;
			} case 6: {
				gl.activeTexture(gl.TEXTURE6);
				break;
			} case 7: {
				gl.activeTexture(gl.TEXTURE7);
				break;
			} case 8: {
				gl.activeTexture(gl.TEXTURE8);
				break;
			} case 9: {
				gl.activeTexture(gl.TEXTURE9);
				break;
			} case 10: {
				gl.activeTexture(gl.TEXTURE10);
				break;
			} case 11: {
				gl.activeTexture(gl.TEXTURE11);
				break;
			} case 12: {
				gl.activeTexture(gl.TEXTURE12);
				break;
			} case 13: {
				gl.activeTexture(gl.TEXTURE13);
				break;
			} case 14: {
				gl.activeTexture(gl.TEXTURE14);
				break;
			} case 15: {
				gl.activeTexture(gl.TEXTURE15);
				break;
			}
		}

		gl.bindTexture(gl.TEXTURE_2D, texture);

		gl.uniform1i(gl.getUniformLocation(program, name), id & 15);
		gl.uniform2fv(gl.getUniformLocation(program, name + "Resolution"), [ img.width, img.height ]);
	};

	img.src = url;
}

function initWebGL(canvas) {
	var gl;

	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	} catch (e) {};

	if (!gl) {
		alert("WebGL is not supported on this device");
		gl = null;
	}

	return gl;
}

function isPowerOf2(n) {
	return (n & (n - 1)) === 0;
}

function loadShader(gl, type, data) {
	if (!data) return null;

	var shader;

	if (type == "fragment") shader = gl.createShader(gl.FRAGMENT_SHADER);
	else if (type == "vertex") shader = gl.createShader(gl.VERTEX_SHADER);
	else return null;

	gl.shaderSource(shader, data);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.log("An error occured compiling the shader: " + gl.getShaderInfoLog(shader) + ".");
		return null;
	}

	return shader;
}

(function main() {
	var is_focused = false;

	var CAMERA_POSITION = [ 0, 0 ];
	var KEYS = [];
	var MOUSE_COUNTERS = [ 0, 0, 0 ];
	var MOUSE_KEY_CENTER = 0;
	var MOUSE_KEY_LEFT = 0;
	var MOUSE_KEY_RIGHT = 0;
	var MOUSE_SCROLL = 0;
	var MOUSE_X = 0;
	var MOUSE_Y = 0;

	var canvas = document.createElement("canvas");
	document.body.appendChild(canvas);

	canvas.height = parseInt(getComputedStyle(canvas).height);
	canvas.width = parseInt(getComputedStyle(canvas).width);

	var textarea = document.createElement("textarea");
	document.body.appendChild(textarea);

	textarea.value = [
		"void main() {",
		"\tgl_FragColor = vec4(gl_FragCoord.xy / u_Resolution, sin(u_Frame), 1.0);",
		"}"
	].join("\n");

	textarea.onclick = function (e) {
		is_focused = false;
		console.log("Canvas is blured!");
	};

	textarea.onkeydown = function (e) {
		if (e.keyCode == 9) {
			e.preventDefault();

			var start = this.selectionStart;
			var stop = this.selectionEnd;

			this.value = this.value.substring(0, start) + "\t" + this.value.substring(stop);

			this.selectionStart = start + 1;
			this.selectionEnd = start + 1;
		}
	};

	var button = document.createElement("button");
	document.body.appendChild(button);

	button.innerText = "Compile shader";

	var is_Running = false;

	button.onclick = function (e) {
		console.clear();

		var gl = initWebGL(canvas);

		var start = performance.now();

		if (is_Running == false) is_Running = true;
		else is_Running = false;

		requestAnimationFrame(function redraw(now) {
			var frame = (now - start) / 60000;

			if (gl) {
				gl.clearColor(0, 0, 0, 1);
				gl.enable(gl.DEPTH_TEST);
				gl.depthFunc(gl.LEQUAL);
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
				gl.viewport(0, 0, canvas.width, canvas.height);
			}

			var program = initShaders(gl, [{
					data: [
						"precision mediump float;",
						"uniform vec2 u_AWSD;",
						"uniform float u_Frame;",
						"uniform int u_Keys[10];",
						"uniform vec3 u_LCR;",
						"uniform vec3 u_MouseMove;",
						"uniform vec3 u_MouseKeys;",
						"uniform vec2 u_Resolution;",
						"uniform sampler2D u_SkyBox;",
						"uniform vec2 u_SkyBoxResolution;",
						textarea.value
					].join("\n"),
					type: "fragment"
				}, {
					data: [
						"attribute vec4 a_VertexPosition;",
						"void main() {",
						"\tgl_Position = a_VertexPosition;",
						"}"
					].join("\n"),
					type: "vertex"
				}
			]);

			try {
				gl.uniform2fv(gl.getUniformLocation(program, "u_AWSD"), CAMERA_POSITION);
				gl.uniform1f(gl.getUniformLocation(program, "u_Frame"), frame);
				gl.uniform1iv(gl.getUniformLocation(program, "u_Keys"), [
					!KEYS[0] ? 0 : KEYS[0],
					!KEYS[1] ? 0 : KEYS[1],
					!KEYS[2] ? 0 : KEYS[2],
					!KEYS[3] ? 0 : KEYS[3],
					!KEYS[4] ? 0 : KEYS[4],
					!KEYS[5] ? 0 : KEYS[5],
					!KEYS[6] ? 0 : KEYS[6],
					!KEYS[7] ? 0 : KEYS[7],
					!KEYS[8] ? 0 : KEYS[8],
					!KEYS[9] ? 0 : KEYS[9]
				]);
				gl.uniform3fv(gl.getUniformLocation(program, "u_LCR"), MOUSE_COUNTERS);
				gl.uniform3f(gl.getUniformLocation(program, "u_MouseMove"), MOUSE_X, MOUSE_Y, MOUSE_SCROLL);
				gl.uniform3f(gl.getUniformLocation(program, "u_MouseKeys"), MOUSE_KEY_LEFT, MOUSE_KEY_CENTER, MOUSE_KEY_RIGHT);
				gl.uniform2f(gl.getUniformLocation(program, "u_Resolution"), canvas.width, canvas.height);

				initTexture(gl, program, "u_SkyBox", "sky_box.jpg", 0);

				gl.drawArrays(gl.TRIANGLES, 0, 6);

				requestAnimationFrame(redraw);
			} catch(e) {}

			for (var i = 0; i < KEYS.length; i++) {
				switch (KEYS[i]) {
					case 65: {
						CAMERA_POSITION[0]--;
						break;
					} case 68: {
						CAMERA_POSITION[0]++;
						break;
					} case 83: {
						CAMERA_POSITION[1]++;
						break;
					} case 87: {
						CAMERA_POSITION[1]--;
						break;
					}
				}
			}

			if (MOUSE_KEY_LEFT == 1) MOUSE_COUNTERS[0]++;
			else if (MOUSE_KEY_CENTER == 1) MOUSE_COUNTERS[1]++;
			else if (MOUSE_KEY_RIGHT == 1) MOUSE_COUNTERS[2]++;

			console.log(CAMERA_POSITION, MOUSE_COUNTERS);

			if (is_Running) cancelAnimationFrame(redraw);
		});
	};

	canvas.oncontextmenu = function (e) {
		return false;
	};

	canvas.onclick = function (e) {
		is_focused = true;
		console.log("Canvas is Focused!");
	};

	canvas.onmousedown = function (e) {
		switch (e.button) {
			case 0: {
				MOUSE_KEY_LEFT = 1;
				break;
			} case 1: {
				MOUSE_KEY_CENTER = 1;
				break;
			} case 2: {
				MOUSE_KEY_RIGHT = 1;
				break;
			}
		}
	};

	canvas.onmousemove = function (e) {
		MOUSE_X = e.pageX - e.currentTarget.offsetLeft;
		MOUSE_Y = e.pageY - e.currentTarget.offsetTop;
	};

	canvas.onmouseup = function (e) {
		switch (e.button) {
			case 0: {
				MOUSE_KEY_LEFT = 0;
				break;
			} case 1: {
				MOUSE_KEY_CENTER = 0;
				break;
			} case 2: {
				MOUSE_KEY_RIGHT = 0;
				break;
			}
		}
	};

	canvas.onwheel = function (e) {
		MOUSE_SCROLL += e.deltaY / 100;
	};

	window.onkeydown = function (e) {
		if (is_focused) {
			if (e.repeat) return;
			KEYS.push(e.keyCode);

			var lkey = KEYS.pop();

			if (lkey != KEYS[KEYS.length - 1]) KEYS.push(lkey);
			console.log("Keys down:", KEYS);
			return false;
		}
	};

	window.onkeyup = function (e) {
		if (is_focused) {
			if (KEYS.length == 0) return;
	
			var _ = [];

			for (var i = 0; i < KEYS.length; i++) {
				if (KEYS[i] != e.keyCode) _.push(KEYS[i]);
			}

			KEYS = _;

			console.log("Keys up:", KEYS);
		}
	};
})();