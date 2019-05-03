"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var yaml = require('js-yaml');

var got = require('got');

var Context = require('./context');

var loadContext = require('./load-context');

module.exports = getContext;
/**
 * fetch and parse context from a file or via http
 *
 * @param {string} target
 * @param {object} [contextOptions]
 * @returns Context
 */

function getContext(_x, _x2) {
  return _getContext.apply(this, arguments);
}

function _getContext() {
  _getContext = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(target, contextOptions) {
    var cdef;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(typeof target === 'string' && target.startsWith('http'))) {
              _context.next = 7;
              break;
            }

            _context.next = 3;
            return got(target).then(function (response) {
              var contentType = response.headers["content-type"];

              switch (contentType) {
                case 'application/x-yaml':
                case 'application/x-yml':
                  return yaml.load(response.body);

                case 'application/json':
                case 'application/ld+json':
                  return JSON.parse(response.body);

                default:
                  return response.body;
              }
            });

          case 3:
            cdef = _context.sent;
            return _context.abrupt("return", new Context(cdef, contextOptions));

          case 7:
            return _context.abrupt("return", loadContext(target, contextOptions));

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getContext.apply(this, arguments);
}