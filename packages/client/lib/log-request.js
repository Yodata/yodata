const chalk = require('chalk')

module.exports = request => {
	console.info(`${chalk.blue(request.method)} ${chalk.green(request.href)}`)
	return request
}
