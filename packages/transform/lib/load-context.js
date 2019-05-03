"use strict";

var callerPath = require('caller-path');

var Yaml = require('js-yaml');

var Context = require('./context');

var fs = require('fs-extra');

var path = require('path');

var got = require('got');

module.exports = loadContext;
/**
 *
 *
 * @param {string} filePath
 * @param {object} [contextOptions]
 * @returns {Context}
 */

function loadContext(filePath, contextOptions) {
  var dirName = path.dirname(callerPath());
  var target = path.resolve(dirName, filePath);
  var extName = path.extname(target);
  var source;
  var cdef;

  switch (extName) {
    case '.yaml':
    case '.yml':
      source = fs.readFileSync(target, 'utf8');
      cdef = Yaml.load(source);
      break;

    case '.json':
      source = fs.readFileSync(target, 'utf8');
      cdef = JSON.parse(source);
      break;

    case '.js':
      cdef = require(target);
      break;

    default:
      throw new Error("unknown file type ".concat(extName));
  }

  return new Context(cdef, contextOptions);
}