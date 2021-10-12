"use strict";

require("core-js/modules/es6.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _controllers = require("./controllers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // localhost:3001/auth


router.post('/student/sign-up', _controllers.studentSignUp); // router.get("/volunteer/sign-up", );
// router.get("/sign-in", );

var _default = router;
exports["default"] = _default;