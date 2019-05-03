const assert = require('assert-plus')
const { loadContext, getContext } = require('@yodata/transform')
const loadData = require('../util/load-data')
const path = require('path')

module.exports = transform

/**
 * transforms data at datapath with context at filepath
 *
 * @param {object} props
 * @param {string} props.datapath - path to data
 * @param {string} [props.filepath] - path to context definition file
 * @param {boolean} [props.inverse]
 * @returns
 */
async function transform({ datapath, filepath, inverse = false }) {
	console.log({ inverse })
	assert.bool(inverse)
	assert.string(datapath)
	assert.string(filepath)
	const context = loadContext(path.resolve(filepath))
	const data = await loadData(datapath)
	return context.map(data)
}
