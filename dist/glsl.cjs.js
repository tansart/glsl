"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var a=0;a<e.length;a++){var r=e[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _createClass(t,e,a){return e&&_defineProperties(t.prototype,e),a&&_defineProperties(t,a),t}function getCanvas(t,e){var a=Object.assign({antialias:!1},e);if(t instanceof HTMLCanvasElement){var r={width:t.width,height:t.height,antialias:a.antialias};return new Canvas(t,r)}if(Array.isArray(t)){var n={width:t[0],height:t[1],antialias:a.antialias},i=document.createElement("canvas");return new Canvas(i,n)}throw new Error("getCanvas expects an HTMLCanvasElement or an Array [width, height]")}var Canvas=function(){function t(e,a){var r=a.width,n=a.height,i=a.antialias;_classCallCheck(this,t),this._canvas=e;try{this._context=e.getContext("webgl",{antialias:i})}catch(t){throw new Error("Error while getting the context. ".concat(t.message))}e.width=r,e.height=n}return _createClass(t,[{key:"context",get:function(){return this._context}},{key:"node",get:function(){return this._canvas}},{key:"height",get:function(){return this._canvas.height}},{key:"width",get:function(){return this._canvas.width}}]),t}(),FLOAT_VARIABLES=["uniform1f","uniform2fv","uniform3fv","uniform4fv"];function variableHelper(t,e){var a=asArray(e),r=a.length-1,n=FLOAT_VARIABLES[r];return{name:t,linked:!1,value:a,type:getType(a),location:"".concat(t,"Location"),locationType:n}}function textureHelper(t,e,a){return{name:t,index:e,texture:"string"==typeof a?pGetImage(a):Promise.resolve(a),linked:!1}}function asArray(t){return Array.isArray(t)?t:[t]}function pGetImage(t){var e=new Image;return e.crossOrigin="Anonymous",new Promise(function(a){e.addEventListener("load",function(t){return a(e)}),e.src=t})}function getType(t){return 1==t.length?"float":"vec".concat(t.length)}var PRECISION=["lowp","mediump","highp"],GLSL=function(){function t(e,a){_classCallCheck(this,t),this._options=Object.assign({antialias:!1,precision:1},a),this._canvas=getCanvas(e,this._options),this._gl=this._canvas.context,this._gl.viewport(0,0,this._gl.drawingBufferWidth,this._gl.drawingBufferHeight),this._locations={},this._variables={},this._textures={},this._vertex="attribute vec2 a_position;\n\t\tvoid main() {\n\t\t\tgl_Position = vec4(a_position, 0, 1);\n\t\t}",this._initTime=Date.now(),this.addVariable("u_time",0),this.addVariable("u_resolution",[this._canvas.width,this._canvas.height])}return _createClass(t,[{key:"canvas",get:function(){return this._canvas.node}}]),_createClass(t,[{key:"addVariable",value:function(t,e){var a=this;if(this._variables.hasOwnProperty(t))throw new Error("Variable ".concat(t," has already been added to this instance."));return this._variables[t]=variableHelper(t,e),function(e){var r=a._variables[t],n=r.location,i=r.locationType;a._variables[t].value=e,a._gl[i](a._locations[n],a._variables[t].value)}}},{key:"addTexture",value:function(t,e){if(this._textures.hasOwnProperty(t))throw new Error("Texture ".concat(t," has already been added to this instance."));var a=Object.keys(this._textures).length;this._textures[t]=textureHelper(t,a,e)}},{key:"fragment",value:function(t){for(var e=this,a=arguments.length,r=new Array(a>1?a-1:0),n=1;n<a;n++)r[n-1]=arguments[n];var i=Array.isArray(t)?t:[t];if(r.length!==i.length-1)throw new Error("The fragment shader provided has an invalid amount of arguments");this._fragment="precision ".concat(PRECISION[this._options.precision]," float;\n\t\t\n\t\t").concat(stringifyVariables(this._variables),"\n\t\t\n\t\t").concat(stringifyTextures(this._textures),"\n\t\t\n\t\t").concat(i.reduce(function(t,e,a){return"".concat(t).concat(r[a]).concat(e)})),this._program=setupProgram(this._gl,this._vertex,this._fragment),Object.keys(this._variables).forEach(function(t){if(!e._variables[t].linked){var a=e._variables[t],r=a.name,n=a.location,i=a.locationType,o=e._gl.getUniformLocation(e._program,r);e._gl[i](o,e._variables[t].value),e._locations[n]=o,e._variables[t].linked=!0}}),Object.keys(this._textures).forEach(function(t){if(!e._textures[t].linked){var a=e._textures[t],r=a.name,n=a.index,i=a.texture,o=createTexture(e._gl,e._program,n+1,r);i.then(function(t){o.apply(t)})}})}},{key:"render",value:function(){var t=this;this._gl.clear(this._gl.COLOR_BUFFER_BIT),this._gl.drawArrays(this._gl.TRIANGLES,0,6);var e=this._variables.u_time,a=e.locationType,r=e.location;this._gl[a](this._locations[r],(Date.now()-this._initTime)/1e3),requestAnimationFrame(function(e){return t.render()})}},{key:"kill",value:function(){this._gl.getExtension("WEBGL_lose_context").loseContext(),this._gl.useProgram(null),this._gl.deleteProgram(this._program)}}]),t}();function setupProgram(t,e,a){var r=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,r),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),t.STATIC_DRAW);var n=t.createShader(t.VERTEX_SHADER);t.shaderSource(n,e),t.compileShader(n);var i=t.createShader(t.FRAGMENT_SHADER);t.shaderSource(i,a),t.compileShader(i);var o=t.createProgram();t.attachShader(o,n),t.attachShader(o,i),t.linkProgram(o),t.useProgram(o);var s=t.getAttribLocation(o,"a_position");return t.enableVertexAttribArray(s),t.vertexAttribPointer(s,2,t.FLOAT,!1,0,0),o}function createTexture(t,e,a,r){var n=t.createTexture();t.bindTexture(t.TEXTURE_2D,n),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.uniform1i(t.getUniformLocation(e,r),a);var i=t["TEXTURE".concat(a)];return t.activeTexture(i),t.bindTexture(t.TEXTURE_2D,n),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,new ImageData(2,2)),{apply:function(e){t.activeTexture(i),t.bindTexture(t.TEXTURE_2D,n),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e)},texture:n}}function stringifyVariables(t){return Object.keys(t).reduce(function(e,a){return"".concat(e,"\n\t\tuniform ").concat(t[a].type," ").concat(a,";")},"")}function stringifyTextures(t){return Object.keys(t).reduce(function(t,e){return"".concat(t,"\n\t\tuniform sampler2D ").concat(e,";")},"")}module.exports=GLSL;