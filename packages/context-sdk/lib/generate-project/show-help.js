const logger = require('../util/logger')
const chalk = require('chalk')

module.exports = (context = { name: 'your project' }) => {
  logger.log(chalk`

  {whiteBright.bold Done.}

  {blue - see your context README.md for some helpful information on context development:}
    {greenBright open ${context.name}/README.md}
`)
}
