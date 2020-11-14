const yaml = require('../util/yaml')
const select = require('../util/select')

async function parseResponse (response) {
  const result = select([
    'url',
    'statusCode',
    'statusMessage',
    'headers',
    'body',
    'request.options.method'
  ], response)

  result.contentType = String(response.headers['content-type'])

  if (result.contentType.includes('json')) {
    result.data = JSON.parse(result.body)
  } else if (result.contentType.includes('yaml')) {
    result.data = yaml.parse(response.body)
  }

  result.gd = () => {
    if (result.contentType.includes('json')) {
      return JSON.parse(result.body)
    }

    if (result.contentType.includes('yaml')) {
      return yaml.parse(result.body)
    }
  }
  return result
}

module.exports = parseResponse
