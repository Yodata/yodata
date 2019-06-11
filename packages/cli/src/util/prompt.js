const inquirer = require('inquirer')

module.exports = async function prompt (message, options = {}) {
  const question = { name: 'value', message, ...options }
  return inquirer.prompt([question]).then(answers => {
    return answers[question.name]
  })
}
