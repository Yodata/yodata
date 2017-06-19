'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var get = _interopDefault(require('lodash/get'));
var transform = _interopDefault(require('lodash/transform'));
var lodash = require('lodash');
var immutable = require('immutable');
var flow = _interopDefault(require('lodash/flow'));
var isPlainObject$1 = _interopDefault(require('lodash/isPlainObject'));

const KEYMAP = 'cname';
const VALMAP = 'cval';

const returnValue = props => props.value;

const parseContext = contextDefinition => {
  return lodash.transform(contextDefinition, (context, value, key) => {
    const setKey = val => lodash.set(context, [KEYMAP, key], val);
    const setVal = val => lodash.set(context, [VALMAP, key], val);

    if (lodash.isNull(value)) {
      setKey(value);
      return context;
    }
    if (lodash.isString(value)) {
      setKey(value);
      return context;
    }
    if (lodash.isFunction(value)) {
      setKey(key);
      setVal(value);
      return context;
    }
    // advanced context definition syntax
    if (lodash.isPlainObject(value)) {
      setKey(lodash.get(value, 'key', key));
      setVal(lodash.get(value, 'val', returnValue));

      if (value.context) {
        // this hack will break if the subContext overwrites a key
        // in the parent context.
        // todo: implement subContext at JSON node level to avoid conflicts
        let subContext = parseContext(value.context);
        Object.assign(context[KEYMAP], subContext[KEYMAP]);
        Object.assign(context[VALMAP], subContext[VALMAP]);
      }
      return context;
    }
    // bad format
    throw new Error('parseContext error');
  }, {});
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

const isArray = Array.isArray;

const mapValueToContext = lodash.curry((context, value, key, last, props) => {
  if (isArray(value)) {
    let result = immutable.Set();
    value.map(item => {
      result = result.add(mapValueToContext(context, item, key, last, props));
    });
    return result.toArray();
  }
  if (lodash.isPlainObject(value)) {
    let nextValue = context.map(value);
    return context.hasVal(key) ? context[VALMAP][key](_extends({ value: nextValue, context, key, last }, props)) : nextValue;
  }
  if (context.hasVal(value)) {
    return context[VALMAP][value](_extends({ context, value, key, last }, props));
  }
  if (context.hasVal(key)) {
    return context[VALMAP][key](_extends({ context, value, key, last }, props));
  }
  return context.mapKey(value);
}, 2);

const withContext = context => (next, value, key, last) => {
  let nextKey = context.mapKey(key);

  if (lodash.isNull(nextKey)) {
    return next;
  }

  let nextValue = mapValueToContext(context, value, key, last);

  // if next.nextKey has data, concat nextValue
  if (lodash.has(next, nextKey)) {
    nextValue = immutable.Set().concat(get(next, nextKey), nextValue).toArray();
  }

  return lodash.set(next, nextKey, nextValue);
};

class Context {
  constructor(cdef) {
    this.cdef = {};
    this.cname = {};
    this.cval = {};
    this.map = this.map.bind(this);
    this.init(cdef);
  }

  init(cdef) {
    Object.assign(this, parseContext(cdef));
    this.cdef = cdef;
  }

  extend(cdef) {
    return new Context(_extends({}, this.cdef, cdef));
  }

  /**
   * true if the current context mentions key
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return lodash.has(this[KEYMAP], key) || lodash.has(this[VALMAP], key);
  }

  hasKey(key) {
    return lodash.has(this[KEYMAP], key);
  }

  hasVal(key) {
    return lodash.has(this[VALMAP], key);
  }

  mapKey(key) {
    return get(this[KEYMAP], key, key);
  }

  mapVal(data) {
    return mapValueToContext(this, data);
  }

  map(data, initialValue) {
    let toContext = withContext(this);
    let result = transform(data, toContext, initialValue);
    return result;
  }
}

/**
 * creates a deep getter with an optional default value
 * @param {string} path - the path to retrieve from the subject i.e. 'path.to.value'
 * @param {*} [defaultValue] - value to return if nothing is found at subject[path]
 */
const getIn = (path, defaultValue) => data => get(data, path, defaultValue);

const defaultProps = defaultProps => ({ value }) => {
  if (isPlainObject$1(value)) {
    return _extends({}, defaultProps, value);
  }
  return value;
};

var index = {
  Context,
  defaultProps,
  flow,
  getIn
};

module.exports = index;
//# sourceMappingURL=yodata-context.js.map
