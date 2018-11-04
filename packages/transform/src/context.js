const isPlainObject = require('lodash/isPlainObject')
const isNull = require('lodash/isnull')
const has = require('lodash/has')
const set = require('lodash/set')
const get = require('lodash/get')
const castArray = require('lodash/castArray')
const transform = require('lodash/transform')
const immutable = require('immutable')
const curry = require('lodash.curry')
const defaults = require('lodash.defaults')
const {KEYMAP, VALMAP, DEFAULT_KEY_ORDER} = require('./constants')
const parseContext = require('./parseContext')
const yaml = require('js-yaml')

const isArray = Array.isArray
const Set = immutable.Set

const mapValueToContext = curry((context, value, key, last, props) => {
	if (isArray(value)) {
		let result = new Set()
		value.map(item => {
			result = result.add(mapValueToContext(context, item, key, last, props))
		})
		return result.toArray()
	}
	if (isPlainObject(value)) {
		const nextValue = context.map(value)
		return context.hasVal(key)
			? context[VALMAP][key]({value: nextValue, context, key, last, ...props})
			: nextValue
	}
	if (context.hasVal(value)) {
		return context[VALMAP][value]({context, value, key, last, ...props})
	}
	if (context.hasVal(key)) {
		return context[VALMAP][key]({context, value, key, last, ...props})
	}
	return context.mapKey(value)
}, 2)

const withContext = context => (next, value, key, last) => {
	const nextKey = context.mapKey(key)

	if (isNull(nextKey)) {
		return next
	}

	let nextValue = mapValueToContext(context, value, key, last)

	// If next.nextKey has data, concat nextValue
	if (has(next, nextKey)) {
	  let currentValue = castArray(get(next,nextKey))
    nextValue = Set(currentValue).add(nextValue).toArray()
	}

	return set(next, nextKey, nextValue)
}

const keyMapper = context => (next, value, key, last) => {
  const nextKey = context.mapKey(key)

  if (isNull(nextKey)) {
    return next
  }

  let nextValue = value

  if (context.hasVal(key)) {
    nextValue = context[VALMAP][key]({context, value, key, last})
  }

  // if next.nextKey has data, concat nextValue
  if (has(next, nextKey)) {
    nextValue = Set()
      .concat(get(next, nextKey), nextValue)
      .toArray()
  }
  set(next, nextKey, nextValue)
  return next
}

const orderKeys = order => object => {
  let src = Object.assign({}, object)
  let dest = {}
  order.forEach(k => {
    if (src[k]) {
      dest[k] = src[k]
      delete src[k]
    }
  })
  // sort remaining keys alphabetically
  let keys = Object.keys(src)
  keys.sort().forEach(k => {
    dest[k] = src[k]
  })

  return dest
}

module.exports = class Context {
	constructor(cdef = {}) {
		this.cdef = {}
		this.cname = {}
		this.cval = {}
		this.initialValue = cdef['@initialValue']
		this.keyOrder = cdef['@keyOrder'] || DEFAULT_KEY_ORDER
		const _cdef = Object.assign(cdef)
		delete _cdef['@initialValue']
		delete _cdef['@keyOrder']
		this.map = this.map.bind(this)
		this.init(_cdef)
	}

	init(cdef) {
		Object.assign(this, parseContext(cdef))
		this.cdef = cdef
	}

	static fromYaml(cdef) {
	  return new Context(yaml.load(cdef))
  }

	extend(cdef) {
		return new Context({...this.cdef, ...cdef})
	}

	/**
	 * True if the current context mentions key
	 * @param {string} key
	 * @returns {boolean}
	 */
	has(key) {
		return has(this[KEYMAP], key) || has(this[VALMAP], key)
	}

	hasKey(key) {
		return has(this[KEYMAP], key)
	}

	hasVal(key) {
		return has(this[VALMAP], key)
	}

	mapKey(key) {
		return get(this[KEYMAP], key, key)
	}

	mapVal(data) {
		return mapValueToContext(this, data)
	}

	map(data, initialValue) {
		const _initialValue = defaults(initialValue, this.initialValue)
		let result = transform(data, withContext(this), _initialValue)
    if (this.keyOrder) {
      result = orderKeys(this.keyOrder.value)(result)
    }
    return result
	}

	mapKeys(data, initialValue) {
		let result = transform(data, keyMapper(this), initialValue)

		if (this.keyOrder) {
			result = orderKeys(this.keyOrder.value)(result)
		}
		return result
	}
}
