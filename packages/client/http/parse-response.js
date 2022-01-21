const yaml = require('../util/yaml')

const parseResponse = response => {
  const contentType = String(response.headers['content-type'])

  if (contentType.includes('json')) {
    response.data = JSON.parse(response.body)
  } else if (contentType.includes('yaml')) {
    response.data = yaml.parse(response.body)
  } else if (contentType.includes('text')) {
    response.data = response.body
  } else if (contentType.includes('stream')) {
    response.headers['content-type'] = 'text/plain'
    response.body = ['STREAM:', contentType, response.url].join(' ')
  } else {
    response.body = ['ERROR:', 'no parser for content-type', contentType, response.url].join(' ')
    response.data = response.body
    response.statusMessage = response.body
  }

  response.gd = () => response.data
  return response
}

module.exports = parseResponse
