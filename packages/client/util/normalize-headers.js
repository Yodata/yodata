
const setValue = require('set-value')
const getValue = require('./get-value')
const normalizeContentType = require('./normalize-content-type')

/** @format */

module.exports = function normalizeHeaders (value = {}) {
  let headers
  if (value.headers) {
    headers = JSON.parse(JSON.stringify(value.headers).toLowerCase())
  } else {
    headers = JSON.parse(JSON.stringify(value).toLowerCase())
  }
  const type = getValue(headers, 'content-type')
  if (typeof type === 'string') {
    setValue(headers, 'content-type', normalizeContentType(type))
  }
  if (value.headers) {
    value.headers = headers
    return value
  } else {
    return headers
  }
}
