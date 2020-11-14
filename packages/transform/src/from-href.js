const got = require('got')
const yaml = require('js-yaml')
const { includes } = require('lodash')
const get = require('lodash/get')

module.exports = fromHref

async function fromHref(uri) {
  const response = await got(uri)
  const contentType = get(response, [ 'headers', 'content-type' ])
  const body = get(response, 'body', '{}')
  if (typeof contentType === 'string') {
    if (contentType.includes('json')) {
      return JSON.parse(body)
    }
    if (contentType.includes('yaml') || contentType.includes('yml')) {
      return yaml.load(body)
    }
  }

  throw new Error(`parse:from-href:error:unrecognized-content-type:${contentType}`)
}
