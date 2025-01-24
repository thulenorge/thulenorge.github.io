function initShaders(gl, shaders) {
	var program = gl.createProgram();

	for (var i = 0; i < shaders.length; i++) {
		gl.attachShader(program, loadShader(gl, shaders[i].type, shaders[i].data));
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
						"uniform float u_Frame;",
						"uniform vec3 u_MouseMove;",
						"uniform vec3 u_MouseKeys;",
						"uniform vec2 u_Resolution;",
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

			gl.uniform1f(gl.getUniformLocation(program, "u_Frame"), frame);
			gl.uniform2f(gl.getUniformLocation(program, "u_Resolution"), canvas.width, canvas.height);
			gl.uniform3f(gl.getUniformLocation(program, "u_MouseMove"), MOUSE_X, MOUSE_Y, MOUSE_SCROLL);
			gl.uniform3f(gl.getUniformLocation(program, "u_MouseKeys"), MOUSE_KEY_LEFT, MOUSE_KEY_CENTER, MOUSE_KEY_RIGHT);

			gl.drawArrays(gl.TRIANGLES, 0, 6);

			requestAnimationFrame(redraw);

			if (is_Running) cancelAnimationFrame(redraw);
		});
	};

	canvas.oncontextmenu = function (e) {
		return false;
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
})();
