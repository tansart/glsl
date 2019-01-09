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
}`
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
  precision: 1 // 0: low, 1: medium, 2: high
};

new GLSL([100, 100], defaultOptions)
```

### Variables provided by GLSL

`u_time` shows the elapsed time in s.

`u_resolution` is the resolution based on the canvas' size.

### Texture

The following assumes `glsl` to be an instance of `GLSL`
```javascript
glsl.addTexture('u_image', 'http://url-to-texture');
```
```javascript
const img = new Image();
img.onLoad = _ => {
  glsl.addTexture('u_image', img);
};
```

### Kill the instance
The following command will stop the rendering loop. 
```javascript
glsl.kill();
glsl = null; // be nice to the garbage collector
```
