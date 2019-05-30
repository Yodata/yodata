'use strict'
const config = require('@yodata/config')
const { print } = require('../../util')

exports.command = 'get <key>'
exports.description = 'returns the current value of <key>'
exports.builder = function (cli) {
	cli.scriptName('yodata')
	cli.example('$ yodata config get profile', '# => default {name of the current profile}')
	cli.example('$ yodata config get default.pod.url', '# => https://bob.example.com')
	return cli
}

exports.handler = print.command(config.get, 'key')
