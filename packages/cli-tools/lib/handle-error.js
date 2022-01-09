module.exports = args => error => {
  const { message, stack } = error
  console.error(JSON.stringify({ message, stack }))
  const { debug, depth = 2 } = args
  if (debug) {
    console.dir(debug, { depth })
  }
}
