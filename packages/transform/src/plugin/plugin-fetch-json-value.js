
const fetch = require('cross-fetch')
const get = require('lodash/get')
const transform = require('lodash/transform')
const { MAP_RESULT } = require('../events')
const TOKEN = '$fetch'

module.exports = fetchJsonValue

function fetchJsonValue (event, state) {
  if (event === MAP_RESULT) {
    state = transform(state, handler)
  }
  return state
}

function handler (state, value, key) {
  if (typeof value === 'string' && value.startsWith(TOKEN)) {
    const re = /\$fetchjsonvalue\((.*)\)/
    const [ targeturl, targetkey, defaultValue ] = re.exec(value)[ 1 ].split(',').map(s => s.trim())
    console.log({ targeturl, targetkey })
    state[ key ] = fetch(targeturl)
      .then(res => res.json())
      .then(data => get(data, targetkey, defaultValue))
  } else {
    state[key] = value
  }
  return state
}
