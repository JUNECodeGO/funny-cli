const { installPackage, updatePackage } = require('./install-deps')
const { stopLoading, logWithLoading } = require('./loading')
const logger = require('./logger')
const scriptsConfig = 'scripts.json'

module.exports = {
  stopLoading,
  logWithLoading,
  installPackage,
  updatePackage,
  logger,
  scriptsConfig,
}
