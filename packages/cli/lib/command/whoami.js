const config = require('@yodata/config')
const client = require('@yodata/client')
const handler = require('../util/create-response-handler')
const Table = require('cli-table3')


exports.command = 'whoami'
exports.description = 'prints information about the current user and pod'
exports.handler = function (args) {
	const table = new Table({ head: ['profile', 'url'] })
	const profile = config.get('profile')
	const url = config.getProfileValue('pod.url')
	table.push([profile, url])
	console.log(table.toString())
}
