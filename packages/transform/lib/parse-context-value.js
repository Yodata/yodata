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
  TYPE,
  NEST,
  NAME
} = TERMS;

const isDecorator = key => key.startsWith("@");

const isNested = key => key.includes(".");

const pathName = key => key.substring(key.lastIndexOf(".") + 1);

const pathContainer = key => isNested(key) ? key.substring(0, key.lastIndexOf(".")) : "";

const defaultContext = key => {
  let result = Map({
    [ID]: pathName(key),
    [NAME]: key
  });

  if (isNested(key)) {
    result = result.set(NEST, pathContainer(key));
  }

  return result;
};

function getType(value, key) {
  let type;

  if (isDecorator(key)) {
    type = "decorator";
  } else {
    type = kindOf(value);
  }

  return type;
}

const parseContextValue = (value, key) => {
  const defaults = defaultContext(key);
  const type = getType(value, key);

  switch (type) {
    case "string":
      return defaultContext(value).set(NAME, key);

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

module.exports = parseContextValue;