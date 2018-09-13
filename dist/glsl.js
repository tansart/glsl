(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=g||self,f(g.GLSL={}));}(this,function(exports){'use strict';function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}function getCanvas(canvasData, options) {
  var _options = Object.assign({
    antialias: false
  }, options);

  if (canvasData instanceof HTMLCanvasElement) {
    var _options2 = {
      width: canvasData.width,
      height: canvasData.height,
      antialias: _options.antialias
    };
    return new Canvas(canvasData, _options2);
  }

  if (Array.isArray(canvasData)) {
    var _options3 = {
      width: canvasData[0],
      height: canvasData[1],
      antialias: _options.antialias
    };
    var node = document.createElement('canvas');
    return new Canvas(node, _options3);
  }
}

var Canvas =
/*#__PURE__*/
function () {
  _createClass(Canvas, [{
    key: "context",
    get: function get() {
      return this._context;
    }
  }, {
    key: "node",
    get: function get() {
      return this._canvas;
    }
  }, {
    key: "height",
    get: function get() {
      return this._canvas.height;
    }
  }, {
    key: "width",
    get: function get() {
      return this._canvas.width;
    }
  }]);

  function Canvas(canvas, _ref) {
    var width = _ref.width,
        height = _ref.height,
        antialias = _ref.antialias;

    _classCallCheck(this, Canvas);

    this._canvas = canvas;

    try {
      this._context = canvas.getContext('webgl', {
        antialias: antialias
      });
    } catch (e) {
      throw new Error("Error while getting the context. ".concat(e.message));
    }

    canvas.width = width;
    canvas.height = height;
  }

  return Canvas;
}();var FLOAT_VARIABLES = ['uniform1f', 'uniform2fv', 'uniform3fv', 'uniform4fv'];
function variableHelper(name, values) {
  var valueArr = getArray(values);
  var index = valueArr.length - 1;
  var command = FLOAT_VARIABLES[index];
  return {
    name: name,
    linked: false,
    value: normaliseFloat(valueArr),
    type: getType(valueArr),
    location: "".concat(name, "Location"),
    locationType: command
  };
}
function getArray(value) {
  return Array.isArray(value) ? value : [value];
}

function normaliseFloat(arr) {
  return arr.map(function (n) {
    return parseFloat(n);
  });
}

function getType(values, hasFloat) {
  switch (values.length) {
    case 1:
      return 'float';

    case 2:
      return 'vec2';

    case 3:
      return 'vec3';

    case 4:
      return 'vec4';
  }
}var GLSL =
/*#__PURE__*/
function () {
  _createClass(GLSL, [{
    key: "canvas",
    get: function get() {
      return this._canvas.node;
    }
  }]);

  function GLSL(canvasData, options) {
    _classCallCheck(this, GLSL);

    this._canvas = new getCanvas(canvasData, options);
    this._gl = this._canvas.context;

    this._gl.viewport(0, 0, this._gl.drawingBufferWidth, this._gl.drawingBufferHeight);

    this._locations = {};
    this._variables = {};
    this._vertex = "attribute vec2 a_position;\n\t\tvoid main() {\n\t\t\tgl_Position = vec4(a_position, 0, 1);\n\t\t}";
    this._initTime = Date.now();
    this.addVariable('u_time', 0);
    this.addVariable('u_resolution', [this._canvas.width, this._canvas.height]);
  }

  _createClass(GLSL, [{
    key: "addVariable",
    value: function addVariable(name, values) {
      if (this._variables.hasOwnProperty(name)) {
        throw new Error("Variable ".concat(name, " has already been added to this instance."));
      }

      this._variables[name] = variableHelper.call(this, name, values);
    }
  }, {
    key: "fragment",
    value: function fragment(template) {
      var _this = this;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var tmpl = Array.isArray(template) ? template : [template];

      if (args.length !== tmpl.length - 1) {
        throw new Error('The fragment shader provided has an invalid amount of arguments');
      }

      this._fragment = "precision highp float;\n\t\t".concat(stringifyVariables(this._variables), "\n\t\t\n\t\t").concat(tmpl.reduce(function (acc, curr, index) {
        return "".concat(acc).concat(args[index]).concat(curr);
      }));
      initProgram.call(this);
      Object.keys(this._variables).forEach(function (key) {
        if (_this._variables[key].linked) {
          return;
        }

        var _this$_variables$key = _this._variables[key],
            name = _this$_variables$key.name,
            location = _this$_variables$key.location,
            locationType = _this$_variables$key.locationType;

        var loc = _this._gl.getUniformLocation(_this._program, name);

        _this._gl[locationType](loc, _this._variables[key].value);

        _this._locations[location] = loc;
        _this._variables[key].linked = true;
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      this._gl.clear(this._gl.COLOR_BUFFER_BIT);

      this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);

      var _this$_variables$u_ti = this._variables['u_time'],
          locationType = _this$_variables$u_ti.locationType,
          location = _this$_variables$u_ti.location;

      this._gl[locationType](this._locations[location], (Date.now() - this._initTime) / 1000.);

      requestAnimationFrame(function (_) {
        return _this2.render();
      });
    }
  }, {
    key: "tick",
    value: function tick() {}
  }, {
    key: "kill",
    value: function kill() {}
  }]);

  return GLSL;
}();

function initProgram() {
  var program = setupProgram(this._gl, this._vertex, this._fragment);

  var positionLocation = this._gl.getAttribLocation(program, "a_position");

  this._gl.enableVertexAttribArray(positionLocation);

  this._gl.vertexAttribPointer(positionLocation, 2, this._gl.FLOAT, false, 0, 0);

  this._program = program;
}

function stringifyVariables(variables) {
  return Object.keys(variables).reduce(function (acc, key) {
    return "".concat(acc, "\n\t\tuniform ").concat(variables[key].type, " ").concat(key, ";");
  }, '');
}

function setupProgram(gl, vertex, fragment) {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]), gl.STATIC_DRAW);
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertex);
  gl.compileShader(vertexShader);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragment);
  gl.compileShader(fragmentShader);
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);
  return program;
}exports.GLSL=GLSL;Object.defineProperty(exports,'__esModule',{value:true});}));