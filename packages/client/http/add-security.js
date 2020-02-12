/**
 * add x-api-key on pod requests only
 *
 * */
module.exports = client => request => {
  if (
    (client.url && client.url.hostname === request.hostname) ||
    request.method === 'PUT' ||
    request.method === 'POST'
  ) {
    request.headers['x-api-key'] = client.hostkey
    request.headers['x-instrument'] = `${client.hostname}/profile/card#me`
  }
  return request
}
