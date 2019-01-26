/* eslint-disable unicorn/new-for-builtins */
/* eslint-disable new-cap */
// @flow
// @ts-check

const set = require('lodash/set')
const get = require('lodash/get')
const castArray = require('lodash/castArray')
const transform = require('lodash/transform')
const toPath = require('lodash/toPath')
const mapKeys = require('lodash/mapKeys')
const {Set, Map, fromJS, merge, List} = require('immutable')
const YAML = require('js-yaml')

const log = require('debug')('transform')
const {DEFAULT_OPTIONS, DEFAULT_CONTEXT} = require('./constants')
const {MAP, MAP_RESULT, PLUGIN_INSTALLED, EXTEND, PARSE} = require('./events')
const {ID, REMOVE, ADDITIONAL_PROPERTIES, NEST, CONTAINER, SET, LIST, REDACT} = require('./terms')
const parseContextValue = require('./parse-context-value')
const mapValueToContext = require('./map-value-to-context')

/**
 * Converts a path expression a.b.c to a path array [a,b,c]
 * @param {string | string[]} key - the path or path array
 * @returns {string[]} pathArray
 */
const pathArray = key => {
	if (typeof key === 'string' && key.includes('http') && key.includes('://')) {
		return [key]
	}

	return toPath(key)
}

class Context {
	/**
	 * Creates a new transformation Cotnext
	 * @param {*} [contextDefinition] a valid ContextDefinition object
	 * @param {*} [options] configuration options
	 */
	constructor(contextDefinition = {}, options = {}) {
		this.options = Map().merge(DEFAULT_OPTIONS, options)
		this.plugins = Set()
		this.cdef = Map().merge(DEFAULT_CONTEXT, this.parseContext(contextDefinition))
	}

	/**
   * Creates a transform context from a YAML string
   * @param {string} yaml - the context source in YAML.
   * @returns {Context} transformation Context
   */
	static fromYaml(yaml) {
		return new Context(YAML.load(yaml))
	}

	/**
   * Parse & normalize a context definition JSON string
   * @param {object} contextDefinition a valid ContextDefinition
   * @returns {object} normalized ContextDefinition document
   */
	parseContext(contextDefinition) {
		const state = this.dispatch(PARSE, contextDefinition, this)
		return Map(state).map(parseContextValue).toJS()
	}

	/**
	 * Creates a new context from the current + the provided context definition document.
	 * @param {object} cdef - a valid context definition object
	 * @param {object} [options] - optional configuration and plugin options
	 * @returns {Context} a new Context
	 */
	extend(cdef, options) {
		const object = this.parseContext(cdef)
		const target = this.toJS()
		const beforeMerge = this.dispatch(EXTEND, {object, target}, this)
		log('beforeMerge')
		log({object, target, beforeMerge})
		const merged = merge(get(beforeMerge, 'target'), get(beforeMerge, 'object'))
		const nextContext = new Context(merged, options)
		nextContext.plugins = this.plugins.toSet()
		return nextContext
	}

	/**
	 * Returns JSON representation of the Context Definition
	 * @returns {string} JSON ContextDefinition
	 */
	toJSON() {
		const object = this.toJS()
		return JSON.stringify(object)
	}

	/**
	 * Returns a plain javascript object representation of the current context
	 * @returns {object} - JavaScript object representation of the current context
	 */
	toJS() {
		return this.cdef.toJS()
	}

	/**
	 * Sets or creates a context.options.key value
	 * @param {string} key option.name
	 * @param {*} value option.value
	 * @returns {Context} Context
	 */
	setOption(key, value) {
		this.options = this.options.setIn(pathArray(key), value)
		return this
	}

	/**
	 * Get an option value
	 * @param {string} key option.name
	 * @param {*} [defaultValue] optional defaultValue
	 * @returns {*} option.value | defaultValue
	 */
	getOption(key, defaultValue) {
		return this.options.getIn(pathArray(key), defaultValue)
	}

	/**
	 * Checks the current context for key
	 * @param {string|string[]} key key to find
	 * @returns {boolean} true if the current context contains key
	 */
	has(key) {
		const target = pathArray(key)
		return this.cdef.hasIn(target)
	}

	/**
	 * Returns the value of key from the current context
	 * @param {string|string[]} key the property to find
	 * @param {*} [defaultValue] optional defaultValue
	 * @returns {*} key.value | defaultValue
	 */
	get(key, defaultValue) {
		const target = pathArray(key)
		return this.has(target) ?
			this.cdef.getIn(target) :
			defaultValue
	}

	/**
	 * True if the provided key will be removed on transform
	 * @param {string|string[]} key the property to find
	 * @returns {boolean} true if the property found in the current context
	 */
	isRemoved(key) {
		const target = pathArray(key)
		return this.has(target.concat(REMOVE))
	}

