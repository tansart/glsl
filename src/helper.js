const FLOAT_VARIABLES = {
  'float':'uniform1f',
  'vec2':'uniform2fv',
  'vec3':'uniform3fv',
  'vec4':'uniform4fv'
};

export function variableHelper(name, values, arrayType) {
  const valueArr = asArray(values);
  const [type, size] = getType(valueArr, arrayType);
  const command = FLOAT_VARIABLES[type];
  return {
    name,
    linked: false,
    value: valueArr,
    type,
    size,
    location: `${name}Location`,
    locationType: command
  }
}

export function textureHelper(name, index, texture) {
  let pImage;

  if (typeof texture == 'string') {
    pImage = pGetImage(texture);
  } else if(texture instanceof Blob) {
    pImage = pGetBlob(texture).then(pGetImage);
  } else {
    pImage = Promise.resolve(texture);
  }

  return {
    apply: noop,
    name,
    index,
    pSource: pImage,
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

function getType(values, arrayType) {
  if(arrayType) {
    return [arrayType, `[${values.length}]`];
  } else if(values.length === 1) {
    return ['float', ''];
  }

  return [`vec${values.length}`, ''];
}

function noop() {}
