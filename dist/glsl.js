var GLSL=function(){"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function n(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}function r(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=[],r=!0,a=!1,i=void 0;try{for(var o,s=t[Symbol.iterator]();!(r=(o=s.next()).done)&&(n.push(o.value),!e||n.length!==e);r=!0);}catch(t){a=!0,i=t}finally{try{r||null==s.return||s.return()}finally{if(a)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var a=function(){function e(n,r){var a=r.width,i=r.height,o=r.antialias;t(this,e),this._canvas=n;try{this._context=n.getContext("webgl",{antialias:o})}catch(t){throw new Error("Error while getting the context. ".concat(t.message))}n.width=a,n.height=i}return n(e,[{key:"context",get:function(){return this._context}},{key:"node",get:function(){return this._canvas}},{key:"height",get:function(){return this._canvas.height}},{key:"width",get:function(){return this._canvas.width}}]),e}(),i={float:"uniform1f",vec2:"uniform2fv",vec3:"uniform3fv",vec4:"uniform4fv"};function o(t,e){var n,a=(n=e,Array.isArray(n)?n:[n]),o=r(function(t){if(Array.isArray(t[0]))return 1===t[0].length?["float","[".concat(t.length,"]")]:["vec".concat(t[0].length),"[".concat(t.length,"]")];if(1===t.length)return["float",""];return["vec".concat(t.length),""]}(a),2),s=o[0],c=o[1],u=i[s];return{name:t,linked:!1,value:a,type:s,size:c,location:"".concat(t,"Location"),locationType:u}}function s(t,e,n){var r,a;return{apply:u,name:t,index:e,pSource:"string"==typeof n?c(n):n instanceof Blob?(r=n,a=new FileReader,new Promise(function(t){a.addEventListener("load",function(e){t(e.target.result)}),a.readAsDataURL(r)})).then(c):Promise.resolve(n),linked:!1}}function c(t){var e=new Image;return e.crossOrigin="Anonymous",new Promise(function(n){e.addEventListener("load",function(t){return n(e)}),e.src=t})}function u(){}var l=["lowp","mediump","highp"];return function(){function e(n,r){t(this,e),this._options=Object.assign({antialias:!1,precision:1},r),this._canvas=function(t,e){var n=Object.assign({antialias:!1},e);if(t instanceof HTMLCanvasElement){var r={width:t.width,height:t.height,antialias:n.antialias};return new a(t,r)}if(Array.isArray(t)){var i={width:t[0],height:t[1],antialias:n.antialias},o=document.createElement("canvas");return new a(o,i)}throw new Error("getCanvas expects an HTMLCanvasElement or an Array [width, height]")}(n,this._options),this._gl=this._canvas.context,this._gl.viewport(0,0,this._gl.drawingBufferWidth,this._gl.drawingBufferHeight),this._locations={},this._variables={},this._textures={},this._vertex="attribute vec2 a_position;\n\t\tvoid main() {\n\t\t\tgl_Position = vec4(a_position, 0, 1);\n\t\t}",this._initTime=Date.now(),this.addVariable("u_time",0),this.addVariable("u_resolution",[this._canvas.width,this._canvas.height])}return n(e,[{key:"canvas",get:function(){return this._canvas.node}}]),n(e,[{key:"addVariable",value:function(t,e){var n=this;if(this._variables.hasOwnProperty(t))throw new Error("Variable ".concat(t," has already been added to this instance."));return this._variables[t]=o(t,e),function(e){var r=n._variables[t],a=r.location,i=r.locationType;n._variables[t].value=e,n._gl[i](n._locations[a],n._variables[t].value)}}},{key:"addTexture",value:function(t,e){var n=this;if(this._textures.hasOwnProperty(t))throw new Error("Texture ".concat(t," has already been added to this instance."));var r=Object.keys(this._textures).length;return this._textures[t]=s(t,r,e),function(e){n._textures[t].apply(e)}}},{key:"fragment",value:function(t){for(var e=this,n=arguments.length,r=new Array(n>1?n-1:0),a=1;a<n;a++)r[a-1]=arguments[a];var i,o,s=Array.isArray(t)?t:[t];if(r.length!==s.length-1)throw new Error("The fragment shader provided has an invalid amount of arguments");this._fragment="precision ".concat(l[this._options.precision]," float;\n\t\t\n\t\t").concat((o=this._variables,Object.keys(o).reduce(function(t,e){return"".concat(t,"\n\t\tuniform ").concat(o[e].type," ").concat(e).concat(o[e].size,";")},"")),"\n\t\t\n\t\t").concat((i=this._textures,Object.keys(i).reduce(function(t,e){return"".concat(t,"\n\t\tuniform sampler2D ").concat(e,";")},"")),"\n\t\t\n\t\t").concat(s.reduce(function(t,e,n){return"".concat(t).concat(r[n]).concat(e)})),this._program=function(t,e,n){var r=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,r),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),t.STATIC_DRAW);var a=t.createShader(t.VERTEX_SHADER);t.shaderSource(a,e),t.compileShader(a);var i=t.createShader(t.FRAGMENT_SHADER);t.shaderSource(i,n),t.compileShader(i);var o=t.createProgram();t.attachShader(o,a),t.attachShader(o,i),t.linkProgram(o),t.useProgram(o);var s=t.getAttribLocation(o,"a_position");return t.enableVertexAttribArray(s),t.vertexAttribPointer(s,2,t.FLOAT,!1,0,0),o}(this._gl,this._vertex,this._fragment),Object.keys(this._variables).forEach(function(t){if(!e._variables[t].linked){var n=e._variables[t],r=n.name,a=n.location,i=n.locationType,o=e._gl.getUniformLocation(e._program,r);e._gl[i](o,e._variables[t].value),e._locations[a]=o,e._variables[t].linked=!0}}),Object.keys(this._textures).forEach(function(t){if(!e._textures[t].linked){var n=e._textures[t],r=n.name,a=n.index,i=n.pSource;e._textures[t].linked=!0;var o=function(t,e,n,r){var a=t.createTexture();t.bindTexture(t.TEXTURE_2D,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.uniform1i(t.getUniformLocation(e,r),n);var i=t["TEXTURE".concat(n)];return t.activeTexture(i),t.bindTexture(t.TEXTURE_2D,a),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,new ImageData(2,2)),{apply:function(e){t.activeTexture(i),t.bindTexture(t.TEXTURE_2D,a),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e)},texture:a}}(e._gl,e._program,a+1,r);e._textures[t].apply=o.apply,i.then(function(t){o.apply(t)})}})}},{key:"render",value:function(){var t=this;this._gl.clear(this._gl.COLOR_BUFFER_BIT),this._gl.drawArrays(this._gl.TRIANGLES,0,6);var e=this._variables.u_time,n=e.locationType,r=e.location;this._gl[n](this._locations[r],(Date.now()-this._initTime)/1e3),requestAnimationFrame(function(e){return t.render()})}},{key:"kill",value:function(){this._gl.getExtension("WEBGL_lose_context").loseContext(),this._gl.useProgram(null),this._gl.deleteProgram(this._program)}}]),e}()}();