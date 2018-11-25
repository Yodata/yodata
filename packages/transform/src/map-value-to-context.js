// @flow
const kindOf = require("kind-of")
const has = require("lodash/has")
const get = require("lodash/get")
const set = require("lodash/set")
const mapValues = require("lodash/mapValues")
const isObjectLike = require("lodash/isObjectLike")
const { Map } = require("immutable")
const mustache = require("mustache")
const ow = require("ow")
const debug = require("debug")
const log = debug("map-value-to-context")

const { NAME, NEST, VALUE, LIST, SET, FRAME, CONTEXT, DEFAULT, TYPE, ID } = require("./terms")

const isToken = (value: any): boolean => {
  return (typeof value === "string" && value[0] === "#")
}
const token = (value: string): string => value.substring(1)

const renderValue = (value, context) => {
  if (isToken(value)) {
    return get(context, token(value))
  }
  return value
}
const renderObject = (object: {}, context: {}): {} => {
  ow(object, ow.object)
  ow(context, ow.object)
  return mapValues(object, value => renderValue(value, context))
}

function objectify(value: any, defaultValue?: {} = {}): {} {
  return isObjectLike(value) ? value : defaultValue
}

function resolve(fn: Function, props, context): any {
  let result
  try {
    result = fn.call({}, props)
    return result
  } catch (e) {
    log(`FUNCTION_ERROR:`, { fn, props })
    return props.value
  }
}

function mapValueToContext(value: any, key: string, object: {}, context: {}): any {
  // console.log("START", { value, key, object, context })
  let nextValue = value

  if (kindOf(nextValue) === "array") {
    return nextValue.map((value, index, array) => mapValueToContext.call(this, value, key, array, context))
  }

  if (kindOf(nextValue) === "object") {
    log({ nextValue, key, context })
    let subContext = get(context, CONTEXT)
    let nextContext = this.extend(subContext)
    nextValue = nextContext.map(nextValue)
  }

  nextValue = Map(context).reduce((result: any, contextValue: any, contextAttribute: string) => {
    switch (contextAttribute) {
      case VALUE:
        switch (kindOf(contextValue)) {
          case "function":
            return resolve(contextValue, { value, key, object, context })
          case "object":
            console.log({ value, nextValue, key, object })
            return renderObject(contextValue, { ...value, name: key, value: nextValue })
          default:
            return contextValue
        }
      case TYPE:
        console.log("currentResult = ", result)
        result = objectify(result, { [context[ID] || VALUE]: value })
        result = set(result, TYPE, contextValue)
        return result
      case "val":
        return contextValue.call({}, { value, key, last: object })
      default:
        if (isToken(contextValue)) {
          let k = contextAttribute
          let v = renderValue(contextValue, {...value, name: key, value: nextValue})
          result = objectify(result, { [context[ID] || VALUE]: value })
          result = set(result, k, v)
        }
        return result
    }
  }, nextValue)


  if (key === "type") {
    switch (kindOf(nextValue)) {
      case "string":
        nextValue = this.mapKey(nextValue, nextValue)
        break
      case "array":
        //$FlowFixMe
        nextValue = nextValue.map(item => {
          return (typeof item === "string") ? this.mapKey(item, item) : item
        })
    }
  }

  return nextValue
}

module.exports = mapValueToContext
