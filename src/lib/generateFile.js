/** @format */

const path = require('path');
const fs = require('fs-extra');
const {scriptsConfig} = require('./common');

// 模版文件路径
const templatesPath = path.resolve(__dirname, '../../templates');
// scripts配置文件路径
const scriptsConfigPath = path.resolve(templatesPath, scriptsConfig);

async function generatePackageJson(projectPath, versionConfig, app, name) {
  // package.json 文件路径
  const packagePath = path.resolve(projectPath, 'package.json');
  const packJson = await fs.readJson(packagePath);
  const scriptJson = await fs.readJson(scriptsConfigPath);
  const newScript = {};

  Object.keys(versionConfig).forEach(key => {
    const {dev, version} = versionConfig[key];
    if (dev !== undefined) {
      packJson[dev ? 'devDependencies' : 'dependencies'][key] = version;
    }
  });

  // 替换app value
  Object.keys(scriptJson).forEach(item => {
    const reg = /(APP=)[\d]+/g;
    const value = scriptJson[item];
    const exist = reg.test(value);
    if (exist) {
      newScript[item] = value.replace(reg, `$1${app}`);
    } else {
      newScript[item] = value;
    }
  });

  packJson['scripts'] = newScript;

  // 写入文件
  fs.writeJsonSync(packagePath, {
    ...packJson,
    ...{name, version: '1.0.0'},
  });
}

async function generateManifest(projectPath, name) {
  // manifest.json 文件路径
  const manifestPath = path.resolve(projectPath, 'src/manifest.json');
  const manifestJson = await fs.readJson(manifestPath);
  // 写入文件
  await fs.writeJsonSync(manifestPath, {
    ...manifestJson,
    ...{name, short_name: name},
  });
}

async function generateReadMe(projectPath, name) {
  const readMePath = path.resolve(projectPath, 'README.md');
  const readMeString = await fs.readFile(readMePath);

  await fs.writeFile(readMePath, `# ${name} \n\n ${readMeString}`);
}

async function generateGlobalLess(projectPath) {
  const globalLessPath = path.resolve(projectPath, 'src/global.less');
  const readGlobalLessString = await fs.readFile(globalLessPath, 'utf-8');

  await fs.writeFile(
    globalLessPath,
    readGlobalLessString.replace(/(html,)/, "@import '~/global.less'; \n\n$1")
  );
}

//
module.exports = {
  generateReadMe,
  generatePackageJson,
  generateManifest,
  generateGlobalLess,
};
