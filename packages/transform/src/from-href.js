const got = require('got')
const yaml = require('js-yaml')
const get = require('lodash/get')

module.exports = fromHref

async function fromHref(uri) {
  const response = await got(uri)
  const contentType = get(response, ['headers', 'content-type'])
  const body = get(response, 'body', '{}')
  switch (contentType) {
  case 'application/x-yaml':
  case 'application/x-yml':
    return yaml.load(body)
  case 'application/json':
  case 'application/ld+json':
    return JSON.parse(body)
  default:
    throw new Error(`content-type not recognized ${contentType}`)
  }
}
