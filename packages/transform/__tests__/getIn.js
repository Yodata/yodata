const {getIn} = require('..')

test('gets value', () => {
	const data = {
		path: {
			to: {
				value: 'foo'
			}
		}
	}
	expect(getIn('path.to.value')(data)).toEqual('foo')
})

test('nothing at path', () => {
	const data = {}
	expect(getIn('test')(data)).toBeUndefined()
})
