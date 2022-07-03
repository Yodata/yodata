// mock a profile event and send it to stmarter-agnet
// const isvalidurl = value => {
//   return (
//     typeof value === 'string' &&
//     value.startsWith('http')
//   )
// }

/**
 *
 * @param {object<Client>}} client
 * @param {string} target
 * @param {object} profile
 *
 * @returns {Promise<*>}
 */
module.exports = async (client, target, profile) => {
  const _target = client.resolve(target)
  // if (!isvalidurl(target)) throw new Error('target must be a valid URL')
  const instrument = profile.id
  const agent = client.resolve('/profile/card#me')

  const timestamp = Date.now()
  const time = new Date(timestamp).toISOString()
  const event = {
    topic: 'realestate/profile#update',
    type: 'Notification',
    instrument,
    agent,
    time,
    timestamp,
    data: {
      type: 'UpdateAction',
      timestamp,
      instrument,
      agent,
      object: profile
    }
  }
  const result = await client.post(_target, event).then(res => {
    const { statusCode, statusMessage, data, url } = res
    // console.log('PUBLISH_RESPONSE', { statusCode, statusMessage, data, url })
    return { statusCode, statusMessage, data, url }
  })
  return `${_target} ${result.statusCode}`
}
