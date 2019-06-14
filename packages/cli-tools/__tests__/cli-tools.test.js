'use strict'
const clitools = require('..')

describe('@yodata/cli-tools', () => {
  it('exports interface', () => {
    expect(clitools).toHaveProperty('Command')
    expect(clitools).toHaveProperty('flags')
    expect(clitools).toHaveProperty('baseFlags')
    expect(clitools).toHaveProperty('print')
    expect(clitools).toHaveProperty('select')
    expect(clitools).toHaveProperty('prompt')
    expect(clitools).toHaveProperty('confirm')
    expect(clitools).toHaveProperty('YAML')
    expect(clitools).toHaveProperty('logger')
    expect(clitools).toHaveProperty('table')
  })

  it('yaml interface', () => {
    const { YAML } = clitools
    expect(YAML).toHaveProperty('parse')
    expect(YAML).toHaveProperty('stringify')
  })
})
