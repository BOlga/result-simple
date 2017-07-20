/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);



/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var hook = __webpack_require__(3);

hook.hook('.js', (src, name) => {
  src = src.replace(/import ([^{]*?) from '(.*?)'/g, 'const $1 = require("$2")');
  src = src.replace(/export default ([^ ]*)/g, 'module.exports = $1');
  src = src.replace(/export (var|let|const) ([a-zA-Z0-9_$]*)/g, '$1 $2 = module.exports.$2');
  src = src.replace(/export function ([a-zA-Z0-9_$]*)/g, 'var $1 = module.exports.$1 = function');
  src = src.replace(/export class ([a-zA-Z0-9_$]*)/g, 'var $1 = module.exports.$1 = class');
  src = src.replace(/import {(.*?)} from '(.*?)'/g, (all, $1, $2) => {
    return $1.split(",")
      .map(part => 'var ' + part + '= require("' + $2 + '").' + part.trim() + ';')
      .join('');
  });
  return src;
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// based on https://github.com/gotwarlost/istanbul/blob/master/lib/hook.js
 //catch errors more easily

/*
 Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

var fs = __webpack_require__(4),
  Module = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"module\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

//dummy definition in case module is not available:
if (!Module) Module = {};
if (!Module._extensions) { console.log("dummy module def"); Module._extensions = []; }

var originalLoaders = {};
var nestedTransforms = {}; //allow nested transforms

var verify = {
  extension: function (str) {
    if (typeof str !== 'string') {
      throw new Error('expected string extension, have ' + str);
    }
    if (str[0] !== '.') {
      throw new Error('Extension should start with dot, for example .js, have ' + str);
    }
  },
  transform: function (fn) {
    if (typeof fn !== 'function') {
      throw new Error('Transform should be a function, have ' + fn);
    }
  }
};

function hook(extension, transform, options) {
  options = options || {};
  if (typeof extension === 'function' &&
    typeof transform === 'undefined') {
    transform = extension;
    extension = '.js';
  }
  if (options.verbose) {
    console.log('hooking transform', transform.name, 'for', extension);
  }

  verify.extension(extension);
  verify.transform(transform);

  if (!nestedTransforms[extension]) nestedTransforms[extension] = [];
  if (!nestedTransforms[extension].length) //only store the first one -DJ
    originalLoaders[extension] = Module._extensions[extension];
  nestedTransforms[extension].push(transform); //allow nested transforms -DJ


  Module._extensions[extension] = function (module, filename) {
    if (options.verbose) {
      console.log('transforming', filename);
    }
    var source = fs.readFileSync(filename, 'utf8');
    var ret = null; //transform(source, filename);
    nestedTransforms[extension].every(function(nested) //nesting order performs earlier first, later last
    {
//        console.log("IN: " + source);
        ret = nested(source, filename);
//        console.log("OUT: " + ret);
//        if (typeof ret !== 'string') return false; //break
//        if (!options.toString) return false; //stop here
        source = ret + ""; //convert to string and keep going
        return true; //continue
    });
    if (typeof ret === 'string') {
      module._compile(ret, filename);
    } else if (options.verbose) {
      console.error('transforming source from', filename, 'has not returned a string');
    }
  };
  if (options.verbose) {
    console.log('hooked function');
  }
}

function unhook(extension) {
  if (typeof extension === 'undefined') {
    extension = '.js';
  }
  verify.extension(extension);
  nestedTransforms[extension].pop(); //assumes no stack underflow
  if (!nestedTransforms[extension].length) //restore original only once
    Module._extensions[extension] = originalLoaders[extension];
}

module.exports = {
  hook: hook,
  unhook: unhook
};

/***/ }),
/* 4 */
/***/ (function(module, exports) {



/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map