const unset = require('lodash/unset')
const assignDefaultValues = require('lodash/defaultsDeep')
const {MAP, EXTEND} = require('../events')

const DEFAULT_VALUES_TOKEN = '@default'

module.exports = defaultValuesPlugin

function defaultValuesPlugin(event, state) {
  if (this.has(DEFAULT_VALUES_TOKEN)) {
    switch (event) {
    case EXTEND:
      unset(state, ['target', DEFAULT_VALUES_TOKEN])
      break
    case MAP:
      assignDefaultValues(state, this.get(DEFAULT_VALUES_TOKEN))
      break
    default:
    }
  }

  return state
}
