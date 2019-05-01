const kebabCase = require('lodash/kebabCase')
const { config } = require('@yodata/cli')

module.exports = [
	{
		name: 'sourceContext',
		message: 'project name',
		default: 'my-context',
		filter: kebabCase
	},
	{
		name: 'sourceDescription',
		message: 'project description'
	},
	{
		name: 'validationSchema',
		default: 'https://realestate.yodata.me/context/v1/schema.yaml'
	},
	{
		name: 'podURL',
		message: 'service pod URL',
		// @ts-ignore
		default: function (props) {
			const defaultPodUrl = config.get('default.pod.url')
			return config.get(`${props.sourceContext}.pod.url`, defaultPodUrl)
		}
	},
	{
		name: 'podSecret',
		message: 'pod secret (x-api-key)',
		default: function (props) {
			const defaultSecret = config.get('default.pod.secret')
			return config.get(`${props.sourceContext}.pod.secret`, defaultSecret)
		}
	}
]
