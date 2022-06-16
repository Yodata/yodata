module.exports = args => error => {
  const { debug, depth = 2 } = args
  if (debug) {
    console.dir(debug, { depth })
  } else {
    const { message, stack } = error
    const response = [message,stack].join('\n')
    console.error(response)
  }
  console.error(error.message)
}
