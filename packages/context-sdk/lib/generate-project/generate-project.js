const copy = require('./copy-files')
const installDependencies = require('./install-dependencies')

module.exports = ({ source }) => async function generateProject(props) {
	return copy(source, props)
		.then(installDependencies)
}
