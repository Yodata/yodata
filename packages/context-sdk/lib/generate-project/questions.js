const kebabCase = require('lodash/kebabCase')
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
    message: 'context server host',
    default: process.env.YODATA_POD_URL,
    validate (input) {
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
    default: process.env.YODATA_POD_SECRET
  }
]
