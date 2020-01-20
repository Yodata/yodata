'use strict'
const mockProcess = require('jest-mock-process')

const logger = require('..')

describe('@yodata/logger', () => {
  test('api', () => {
    expect(logger).toHaveProperty('createLogger')
    expect(logger).toHaveProperty('debug')
    expect(logger).toHaveProperty('error')
    expect(logger).toHaveProperty('info')
    expect(logger).toHaveProperty('log')
    expect(logger).toHaveProperty('table')
    expect(logger).toHaveProperty('tap')
    expect(logger).toHaveProperty('trace')
    expect(logger).toHaveProperty('warn')
  })

  test('response', () => {
    const s = 'test one'
    let stdout = mockProcess.mockProcessStderr()
    logger.info(s)
    expect(true).toBe(false)
    return expect(stdout).toHaveBeenCalledWith({ level: 'info', message: s })
  })
})
