// @flow
const set = require("lodash/set")
const get = require("lodash/get")
const castArray = require("lodash/castArray")
const transform = require("lodash/transform")
const pathArray = require("lodash/toPath")
const { Set, Map, fromJS, merge } = require("immutable")
const yaml = require("js-yaml")
const kindOf = require("kind-of")
const debug = require("debug")
const log = debug("transform")
// const log = console.dir
const { DEFAULT_OPTIONS, DEFAULT_CONTEXT } = require("./constants")
const { MAP, MAP_RESULT, PLUGIN_INSTALLED, EXTEND, PARSE } = require("./events")
const { CONTEXT, ID, REMOVE, VALUE, ADDITIONAL_PROPERTIES } = require("./terms")
const mapContextValue = require("./map-context-value")

function defaultContext(key: string) {
  return {
    name: key,
    id:   key,
    key:  key
  }
}

module.exports = class Context {
  cdef: Map<string, any>
  options: Map<string, any>
  plugins: Set<Function>

  constructor(cdef: {} = {}, options?: {} = {}) {
    this.options = Map().merge(DEFAULT_OPTIONS, options)
    this.plugins = Set()
    this.cdef = Map().merge(DEFAULT_CONTEXT, this.parseContext(cdef))
  }

  static fromYaml(cdef: string): Context {
    return new Context(yaml.load(cdef))
  }

  parseContext(contextDefinition: {}): {} {
    const state = this.dispatch(PARSE, contextDefinition, this)
    return Map(state).map(mapContextValue).toJS()
  }

  extend(cdef: {}, options?: {}): Context {
    // new context to merge with current context
    const object = this.parseContext(cdef)
    const target = this.toJSON()
    const beforeMerge = this.dispatch(EXTEND, { object, target }, this)
    const merged = merge(get(beforeMerge, 'target'), get(beforeMerge, 'object'))
    const nextContext = new Context(merged, options)
    nextContext.plugins = this.plugins.toSet()
    return nextContext
  }

  toJSON() {
    return this.cdef.toJS()
  }

  toJS() {
    return this.cdef.toJS()
  }

  setOption(key: string, value: any): Context {
    //$FlowFixMe
    this.options = this.options.setIn(pathArray(key), value)
    return this
  }

  getOption(key: string, defaultValue: any): any {
    //$FlowFixMe
    return this.options.getIn(pathArray(key), defaultValue)
  }

  has(key: string | Array<string>): boolean {
    //$FlowFixMe
    return this.cdef.hasIn(pathArray(key))
  }

  get(keyPath: string | Array<string>, defaultValue: any): any {
    return this.has(keyPath)
      //$FlowFixMe
      ? this.cdef.getIn(pathArray(keyPath))
      : defaultValue
  }

  mapKey(key: string, defaultValue?: string): string {
    return this.get([key, ID], defaultValue) || key
  }

  allowProperty(key: string): boolean {
    const ALLOWED = true
    if (this.has(key) && (this.get([key, ID]) !== REMOVE) && this.get([key, VALUE]) !== REMOVE) {
      return ALLOWED
    }
    if (this.has(ADDITIONAL_PROPERTIES)) {
      return this.get(ADDITIONAL_PROPERTIES, false)
    }
    return this.getOption(ADDITIONAL_PROPERTIES, false)
  }

  /**
   *  apply the current context to a single value & key
   * @param {*} value - the value to be processed
   * @param key {string} - the context node to apply to the value
   * @param last {*} - the originalValue (passed to context.val handler function if any exists
   * @returns {*} - the transformed value
   */
  mapValue(value: any, key: string, last?: {}) {
    log("mapValue", { value, key })
    const object = this.get(key, defaultContext(key))

    if (kindOf(value) === "array") {
      let context = this
      return value.map(item => context.mapValue(item, key, value))
    }

    let result = value

    // deprecated syntax
    if (kindOf(object["val"]) === "function") {
      console.warn("context.val functions have been deprecated, functions should be converted to new value - called with (value, key, last, context)")
      result = object["val"].call(this.toJSON(), { value, key, last })
    }

    if (kindOf(object[VALUE]) === "function") {
      result = object[VALUE].call(this.toJSON(), value, key, last, this.toJSON())
    }

    if (kindOf(object[VALUE]) === "string") {
      result = object[VALUE]
    }

    if (kindOf(result) === "object") {
      console.log("object:value", result)
      let subContext = get(object, CONTEXT) || get(object, "context", {})
      console.log({ subContext })
      result = this.extend(subContext).map(result)
    }

    /* map string values for type/@type */
    if (["type", "@type"].includes(key) && (typeof result === "string")) {
      result = this.mapKey(result, result)
    }

    log("mapValue:end", result)

    return result
  }

  mapEntry(entry: [string, any]): [string, any] | void {
    let [key, value] = entry
    const nextKey = this.mapKey(key, key)
    const nextValue = this.mapValue(value, key)
    return [nextKey, nextValue]
  }

  map(value: {} = {}, initialValue?: {}) {
    const transformer = this.transformEntry.bind(this)
    let state = fromJS(value)
    //$FlowFixMe
    state = state.toJS()
    state = this.dispatch(MAP, state, { initialValue, context: this })
    state = transform(state, transformer, initialValue)
    state = this.dispatch(MAP_RESULT, state, this)
    return state
  }

  transformEntry(target: {}, value: any, key: string, object: {}): {} {
    if (this.allowProperty(key)) {
      const nextKey = this.mapKey(key, key)
      const newValue = this.mapValue(value, key, object)
      const currentValue = get(target, nextKey)
      const result = currentValue ? castArray(currentValue).concat(newValue) : newValue
      set(target, nextKey, result)
    }
    // log({ event: "transformEntry:result", next, value, key, last })
    return target
  }

  use(plugin: Function, options?: {}): Context {
    plugin.call(this, PLUGIN_INSTALLED, options, this)
    this.plugins = this.plugins.add(plugin)
    return this
  }

  dispatch(event: string, data: {} = {}, context?: any): {} {
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
