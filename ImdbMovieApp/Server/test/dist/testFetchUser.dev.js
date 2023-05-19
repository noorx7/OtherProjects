"use strict";

var _supertest = _interopRequireDefault(require("supertest"));

var _assert = _interopRequireDefault(require("assert"));

var _index = _interopRequireDefault(require("../index.mjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('User Fetch', function () {
  // testing the userFetch function
  it('returns a user with a valid ID', function _callee() {
    var user, res;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(User.create({
              firstName: 'Gizem',
              lastName: 'Noor'
            }));

          case 2:
            user = _context.sent;
            _context.next = 5;
            return regeneratorRuntime.awrap((0, _supertest["default"])(_index["default"]).get("/users/".concat(user._id)).set('Authorization', "Bearer ".concat(token)));

          case 5:
            res = _context.sent;

            _assert["default"].equal(res.status, 200);

            _assert["default"].equal(res.body.msg, "User with name ".concat(user.firstName, " ").concat(user.lastName, " ID is: ").concat(user._id));

          case 8:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  it('returns an error message with an invalid ID', function _callee2() {
    var res;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap((0, _supertest["default"])(_index["default"]).get('/users/invalid-id').set('Authorization', "Bearer ".concat(token)));

          case 2:
            res = _context2.sent;

            _assert["default"].equal(res.status, 400);

            _assert["default"].equal(res.body.msg, 'User with ID invalid-id does not exist.');

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
});