const isPlainObject = require('lodash/isPlainObject')
const isNull = require('lodash/isnull')
const has = require('lodash/has')
const set = require('lodash/set')
const get = require('lodash/get')
const transform = require('lodash/transform')
const immutable = require('immutable')
const curry = require('lodash.curry')
const defaults = require('lodash.defaults')
const {KEYMAP, VALMAP} = require('./constants')
const parseContext = require('./parseContext')

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
		nextValue = new Set().concat(get(next, nextKey), nextValue).toArray()
	}

	return set(next, nextKey, nextValue)
}

module.exports = class Context {
	constructor(cdef = {}) {
		this.cdef = {}
		this.cname = {}
		this.cval = {}
		this.initialValue = cdef['@initialValue']
		this.map = this.map.bind(this)
		this.init(cdef)
	}

	init(cdef) {
		Object.assign(this, parseContext(cdef))
		this.cdef = cdef
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
		return transform(data, withContext(this), _initialValue)
	}

	mapKeys(data, initialValue) {
		let result = transform(data, keyMapper(this), initialValue)
		if (this.__keyorder) {
			result = orderKeys(this.__keyorder.value)(result)
		}
		return result
	}
}
