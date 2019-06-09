const config = require('@yodata/config')
const Client = require('@yodata/client')
// @ts-ignore
const { name, hostname, hostkey } = config.currentProfile()
const profileClient = new Client({ name, hostname, hostkey })

module.exports = profileClient
