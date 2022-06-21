// mock a profile event and send it to stmarter-agnet
const isvalidurl = value => {
  return (
    typeof value === 'string' &&
    value.startsWith('http')
  )
}

/**
 *
 * @param {object<Client>}} client
 * @param {string} target
 * @param {object} data
 *
 * @returns {Promise<*>}
 */
module.exports = async (client, target, data) => {
  const _target = client.resolve(target)
  if (!isvalidurl(target)) throw new Error('target must be a valid URL')
  const instrument = client.resolve('/profile/card#me')
  const agent = data.id

  const timestamp = Date.now()
  const event = {
    topic: 'realestate/profile#update',
    type: 'Notification',
    instrument,
    agent,
    timestamp,
    data: {
      type: 'UpdateAction',
      timestamp,
      instrument,
      agent,
      object: data
    }
  }
  const result = await client.post(_target, event).then(res => (res.data))
  const response = `${data.id} ${result.id} ${result.statusCode}`
  console.log(response)
  return response
}
