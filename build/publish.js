// https://github.com/shelljs/shelljs
require('./check-versions')()
require('shelljs/global')

var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')

console.log(
  '  Tip:\n' +
  '  Publish for github, make sure to build before publishing.\n'
)

var spinner = ora('coping build for github pages...')
spinner.start()

console.log(config.build.publishPath)

rm('-rf', config.build.publishPath)
mkdir('-p', config.build.publishPath)

cp('-R', config.build.assetsRoot+'\\*', config.build.publishPath)

spinner.stop()
