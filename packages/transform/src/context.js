// @flow
const set = require("lodash/set")
const get = require("lodash/get")
const castArray = require("lodash/castArray")
const transform = require("lodash/transform")
const pathArray = require("lodash/toPath")
const mapKeys = require('lodash/mapKeys')
const { Set, Map, fromJS, merge } = require("immutable")
const YAML = require("js-yaml")
const kindOf = require("kind-of")
const debug = require("debug")
const log = debug("transform")
const ow = require('ow')
// const log = console.dir
const { DEFAULT_OPTIONS, DEFAULT_CONTEXT } = require("./constants")
const { MAP, MAP_RESULT, PLUGIN_INSTALLED, EXTEND, PARSE } = require("./events")
const { CONTEXT, ID, REMOVE, VALUE, ADDITIONAL_PROPERTIES, NEST, NAME } = require("./terms")
const parseContextValue = require("./parse-context-value")
const mapValueToContext = require("./map-value-to-context")

function defaultContext(key: string) {
  return {
    name: key,
    id:   key,
    key:  key
  }
}

class Context {
  cdef: Map<string, any>
  options: Map<string, any>
  plugins: Set<Function>

  constructor(contextDefinition: {} = {}, options?: {} = {}) {
    this.options = Map().merge(DEFAULT_OPTIONS, options)
    this.plugins = Set()
    this.cdef = Map().merge(DEFAULT_CONTEXT, this.parseContext(contextDefinition))
  }

  /**
   * creates a transform context from a YAML string
   *
   * @param yaml - the context source in YAML.
   * @returns {Context}
   */
  static fromYaml(yaml: string): Context {
    return new Context(YAML.load(yaml))
  }

  /**
   * parse & normalize a context definition object.
   *
   *
   * @param contextDefinition
   * @returns {object}
   */
  parseContext(contextDefinition: {}): {} {
    const state = this.dispatch(PARSE, contextDefinition, this)
    return Map(state).map(parseContextValue).toJS()
  }

  extend(cdef: {}, options?: {}): Context {
    // new context to merge with current context
    const object = this.parseContext(cdef)
    const target = this.toJSON()
    const beforeMerge = this.dispatch(EXTEND, { object, target }, this)
    const merged = merge(get(beforeMerge, "target"), get(beforeMerge, "object"))
    const nextContext = new Context(merged, options)
    nextContext.plugins = this.plugins.toSet()
    return nextContext
  }

  toJSON(): {} {
    return this.cdef.toJS()
  }

  toJS(): {} {
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

  mapKey(key: string, defaultValue?: string): string {
    let container = this.get([key, NEST])
    let nextKey = this.get([key, ID], defaultValue) || key
    return container ? `${container}.${nextKey}` : nextKey
  }

  mapKeys(object: {}): {} {
    return mapKeys(object,(v,k,o) => this.mapKey(k,k))
  }

  mapValue(value: any, key: string, object?: {} = {}, context: {}) {
    let activeContext = this.get(key, this.toJS())
    return mapValueToContext.call(this, value, key, object, activeContext)
  }

  mapEntry(entry: [string, any]): [string, any] | void {
    let [key, value] = entry
    const nextKey = this.mapKey(key, key)
    const nextValue = this.mapValue(value, key)
    return [nextKey, nextValue]
  }

  map(object: {} = {}, initialValue?: {}): {} | Array<{}> {
    ow(object, ow.object)
    const transformer = this.transformEntry.bind(this)
    let state = fromJS(object)
    //$FlowFixMe
    log({state})
    state = state.toJS()
    state = this.dispatch(MAP, state, { initialValue, context: this })
    state = transform(state, transformer, initialValue)
    state = this.dispatch(MAP_RESULT, state, this)
    return state
  }

  transformEntry(target: {}, value: any, key: string, object: {}): {} {
    log('transform', {value, key, object, target})
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

module.exports = Context
