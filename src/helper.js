const FLOAT_VARIABLES = [
	'uniform1f',
	'uniform2fv',
	'uniform3fv',
	'uniform4fv'
];

export function variableHelper(name, values) {
	const valueArr = getArray(values);
	const index = valueArr.length - 1;
	const command = FLOAT_VARIABLES[index];

	return {
		name,
		linked: false,
		value: normaliseFloat(valueArr),
		type: getType(valueArr),
		location: `${name}Location`,
		locationType: command
	}
}

export function getArray(value) {
	return Array.isArray(value) ? value: [value];
}

function normaliseFloat(arr) {
	return arr.map(n => parseFloat(n));
}

function getType(values, hasFloat) {
	switch(values.length) {
		case 1:
			return 'float';
		case 2:
			return 'vec2';
		case 3:
			return 'vec3';
		case 4:
			return 'vec4';
	}
}
