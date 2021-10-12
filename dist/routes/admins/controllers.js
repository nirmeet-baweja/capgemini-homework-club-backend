"use strict";

require("core-js/modules/es6.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVolunteers = exports.getUsers = exports.getStudents = exports.getClasses = exports.getClassDetails = void 0;

require("core-js/modules/es6.object.to-string.js");

require("core-js/modules/es6.promise.js");

require("regenerator-runtime/runtime.js");

var _services = _interopRequireDefault(require("./services"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// import knex from '../../knex'
var getClasses = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var classes;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _services["default"].getClasses();

          case 3:
            classes = _context.sent;
            return _context.abrupt("return", res.json(classes));

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", res.status(404).send('Classes not found.'));

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));

  return function getClasses(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.getClasses = getClasses;

var getClassDetails = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            return _context2.abrupt("return", res.json('in geclassdetails'));

          case 4:
            _context2.prev = 4;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", res.status(404).send('Class not found.'));

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 4]]);
  }));

  return function getClassDetails(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getClassDetails = getClassDetails;

var getUsers = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var users;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _services["default"].getUsers();

          case 3:
            users = _context3.sent;
            return _context3.abrupt("return", res.json(users));

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            return _context3.abrupt("return", res.status(404).send('Users not found.'));

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7]]);
  }));

  return function getUsers(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getUsers = getUsers;

var getVolunteers = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var volunteers;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _services["default"].getVolunteers();

          case 3:
            volunteers = _context4.sent;
            return _context4.abrupt("return", res.json(volunteers));

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            return _context4.abrupt("return", res.status(404).send('Volunteers not found.'));

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 7]]);
  }));

  return function getVolunteers(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getVolunteers = getVolunteers;

var getStudents = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var students;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _services["default"].getStudents();

          case 3:
            students = _context5.sent;
            return _context5.abrupt("return", res.json(students));

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](0);
            return _context5.abrupt("return", res.status(404).send('Students not found.'));

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 7]]);
  }));

  return function getStudents(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}(); // export const getAdmin = async (req, res) => {
//   // const { userId } = req.params;
//   try {
//     return res.status(200).send({ user: 'admin data' })
//   } catch (err) {
//     console.log(err)
//     return res.status(400).send('Admin not found')
//   }
// }


exports.getStudents = getStudents;