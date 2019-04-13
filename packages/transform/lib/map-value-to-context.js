"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// @ts-check
var kindOf = require('kind-of');

var get = require('lodash/get');

var set = require('lodash/set');

var mapValues = require('lodash/mapValues');

var isObjectLike = require('lodash/isObjectLike');

var _require = require('immutable'),
    Map = _require.Map,
    fromJS = _require.fromJS;

var debug = require('debug');

var jsonata = require('jsonata');

var logger = debug('transform:map-value-to-context');

var _require2 = require('./terms'),
    NAME = _require2.NAME,
    NEST = _require2.NEST,
    VALUE = _require2.VALUE,
    LIST = _require2.LIST,
    SET = _require2.SET,
    FRAME = _require2.FRAME,
    CONTEXT = _require2.CONTEXT,
    DEFAULT = _require2.DEFAULT,
    TYPE = _require2.TYPE,
    ID = _require2.ID,
    REMOVE = _require2.REMOVE,
    REDACT = _require2.REDACT;

var isToken = function isToken(value) {
  var result = typeof value === 'string' && ['#', '$'].includes(value[0]);
  return result;
};

var isExpression = function isExpression(value) {
  return kindOf(value) === 'string' && value.startsWith('(') && value.endsWith(')');
};

var renderExpression = function renderExpression(value, context) {
  var expression = value.slice(1, -1);
  return jsonata(expression).evaluate(context);
};

var stripToken = function stripToken(value) {
  return value.substring(1);
};

var renderValue = function renderValue(value, context) {
  switch (kindOf(value)) {
    case 'string':
      if (isExpression(value)) {
        return renderExpression(value, context);
      }

      if (isToken(value)) {
        return get(context, stripToken(value));
      }

      return value;

    case 'function':
      return resolve(value, context);

    default:
      return value;
  }
};

var renderObject = function renderObject(object, context) {
  var ctx = new Map(fromJS(context)).flatten().set('name', get(context, 'name')).set('value', get(context, 'value')).toJS();
  return mapValues(object, function (value) {
    return renderValue(value, ctx);
  });
};

module.exports = mapValueToContext;

function objectify(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return isObjectLike(value) ? value : defaultValue;
}

function resolve(fn, props, defaultValue) {
  var result;

  try {
    result = fn.call({}, props);
  } catch (e) {
    logger('FUNCTION_ERROR:', {
      fn: fn,
      props: props
    });
    result = defaultValue;
  }

  return result;
}

function mapValueToContext(value, key, object, context) {
  var _this = this;

  logger('start', {
    key: key,
    value: value,
    object: object,
    context: context
  });
  var nextValue = value;

  if (kindOf(nextValue) === 'array') {
    return nextValue.map(function (value, index, array) {
      return mapValueToContext.call(_this, value, key, array, context);
    });
  }

  if (kindOf(nextValue) === 'object') {
    var subContext = get(context, CONTEXT);
    var nextContext = this.extend(subContext);
    nextValue = nextContext.map(nextValue);
  } // @ts-ignore


  nextValue = new Map(context).reduce(function (result, contextValue, contextAttribute) {
    switch (contextAttribute) {
      case VALUE:
        switch (kindOf(contextValue)) {
          case 'function':
            return resolve(contextValue, {
              object: object,
              context: context,
              value: value,
              key: key
            }, nextValue);

          case 'object':
            return renderObject(contextValue, {
              object: object,
              name: key,
              value: nextValue
            });

          case 'string':
            {
              var renderContext = kindOf(nextValue) === 'object' ? _objectSpread({}, nextValue, context['@context']) : _objectSpread({}, object, {
                name: key,
                value: nextValue
              });
              return renderValue(contextValue, renderContext);
            }

          default:
            return contextValue;
        }

      case TYPE:
        // Console.log("currentResult = ", result)
        result = objectify(result, _defineProperty({}, context[ID] || VALUE, value));
        result = set(result, TYPE, contextValue);
        return result;

      case 'val':
        return resolve(contextValue, {
          value: value,
          key: key,
          last: object
        });

      case REMOVE:
        return REMOVE;

      case REDACT:
        return REDACT;

      default:
        if (isToken(contextValue)) {
          var k = contextAttribute;
          var v = renderValue(contextValue, _objectSpread({}, value, {
            name: key,
            value: nextValue
          }));
          result = objectify(result, _defineProperty({}, context[ID] || VALUE, value));
          result = set(result, k, v);
        }

        return result;
    }
  }, nextValue);

  if (key === 'type') {
    // eslint-disable-next-line default-case
    switch (kindOf(nextValue)) {
      case 'string':
        nextValue = this.mapKey(nextValue, nextValue);
        break;

      case 'array':
        nextValue = nextValue.map(function (item) {
          return typeof item === 'string' ? _this.mapKey(item, item) : item;
        });
    }
  }

  return nextValue;
}