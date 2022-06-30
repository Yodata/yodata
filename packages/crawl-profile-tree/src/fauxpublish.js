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
  const instrument = client.resolve('/profile/card#me')
  const agent = profile.id

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
  const result = await client.post(_target, event).then(res => (res.data))
  const response = `${profile.id} ${result.id} ${result.statusCode}`
  return response
}
