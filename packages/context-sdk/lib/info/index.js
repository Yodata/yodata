'use strict'
/* eslint-disable no-unused-expressions */
'use strict'
require('dotenv').config()
const path = require('path')

module.exports = (props = {}) => {
  const contextName = props.name || process.env.YODATA_PROFILE
  const context = {
    name: contextName,
    contentType: 'application/x-yaml',
    environment: props.environment || process.env.YODATA_STAGE || 'staging',
    filename: `${contextName}.cdef.yaml`
  }
  context.filepath = path.join(process.cwd(), context.filename)

  context.hostname = props.hostname || process.env.YODATA_POD_URL
  context.hostpath = path.join('/public/context', context.environment, context.filename)
  context.url = new URL(context.hostpath, context.hostname).href
  context.hostkey = props.hostkey || process.env.YODATA_POD_SECRET
  return { ...props, context }
}
