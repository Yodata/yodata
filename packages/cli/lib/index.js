const print = require('./util/print')

exports.config = require('@yodata/config')
exports.client = require('@yodata/client')
exports.printResult = require('./util/print-result')
exports.coverup = require('coverup')

exports.print = print
exports.createCLIResponsHandler = print.command
