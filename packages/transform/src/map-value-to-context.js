// @ts-check
const kindOf = require('kind-of')
const get = require('lodash/get')
const set = require('lodash/set')
const mapValues = require('lodash/mapValues')
const isObjectLike = require('lodash/isObjectLike')
const { Map, fromJS } = require('immutable')
const debug = require('debug')
const jsonata = require('jsonata')

const logger = debug('transform:map-value-to-context')

const { NAME, NEST, VALUE, LIST, SET, FRAME, CONTEXT, DEFAULT, TYPE, ID, REMOVE, REDACT } = require('./terms')

const isToken = value => {
	const result = (typeof value === 'string' && ['#', '$'].includes(value[0]))
	logger('isToken?', result)
	return result
}

const isExpression = value => {
	return (
		kindOf(value) === 'string'
		&& value.startsWith('(')
		&& value.endsWith(')')
	)
}

const renderExpression = (value, context) => jsonata(value).evaluate(context)

const stripToken = value => value.substring(1)

const renderValue = (value, context) => {
	logger('render-value', { value, context })
	switch (kindOf(value)) {
		case 'string':
			logger('renderValue', { value, context })
			if (isExpression(value)) {
				return renderExpression(value, context)
			}
			if (isToken(value)) {
				return get(context, stripToken(value))
			}
			return value
		case 'function':
			return resolve(value, context)
		default:
			return value
	}
}

const renderObject = (object, context) => {
	const ctx = new Map(fromJS(context))
		.flatten()
		.set('name', get(context, 'name'))
		.set('value', get(context, 'value'))
		.toJS()
	return mapValues(object, value => renderValue(value, ctx))
}

module.exports = mapValueToContext

function objectify(value, defaultValue = {}) {
	return isObjectLike(value) ? value : defaultValue
}

function resolve(fn, props, defaultValue) {
	let result
	try {
		result = fn.call({}, props)
	} catch (e) {
		logger('FUNCTION_ERROR:', { fn, props })
		result = defaultValue
	}

	return result
}

function mapValueToContext(value, key, object, context) {
	logger('start', { key, value, object, context })
	let nextValue = value

	if (kindOf(nextValue) === 'array') {
		return nextValue.map((value, index, array) => mapValueToContext.call(this, value, key, array, context))
	}

	if (kindOf(nextValue) === 'object') {
		const subContext = get(context, CONTEXT)
		const nextContext = this.extend(subContext)
		nextValue = nextContext.map(nextValue)
	}

	// @ts-ignore
	nextValue = new Map(context).reduce((result, contextValue, contextAttribute) => {
		switch (contextAttribute) {
			case VALUE:
				switch (kindOf(contextValue)) {
					case 'function':
						return resolve(contextValue, { object, context, value, key }, nextValue)
					case 'object':
						return renderObject(contextValue, { object, name: key, value: nextValue })
					case 'string': {
						const renderContext = (kindOf(nextValue) === 'object') ?
							{ ...nextValue } :
							{
								...object,
								name: key,
								value: nextValue
							}
						logger('render-string-value', { renderValue: contextValue, renderContext, nextValue })
						return renderValue(contextValue, renderContext)
					}

					default:
						return contextValue
				}

			case TYPE:
				// Console.log("currentResult = ", result)
				result = objectify(result, { [context[ID] || VALUE]: value })
				result = set(result, TYPE, contextValue)
				return result
			case 'val':
				return resolve(contextValue, { value, key, last: object })
			case REMOVE:
				return REMOVE
			case REDACT:
				return REDACT
			default:
				if (isToken(contextValue)) {
					const k = contextAttribute
					const v = renderValue(contextValue, { ...value, name: key, value: nextValue })
					result = objectify(result, { [context[ID] || VALUE]: value })
					result = set(result, k, v)
				}

				return result
		}
	}, nextValue)

	if (key === 'type') {
		// eslint-disable-next-line default-case
		switch (kindOf(nextValue)) {
			case 'string':
				nextValue = this.mapKey(nextValue, nextValue)
				break
			case 'array':
				nextValue = nextValue.map(item => {
					return (typeof item === 'string') ? this.mapKey(item, item) : item
				})
		}
	}

	return nextValue
}

