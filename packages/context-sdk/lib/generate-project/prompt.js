const kebabCase = require('lodash/kebabCase')
const logger = require('../util/logger')

module.exports = require('inquirer').prompt([
  {
    name: 'name',
    message: 'context name',
    default: 'my-context',
    filter: kebabCase
  },
  {
    name: 'description',
    message: 'description',
    default: 'my awesome context'
  },
  {
    name: 'hostname',
    message: 'server hostname',
    default: process.env.SOLID_HOST || 'https://example.com',
    validate (input) {
      const value = String(input)
      if (value.startsWith('http')) {
        return true
      }

      if (value.length === 0) {
        logger.error('   hostname is required')
      } else {
        logger.error('   hostname must be a valid url (http://...)')
      }
    }
  },
  {
    name: 'xapikey',
    message: 'pod secret (x-api-key)',
    default: process.env.SOLID_KEY
  }
])
