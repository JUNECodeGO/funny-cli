/** @format */
const chalk = require('chalk')
const execa = require('execa')
const { logger, logWithLoading, stopLoading } = require('./common')
const fetchVersionConfig = require('./fetchVersion')
const copyFile = require('./copyFile')
const {
  generatePackageJson,
  generateManifest,
  generateReadMe,
  generateGlobalLess,
} = require('./generateFile')

module.exports = class Creator {
  constructor(params) {
    const { name, cwd, projectPath, app } = params
    this.name = name

    // 项目文件路径
    this.projectPath = projectPath

    this.cwd = cwd
    this.app = app
  }

  async create() {
    try {
      const { name, projectPath, cwd, app } = this
      // 获取远程 version
      const versionConfig = await this.fetchVersion(cwd)

      logWithLoading(`正在初始化项目...\n`)

      await this.initProject(name, versionConfig)
      stopLoading(`初始化项目成功\n`)

      logWithLoading(`正在生成 ${chalk.yellow('package.json')} 等模板文件...\n`)

      // 将模版文件拷贝到项目中
      await copyFile(projectPath)
      // 生成package.json
      await generatePackageJson(projectPath, versionConfig, app, name)
      // // 生成manifest.json
      await generateManifest(projectPath, name)
      // 生成readme
      await generateReadMe(projectPath, name)
      // 生成global less
      await generateGlobalLess(projectPath, name)

      stopLoading('生成模版文件成功\n')

      logger.log(
        `🎉  项目创建成功 ${chalk.yellow(
          name,
        )}, 请根据 README.md 进行开发吧～ \n`,
      )
    } catch (error) {
      throw error
    }
  }

  async fetchVersion(cwd) {
    let versionJson
    logWithLoading(`正在读取远程packages配置..\n\n`)
    try {
      versionJson = await fetchVersionConfig(cwd)
      stopLoading('读取远程packages配置成功 \n')
      return versionJson
    } catch (e) {
      console.log(e)
      stopLoading()
      throw '读取远程packages配置失败, 请联系管理员'
    }
  }

  // 初始化umi
  async initProject(name, versionConfig) {
    const umiVersion = Object.entries(versionConfig)
      .filter(([_, value]) => value['umi-cli'])
      .map(([key, config]) => `--${key} ${config.version}`)
    try {
      const { exitCode } = await execa('npm', ['install', 'create-umi'], {
        cwd: './',
      })
      if (!exitCode) {
        await execa(
          'npx',
          [
            'create-umi',
            name,
            '--type',
            'ant-design-pro',
            '--language',
            'TypeScript',
            '--allBlocks',
            'simple',
            ...umiVersion,
          ],
          {
            shell: true,
            cwd: './',
          },
        )
        await execa('npm', ['uninstall', 'create-umi'])
      } else {
        throw Error()
      }
    } catch (error) {
      throw 'umi 初始化失败, 请联络管理员'
    }
  }
}
