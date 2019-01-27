"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable unicorn/new-for-builtins */

/* eslint-disable new-cap */
// @ts-check
var kindOf = require('kind-of');

var capitalize = require('lodash/capitalize');

var _require = require('immutable'),
    merge = _require.merge,
    Map = _require.Map;

var TERMS = require('./terms');

var REMOVE = TERMS.REMOVE,
    ID = TERMS.ID,
    VALUE = TERMS.VALUE,
    TYPE = TERMS.TYPE,
    NEST = TERMS.NEST,
    NAME = TERMS.NAME;

var isDecorator = function isDecorator(key) {
  return key.startsWith('@');
};

var isNested = function isNested(key) {
  return key.includes('.');
};

var pathName = function pathName(key) {
  return key.substring(key.lastIndexOf('.') + 1);
};

var pathContainer = function pathContainer(key) {
  return isNested(key) ? key.substring(0, key.lastIndexOf('.')) : '';
};

var defaultContext = function defaultContext(key) {
  var _Map;

  var result = Map((_Map = {}, _defineProperty(_Map, ID, pathName(key)), _defineProperty(_Map, NAME, key), _Map));

  if (isNested(key)) {
    result = result.set(NEST, pathContainer(key));
  }

  return result;
};

function getType(value, key) {
  var type;

  if (isDecorator(key)) {
    type = 'decorator';
  } else {
    type = kindOf(value);
  }

  return type;
}

var parseContextValue = function parseContextValue(value, key) {
  var defaults = defaultContext(key);
  var type = getType(value, key);

  switch (type) {
    case 'string':
      return defaultContext(value).set(NAME, key);

    case 'null':
      return defaults.set(REMOVE, true);

    case 'decorator':
      return value;

    case 'object':
      return merge(defaults, value);

    case 'function':
      return defaults.set(VALUE, value);

    default:
      return defaults.set(TYPE, capitalize(type)).set(VALUE, value);
  }
};

exports.parseContextValue = parseContextValue;

exports.parse = function (state) {
  return Map(state).map(parseContextValue).toJS();
};