const assert = require('assert-plus')
const { Context } = require('@yodata/transform')
const viewPlugin = require('@yodata/transform-plugin-view')
const loadData = require('../util/load-data')

module.exports = transform

/**
 * Transforms data at datapath with context at filepath
 *
 * @param {object} props
 * @param {string} props.datapath - path to data
 * @param {string} [props.filepath] - path to context definition file
 * @param {boolean} [props.inverse] - true for outbound (subscription) transformation
 * @returns
 */
async function transform({ datapath, filepath, inverse = false }) {
	assert.string(datapath)
	assert.string(filepath)
	const data = await loadData(datapath)
	const contextdoc = await loadData(filepath)
	assert.object(data)
	assert.object(contextdoc)
	const result = new Context(contextdoc).use(viewPlugin).map(data)
	return result
}
