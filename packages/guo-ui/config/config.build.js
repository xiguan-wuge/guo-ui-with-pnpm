const fs = require("fs");
const path = require("path");
const chalk = require('chalk')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const AddDefaultCssPlugin = require('../plugins/addDefaultCssPlugin/index.js')


const join = path.join;
//  获取基于当前路径的目标文件
const resolve = (dir) => path.join(__dirname, "../", dir);

function getComponentEntries(path) {
  let files = fs.readdirSync(resolve(path));
  const componentEntries = files.reduce((fileObj, item) => {
    //  文件路径
    const itemPath = join(path, item);
    //  在文件夹中
    const isDir = fs.statSync(itemPath).isDirectory();
    const [name, suffix] = item.split(".");

    //  文件中的入口文件
    if (isDir) {
      fileObj[item] = resolve(join(itemPath, "index.js"));
    }
    //  文件夹外的入口文件
    else if (suffix === "js") {
      fileObj[name] = resolve(`${itemPath}`);
    }
    return fileObj;
  }, {});

  return componentEntries;
}

function getMultiEntry(entryArr) {
  let result = {}
  if (Array.isArray(entryArr)) {
    entryArr.forEach(entry => {
      const entryRes = getComponentEntries(entry)
      result = Object.assign({}, result, entryRes)
    })
  }
  return result
}
const entries = getComponentEntries("packages")

function getComponentList(obj) {
  let res = []
  Object.keys(obj).forEach(entry => {
    res.push(entry)
  })
  return res
}
const componentList = getComponentList(entries) || []

// console.log('componentList', componentList);

const buildConfig = {
  //  输出文件目录
  outputDir: resolve("lib"),
  productionSourceMap: false,
  //  webpack配置
  configureWebpack: smp.wrap({
    //  入口文件
    entry: entries,
    //  输出配置
    output: {
      //  文件名称
      filename: "[name]/index.js",
      //  构建依赖类型
      libraryTarget: "umd",
      //  库中被导出的项
      libraryExport: "default",
      //  引用时的依赖名
      library: "guoUI",
    },
    resolve: {
      // 配置路径别名
      alias: {
        'utils': '/utils'
      }
    },
    module: {
      rules: [{
        test: /\.less$/,
        use: [{
          loader: 'less-loader'
        }]
      }]
    },
    plugins: [
      new BundleAnalyzerPlugin(),
      // 进度条
      new ProgressBarPlugin({
        format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`
      }),
      new AddDefaultCssPlugin({
        components: componentList
      })

    ],
    externals: {
      vue: "Vue",
    },
    cache: {
      // 将缓存类型设置为文件系统,默认是memory
      type: 'filesystem',
    },
    optimization: {
      minimizer: [
        // 使用 TerserWebpackPlugin 来压缩 JavaScript。
        // 目前打包看，体积几乎没有变化
        new TerserPlugin({
          parallel: 4,
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
        new CssMinimizerPlugin({
          parallel: 4,
        }),
      ]
    },
    // devtool: 'source-map'
    // splitChunks: {
    //   // include all types of chunks
    //   chunks: 'all',
    //   // 重复打包问题
    //   cacheGroups:{
    //     vendors:{ // node_modules里的代码
    //       test: /[\\/]node_modules[\\/]/,
    //       chunks: "all",
    //       // name: 'vendors', 一定不要定义固定的name
    //       priority: 10, // 优先级
    //       enforce: true 
    //     }
    //   }
    // },
  }),
  css: {
    sourceMap: false,
    extract: {
      filename: "[name]/style/index.css",
      // filename: "[name]/style.css",
      // filename: "[name]/index.css",
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("js")
      .include.add("/packages")
      .end()
      .use("babel")
      .loader("babel-loader")
      .tap((options) => {
        // 一些修改
        return options;
      });
    config.optimization.delete("splitChunks");
    config.plugins.delete("copy");
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");
    config.plugins.delete("html");
    config.plugins.delete("hmr");
    config.entryPoints.delete("app");
  },
  lintOnSave: false
};
module.exports = buildConfig;