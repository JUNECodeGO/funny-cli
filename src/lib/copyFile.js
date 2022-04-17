const fs = require('fs-extra')
const { logger, scriptsConfig } = require('./common')
const path = require('path')

// 模版文件路径
const templatesPath = path.resolve(__dirname, '../../templates')

module.exports = async function copyFile(projectPath) {
  // 获取模版文件目录
  const templatesFiles = fs.readdirSync(templatesPath)

  try {
    // templates 复制至新文件夹
    await Promise.all(
      templatesFiles.map(fileName => {
        const projectFilePath = path.resolve(projectPath, fileName)
        const templatesFilePath = path.resolve(templatesPath, fileName)
        const isExist = fs.existsSync(projectFilePath)

        if (isExist || fileName !== scriptsConfig) {
          return fs.copy(templatesFilePath, projectFilePath)
        }
        return null
      }),
    )
    await fs.unlink(path.resolve(projectPath, 'src/app.tsx'))
  } catch (error) {
    logger.error('拷贝文件失败失败')
  }
}
