const yaml = require('js-yaml')
const ow = require('ow')

module.exports = string => {
	ow(string, ow.string)
	return yaml.load(string)
}
