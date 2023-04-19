class VueWConsolePlugin {
  apply(compiler) {

    compiler.hooks.done.tap('map-collect', (compilation) => {
      console.log('compilation.assets', compilation);
      console.log('compilation.assets---\n', compilation.assets);
      for(const filename in compilation.emittedAssets) {
        // fileList += `- ${filename} \n`
        console.log('filename: ',filename);
      }
      // callback()
    })
    
    // 可以通过tap函数来注册同步事件，
    // 也可以通过 tapAsync tapPromise 来注册异步事件
    // 注册完成钩子
    // compiler.hooks.done.tap('FileListPluginDone', (compilation) => {
    //   console.log('*** FileListPlugin listen done *** \n')
    // })
    // 注册FileListPlugin事件
    // compiler.hooks.emit.tapAsync('FileListPluginWrite', (compilation, callback) => {
    //   let fileList = '## In this build:\n\n'
      
    //   // 遍历所有编译过的文件，每个文件，都添加一行内容
    //   for(const filename in compilation.assets) {
    //     fileList += `- ${filename} \n`
    //   }

    //   // 将这个列表作为新的文件资源，插入到webpack构建中
    //   console.log('compilation.assets', compilation.assets)
    //   compilation.assets['fileList.md'] = {
    //     source: function() {
    //       return fileList
    //     },
    //     size: function() {
    //       return fileList.length
    //     }
    //   }

    //   callback()
    // })
  }
}

module.exports = VueWConsolePlugin