const compose = require('lodash/flow')
const yaml = require('js-yaml')
const {Map, fromJS, Set} = require('immutable')

const KEYWORDS = ['Prefix', 'Context']
const n3 = require('n3')

const isKeyword = string => KEYWORDS.includes(string)
const get = require('lodash/get')
const has = require('lodash/has')

const PREFIX = 'Prefix'
const {namedNode} = n3.DataFactory
const mapValues = require('lodash/mapValues')
const pProps = require('p-props')
const splitCurie = require('./split-curie')
const isCurie = require('./is-curie')

const toJSON = context => async quads => {
	const {graph} = context
}

const expandPrefixedTerms = async (value, context) => {
	if (typeof value === 'string') {
		return namedNode(value)
	}

	return value
}

const enrichSchemaItem = async (item, context) => {
	return {
		'@id': item.id,
		name: 'localName',
		type: 'schema:rangeIncludes',
		title: 'rdfs:label',
		description: 'rdfs:comment',
		subClassOf: 'rdfs:subClassOf',
		subPropertyOf: 'rdfs:subPropertyOf',
		domainIncludes: 'schema:domainIncludes',
		rangeIncludes: 'schema:rangeIncludes'
	}
}

const processSchemaItem = context => async (value, key, object) => {
	return expandPrefixedTerms(value, context)
		.then(item => enrichSchemaItem(item, context))
}

async function parseYamlSchema(schemaObject) {
	const object = yaml.load(schemaObject)
	const graph = n3.Store()
	const next = mapValues(object, processSchemaItem({graph}))
	return await pProps(next)
}

module.exports = parseYamlSchema
