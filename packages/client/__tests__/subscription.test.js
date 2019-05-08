const sub = require('../lib/subscription')

test('subscription.list', () => {
	return expect(sub.list()).resolves.toBeInstanceOf(Array)
})