	/**
	 * True if the provided key will be redacted on transform
	 * @param {string|string[]} key the property to find
	 * @returns {boolean} true if property.redact = true
	 */
	isRedacted(key) {
		const target = pathArray(key)
		return this.has(target.concat(REDACT))
	}

	/**
	 * True if the context allows out-of-context values
	 * @property {boolean}
	 */
	get allowsAdditionalProperties() {
		return this.has(ADDITIONAL_PROPERTIES) ? this.get(ADDITIONAL_PROPERTIES) : this.getOption(ADDITIONAL_PROPERTIES, false)
	}

	/**
	 *
	 * @param {string|string[]} key
	 * @returns {boolean}
	 */
	isAllowed(key) {
		return this.has(key) ? !this.isRemoved(key) : this.allowsAdditionalProperties
	}

	/**
	 * Returns the context name of key
	 * @param {string|string[]} key
	 * @param {*} [defaultValue]
	 * @returns {string}
	 */
	mapKey(key, defaultValue) {
		// @ts-ignore
		const container = this.get([key, NEST])
		// @ts-ignore
		const nextKey = this.get([key, ID], defaultValue) || key
		return container ? `${container}.${nextKey}` : nextKey
	}

	/**
	 * Returns a new copy of object with the keys renamed by the active context (this)
	 * @param {object} object
	 * @returns {object}
	 */
	mapKeys(object) {
		return mapKeys(object, (v, k) => this.mapKey(k, k))
	}

	/**
	 * Executes the current context for the key/value pair and returns the resulting value
	 * @param {*} value - the value
	 * @param {string|string[]} key - the key
	 * @param {*} [object]
	 * @param {*} [context]
	 */
	mapValue(value, key, object = {}, context) {
		const activeContext = context || this.get(key, this.toJS())
		return mapValueToContext.call(this, value, key, object, activeContext)
	}

	/**
	 * Processes the key/value pair with the current context and returns the resulting key/value pair or void if the key is not allowed
	 * @param {[string,*]} entry - key,value pair
	 * @returns {[string,*]|undefined}
	 */
	mapEntry(entry) {
		const [key, value] = entry
		const nextKey = this.mapKey(key, key)
		const nextValue = this.mapValue(value, key)
		return [nextKey, nextValue]
	}

	/**
	 * Process object with the current context
	 * non-destructive - always returns a new object
	 * @param {object} object
	 * @param {object} [initialValue]
	 * @returns {object} - the resulting state of object
	 */
	map(object = {}, initialValue) {
		let state = fromJS(object)
		state = state.toJS()
		state = this.dispatch(MAP, state, {initialValue, context: this})
		state = this._map(state, initialValue)
		state = this.dispatch(MAP_RESULT, state, this)
		return state
	}

	_map(object = {}, initialValue) {
		const transformer = this.transformEntry.bind(this)
		return transform(object, transformer, initialValue)
	}

	/**
	 * Adds value to target.key.
	 * if target.key does not exist it will be created.
	 * if target.key is a scalar, it will be converted to an array and the new value will be pushed
	 * if target.key is an array, the new value is pushed to target.key
	 * if target.key is an object and value is an object, target.key will be recursively processed in the same manor
	 * @param {object} target - the object being transformed
	 * @param {*} value - the value to add to target.key
	 * @param {string} key - the key
	 * @param {*} object - the original (source) object
	 * @returns {object} - the next state of target
	 */
	transformEntry(target, value, key, object) {
		if (this.isAllowed(key)) {
			const targetKey = pathArray(this.mapKey(key, key))
			const targetValue = get(target, targetKey)
			const objectValue = this.mapValue(value, key, object)
			// @ts-ignore
			const targetContainer = this.get([targetKey, CONTAINER])
			let nextValue = targetValue ? castArray(targetValue).concat(objectValue) : objectValue
			// eslint-disable-next-line default-case
			switch (targetContainer) {
				case LIST:
					nextValue = List(castArray(nextValue)).toArray()
					break
				case SET:
					nextValue = Set(castArray(nextValue)).toArray()
					break
			}

			set(target, targetKey, nextValue)
		}

		return target
	}

	/**
	 * Adds a plugin to the context
	 * @param {function} plugin
	 * @param {object} [options]
	 * @returns {Context} the new context with plugin installed
	 */
	use(plugin, options) {
		plugin.call(this, PLUGIN_INSTALLED, options, this)
		this.plugins = this.plugins.add(plugin)
		return this
	}

	/**
	 * Emits event to plug-in handlers
	 * @param {string} event
	 * @param {object} [data]
	 * @param {*} [context]
	 * @returns {Context} the current context
	 */
	dispatch(event, data = {}, context) {
		const state = fromJS(data)
		let next = state.toJS()
		this.plugins.forEach(plugin => {
			next = plugin.call(this, event, next, context)
			log(`${event}:result`, next)
		})
		return next
	}
}

module.exports = Context
