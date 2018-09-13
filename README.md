## GLSL

100% a WIP, use at own risk.

### Usage example

```
const glsl = new GLSL(canvas);
glsl.addVariable('u_delta', [0, 2, 4]);
glsl.fragment`void main() {
  vec2 uv = gl_FragCoord.xy/u_resolution.xy;
  vec3 col = 0.5 + 0.5*cos(u_time + uv.xyx + u_delta);
  gl_FragColor = vec4(col,1.0);
}`
glsl.render();
```

alternatively you can let `GLSL` generate the canvas by providing `width` and `height` as follow:
```
const glsl = new GLSL([100, 100]);
document.body.appendChild(glsl.canvas);
```

### Constructor options
The second argument of GLSL accepts a set of options.

```
const defaultOptions = {
  antialias: false // boolean
  precision: 1 // 0: low, 1: medium, 2: high
};

new GLSL([100, 100], defaultOptions)
```

### Variables provided by GLSL

`u_time` shows the time in s.

`u_resolution` is the resolution based on the canvas' size.

### Texture

The following assumes `glsl` to be an instance of `GLSL`
```
glsl.addTexture('http://url-to-texture');
```
```
const img = new Image();
img.onLoad = _ => {
  glsl.addTexture(img);
};
```

### Kill the instance
The following command will stop the rendering loop. 
```
glsl.kill();
glsl = null; // be nice to the garbage collector
```
