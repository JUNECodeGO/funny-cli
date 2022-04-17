/** @format */
const path = require('path')
const fs = require('fs-extra')
const Creator = require('../lib/creator')
const { logger, stopLoading } = require('../lib/common')

// 构建项目
async function create(projectName = 'new-project', options) {
  const { app } = options
  let name = projectName

  logger.info(`你的 app value 为 ${app}\n`)

  let cwd = process.cwd()
  let localPath = path.join(cwd.toString(), name)

  // 名字相同 project 退出进程 展示错误提示
  if (fs.existsSync(localPath)) {
    throw `已存在同名文件夹 【${projectName}】, 请确认\n`
  }

  logger.info(`正在初始化项目，安装位置：${localPath} \n\n`)

  // 前面完成准备工作，正式开始创建项目
  const creator = new Creator({ name, cwd, projectPath: localPath, app })

  await creator.create()
}

module.exports = (name, options) => {
  return create(name, options).catch(err => {
    stopLoading()
    logger.error(err)
  })
}
