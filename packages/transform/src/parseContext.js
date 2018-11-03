const transform  = require('lodash.transform')
const set  = require('lodash.set')
const isNull  = require('lodash.isnull')
const isPlainObject  = require('lodash.isplainobject')
const get  = require('lodash.get')
const isString  = require('lodash.isstring')
const isFunction  = require('lodash.isfunction')
const {KEYMAP, VALMAP}  = require('./constants')

const returnValue = props => props.value

/**
 * Parse a context definition
 * @param {object} contextDefinition
 * @returns {Context}
 */
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

module.exports = parseContext
