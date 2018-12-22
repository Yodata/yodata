const get = require("lodash/get");
const set = require("lodash/set");
const has = require("lodash/has");
const castArray = require("lodash/castArray");
const ow = require("ow");

module.exports = quads => {
  ow(quads, ow.array);
  const result = {};
  quads.forEach(({ subject, predicate, object }) => {
    const key = [subject, predicate];
    const currentValue = get(result, key);
    const nextValue = object;
    const newValue = currentValue ? castArray(currentValue).push(nextValue) : nextValue;
    set(result, key, newValue)
  });
  return result
};