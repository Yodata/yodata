module.exports = args => error => {
  const { debug, depth = 2 } = args
  const { response } = error

  if (debug) {
    console.dir(response, { depth })
  }

  if (response) {
    const { statusCode, statusMessage, url } = response
    response.body = [statusCode, statusMessage, url].join(' ')
    response.headers['content-type'] = 'text/plain'
    response.data = { type: 'motherfucker' }
  }

  return response
}
