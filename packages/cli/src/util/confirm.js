const inquirer = require('inquirer')

module.exports = async function confirm (message) {
  const question = { type: 'confirm', name: 'confirm', message: `Are you sure you want to ${message}` }
  return inquirer.prompt([ question ]).then(response => {
    return response.confirm
  })
}
