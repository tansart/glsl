import {getCanvas} from './Canvas';
import {variableHelper} from './helper';

export class GLSL {
	get canvas() {
		return this._canvas.node;
	}

	constructor(canvasData, options) {
		this._canvas = new getCanvas(canvasData, options);
		this._gl = this._canvas.context;

		this._gl.viewport(0, 0, this._gl.drawingBufferWidth, this._gl.drawingBufferHeight);

		this._locations = {};
		this._variables = {};

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

		this._variables[name] = variableHelper.call(this, name, values);
	}

	fragment(template, ...args) {
		const tmpl = Array.isArray(template) ? template : [template];

		if (args.length !== tmpl.length - 1) {
			throw new Error('The fragment shader provided has an invalid amount of arguments');
		}

		this._fragment = `precision highp float;
		${stringifyVariables(this._variables)}
		
		${tmpl.reduce((acc, curr, index) => {
			return `${acc}${args[index]}${curr}`;
		})}`;

		initProgram.call(this);
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
	}

	render() {
		this._gl.clear(this._gl.COLOR_BUFFER_BIT);
		this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);

		let {locationType, location} = this._variables['u_time'];
		this._gl[locationType](this._locations[location], (Date.now() - this._initTime) / 1000.);

		requestAnimationFrame(_ => this.render());
	}

	tick() {

	}

	kill() {

	}
}

function initProgram() {
	const program = setupProgram(this._gl, this._vertex, this._fragment);

	const positionLocation = this._gl.getAttribLocation(program, "a_position");
	this._gl.enableVertexAttribArray(positionLocation);
	this._gl.vertexAttribPointer(positionLocation, 2, this._gl.FLOAT, false, 0, 0);

	this._program = program;
}

function stringifyVariables(variables) {
	return Object.keys(variables).reduce((acc, key) => {
		return `${acc}
		uniform ${variables[key].type} ${key};`;
	}, '');
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

	return program;
}
