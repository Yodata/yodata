const kebabCase = require('lodash/kebabCase')
const config = require('@yodata/config')
const get = require('lodash/get')

module.exports = [
	{
		name: 'context.name',
		message: 'context name',
		default: 'my-context',
		filter: kebabCase
	},
	{
		name: 'context.description',
		message: 'description'
	},
	{
		name: 'context.$schema',
		default: 'https://realestate.yodata.me/context/v1/schema.yaml'
	},
	{
		name: 'pod.url',
		message: 'service pod URL',
		// @ts-ignore
		default: function (props) {
			return config.get(`${props.context.name}.pod.url`) || config.get('default.pod.url')
		}
	},
	{
		name: 'pod.secret',
		message: 'pod secret (x-api-key)',
		default: function (props) {
			return config.get(`${props.context.name}.pod.secret`) || config.get('default.pod.secret')
		}
	}
]
