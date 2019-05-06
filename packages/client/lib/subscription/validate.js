const assert = require('assert-plus')

module.exports = function validateSubscription(subscription) {
	const { agent, object, target, scope } = subscription
	assert.string(agent)
	assert.string(object)
	if (target) assert.string(target)
	if (scope) {
		assert.array(scope)
	}
}
