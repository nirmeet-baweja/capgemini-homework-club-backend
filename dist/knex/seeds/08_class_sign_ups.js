"use strict";

require("regenerator-runtime/runtime.js");

require("core-js/modules/es6.array.for-each.js");

require("core-js/modules/es7.array.includes.js");

require("core-js/modules/es6.object.to-string.js");

require("core-js/modules/es6.promise.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

exports.seed = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(knex) {
    var classSignUps, sampleComments, getRandomIntInclusive, createSignUp, classesId, students, volunteers;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // array to store the classSignUps
            classSignUps = [];
            sampleComments = ['Sed ante. Vivamus tortor. Duis mattis egestas metus.', 'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.', 'Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.', 'Fusce consequat. Nulla nisl. Nunc nisl.', '', '', '', '', '', '', '', '']; // function to return a random number in a given range of numbers

            getRandomIntInclusive = function getRandomIntInclusive(min, max) {
              var ceilMin = Math.ceil(min);
              var floorMax = Math.floor(max); // The maximum is inclusive and the minimum is inclusive

              return Math.floor(Math.random() * (floorMax - ceilMin + 1) + ceilMin);
            }; // function to create a single object for class_sign_ups table


            createSignUp = function createSignUp(userId, classId) {
              var isCancelled = Math.random() > 0.85;
              var isPresent = Math.random() < 0.85; // if a sign-up has been cancelled the member is considered as absent.

              if (isCancelled) {
                isPresent = false;
              }

              var userSignUp = {
                user_id: userId,
                class_id: classId,
                skill_id: getRandomIntInclusive(1, 9),
                is_cancelled: isCancelled,
                is_present: isPresent,
                comments: sampleComments[getRandomIntInclusive(0, sampleComments.length - 1)],
                remarks: sampleComments[getRandomIntInclusive(0, sampleComments.length - 1)]
              };
              return userSignUp;
            }; // get the list of all the classes


            _context.next = 6;
            return knex('classes').select('id').orderBy('id');

          case 6:
            classesId = _context.sent;
            _context.next = 9;
            return knex('users').select('id').where('role_id', 3).orderBy('id');

          case 9:
            students = _context.sent;
            _context.next = 12;
            return knex('users').select('id').where('role_id', 2).orderBy('id');

          case 12:
            volunteers = _context.sent;
            // create the rows for classSignUps for each class
            classesId.forEach(function (classId) {
              var studentCount = 0;
              var volunteerCount = 0;
              var studentIds = [];
              var volunteerIds = [];
              var numStudents = getRandomIntInclusive(10, 25);
              var numVolunteers = getRandomIntInclusive(2, 6); // create the data for students' classSignUp

              while (studentCount < numStudents) {
                var student = getRandomIntInclusive(0, students.length - 1);

                if (!studentIds.includes(student)) {
                  studentIds.push(student);
                  classSignUps.push(createSignUp(students[student].id, classId.id));
                  studentCount += 1;
                }
              } // create the data for volunteers' classSignUp


              while (volunteerCount < numVolunteers) {
                var volunteer = getRandomIntInclusive(0, volunteers.length - 1);

                if (!volunteerIds.includes(volunteer)) {
                  volunteerIds.push(volunteer);
                  classSignUps.push(createSignUp(volunteers[volunteer].id, classId.id));
                  volunteerCount += 1;
                }
              }
            }); // Deletes ALL existing entries

            return _context.abrupt("return", knex('class_sign_ups').del().then(function () {
              return (// Inserts seed entries
                knex('class_sign_ups').insert(classSignUps)
              );
            }));

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();