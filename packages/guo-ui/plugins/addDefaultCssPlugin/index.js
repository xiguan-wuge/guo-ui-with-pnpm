/**
 * 组件添加默认的css文件
 * @param options Object 
 */

// 入参介绍：
// options:{
//   components: ['Button'], // 需要检查的组件名
//   cssFileName: 'style/index.css', // 需要添加的默认css文件路径+文件名, 添加到当前组件的输出目录下，
//   cssDefaultContent: '', 需要添加到css文件中的内容
// }
// 若Button组件中，没有依赖css，则会默认添加一个空css文件 'Button/style/index.css'

class AddDefaultCssPlugin {
  constructor(options) {
    this.options = options
    // 兼容性
    this.options.components = options?.components || []
    this.options.cssFileName = options?.cssFileName ||  'style/index.css'
    this.options.cssDefaultContent = options?.cssDefaultContent || ''
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('FileListPluginWrite', (compilation, callback) => {
      let fileList = '## In this build:\n\n'
      
      // 遍历所有编译过的文件，每个文件，都添加一行内容
      for(const filename in compilation.assets) {
        fileList += `- ${filename} \n`
      }

      // 将这个列表作为新的文件资源，插入到webpack构建中
      // compilation.assets['temDir/fileList.md'] = {
      //   source: function() {
      //     return fileList
      //   },
      //   size: function() {
      //     return fileList.length
      //   }
      // }
      
      // 添加默认css文件
      // const components = ['Button', 'Collapse']
      const components = this.options.components || []
      const cssFileName = this.options.cssFileName
      
      const cssDefaultContent = this.options.cssDefaultContent
      const newAddCss = []
      for(let i = 0, len = components.length; i < len; i++) {
        const comp = components[i]
        const targetFile = `${comp}/${cssFileName}`
        if(fileList.indexOf(targetFile) === -1) {
          newAddCss.push({
            name: targetFile,
            content:cssDefaultContent
          })
        }
      }
      if(newAddCss.length > 0) {
        newAddCss.forEach(file => {
          compilation.assets[file.name] = {
            source: function() {
              return file.content || ''
            },
            size: function() {
              return file.content.length || 0
            }
          }
        })
      }

      callback()
    })
  }
}

module.exports = AddDefaultCssPlugin