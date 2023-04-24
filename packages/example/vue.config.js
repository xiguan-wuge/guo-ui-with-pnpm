const { defineConfig } = require('@vue/cli-service')
const path = require('path')
// const VueWConsolePlugin = require('./src/plugins/vue-wconsole-plugin/index')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const CollectMapFilePlugin = require('./src/plugins/CollectMapFilePlugin/index')
const isLib = process.env.VUE_MODE
const uiPath = process.env.NODE_ENV === 'production' || isLib 
  ? 'guo-ui' 
  : path.resolve(__dirname, '../guo-ui/packages/index')

// const Components = require('unplugin-vue-components/webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          // modifyVars: {
          //   // 直接修改变量
          //   // ''
          //   // 或者可以通过less文件覆盖（文件路径为绝对路径）
          //   hack: `true; @import ''`
          // }
        }
      }
    }
  },
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      // 配置路径别名
      alias: {
        // 'mixins': '../mixins',
        // 'utils': '../utils'
        'ui-path': uiPath,
        'mixins': path.resolve(__dirname, '../', 'mixins'),
        'utils': path.resolve(__dirname, '../', 'utils')
      }
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            { loader: 'less-loader'}
          ]
        },
        {
          test: /\.jsx$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new CollectMapFilePlugin()
      // process.env.NODE_ENV === "production" && new BundleAnalyzerPlugin({analyzerPort: '8891'})
      // new VueWConsolePlugin()
      // Components({
      //   resolvers: [
      //     (componentName) => {
      //       if (componentName.startsWith('G')){
      //         const name = componentName.slice(1)
      //         return { 
      //           name, 
      //           from: 'guo-ui',
      //           sideEffects: `guo-ui/lib/${name}/style/index.css`,
      //           include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      //         }
      //       }
      //     },
      //   ],
      // })
    ]
  },
})
