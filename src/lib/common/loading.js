const ora = require('ora')
const chalk = require('chalk')

const spinner = ora()
let lastMsg

const logWithLoading = (symbol, msg) => {
  if (!msg) {
    msg = symbol
    symbol = chalk.green('✔')
  }
  if (lastMsg) {
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text,
    })
  }
  spinner.text = ' ' + msg
  lastMsg = {
    symbol: symbol + ' ',
    text: msg,
  }
  spinner.start()
}

const stopLoading = msg => {
  if (lastMsg && msg) {
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: msg || lastMsg.text,
    })
  } else {
    spinner.stop()
  }
  lastMsg = null
}

module.exports = { stopLoading, logWithLoading }
