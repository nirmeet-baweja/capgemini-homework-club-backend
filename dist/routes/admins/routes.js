"use strict";

require("core-js/modules/es6.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _controllers = require("./controllers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // localhost:3001/admins
// router.get('/:userId', getAdmin)


router.get('/users', _controllers.getUsers);
router.get('/volunteers', _controllers.getVolunteers);
router.get('/students', _controllers.getStudents);
router.get('/classes', _controllers.getClasses);
router.get('/classes/:classId', _controllers.getClasses);
var _default = router;
exports["default"] = _default;