
const mockProcess = require('jest-mock-process')

describe('@yodata/logger', () => {
  let mockLog, logger

  beforeEach(() => {
    mockLog = mockProcess.mockConsoleLog()
    logger = require('..')
  })

  afterEach(() => {
    mockLog.mockRestore()
  })

  test('api', () => {
    expect(logger).toHaveProperty('createLogger', expect.any(Function))
    expect(logger).toHaveProperty('debug', expect.any(Function))
    expect(logger).toHaveProperty('error', expect.any(Function))
    expect(logger).toHaveProperty('info', expect.any(Function))
    expect(logger).toHaveProperty('log', expect.any(Function))
    expect(logger).toHaveProperty('table', expect.any(Function))
    expect(logger).toHaveProperty('tap', expect.any(Function))
    expect(logger).toHaveProperty('trace', expect.any(Function))
    expect(logger).toHaveProperty('warn', expect.any(Function))
  })

  test('receives a string', () => {
    const message = 'returns a string'
    let fn = jest.fn()
    const log = logger.createLogger(fn, 'silly')
    log(message)
    return expect(fn).toHaveBeenCalledWith(message)
  })

  test('receives an arrya of props', () => {
    const fn = jest.fn()
    const log = logger.createLogger(fn, 'info')
    const message = 'returns a string'
    const event = { type: 'Event' }
    const expectedResult = `${message}\n${JSON.stringify(event)}`
    log(message, event)
    return expect(fn).toHaveBeenCalledWith(expectedResult)
  })


})
