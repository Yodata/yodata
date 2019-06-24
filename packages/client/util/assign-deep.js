const assign = require('assign-deep')

function assignDeep (object, target) {
  if (arguments.length === 1) {
    return target => assignDeep(object, target)
  }
  return assign(target, object)
}

module.exports = assignDeep
