const { profile } = require('@yodata/config')
const Client = require('@yodata/client')
const inbox = require('yodata-plugin-inbox')

const name = profile.name()
const hostname = profile.get('pod.url')
const hostkey = profile.get('pod.secret')
const client = new Client({ name, hostname, hostkey })
client.use(inbox)

module.exports = client
