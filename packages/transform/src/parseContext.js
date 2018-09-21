import transform from 'lodash.transform'
import set from 'lodash.set'
import isNull from 'lodash.isnull'
import isPlainObject from 'lodash.isplainobject'
import get from 'lodash.get'
import isString from 'lodash.isstring'
import isFunction from 'lodash.isfunction'
import {KEYMAP, VALMAP} from './constants'

const returnValue = props => props.value

const parseContext = contextDefinition => {
	return transform(
		contextDefinition,
		(context, value, key) => {
			const setKey = val => set(context, [KEYMAP, key], val)
			const setVal = val => set(context, [VALMAP, key], val)

			if (isNull(value)) {
				setKey(value)
				return context
			}
			if (isString(value)) {
				setKey(value)
				return context
			}
			if (isFunction(value)) {
				setKey(key)
				setVal(value)
				return context
			}
			// Advanced context definition syntax
			if (isPlainObject(value)) {
				setKey(get(value, 'key', key))
				setVal(get(value, 'val', returnValue))

				if (value.context) {
					// This hack will break if the subContext overwrites a key
					// in the parent context.
					// todo: implement subContext at JSON node level to avoid conflicts
					const subContext = parseContext(value.context)
					Object.assign(context[KEYMAP], subContext[KEYMAP])
					Object.assign(context[VALMAP], subContext[VALMAP])
				}
				return context
			}
			// Bad format
			throw new Error('parseContext error')
		},
		{}
	)
}

export default parseContext
