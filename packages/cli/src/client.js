const config = require('@yodata/config')
const Client = require('@yodata/client')

// @ts-ignore
const { name, hostname, hostkey } = config.currentProfile()

module.exports = new Client({ name, hostname, hostkey })
