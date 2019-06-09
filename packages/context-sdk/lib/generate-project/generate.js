const getDefaults = require('../info')
const copyFiles = require('./copy-files')
const installDependencies = require('./install-dependencies')

module.exports = generateProject

async function generateProject (props) {
  return getDefaults(props)
    .then(copyFiles)
    .then(installDependencies)
    .catch(console.error)
}
