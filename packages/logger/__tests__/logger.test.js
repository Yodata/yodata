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
    let mockStdout = mockProcess.mockProcessStdout()
    logger.info(s)
    expect(mockStdout).toHaveBeenCalledWith(`info: ${s}\n`)
  })
})
