const {Parser} = require('n3')

const parser = new Parser()

module.exports = async string => {
	return parser.parse(string)
}
