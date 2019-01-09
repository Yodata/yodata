"use strict";

var unset = require("lodash/unset");

var assignDefaultValues = require("lodash/defaultsDeep");

var _require = require("../events"),
    MAP = _require.MAP,
    EXTEND = _require.EXTEND;

var DEFAULT_VALUES_TOKEN = "@default";

module.exports = function defaultValuesPlugin(event, state) {
  switch (event) {
    case EXTEND:
      unset(state, ["target", DEFAULT_VALUES_TOKEN]);
      break;

    case MAP:
      if (this.has(DEFAULT_VALUES_TOKEN)) {
        assignDefaultValues(state, this.get(DEFAULT_VALUES_TOKEN));
      }

      break;

    default:
  }

  return state;
};