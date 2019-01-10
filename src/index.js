import {getCanvas} from './Canvas';
import {variableHelper, pGetImage, textureHelper} from './helper';

const PRECISION = ['lowp', 'mediump', 'highp'];

export default class GLSL {
	get canvas() {
		return this._canvas.node;
	}

	constructor(canvasData, options) {
		this._options = Object.assign({
			antialias: false,
			precision: 1
		}, options);

		this._canvas = new getCanvas(canvasData, this._options);

		this._gl = this._canvas.context;
		this._gl.viewport(0, 0, this._gl.drawingBufferWidth, this._gl.drawingBufferHeight);

		this._locations = {};
		this._variables = {};
		this._textures = {};

		this._vertex = `attribute vec2 a_position;
		void main() {
			gl_Position = vec4(a_position, 0, 1);
		}`;

		this._initTime = Date.now();

		this.addVariable('u_time', 0);
		this.addVariable('u_resolution', [this._canvas.width, this._canvas.height]);
	}

	addVariable(name, values) {
		if (this._variables.hasOwnProperty(name)) {
			throw new Error(`Variable ${name} has already been added to this instance.`);
		}

		this._variables[name] = variableHelper(name, values);

		return value => {
			const {location, locationType} = this._variables[name];

			this._variables[name].value = value;
			this._gl[locationType](this._locations[location], this._variables[name].value);
		};
	}

	addTexture(name, imageData) {
		if (this._textures.hasOwnProperty(name)) {
			throw new Error(`Texture ${name} has already been added to this instance.`);
		}

		const index = Object.keys(this._textures).length;
		this._textures[name] = textureHelper(name, index, imageData);
	}

	fragment(template, ...args) {
		const tmpl = Array.isArray(template) ? template : [template];

		if (args.length !== tmpl.length - 1) {
			throw new Error('The fragment shader provided has an invalid amount of arguments');
		}

		this._fragment = `precision ${PRECISION[this._options['precision']]} float;
		
		${stringifyVariables(this._variables)}
		
		${stringifyTextures(this._textures)}
		
		${tmpl.reduce((acc, curr, index) => {
			return `${acc}${args[index]}${curr}`;
		})}`;

		this._program = setupProgram(this._gl, this._vertex, this._fragment);

		Object.keys(this._variables).forEach(key => {
			if (this._variables[key].linked) {
				return;
			}

			const {name, location, locationType} = this._variables[key];

			const loc = this._gl.getUniformLocation(this._program, name);
			this._gl[locationType](loc, this._variables[key].value);
			this._locations[location] = loc;

			this._variables[key].linked = true;
		});

		Object.keys(this._textures).forEach(key => {
			if (this._textures[key].linked) {
				return;
			}

			const {name, index, texture} = this._textures[key];

			const textureObject = createTexture(this._gl, this._program, index + 1, name);
			texture.then(img => {
				textureObject.apply(img);
			});
		});
	}

	render(renderHook) {
		this._gl.clear(this._gl.COLOR_BUFFER_BIT);
		this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);

		let {locationType, location} = this._variables['u_time'];
		this._gl[locationType](this._locations[location], (Date.now() - this._initTime) / 1000.);

		requestAnimationFrame(_ => this.render());
	}

	kill() {
		this._gl.getExtension('WEBGL_lose_context').loseContext();
		this._gl.useProgram(null);
		this._gl.deleteProgram(this._program);
	}
}

function setupProgram(gl, vertex, fragment) {
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([
				-1.0, -1.0,
				1.0, -1.0,
				-1.0, 1.0,
				-1.0, 1.0,
				1.0, -1.0,
				1.0, 1.0]),
			gl.STATIC_DRAW
	);

	const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertex);
	gl.compileShader(vertexShader);

	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragment);
	gl.compileShader(fragmentShader);

	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	gl.useProgram(program);

	const positionLocation = gl.getAttribLocation(program, "a_position");
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	return program;
}

function createTexture(gl, program, index, name) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	gl.uniform1i(gl.getUniformLocation(program, name), index);

	const textureID = gl[`TEXTURE${index}`];

	gl.activeTexture(textureID);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(2, 2));

	return {
		apply: (source) => {
			gl.activeTexture(textureID);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
		},
		texture
	};
}

function stringifyVariables(variables) {
	return Object.keys(variables).reduce((acc, key) => {
		return `${acc}
		uniform ${variables[key].type} ${key};`;
	}, '');
}

function stringifyTextures(textures) {
	return Object.keys(textures).reduce((acc, key) => {
		return `${acc}
		uniform sampler2D ${key};`;
	}, '');
}
