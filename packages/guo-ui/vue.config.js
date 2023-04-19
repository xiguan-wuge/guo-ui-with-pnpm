const { defineConfig } = require('@vue/cli-service')
const devConfig = require('./config/config.dev')
const buildConfig = require('./config/config.build')
console.log('process.env.NODE_ENV', process.env.VUE_MODE);
// 区分打包组件和打包demo
module.exports = process.env.VUE_MODE === 'lib' ? 
  defineConfig(buildConfig) : 
  defineConfig(devConfig)
