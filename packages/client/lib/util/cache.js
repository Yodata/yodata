const store = require('@yodata/config')

const ckey = key => `cache.${key}`

exports.delete = key => store.profile.delete(ckey(key))
exports.has = key => store.profile.has(ckey(key))
exports.get = key => store.profile.get(ckey(key))
exports.set = (key, value) => store.profile.set(ckey(key), value)
exports.save = key => value => store.profile.set(ckey(key), value)
