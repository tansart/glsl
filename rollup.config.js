import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
	input: 'src/index.js',
	output: {
		file: './dist/glsl.js',
		format: 'umd',
		name: 'GLSL'
	},
	plugins: [
		resolve(),
		babel({
			exclude: 'node_modules/**'
		})
	],
	watch: {
		include: 'src/**'
	}
};
