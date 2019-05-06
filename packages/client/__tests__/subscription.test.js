const sub = require('../lib/subscription')

test('subscription.list', () => {
	expect(sub.list()).resolves.toBeInstanceOf(Array)
})

