/** @format */
const {
  logger,
  stopLoading,
  installPackage,
  logWithLoading,
} = require('../lib/common')
const fs = require('fs-extra')
const fetchVersionConfig = require('../lib/fetchVersion')
const path = require('path')

async function update() {
  let cwd = process.cwd()
  const packagePath = path.resolve(cwd, 'package.json')
  // 获取远程 version
  let versionJson
  logWithLoading(`正在读取远程packages配置..\n`)
  try {
    versionJson = await fetchVersionConfig(cwd)
    stopLoading('读取远程packages配置成功 \n')
  } catch (e) {
    stopLoading()
    throw `读取远程packages配置失败, 请联系管理员 \n`
  }

  const curPackages = await fs.readJson(packagePath)

  if (!versionJson) {
    logger.warn(`需更新版本为空 \n`)
    return
  }
  Object.keys(versionJson).forEach(key => {
    const { dev, version } = versionJson[key]
    if (dev !== undefined) {
      curPackages[dev ? 'devDependencies' : 'dependencies'][key] = version
    }
  })

  fs.writeJsonSync(packagePath, curPackages)

  logWithLoading(`正在更新.. \n`)
  try {
    await installPackage(cwd.toString())
  } catch (error) {
    throw '更新失败, 请联系管理员 \n'
  }

  stopLoading(`🎉 更新成功\n`)
}

module.exports = () => {
  return update().catch(err => {
    stopLoading()
    logger.error(err)
  })
}
