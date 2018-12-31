// @ts-check

const set = require("lodash/set")
const get = require("lodash/get")
const has = require("lodash/has")
const castArray = require("lodash/castArray")
const transform = require("lodash/transform")
const pathArray = require("lodash/toPath")
const mapKeys = require("lodash/mapKeys")
const { Set, Map, fromJS, merge, List } = require("immutable")
const YAML = require("js-yaml")
const log = console.dir
const { DEFAULT_OPTIONS, DEFAULT_CONTEXT } = require("./constants")
const { MAP, MAP_RESULT, PLUGIN_INSTALLED, EXTEND, PARSE } = require("./events")
const { CONTEXT, ID, REMOVE, VALUE, ADDITIONAL_PROPERTIES, NEST, NAME, CONTAINER, SET, LIST, REDACT } = require("./terms")
const parseContextValue = require("./parse-context-value")
const mapValueToContext = require("./map-value-to-context")

class Context {

	/**
	 * Creates a new transformation Cotnext
	 * @param {*} contextDefinition
	 * @param {*} options
	 */
  constructor(contextDefinition = {}, options = {}) {
    this.options = Map().merge(DEFAULT_OPTIONS, options)
    this.plugins = Set()
    this.cdef = Map().merge(DEFAULT_CONTEXT, this.parseContext(contextDefinition))
  }

  /**
   * creates a transform context from a YAML string
   * @param {string} yaml - the context source in YAML.
   * @returns {Context}
   */
  static fromYaml(yaml) {
    return new Context(YAML.load(yaml))
  }

  /**
   * parse & normalize a context definition JSON string
   * @param {object} contextDefinition
   * @returns {object}
   */
  parseContext(contextDefinition) {
    const state = this.dispatch(PARSE, contextDefinition, this)
    return Map(state).map(parseContextValue).toJS()
	}

	/**
	 * Creates a new context from the current + the provided context definition document.
	 * @param {object} cdef - a valid context definition object
	 * @param {object} [options]
	 * @returns {Context}
	 */
  extend(cdef, options) {
    const object = this.parseContext(cdef)
    const target = this.toJS()
		const beforeMerge = this.dispatch(EXTEND, { object, target }, this)
		log('beforeMerge')
		log({object,target,beforeMerge})
    const merged = merge(get(beforeMerge, "target"), get(beforeMerge, "object"))
    const nextContext = new Context(merged, options)
    nextContext.plugins = this.plugins.toSet()
    return nextContext
  }

	/**
	 *
	 * @returns {JSON}
	 */
	toJSON() {
		let object = this.toJS()
    return JSON.stringify(object)
  }

	/**
	 * returns a plain javascript object representation of the current context
	 * @returns {object}
	 */
	toJS() {
    return this.cdef.toJS()
  }

	/**
	 *
	 * @param {string} key
	 * @param {*} value
	 * @returns {Context}
	 */
  setOption(key, value) {
    //$FlowFixMe
    this.options = this.options.setIn(pathArray(key), value)
    return this
	}
	/**
	 *
	 * @param {string} key
	 * @param {*} defaultValue
	 * @returns {*}
	 */
  getOption(key, defaultValue) {
    //$FlowFixMe
    return this.options.getIn(pathArray(key), defaultValue)
  }

	/**
	 *
	 * @param {string|string[]} key
	 * @returns {boolean}
	 */
	has(key) {
		let target = pathArray(key)
    return this.cdef.hasIn(target)
  }

	/**
	 *
	 * @param {string|string[]} keyPath
	 * @param {*} [defaultValue]
	 * @returns {*}
	 */
	get(key, defaultValue) {
		let target = pathArray(key)
    return this.has(target)
      ? this.cdef.getIn(target)
      : defaultValue
	}

	/**
	 * true if the provided key will be removed on transform
	 * @param {string|string[]} key
	 * @returns {boolean}
	 */
	isRemoved(key) {
		let target = pathArray(key)
    return this.has(target.concat(REMOVE))
  }

	/**
	 * true if the provided key will be redacted on transform
	 * @param {string|string[]} key
	 * @returns {boolean}
	 */
  isRedacted(key) {
		let target = pathArray(key)
    return this.has(target.concat(REDACT))
	}

	/**
	 * true if the context allows out-of-context values
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
	isAllowed(key){
    return this.has(key) ? !this.isRemoved(key) : this.allowsAdditionalProperties
  }

	/**
	 * returns the context name of key
	 * @param {string|string[]} key
	 * @param {*} [defaultValue]
	 * @returns {string}
	 */
	mapKey(key, defaultValue) {
    let container = this.get([key, NEST])
    let nextKey = this.get([key, ID], defaultValue) || key
    return container ? `${container}.${nextKey}` : nextKey
  }

	/**
	 * returns a new copy of object with the keys renamed by the active context (this)
	 * @param {object} object
	 * @returns {object}
	 */
	mapKeys(object) {
    return mapKeys(object, (v, k) => this.mapKey(k, k))
  }

	/**
	 * executes the current context for the key/value pair and returns the resulting value
	 * @param {*} value - the value
	 * @param {string|string[]} key - the key
	 * @param {*} [object]
	 * @param {*} [context]
	 */
	mapValue(value, key, object = {}, context) {
    let activeContext = context || this.get(key, this.toJS())
    return mapValueToContext.call(this, value, key, object, activeContext)
	}

	/**
	 * processes the key/value pair with the current context and returns the resulting key/value pair or void if the key is not allowed
	 * @param {[string,*]} entry - key,value pair
	 * @returns {[string,*]|undefined}
	 */
  mapEntry(entry) {
    let [key, value] = entry
    const nextKey = this.mapKey(key, key)
    const nextValue = this.mapValue(value, key)
    return [nextKey, nextValue]
  }

	/**
	 * process object with the current context
	 * non-destructive - always returns a new object
	 * @param {object} object
	 * @param {object} [initialValue]
	 * @returns {object} - the resulting state of object
	 */
	map(object = {}, initialValue) {
    const transformer = this.transformEntry.bind(this)
    let state = fromJS(object)
    //$FlowFixMe
    state = state.toJS()
    state = this.dispatch(MAP, state, { initialValue, context: this })
    state = transform(state, transformer, initialValue)
    state = this.dispatch(MAP_RESULT, state, this)
    return state
	}

	/**
	 * adds value to target.key.
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
      const targetKey = this.mapKey(key, key)
      const targetValue = get(target, targetKey)
      const objectValue = this.mapValue(value, key, object)
      const targetContainer = this.get([targetKey, CONTAINER])
      let nextValue = targetValue ? castArray(targetValue).concat(objectValue) : objectValue
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
	 *
	 * @param {function} plugin
	 * @param {object} [options]
	 * @returns {Context}
	 */
  use(plugin, options) {
    plugin.call(this, PLUGIN_INSTALLED, options, this)
    this.plugins = this.plugins.add(plugin)
    return this
  }

	/**
	 * emits event to plug-in handlers
	 * @param {string} event
	 * @param {object} [data]
	 * @param {*} [context]
	 */
	dispatch(event, data = {}, context) {
    log("DISPATCH", { event, data, context })
    let state = fromJS(data)
    //$FlowFixMe
    let next = state.toJS()
    this.plugins.forEach(plugin => {
      next = plugin.call(this, event, next, context)
    })
    log("dispatch:completed", { data, next })
    return next
  }
}

module.exports = Context
