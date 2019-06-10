const kebabCase = require('lodash/kebabCase')
const logger = require('../util/logger')

module.exports = [
  {
    name: 'name',
    message: 'context name',
    default: 'my-context',
    filter: kebabCase
  },
  {
    name: 'description',
    message: 'description'
  },
  {
    name: '$schema',
    default: 'https://realestate.yodata.me/context/v1/schema.yaml'
  },
  {
    name: 'hostname',
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
    name: 'hostkey',
    message: 'pod secret (x-api-key)',
    default: process.env.YODATA_POD_SECRET
  }
]
