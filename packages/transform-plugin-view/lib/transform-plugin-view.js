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
 * @returns {object} - transformation result
 */
module.exports = function (event, data) {
  let result = data
  // @ts-ignore
  if (data && data[VIEW] !== 'undefined') {
    // @ts-ignore
    const view = data[VIEW]
    switch (event) {
      case EXTEND:
        unset(data, ['target', VIEW])
        break
      case MAP_RESULT:
        result = processView(data, view)
        // Console.log('transform-plugin-view', {event, data, result})
        break
      default:
        result = data
    }
  }

  return result
}

function processView (data, view) {
  let result
  switch (typeof view) {
    case 'string':
      result = jsonata(view).evaluate(data)
      break
    case 'object':
      result = transform(view, (result, value, key) => {
        set(result, key, jsonata(value).evaluate(data))
      })
      break
    default:
      result = data
  }

  return result
}
