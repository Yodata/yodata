const logger = require('../util/logger')
const chalk = require('chalk').default
const EXAMPLE_MESSAGE = JSON.stringify({
	recipient: 'https://user.example.com/profile/card#me',
	topic: 'realestate/test#event',
	data: {
		type: 'TestEvent'
	}
}, null, 2)

module.exports = ({ sourceContext, podURL }) => {
	logger.log(chalk`

  {whiteBright.bold Done.}

  {blue - see your context README.md for some helpful information on context development:}
    {greenBright open ${sourceContext}/README.md}
`)
}
