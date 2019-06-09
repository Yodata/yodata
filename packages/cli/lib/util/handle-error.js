module.exports = args => error => {
  const { message } = error
  console.error(message)

  const { debug } = args
  if (debug) {
    console.dir(debug, { depth: 10 })
  }
}
