const kindOf = require("kind-of");

const has = require("lodash/has");

const get = require("lodash/get");

const set = require("lodash/set");

const mapValues = require("lodash/mapValues");

const {
  Map
} = require("immutable");

const mustache = require("mustache");

const ow = require("ow");

const debug = require("debug");

const log = debug("map-value-to-context");

const {
  NAME,
  NEST,
  VALUE,
  LIST,
  SET,
  FRAME,
  CONTEXT,
  DEFAULT,
  TYPE,
  ID
} = require("./terms");

const isToken = value => {
  return typeof value === "string" && value[0] === "#";
};

const replaceValueTokens = (object, context) => {
  return mapValues(object, objectValue => {
    let result = objectValue;

    if (isToken(objectValue)) {
      let token = objectValue.substring(1);
      result = get(context, token, objectValue);
    }

    return result;
  });
};

function objectify(value, context) {
  switch (kindOf(value)) {
    case "object":
      return value;

    default:
      let key = context[ID] || VALUE;
      return Object.assign({}, {
        [key]: value
      });
  }
}

function mapValueToContext(value, key, object, context) {
  // console.log("START", { value, key, object, context })
  let nextValue = value;

  if (kindOf(nextValue) === "array") {
    return nextValue.map((value, index, array) => mapValueToContext.call(this, value, key, array, context));
  }

  nextValue = Map(context).reduce((nextValue, ctxValue, term) => {
    switch (term) {
      case VALUE:
        switch (kindOf(ctxValue)) {
          case "function":
            return ctxValue.call({}, {
              value,
              key,
              object,
              context
            });

          case "object":
            nextValue = objectify(nextValue, context);
            nextValue = Object.assign({}, nextValue, ctxValue);
            nextValue = replaceValueTokens(nextValue, {
              value,
              name: key
            });
            return nextValue;

          default:
            return ctxValue;
        }

      case TYPE:
        nextValue = objectify(nextValue, context);
        nextValue = set(nextValue, TYPE, ctxValue);
        return nextValue;

      case "val":
        return ctxValue.call({}, {
          value,
          key,
          last: object
        });

      default:
        return nextValue;
    }
  }, nextValue);

  if (key === "type") {
    switch (kindOf(nextValue)) {
      case "string":
        nextValue = this.mapKey(nextValue, nextValue);
        break;

      case "array":
        nextValue = nextValue.map(item => {
          return typeof item === "string" ? this.mapKey(item, item) : item;
        });
    }
  }

  if (kindOf(nextValue) === "object") {
    log("nextValue is object", {
      nextValue,
      value,
      key,
      object,
      context
    });
    let subContext = get(context, CONTEXT);
    let nextContext = this.extend(subContext);
    nextValue = nextContext.map(nextValue);
  }

  return nextValue;
}

module.exports = mapValueToContext;