const execa = require('execa')

async function installPackage(targetDir, packageNames = [], dev = false) {
  const args = ['install', ...packageNames]
  if (dev) args.push('-D')
  await execa('npm', args, {
    cwd: targetDir,
  })
}

async function updatePackage(targetDir, packageNames) {
  const args = ['update', ...packageNames]
  await execa('npm', args, {
    cwd: targetDir,
  })
}

module.exports = { installPackage, updatePackage }
