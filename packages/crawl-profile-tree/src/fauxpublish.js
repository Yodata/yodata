// mock a profile event and send it to stmarter-agnet
const isvalidurl = require('./validate-url')

/**
 *
 * @param {object} client
 * @param {string} target
 * @param {object} data
 *
 * @returns {Promise<*>}
 */
module.exports = async (client, target, data) => {
  if (!isvalidurl(target)) throw new Error('target must be a valid URL')

  const timestamp = Date.now()
  const event = {
    topic: 'realestate/profile#updateaction',
    type: 'Notification',
    instrument: data.id,
    agent: 'https://dave.bhhs.hsfaffiliates.com/profile/card#me',
    timestamp,
    data: {
      type: 'UpdateAction',
      timestamp,
      instrument: 'https://dave.bhhs.hsfaffiliates.com/profile/card#me',
      agent: 'https://dave.bhhs.hsfaffiliates.com/profile/card#me',
      object: data
    }
  }
  return client.post(target, event).then(res => (res.data))
}
