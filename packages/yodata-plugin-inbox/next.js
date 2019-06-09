
const list = require('./list')

module.exports = client => getNextInboxPage.bind(client)

/**
* Fetch the next page of inbox items
* @returns {Promise<object[]>} - page of inbox items
*/
async function getNextInboxPage () {
  const from = this.get('inbox.next')
  return list({ from })
}
