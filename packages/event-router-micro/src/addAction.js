/**
 * @function handleAddAction
 * @param {object} action
 * @returns {promise}
 * @description
 * Your handler can require any npm package - just add it to your package.json
 * Async function - should always return some value to ensure the promise is resolved properly
 */
module.exports = async function handleAddAction (action) {
  // add your handler code here
  console.log('received AddAction')
  // always return some response or throw an error
  return action
}
