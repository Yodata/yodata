import get from 'lodash/get'
import transform from 'lodash/transform'
import { curry, has, isNull, isPlainObject, set } from 'lodash'
import { Set } from 'immutable'
import { KEYMAP, VALMAP } from './constants'
import parseContext from './parseContext'

const isArray = Array.isArray

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
    return context.hasVal(key)
      ? context[ VALMAP ][ key ]({ value: nextValue, context, key, last, ...props })
      : nextValue;
  }
  if (context.hasVal(value)) {
    return context[ VALMAP ][ value ]({ context, value, key, last, ...props })
  }
  if (context.hasVal(key)) {
    return context[ VALMAP ][ key ]({ context, value, key, last, ...props })
  }
  return context.mapKey(value)
}, 2);

const withContext = context => (next, value, key, last) => {
  let nextKey = context.mapKey(key)

  if (isNull(nextKey)) {
    return next
  }

  let nextValue = mapValueToContext(context, value, key, last);

  // if next.nextKey has data, concat nextValue
  if (has(next, nextKey)) {
    nextValue = Set().concat(get(next, nextKey), nextValue).toArray()
  }

  return set(next, nextKey, nextValue)
};

export default class Context {
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
    return new Context({ ...this.cdef, ...cdef })
  }

  /**
   * true if the current context mentions key
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return has(this[ KEYMAP ], key) || has(this[ VALMAP ], key);
  }

  hasKey(key) {
    return has(this[ KEYMAP ], key);
  }

  hasVal(key) {
    return has(this[ VALMAP ], key);
  }

  mapKey(key) {
    return get(this[ KEYMAP ], key, key);
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
