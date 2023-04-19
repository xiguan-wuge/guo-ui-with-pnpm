module.exports = {
  transpileDependencies: true,
  // 修改 src 目录为 examples
  // pages: {
  //   index: {
  //     entry: 'examples/main.js',
  //     template: 'public/index.html',
  //     filename: 'index.html'
  //   }
  // },
  // 扩展webpack 配置，使packages 加入编译
  chainWebpack: config => {
    config.module
      .rule('js')
      .include
        .add('/packages')
        .end()
      .use('babel')
        .loader('babel-loader')
        .tap(options => {
          // 一些修改
          return options
        })
  },
  configureWebpack: {
    resolve: {
      // 配置路径别名
      alias: {
        'mixins': '/mixins',
        'utils': '/utils'
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
    }
  },
  lintOnSave: false
}