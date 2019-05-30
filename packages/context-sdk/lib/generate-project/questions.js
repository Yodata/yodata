const kebabCase = require('lodash/kebabCase')
const config = require('@yodata/config')
const logger = require('../util/logger')

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
		default({context}) {
			const defaultKey = 'default.pod.url'
			const profileKey = `${context.name}.pod.url`
			if (
				config.has(profileKey) &&
				typeof config.get(profileKey) === 'string' &&
				config.get(profileKey).length > 0
			) {
				return config.get(profileKey)
			}

			if (
				config.has(defaultKey) &&
				typeof config.get(defaultKey) === 'string' &&
				config.get(defaultKey).length > 0
			) {
				return config.get(defaultKey)
			}
		},
		validate(input) {
			const value = String(input)
			if (value.startsWith('http')) {
				return true
			}

			if (value.length === 0) {
				logger.error('   pod.url is required')
			} else {
				logger.error('   pod.url must be a valid url (http://...)')
			}
		}
	},
	{
		name: 'pod.secret',
		message: 'pod secret (x-api-key)',
		default({context}) {
			return config.get(`${context.name}.pod.secret`) || config.get('default.pod.secret')
		}
	}
]
