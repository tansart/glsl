export function getCanvas(canvasData, options) {
  const _options = Object.assign({
    antialias: false
  }, options);

  if (canvasData instanceof HTMLCanvasElement) {
    const options = {
      width: canvasData.width,
      height: canvasData.height,
      antialias: _options.antialias
    };

    return new Canvas(canvasData, options);
  }

  if (Array.isArray(canvasData)) {
    const options = {
      width: canvasData[0],
      height: canvasData[1],
      antialias: _options.antialias
    };

    const node = document.createElement('canvas');
    return new Canvas(node, options);
  }

  throw new Error(`getCanvas expects an HTMLCanvasElement or an Array [width, height]`);
}

class Canvas {
  get context() {
    return this._context;
  }

  get node() {
    return this._canvas;
  }

  get height() {
    return this._canvas.height;
  }

  get width() {
    return this._canvas.width;
  }

  constructor(canvas, {width, height, antialias}) {
    this._canvas = canvas;

    try {
      this._context = canvas.getContext('webgl', {antialias});
    } catch (e) {
      throw new Error(`Error while getting the context. ${e.message}`);
    }

    canvas.width = width;
    canvas.height = height;
  }
}
