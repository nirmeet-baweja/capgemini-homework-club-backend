"use strict";

require("core-js/modules/es6.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "admins", {
  enumerable: true,
  get: function get() {
    return _routes["default"];
  }
});
Object.defineProperty(exports, "auth", {
  enumerable: true,
  get: function get() {
    return _routes5["default"];
  }
});
Object.defineProperty(exports, "common", {
  enumerable: true,
  get: function get() {
    return _routes4["default"];
  }
});
Object.defineProperty(exports, "students", {
  enumerable: true,
  get: function get() {
    return _routes2["default"];
  }
});
Object.defineProperty(exports, "volunteers", {
  enumerable: true,
  get: function get() {
    return _routes3["default"];
  }
});

var _routes = _interopRequireDefault(require("./admins/routes"));

var _routes2 = _interopRequireDefault(require("./students/routes"));

var _routes3 = _interopRequireDefault(require("./volunteers/routes"));

var _routes4 = _interopRequireDefault(require("./common/routes"));

var _routes5 = _interopRequireDefault(require("./auth/routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }