"use strict";

var sortObjectKeys = require('sort-object-keys');

var _require = require('lodash'),
    intersection = _require.intersection;

var _require2 = require('../events'),
    MAP_RESULT = _require2.MAP_RESULT;

var TOKEN = '@keyOrder';

module.exports = function (event, object) {
  if (event === MAP_RESULT) {
    var defaultOrder = this.getOption(TOKEN, []);
    var order = this.get(TOKEN, defaultOrder);
    order = intersection(order, Object.keys(object));
    return sortObjectKeys(object, order);
  }

  return object;
};