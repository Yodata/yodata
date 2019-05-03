const assert = require('assert-plus')
const { loadContext } = require('@yodata/transform')
const loadData = require('../util/load-data')
const path = require('path')

module.exports = transform

/**
 * transforms data at datapath with context at filepath
 *
 * @param {object} props
 * @param {string} props.datapath - path to data
 * @param {string} [props.filepath] - path to context definition file
 * @returns
 */
async function transform({ datapath, filepath }) {
	assert.string(datapath)
	assert.string(filepath)
	const context = loadContext(path.join(process.cwd(), filepath))
	const data = await loadData(datapath)
	return context.map(data)
}
