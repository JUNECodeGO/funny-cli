/** @format */

const git = require('git-promise');
const fs = require('fs-extra');
const path = require('path');

module.exports = async function (cwd) {
  const versionPath = path.resolve(cwd, versionConfigPath);
  const sshPath = versionConfigGit.packages;
  const packagesPath = path.resolve(cwd, './packages');

  // 获取远程 git 仓库
  await git(`clone ${sshPath}`);

  await git('checkout branch ', {
    cwd: path.resolve(cwd, packagesPath),
  });
  const json = await fs.readJson(versionPath);

  // 删除仓库
  await fs.rmdir(packagesPath, {
    recursive: true,
    force: true,
  });
  return json;
};
