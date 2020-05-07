const FLOAT_VARIABLES = [
	'uniform1f',
	'uniform2fv',
	'uniform3fv',
	'uniform4fv'
];

export function variableHelper(name, values) {
	const valueArr = asArray(values);
	const index = valueArr.length - 1;
	const command = FLOAT_VARIABLES[index];

	return {
		name,
		linked: false,
		value: valueArr,
		type: getType(valueArr),
		location: `${name}Location`,
		locationType: command
	}
}

export function textureHelper(name, index, texture) {
  let pImage = null;

  if (typeof texture == 'string') {
    pImage = pGetImage(texture);
  } else if(texture instanceof Blob) {
    pImage = pGetBlob(texture).then(pGetImage);
  } else {
    pImage = Promise.resolve(texture);
  }

  return {
    name,
    index,
    texture: pImage,
    linked: false,
  }
}

export function asArray(value) {
	return Array.isArray(value) ? value : [value];
}

export function pGetImage(src) {
	const img = new Image();
	img.crossOrigin = "Anonymous";

	return new Promise(resolve => {
		img.addEventListener("load", _ => resolve(img));
		img.src = src
	});
}

function pGetBlob(blob) {
  const reader = new FileReader();
  return new Promise(resolve => {
    reader.addEventListener('load', e => {
      resolve(e.target.result);
    });
    reader.readAsDataURL(blob);
  });
}

function getType(values) {
	return values.length == 1 ? 'float' : `vec${values.length}`;
}
