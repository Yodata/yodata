const logger = require('../util/logger')
const chalk = require('chalk').default

module.exports = ({context}) => {
	logger.log(chalk`

  {whiteBright.bold Done.}

  {blue - see your context README.md for some helpful information on context development:}
    {greenBright open ${context.name}/README.md}
`)
}
