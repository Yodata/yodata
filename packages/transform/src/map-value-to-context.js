// @flow
const kindOf = require("kind-of")
const get = require("lodash/get")
const set = require("lodash/set")
const mapValues = require("lodash/mapValues")
const isObjectLike = require("lodash/isObjectLike")
const { Map, fromJS } = require("immutable")
const ow = require("ow")
const debug = require("debug")
const log = debug("map-value-to-context")

const { NAME, NEST, VALUE, LIST, SET, FRAME, CONTEXT, DEFAULT, TYPE, ID, REMOVE, REDACT } = require("./terms")

const isToken = (value: any): boolean => {
  return (typeof value === "string" && ["#", "$"].includes(value[0]))
}
const token = (value: string): string => value.substring(1)

const renderValue = (value, context) => {
  switch (kindOf(value)) {
    case "string":
      return isToken(value) ? get(context, token(value)) : value
    case "function":
      return resolve(value, context)
    default:
      return value
  }
}
const renderObject = (object: {}, context: {}): {} => {
  ow(object, ow.object)
  ow(context, ow.object)
  //$FlowFixMe
  let ctx = Map(fromJS(context))
    .flatten()
    .set("name", get(context,'name'))
    .set("value", get(context,'value'))
    .toJS()
  return mapValues(object, value => renderValue(value, ctx))
}

function objectify(value: any, defaultValue?: {} = {}): {} {
  return isObjectLike(value) ? value : defaultValue
}

function resolve(fn: Function, props: {}, defaultValue?: any): any {
  let result
  try {
    result = fn.call({}, props)
  } catch (e) {
    log(`FUNCTION_ERROR:`, { fn, props })
    result = defaultValue
  }
  return result
}

function mapValueToContext(value: any, key: string, object: {}, context: {}): any {
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
            return resolve(contextValue, { value, key, object, context }, nextValue)
          case "object":
            return renderObject(contextValue, { object, name: key, value: nextValue })
          case "string":
            return renderValue(contextValue, kindOf(nextValue === "object") ? { ...nextValue } : {
              ...object,
              name:  key,
              value: nextValue
            })
          default:
            return contextValue
        }
      case TYPE:
        // console.log("currentResult = ", result)
        result = objectify(result, { [context[ID] || VALUE]: value })
        result = set(result, TYPE, contextValue)
        return result
      case "val":
        return resolve(contextValue, { value, key, last: object })
      case REMOVE:
        return REMOVE
      case REDACT:
        return REDACT
      default:
        if (isToken(contextValue)) {
          let k = contextAttribute
          let v = renderValue(contextValue, { ...value, name: key, value: nextValue })
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
