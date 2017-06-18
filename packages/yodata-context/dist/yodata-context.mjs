import get from 'lodash/get';
import transform from 'lodash/transform';
import { curry, get as get$1, has, isFunction, isNull, isPlainObject, isString, set, transform as transform$1 } from 'lodash';
import { Set } from 'immutable';
import flow from 'lodash/flow';
import isPlainObject$1 from 'lodash/isPlainObject';

const KEYMAP = 'cname';
const VALMAP = 'cval';

const returnValue = props => props.value;

const parseContext = contextDefinition => {
  return transform$1(contextDefinition, (context, value, key) => {
    const setKey = val => set(context, [KEYMAP, key], val);
    const setVal = val => set(context, [VALMAP, key], val);

    if (isNull(value)) {
      setKey(value);
      return context;
    }
    if (isString(value)) {
      setKey(value);
      return context;
    }
    if (isFunction(value)) {
      setKey(key);
      setVal(value);
      return context;
    }
    // advanced context definition syntax
    if (isPlainObject(value)) {
      setKey(get$1(value, 'key', key));
      setVal(get$1(value, 'val', returnValue));

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

const mapValueToContext = curry((context, value, key, last, props) => {
  if (isArray(value)) {
    let result = Set();
    value.map(item => {
      result = result.add(mapValueToContext(context, item, key, last, props));
    });
    return result.toArray();
  }
  if (isPlainObject(value)) {
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

  if (isNull(nextKey)) {
    return next;
  }

  let nextValue = mapValueToContext(context, value, key, last);

  // if next.nextKey has data, concat nextValue
  if (has(next, nextKey)) {
    nextValue = Set().concat(get(next, nextKey), nextValue).toArray();
  }

  return set(next, nextKey, nextValue);
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
    return has(this[KEYMAP], key) || has(this[VALMAP], key);
  }

  hasKey(key) {
    return has(this[KEYMAP], key);
  }

  hasVal(key) {
    return has(this[VALMAP], key);
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

export default index;
//# sourceMappingURL=yodata-context.mjs.map
