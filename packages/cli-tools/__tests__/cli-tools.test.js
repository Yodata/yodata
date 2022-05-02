const clitools = require('..')

describe('@yodata/cli-tools', () => {
  it('exports interface', () => {
    expect(clitools).toHaveProperty('addToCollection')
    expect(clitools).toHaveProperty('baseFlags')
    expect(clitools).toHaveProperty('coalesce')
    expect(clitools).toHaveProperty('collectionIncludes')
    expect(clitools).toHaveProperty('Command')
    expect(clitools).toHaveProperty('confirm')
    expect(clitools).toHaveProperty('deepAssign')
    expect(clitools).toHaveProperty('findInCollection')
    expect(clitools).toHaveProperty('flags')
    expect(clitools).toHaveProperty('getValue')
    expect(clitools).toHaveProperty('logger')
    expect(clitools).toHaveProperty('mergeFlags')
    expect(clitools).toHaveProperty('print')
    expect(clitools).toHaveProperty('printResult')
    expect(clitools).toHaveProperty('prompt')
    expect(clitools).toHaveProperty('select')
    expect(clitools).toHaveProperty('sort')
    expect(clitools).toHaveProperty('table')
    expect(clitools).toHaveProperty('uri')
    expect(clitools).toHaveProperty('YAML')
  })

  it('yaml interface', () => {
    const { YAML } = clitools
    expect(YAML).toHaveProperty('parse')
    expect(YAML).toHaveProperty('stringify')
  })
})
