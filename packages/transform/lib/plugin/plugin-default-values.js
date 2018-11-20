const unset = require("lodash/unset");

const assignDefaultValues = require("lodash/defaultsDeep");

const {
  MAP,
  EXTEND
} = require("../events");

const DEFAULT_VALUES_TOKEN = "@default";

module.exports = function defaultValuesPlugin(event, state, context) {
  switch (event) {
    case EXTEND:
      unset(state, ["target", DEFAULT_VALUES_TOKEN]);
      break;

    case MAP:
      console.log({
        state
      });
      console.log('defaults=', this.get(DEFAULT_VALUES_TOKEN));

      if (this.has(DEFAULT_VALUES_TOKEN)) {
        assignDefaultValues(state, this.get(DEFAULT_VALUES_TOKEN));
      }

      break;

    default:
  }

  return state;
};