const config = require('@yodata/config')

exports.command = 'name'
exports.desc = 'set profile'
exports.handler = () => console.log(config.profile.name())
