export function getCanvas(canvasData, options) {
  const _options = Object.assign({
    antialias: false
  }, options);

  if (canvasData instanceof HTMLCanvasElement) {
    const options = {
      ..._options,
      height: canvasData.height,
      width: canvasData.width
    };

    return new Canvas(canvasData, options);
  }

  if (Array.isArray(canvasData)) {
    const options = {
      ..._options,
      height: canvasData[1],
      width: canvasData[0]
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

  constructor(canvas, {antialias, height, width, webglVersion}) {
    this._canvas = canvas;

    try {
      this._context = canvas.getContext(webglVersion, {antialias});
    } catch (e) {
      throw new Error(`Error while getting the context. ${e.message}`);
    }

    canvas.width = width;
    canvas.height = height;
  }
}
