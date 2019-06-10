'use strict'
const fs = require('fs')
const Client = require('@yodata/client')
const logger = require('@yodata/logger')
const getContextInfo = require('../info')

module.exports = deploy

async function deploy (props) {
  const { filepath, url, contentType, hostname, hostkey } = await getContextInfo(props)
  const content = fs.readFileSync(filepath, 'utf8')
  const client = new Client({ hostname, hostkey })
  logger.log(`deploying to ${url}`)

  return client.http.put(
    url,
    {
      body: content,
      headers: {
        'content-type': contentType,
        'x-api-key': hostkey
      }
    })
}
