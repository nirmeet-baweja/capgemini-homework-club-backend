"use strict";

require("core-js/modules/es6.object.define-property.js");

require("core-js/modules/es6.object.keys.js");

require("core-js/modules/es6.symbol.js");

require("core-js/modules/es6.array.filter.js");

require("core-js/modules/es6.object.get-own-property-descriptor.js");

require("core-js/modules/es6.array.for-each.js");

require("core-js/modules/es7.object.get-own-property-descriptors.js");

require("core-js/modules/es6.object.define-properties.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("regenerator-runtime/runtime.js");

require("core-js/modules/es6.string.iterator.js");

require("core-js/modules/es6.object.to-string.js");

require("core-js/modules/es6.array.iterator.js");

require("core-js/modules/web.dom.iterable.js");

require("core-js/modules/es6.promise.js");

require("core-js/modules/es6.array.map.js");

require("core-js/modules/es6.function.name.js");

var _knex = _interopRequireDefault(require("../../knex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getClasses = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var classes, fetchSkills, fetchNumOfAttendees;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return (0, _knex["default"])('classes').select('id', 'date', 'comments', 'call_link as callLink', 'is_submitted as isSubmitted').orderBy('date');

          case 2:
            classes = _context5.sent;

            // function to fetch the skills for each class
            fetchSkills = /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return Promise.all(classes.map( /*#__PURE__*/function () {
                          var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(homeworkClass, index) {
                            var classSkills, skills;
                            return regeneratorRuntime.wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    _context.next = 2;
                                    return (0, _knex["default"])('class_skills as cs').select('s.name').join('skills as s', 's.id', 'cs.skill_id').where('cs.class_id', homeworkClass.id);

                                  case 2:
                                    classSkills = _context.sent;
                                    skills = classSkills.map(function (classSkill) {
                                      return classSkill.name;
                                    }); // amend the skills for each class

                                    // amend the skills for each class
                                    classes[index] = _objectSpread(_objectSpread({}, classes[index]), {}, {
                                      skills: skills
                                    });

                                  case 5:
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee);
                          }));

                          return function (_x, _x2) {
                            return _ref3.apply(this, arguments);
                          };
                        }()));

                      case 2:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function fetchSkills() {
                return _ref2.apply(this, arguments);
              };
            }();

            fetchNumOfAttendees = /*#__PURE__*/function () {
              var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return Promise.all( // get the number of students signed up for the class
                        classes.map( /*#__PURE__*/function () {
                          var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(homeworkClass, index) {
                            var numOfStudents, numOfVolunteers;
                            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                              while (1) {
                                switch (_context3.prev = _context3.next) {
                                  case 0:
                                    _context3.next = 2;
                                    return (0, _knex["default"])('class_sign_ups as csu').join('users as u', 'u.id', 'csu.user_id').where('csu.class_id', homeworkClass.id).andWhere('u.role_id', 3).count('u.id');

                                  case 2:
                                    numOfStudents = _context3.sent;
                                    // amend the number of students signed up for each class
                                    classes[index] = _objectSpread(_objectSpread({}, classes[index]), {}, {
                                      numOfStudents: numOfStudents[0].count
                                    }); // get the number of volunteers signed up for the class

                                    _context3.next = 6;
                                    return (0, _knex["default"])('class_sign_ups as csu').join('users as u', 'u.id', 'csu.user_id').where('csu.class_id', homeworkClass.id).andWhere('u.role_id', 2).count('u.id');

                                  case 6:
                                    numOfVolunteers = _context3.sent;
                                    // amend the number of volunteers signed up for each class
                                    classes[index] = _objectSpread(_objectSpread({}, classes[index]), {}, {
                                      numOfVolunteers: numOfVolunteers[0].count
                                    });

                                  case 8:
                                  case "end":
                                    return _context3.stop();
                                }
                              }
                            }, _callee3);
                          }));

                          return function (_x3, _x4) {
                            return _ref5.apply(this, arguments);
                          };
                        }()));

                      case 2:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function fetchNumOfAttendees() {
                return _ref4.apply(this, arguments);
              };
            }();

            _context5.next = 7;
            return fetchSkills();

          case 7:
            _context5.next = 9;
            return fetchNumOfAttendees();

          case 9:
            return _context5.abrupt("return", classes);

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function getClasses() {
    return _ref.apply(this, arguments);
  };
}();

var getUsers = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var users;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _knex["default"])('users').select('firstname', 'last_name', 'email', 'role_id', 'cohort_id').orderBy('id');

          case 2:
            users = _context6.sent;
            return _context6.abrupt("return", users);

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function getUsers() {
    return _ref6.apply(this, arguments);
  };
}();

var getVolunteers = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var volunteers;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return (0, _knex["default"])('users').select('firstname', 'last_name', 'email').where('role_id', 2).orderBy('id');

          case 2:
            volunteers = _context7.sent;
            return _context7.abrupt("return", volunteers);

          case 4:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function getVolunteers() {
    return _ref7.apply(this, arguments);
  };
}();

var getStudents = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var students;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return (0, _knex["default"])('users').select('firstname', 'last_name', 'email', 'cohort_id').where('role_id', 3).orderBy('id');

          case 2:
            students = _context8.sent;
            return _context8.abrupt("return", students);

          case 4:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function getStudents() {
    return _ref8.apply(this, arguments);
  };
}();

var _default = {
  getClasses: getClasses,
  getUsers: getUsers,
  getVolunteers: getVolunteers,
  getStudents: getStudents
};
exports["default"] = _default;