
module.exports = request => {
  const { url } = request
  if (String(url).startsWith('/')) {
    request.url = String(url).substring(1)
  }
  return request
}
