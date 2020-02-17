'use strict'
const fs = require('fs')
const Client = require('@yodata/client')
const logger = require('../util/logger')
const getContextInfo = require('../info')

module.exports = deploy

async function deploy (props) {
  const { filepath, url, contentType } = await getContextInfo(props)

  logger.log(`deploying to ${url}`)

  const content = fs.readFileSync(filepath, 'utf8')
  const client = new Client()
  return client.put(url, content, contentType)
}
