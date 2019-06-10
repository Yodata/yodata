'use strict'
const fs = require('fs')
const client = require('@yodata/client')
const logger = require('@yodata/logger')
const getContextInfo = require('../info')

module.exports = deploy

async function deploy (props) {
  const context = await getContextInfo(props)
  const content = fs.readFileSync(context.filepath, 'utf8')

  logger.info(`deploying to ${context.url}`)

  return client.putData(context.url, {
    headers: {
      'content-type': context.contentType,
      'x-api-key': context.hostkey
    },
    body: content
  }).then(response => {
    logger.info('OK')
  })
}
