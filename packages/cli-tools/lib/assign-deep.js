const assign = require('assign-deep')

function deepAssign (object, target) {
  return (arguments.length <= 1)
    ? target => deepAssign(object, target)
    : assign(target, object)
}

module.exports = deepAssign
