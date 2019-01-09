import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";

export default {
	input: 'src/index.js',
	output: [
		{
			file: './dist/glsl.js',
			format: 'iife',
			name: 'GLSL'
		},
		{
			file: './dist/glsl.cjs.js',
			format: 'cjs',
		}
	],
	plugins: [
		resolve(),
		babel({
			exclude: 'node_modules/**'
		}),
		terser()
	],
	watch: {
		include: 'src/**'
	}
};
