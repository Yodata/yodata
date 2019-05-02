const Transform = require('@yodata/transform')

module.exports = transform

async function transform(filepath, datapath) {
	const context = Transform.loadContext(filepath)
	return context.map(datapath)
}
