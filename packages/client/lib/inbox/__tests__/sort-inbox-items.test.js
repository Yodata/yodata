const sortInboxItems = require('../sort-inbox-items')

let a; let b; let c; let items

beforeEach(() => {
	a = {
		id: 1,
		timestamp: 3
	}
	b = {
		id: 2,
		timestamp: 2
	}
	c = {
		id: 3,
		timestamp: 1
	}
	items = [a, b, c]
})

test('sorts by timestamp by default', () => {
	expect(sortInboxItems(['timestamp'], items)).toEqual([c, b, a])
	expect(sortInboxItems(undefined, items)).toEqual([c, b, a])
})
