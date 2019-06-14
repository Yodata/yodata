module.exports = function transformBuilder (yargs) {
  return yargs
    .option('transform', {
      alias: 't',
      description: 'transform the result',
      type: 'boolean'
    })
    .option('publish', {
      alias: 'p',
      description: 'publish result',
      type: 'boolean'
    })
}
