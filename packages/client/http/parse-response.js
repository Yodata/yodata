const yaml = require('../util/yaml')

const parseResponse = response => {
  const contentType = String(response.headers['content-type'])

  if (contentType.includes('json')) {
    response.data = JSON.parse(response.body)
  } else if (contentType.includes('yaml')) {
    response.data = yaml.parse(response.body)
  }

  response.gd = () => response.data
  return response
}

module.exports = parseResponse
