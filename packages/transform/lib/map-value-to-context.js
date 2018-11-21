const kindOf = require("kind-of");

const has = require("lodash/has");

const get = require("lodash/get");

const set = require("lodash/set");

const mapValues = require("lodash/mapValues");

const {
  Map,
  Seq
} = require("immutable");

const invoke = require("lodash/invoke");

const mustache = require("mustache");

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

const replaceValueTokens = (object, context) => {
  return mapValues(object, v => {
    return typeof v === "string" ? mustache.render(v, context, null, ["{", "}"]) : v;
  });
};

function mapValueToContext(value, key, object, context) {
  let result = value;

  if (kindOf(value) === "array") {
    return value.map(v => mapValueToContext.call(this, v, key, object, context));
  }

  if (has(context, VALUE)) {
    switch (kindOf(context[VALUE])) {
      case "function":
        result = context[VALUE].call(this, {
          value,
          key,
          object,
          context
        });
        break;

      case "object":
        result = Object.assign({}, context[VALUE]);
        result = replaceValueTokens(result, {
          value,
          name: context[NAME],
          id: context[ID]
        });
        break;

      case "string":
        result = context[VALUE];
        break;

      default:
        result = context[VALUE];
        break;
    }
  }

  if (has(context, "val") && kindOf(get(context, "val")) === "function") {
    result = invoke(context, "val", {
      value,
      key,
      last: object
    });
  }

  if (kindOf(result) === "object") {
    result = this.extend(context[CONTEXT]).map(result);
  }
  /* map string values for type/@type */


  if (["type", "@type"].includes(key) && typeof result === "string") {
    result = this.mapKey(result, result);
  }

  return result;
}

module.exports = mapValueToContext;