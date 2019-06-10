#!/usr/bin/env node
const logger = require('../util/logger')
const getProjectInfo = require('../info')
const copyFiles = require('./copy-files')
const installDependencies = require('./install-dependencies')
const showHelp = require('./show-help')

require('./prompt')
  .then(getProjectInfo)
  .then(copyFiles)
  .then(installDependencies)
  .then(showHelp)
  .catch(logger.error)
