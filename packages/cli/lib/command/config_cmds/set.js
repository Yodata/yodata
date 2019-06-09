'use strict'
const config = require('@yodata/config')
const { print } = require('../../util')

exports.command = 'set <key> <value>'
exports.description = 'updates the current value of <key> to <value>'
exports.handler = print.command(({ key, value }) => {
  return config.set(key, value)
})
