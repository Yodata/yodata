const assert = require('assert-plus')
const { Context, loadContext } = require('@yodata/transform')
const loadData = require('../util/load-data')
const viewPlugin = require('@yodata/transform-plugin-view')


module.exports = transform

/**
 * transforms data at datapath with context at filepath
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
