const inquirer = require('inquirer')

/**
 * @namespace yodata
 *
 * @typedef PromptOptions
 * @property {string} [type] Type of the prompt. Defaults: input - Possible values: input, number, confirm, list, rawlist, expand, checkbox, password, editor
 * @property {string} [name] The name to use when storing the answer in the answers hash. If the name contains periods, it will define a path in the answers hash.
 * @property {string|function} [message] The question to print. If defined as a function, the first parameter will be the current inquirer session answers. Defaults to the value of name (followed by a colon).
 * @property {string[]} [choices] Choices array or a function returning a choices array. If defined as a function, the first parameter will be the current inquirer session answers. Array values can be simple numbers, strings, or objects containing a name (to display in list), a value (to save in the answers hash) and a short (to display after selection) properties. The choices array can also contain a Separator.
 * @property {function} [validate] Receive the user input and answers hash. Should return true if the value is valid, and an error message (String) otherwise. If false is returned, a default error message is provided.
 * @property {function} [filter] Receive the user input and return the filtered value to be used inside the program. The value returned will be added to the Answers hash.
 * @property {function} [transformer] (Function) Receive the user input, answers hash and option flags, and return a transformed value to display to the user. The transformation only impacts what is shown while editing. It does not modify the answers hash.
 * @property {function|boolean} [when] (Function, Boolean) Receive the current user answers hash and should return true or false depending on whether or not this question should be asked. The value can also be a simple boolean.
 * @property {number} [pageSize] : (Number) Change the number of lines that will be rendered when using list, rawList, expand or checkbox.
 * @property {string} [prefix] (String) Change the default prefix message.
 * @property {string} [suffix] (String) Change the default suffix message.
 */

module.exports = prompt

/**
 *
 * @param {string} message
 * @param {PromptOptions|function(string): boolean} [opt]
 * @returns {Promise<any>} user response
 */
async function prompt (message, opt = {}) {
  let options = opt
  if (typeof opt === 'function') {
    options = { validate: value => opt(value) }
  }
  const question = { name: 'value', message, ...options }
  // @ts-ignore
  return inquirer.prompt([question]).then(answers => {
    return answers[question.name]
  })
}
