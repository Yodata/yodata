// @ts-check
'use strict'

const jsonata = require('jsonata')
const unset = require('lodash/unset')
const set = require('lodash/set')
const transform = require('lodash/transform')

const VIEW = '@view'
const MAP_RESULT = 'MAP_RESULT'
const EXTEND = 'EXTEND'

/**
 * Applies a JSONata transformation to data
 * @param {string} event - Context.Event
 * @param {object} data - data to be transformed
 * @param {object} context - current context instance
 * @returns {object} - transformation result
 */
module.exports = function (event, data, context) {
  let result = data
  switch (event) {
    case EXTEND:
      unset(data, ['target', VIEW])
      break
    case MAP_RESULT:
      if (context && context.get instanceof Function) {
        result = processView(data, context.get('@view'))
      }
      break
    default:
      result = data
  }
  return result
}

function processView (data, view) {
  let result = data
  switch (typeof view) {
    case 'string':
      result = jsonata(view).evaluate(data)
      break
    case 'object':
      // result = jsonata(JSON.stringify(view)).evaluate(data)
      result = transform(view, (result, value, key) => {
        set(result, key, jsonata(value).evaluate(data))
      })
      break
    default:
      result = data
  }
  return result
}
