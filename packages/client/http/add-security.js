/**
 * add x-api-key on pod requests only
 *
 * @format
 */

module.exports = client => request => {
  if (
    (client.url && client.url.hostname === request.hostname) ||
    request.method === 'PUT' ||
    request.method === 'POST' ||
    request.method === 'DELETE' ||
    request.method === 'PATCH' ||
    request.method === 'GET'
  ) {
    request.headers['x-api-key'] = client.hostkey
    request.headers['x-instrument'] = `${client.hostname}/profile/card#me`
  }
}
