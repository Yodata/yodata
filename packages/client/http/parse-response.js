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
    response.data = `[ ${contentType},${response.url} ]`
  } else {
    response.body = `ERROR: unhandled content type ${contentType}`
    response.data = response.body
    response.statusMessage = response.body
  }

  response.gd = () => response.data
  return response
}

module.exports = parseResponse
