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
    var getRandomIntInclusive, volunteersId, totalNumSkills, userSkills;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // function to return a random number in a given range of numbers
            getRandomIntInclusive = function getRandomIntInclusive(min, max) {
              var ceilMin = Math.ceil(min);
              var floorMax = Math.floor(max); // The maximum is inclusive and the minimum is inclusive

              return Math.floor(Math.random() * (floorMax - ceilMin + 1) + ceilMin);
            }; // get the list of volunteers


            _context.next = 3;
            return knex('users').select('id').where('role_id', 2).orderBy('id');

          case 3:
            volunteersId = _context.sent;
            _context.next = 6;
            return knex('skills').count('id');

          case 6:
            totalNumSkills = _context.sent;
            // array to store the rows for user_skills table
            userSkills = []; // create the skills for each volunteer

            volunteersId.forEach(function (volunteer) {
              var skills = [];
              var numOfSkills = getRandomIntInclusive(1, totalNumSkills[0].count);
              var skillCount = 0; // create an array for skills for the volunteer

              while (skillCount < numOfSkills) {
                var skill = getRandomIntInclusive(1, numOfSkills);

                if (!skills.includes(skill)) {
                  skills.push(skill);
                  skillCount += 1;
                }
              } // push the data to userSkills array


              for (var i = 0; i < numOfSkills; i += 1) {
                var userSkill = {
                  user_id: volunteer.id,
                  skill_id: skills[i]
                };
                userSkills.push(userSkill);
              }
            }); // Deletes ALL existing entries

            return _context.abrupt("return", knex('user_skills').del().then(function () {
              return (// Inserts seed entries
                knex('user_skills').insert(userSkills)
              );
            }));

          case 10:
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