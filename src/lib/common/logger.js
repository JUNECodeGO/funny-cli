#!/usr/bin/env node
const chalk = require('chalk')

const format = (label, msg) => {
  return msg
    .split('\n')
    .map((line, i) => {
      return !i ? `${label} ${line}` : line
    })
    .join('\n')
}

const log = (msg = '') => {
  console.log(msg)
}

const info = msg => {
  console.log(format(chalk.bgBlue.black(' INFO '), msg))
}

const done = msg => {
  console.log(format(chalk.bgGreen.black(' DONE '), msg))
}

const warn = msg => {
  console.warn(format(chalk.bgYellow.black(' WARN '), chalk.yellow(msg)))
}

const error = msg => {
  console.error(format(chalk.bgRed(' ERROR '), chalk.red(msg.toString())))
  if (msg instanceof Error) {
    console.error(msg.stack)
  }
}

module.exports = {
  log,
  done,
  error,
  warn,
  info,
}
