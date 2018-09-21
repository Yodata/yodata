import test from 'ava'
import expect from 'expect'
import {getIn} from '..'

test(`gets value`, t => {
	const data = {
		path: {
			to: {
				value: 'foo'
			}
		}
	}
	expect(getIn('path.to.value')(data)).toEqual('foo')
	t.pass()
})

test(`nothing at path`, t => {
	const data = {}
	expect(getIn('test')(data)).toBeUndefined()
	t.pass()
})
