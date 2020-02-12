
const fetch = require('cross-fetch')
const get = require('lodash/get')
const set = require('lodash/set')
const transform = require('lodash/transform')
const { MAP_RESULT } = require('../events')
const TOKEN = '$fetch'
const kindOf = require('kind-of')

module.exports = fetchJsonValue

const isFetchCommand = value => (typeof value === 'string' && value.startsWith(TOKEN))
const fetchData = async value => {
  const re = /\$fetchjsonvalue\((.*)\)/
  const [targeturl, targetkey, defaultValue] = re.exec(value)[1].split(',').map(s => s.trim())
  // @ts-ignore
  return fetch(targeturl)
    .then(res => res.json())
    .then(data => get(data, targetkey, defaultValue))
    .catch(error => {
      console.error('FETCH_JSON_VALUE:ERROR', { value, error: error.message })
      return defaultValue || error.message
    })
}
function mapValue (state, value, key) {
  switch (kindOf(value)) {
    case 'object':
      set(state, key, transform(value, mapValue))
      break
    default:
      if (isFetchCommand(value)) {
        set(state, key, fetchData(value))
      } else {
        set(state, key, value)
      }
  }
  return state
}

function fetchJsonValue (event, state) {
  if (event === MAP_RESULT) {
    return transform(state, mapValue)
  }
  return state
}
