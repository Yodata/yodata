'use strict'

const { inbox } = require('@yodata/client')
const { print } = require('../../util')

exports.command = 'get <index>'
exports.description = 'get inbox item by index'
exports.handler = print.command(inbox.get, 'index')
