#!/usr/bin/env node
/** @format */

const {program} = require('commander');
const logger = require('../lib/common/logger');
const chalk = require('chalk');
const create = require('../scripts/create');

const version = require('../../package.json').version;

if (process.argv.length > 2) {
  console.log(chalk.blue('\n\n✨✨✨✨  cli 工具 ✨✨✨✨ \n\n'));
}

// 全局配置
program.name('funnyCli').version(version, '-v, --version');

// 构建项目模板
program
  .command('create [project-name]')
  .description('构建模板项目, funnyCli create dataAdmin --app 2')
  .option('-a, --app <value>', '输入app value')
  .action((name, options) => {
    const {app} = options;
    const reg = /^(\d+)$/i;
    //校验 value 是否合法
    if (reg.test(app)) {
      create(name, options);
    } else {
      logger.error(`缺少必要参数 ${chalk.yellow('<app>')}`);
      process.exit(1);
    }
  });

// 更新项目config文件
program
  .command('update')
  .description('更新packages版本')
  .action(require('../scripts/update'));

// 其他
program.command('*').action(function () {
  logger.error('无效命令');
  logger.info('使用 funnyCli --help 查看工具使用帮助');
});

program.parse(process.argv);
