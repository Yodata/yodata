'use strict'
const config = require('@yodata/config')
const { print } = require('../../util')

exports.command = ['delete <key>', 'rm']
exports.description = 'remove <key> from config store'
exports.builder = function (cli) {
	cli.example('$ yodata config delete foo', '# => true')
	return cli
}

exports.handler = print.command(config.delete, 'key')
