## GLSL

100% a WIP, use at own risk.

### Usage example

```javascript
const glsl = new GLSL(canvas);
glsl.addVariable('u_delta', [0, 2, 4]);
glsl.fragment`void main() {
  vec2 uv = gl_FragCoord.xy/u_resolution.xy;
  vec3 col = 0.5 + 0.5 * cos(u_time + uv.xyx + u_delta);
  gl_FragColor = vec4(col,1.0);
}`;
glsl.render();
```

alternatively you can let `GLSL` generate the canvas by providing `width` and `height` as follow:
```javascript
const glsl = new GLSL([100, 100]);
document.body.appendChild(glsl.canvas);
```

### Constructor options
The second argument of GLSL accepts a set of options.

```javascript
const defaultOptions = {
  antialias: false, // boolean
  precision: 1 // 0: lowp, 1: mediump, 2: highp
};

new GLSL([100, 100], defaultOptions)
```

### Variables

#### Variables provided by GLSL
`u_time` shows the elapsed time in s.

`u_resolution` is the resolution based on the canvas' size.

#### Custom Variables

```javascript
glsl.addVariable('u_background', [1.,0.,0.,1.]);

glsl.fragment`void main() {
  gl_FragColor = u_background;
}`;

glsl.render();
```

#### Dynamically updating variables
`glsl.addVariable` returns a function, which let's you update the value.

**Attention:** currently, `updateVariable()` doesn't check that the new variable matches the initial variable.

```javascript
const updateVarOne = glsl.addVariable('u_var1', [1., 1., 1., 1.]);

glsl.fragment`void main() {
  gl_FragColor = u_var1;
}`;

setInterval(_ => {
  updateVarOne([Math.random(), Math.random(), Math.random(), 1.]);
}, 1000);

glsl.render();
```

### Texture
```javascript
glsl.addTexture('u_image', 'http://url-to-texture');
```
```javascript
const img = new Image();
img.onLoad = _ => {
  glsl.addTexture('u_image', img);
};
```

in either case you can then use the texture in your fragment shader as below:

```javascript
glsl.fragment`void main() {
  vec2 uv = gl_FragCoord.xy/u_resolution.xy;
  gl_FragColor = texture2D(u_image, vec2(uv.x, 1. - uv.y - 1.0));
}`;

glsl.render();
```

### Kill the instance
The following command will stop the rendering loop. 
```javascript
glsl.kill();
glsl = null; // be nice to the garbage collector
```
