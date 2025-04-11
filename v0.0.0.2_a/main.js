function initShaders(div, gl, shaders) {
	var program = gl.createProgram();

	for (var i = 0; i < shaders.length; i++) {
		try {
			gl.attachShader(program, loadShader(div, gl, shaders[i].type, shaders[i].data));
		} catch (e) {
			return null;
		}
	}

	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		div.innerText += ("Unable to initialize the shader program: " + gl.getProgramInfoLog(program) + ".") + "\n";
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

function initWebGL(div, canvas) {
	var gl;

	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	} catch (e) {};

	if (!gl) {
		div.innerText += ("WebGL is not supported on this device") + "\n";
		gl = null;
	}

	return gl;
}

function isPowerOf2(n) {
	return (n & (n - 1)) === 0;
}

function loadShader(div, gl, type, data) {
	if (!data) return null;

	var shader;

	if (type == "fragment") shader = gl.createShader(gl.FRAGMENT_SHADER);
	else if (type == "vertex") shader = gl.createShader(gl.VERTEX_SHADER);
	else return null;

	gl.shaderSource(shader, data);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		div.innerText += ("An error occured compiling the shader: " + gl.getShaderInfoLog(shader) + ".") + "\n";
		return null;
	}

	return shader;
}

function loadTexture(gl, program, name, url, block, id) {
	var texture = gl.createTexture();

	var img = new Image();

	img.src = url;

	img.onload = function (e) {
		gl.activeTexture(gl.TEXTURE0 + id);

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

		if (isPowerOf2(img.width) && isPowerOf2(img.height)) gl.generateMipmap(gl.TEXTURE_2D);
		else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		}
	};
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
		div.innerText += ("Canvas is blured!") + "\n";
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

	var div = document.createElement("div");
	document.body.appendChild(div);

	var button = document.createElement("button");
	document.body.appendChild(button);

	button.innerText = "Compile shader";

	var is_Running = false;

	var gl = initWebGL(div, canvas);

	button.onclick = function (e) {
		var start = performance.now();

		if (!is_Running) is_Running = true;
		else {
			is_Running = false;
			gl.finish();
		}

		if (gl) {
			gl.clearColor(0, 0, 0, 1);
			gl.enable(gl.DEPTH_TEST);
			gl.depthFunc(gl.LEQUAL);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.viewport(0, 0, canvas.width, canvas.height);
		}

			var program = initShaders(div, gl, [{
					data: [
						"precision mediump float;",
						"uniform vec2 u_AWSD;",
						"uniform sampler2D u_Brick;",
						"uniform sampler2D u_Checker;",
						"uniform sampler2D u_Concrete;",
						"uniform float u_Frame;",
						"uniform sampler2D u_Grass;",
						"uniform int u_Keys[10];",
						"uniform vec3 u_LCR;",
						"uniform sampler2D u_Marble;",
						"uniform vec3 u_MouseMove;",
						"uniform vec3 u_MouseKeys;",
						"uniform float u_Pi;",
						"uniform float u_Random;",
						"uniform vec2 u_Random2;",
						"uniform vec3 u_Random3;",
						"uniform vec4 u_Random4;",
						"uniform vec2 u_Resolution;",
						"uniform sampler2D u_Sand;",
						"uniform sampler2D u_Skin;",
						"uniform sampler2D u_SkyBox;",
						"uniform sampler2D u_SkyBox2;",
						"uniform sampler2D u_Space;",
						"uniform sampler2D u_Space2;",
						"uniform sampler2D u_Stone;",
						"uniform sampler2D u_Terrain;",
						"uniform sampler2D u_Terrain2;",
						"uniform sampler2D u_Terrain3;",
						"uniform sampler2D u_Terrain3_NormalMap;",
						"uniform sampler2D u_Terrain4;",
						"uniform sampler2D u_Terrain4_NormalMap;",
						"uniform sampler2D u_Wood;",
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

		loadTexture(gl, program, "u_Brick", "u_Brick.png", 0, 2);
		loadTexture(gl, program, "u_Checker", "checker.png", 0, 1);
		loadTexture(gl, program, "u_Concrete", "u_Concrete.png", 0, 3);
		loadTexture(gl, program, "u_Grass", "u_Grass.png", 0, 4);
		loadTexture(gl, program, "u_Marble", "u_Marble.png", 0, 10);
		loadTexture(gl, program, "u_Sand", "u_Sand.png", 0, 8);
		loadTexture(gl, program, "u_Skin", "u_Skin.png", 0, 9);
		loadTexture(gl, program, "u_SkyBox", "u_SkyBox.png", 0, 0);
		loadTexture(gl, program, "u_SkyBox", "u_SkyBox2.png", 0, 11);
		loadTexture(gl, program, "u_Space", "u_Space.png", 0, 5);
		loadTexture(gl, program, "u_Space2", "u_Space2.png", 0, 6);
		loadTexture(gl, program, "u_Space2", "u_Stone.png", 0, 18);
		loadTexture(gl, program, "u_Terrain", "u_Terrain.png", 0, 7);
		loadTexture(gl, program, "u_Terrain", "u_Terrain2.png", 0, 13);
		loadTexture(gl, program, "u_Terrain", "u_Terrain3.png", 0, 14);
		loadTexture(gl, program, "u_Terrain", "u_Terrain3_NormalMap.png", 0, 15);
		loadTexture(gl, program, "u_Terrain", "u_Terrain4.png", 0, 16);
		loadTexture(gl, program, "u_Terrain", "u_Terrain4_NormalMap.png", 0, 17);
		loadTexture(gl, program, "u_Wood", "u_Wood.png", 0, 12);

		requestAnimationFrame(function redraw(now) {
			var frame = (now - start) / 60000;

			try {
				gl.uniform2fv(gl.getUniformLocation(program, "u_AWSD"), CAMERA_POSITION);
				gl.uniform1i(gl.getUniformLocation(program, "u_Brick"), 2);
				gl.uniform1i(gl.getUniformLocation(program, "u_Checker"), 1);
				gl.uniform1i(gl.getUniformLocation(program, "u_Concrete"), 3);
				gl.uniform1i(gl.getUniformLocation(program, "u_Grass"), 4);
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
				gl.uniform1i(gl.getUniformLocation(program, "u_Marble"), 10);
				gl.uniform3f(gl.getUniformLocation(program, "u_MouseMove"), MOUSE_X, MOUSE_Y, MOUSE_SCROLL);
				gl.uniform3f(gl.getUniformLocation(program, "u_MouseKeys"), MOUSE_KEY_LEFT, MOUSE_KEY_CENTER, MOUSE_KEY_RIGHT);
				gl.uniform1f(gl.getUniformLocation(program, "u_Pi"), Math.PI);
				gl.uniform1f(gl.getUniformLocation(program, "u_Random"), Math.random());
				gl.uniform2fv(gl.getUniformLocation(program, "u_Random2"), [ Math.random(), Math.random() ]);
				gl.uniform3fv(gl.getUniformLocation(program, "u_Random3"), [ Math.random(), Math.random(), Math.random() ]);
				gl.uniform4fv(gl.getUniformLocation(program, "u_Random4"), [ Math.random(), Math.random(), Math.random(), Math.random() ]);
				gl.uniform2f(gl.getUniformLocation(program, "u_Resolution"), canvas.width, canvas.height);
				gl.uniform1i(gl.getUniformLocation(program, "u_Sand"), 8);
				gl.uniform1i(gl.getUniformLocation(program, "u_Skin"), 9);
				gl.uniform1i(gl.getUniformLocation(program, "u_SkyBox"), 0);
				gl.uniform1i(gl.getUniformLocation(program, "u_SkyBox2"), 11);
				gl.uniform1i(gl.getUniformLocation(program, "u_Space"), 5);
				gl.uniform1i(gl.getUniformLocation(program, "u_Space2"), 6);
				gl.uniform1i(gl.getUniformLocation(program, "u_Stone"), 18);
				gl.uniform1i(gl.getUniformLocation(program, "u_Terrain"), 7);
				gl.uniform1i(gl.getUniformLocation(program, "u_Terrain2"), 13);
				gl.uniform1i(gl.getUniformLocation(program, "u_Terrain3"), 14);
				gl.uniform1i(gl.getUniformLocation(program, "u_Terrain3_NormalMap"), 15);
				gl.uniform1i(gl.getUniformLocation(program, "u_Terrain4"), 16);
				gl.uniform1i(gl.getUniformLocation(program, "u_Terrain4_NormalMap"), 17);
				gl.uniform1i(gl.getUniformLocation(program, "u_Wood"), 12);
			} catch(e) {}

			gl.drawArrays(gl.TRIANGLES, 0, 6);

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

			// console.log(CAMERA_POSITION, MOUSE_COUNTERS);

			requestAnimationFrame(redraw);

			if (is_Running) cancelAnimationFrame(redraw);
		});
	};

	canvas.oncontextmenu = function (e) {
		return false;
	};

	canvas.onclick = function (e) {
		is_focused = true;
		div.innerText += ("Canvas is Focused!") + "\n";
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
			div.innerText += ("Keys down: " + KEYS) + "\n";
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

			div.innerText += ("Keys up: " + KEYS) + "\n";
		}
	};
})();