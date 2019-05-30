'use strict'
const config = require('@yodata/config')
const { Context } = require('@yodata/transform')

const { print } = require('../../util')

const transform = new Context({
	cache: null,
	secret: {
		value: ({ value }) => String(value).substr(0, 4) + '...'
	}
})

exports.command = 'show'
exports.description = 'print all settings'
exports.handler = argv => {
	print.result(argv)(transform.map(config.all()))
}
