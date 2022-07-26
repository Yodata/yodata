const { flags } = require('@yodata/cli-tools')

exports.path = flags.string({
  type: 'string',
  description: 'overwrides the default path to target'
})

exports.verbose = flags.boolean({
  type: 'boolean',
  description: 'show verbose output i.e HTTP DELETE https://id.example.com/resource 204'
})
