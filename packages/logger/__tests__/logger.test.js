
const mockProcess = require('jest-mock-process')

describe('@yodata/logger', () => {
  let mockLog, logger, logLevel

  beforeAll(() => {
    logLevel = process.env.LOG_LEVEL
  })

  beforeEach(() => {
    mockLog = mockProcess.mockConsoleLog()
    logger = require('..')
  })

  afterEach(() => {
    mockLog.mockRestore()
  })

  afterAll(() => {
    process.env.LOG_LEVEL = logLevel
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
    let fn = jest.fn()
    const message = 'returns a string'
    const log = logger.createLogger(fn, 'info')
    log(message)
    return expect(fn).toHaveBeenCalledTimes(1)
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
