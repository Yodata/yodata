const kindOf = require("kind-of");

const capitalize = require("lodash/capitalize");

const {
  merge,
  Map
} = require("immutable");

const TERMS = require("./terms");

const {
  REMOVE,
  ID,
  VALUE,
  TYPE
} = TERMS;

const isDecorator = key => key.startsWith("@"); // const KEYWORDS = Object.values(TERMS)
// const isKeyword = (key: string) => KEYWORDS.includes(key)


function getType(value, key) {
  let type;

  if (isDecorator(key)) {
    type = "decorator";
  } else {
    type = kindOf(value);
  }

  return type;
}

const mapContextValue = (value, key) => {
  const defaults = Map({
    id: key,
    name: key
  });
  const type = getType(value, key);

  switch (type) {
    case "string":
      return defaults.set(ID, value);

    case "null":
      return defaults.set(ID, REMOVE).set(VALUE, REMOVE);

    case "decorator":
      return value;

    case "object":
      return merge(defaults, value);

    case "function":
      return defaults.set(VALUE, value);

    default:
      return defaults.set(TYPE, capitalize(type)).set(VALUE, value);
  }
};

module.exports = mapContextValue;