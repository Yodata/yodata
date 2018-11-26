function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const kindOf = require("kind-of");

const get = require("lodash/get");

const set = require("lodash/set");

const mapValues = require("lodash/mapValues");

const isObjectLike = require("lodash/isObjectLike");

const {
  Map,
  fromJS
} = require("immutable");

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
  ID,
  REMOVE,
  REDACT
} = require("./terms");

const isToken = value => {
  return typeof value === "string" && ["#", "$"].includes(value[0]);
};

const token = value => value.substring(1);

const renderValue = (value, context) => {
  if (isToken(value)) {
    let key = token(value);

    switch (key) {
      case NAME:
    }

    return get(context, token(value));
  }

  return value;
};

const renderObject = (object, context) => {
  ow(object, ow.object);
  ow(context, ow.object);
  let value = get(context, 'value');
  let ctx = context;

  if (kindOf(value) === 'object') {
    ctx = Object.assign({}, context, _objectSpread({}, value));
  }

  return mapValues(object, value => renderValue(value, ctx));
};

function objectify(value, defaultValue = {}) {
  return isObjectLike(value) ? value : defaultValue;
}

function resolve(fn, props, defaultValue) {
  let result;

  try {
    result = fn.call({}, props);
  } catch (e) {
    log(`FUNCTION_ERROR:`, {
      fn,
      props
    });
    result = defaultValue;
  }

  return result;
}

function mapValueToContext(value, key, object, context) {
  let nextValue = value;

  if (kindOf(nextValue) === "array") {
    return nextValue.map((value, index, array) => mapValueToContext.call(this, value, key, array, context));
  }

  if (kindOf(nextValue) === "object") {
    log({
      nextValue,
      key,
      context
    });
    let subContext = get(context, CONTEXT);
    let nextContext = this.extend(subContext);
    nextValue = nextContext.map(nextValue);
  }

  nextValue = Map(context).reduce((result, contextValue, contextAttribute) => {
    switch (contextAttribute) {
      case VALUE:
        switch (kindOf(contextValue)) {
          case "function":
            return resolve(contextValue, {
              value,
              key,
              object,
              context
            }, nextValue);

          case "object":
            return renderObject(contextValue, {
              name: key,
              value: nextValue
            });

          case "string":
            return renderValue(contextValue, kindOf(nextValue === "object") ? _objectSpread({}, nextValue) : _objectSpread({}, object, {
              name: key,
              value: nextValue
            }));

          default:
            return contextValue;
        }

      case TYPE:
        // console.log("currentResult = ", result)
        result = objectify(result, {
          [context[ID] || VALUE]: value
        });
        result = set(result, TYPE, contextValue);
        return result;

      case "val":
        return resolve(contextValue, {
          value,
          key,
          last: object
        });

      case REMOVE:
        return REMOVE;

      case REDACT:
        return contextValue === true ? get(object, REDACT, REDACT) : result;

      default:
        if (isToken(contextValue)) {
          let k = contextAttribute;
          let v = renderValue(contextValue, _objectSpread({}, value, {
            name: key,
            value: nextValue
          }));
          result = objectify(result, {
            [context[ID] || VALUE]: value
          });
          result = set(result, k, v);
        }

        return result;
    }
  }, nextValue);

  if (key === "type") {
    switch (kindOf(nextValue)) {
      case "string":
        nextValue = this.mapKey(nextValue, nextValue);
        break;

      case "array":
        //$FlowFixMe
        nextValue = nextValue.map(item => {
          return typeof item === "string" ? this.mapKey(item, item) : item;
        });
    }
  }

  return nextValue;
}

module.exports = mapValueToContext;