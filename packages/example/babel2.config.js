module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  plugins: [
    // [
    //   'import',
    //   {
    //     libraryName: 'guo-ui',
    //     libraryDirectory: 'lib',
    //     // 指定样式路径
    //     // style: true,
    //     style:name => {
    //       console.log('name', name);
    //       const noCssList = ['Utils']
    //       if(noCssList.indexOf(name) > -1) {
    //         return false
    //       }
    //       return `${name}/style.css`
    //     },
    //     camel2DashComponentName: false, // 是否需要驼峰转短横线
    //     camel2UnderlineComponentName: false // 是否需要驼峰转下划线
    //   }
    // ]
    // [
    //   'import', 
    //   {
    //     libraryName: 'vant',
    //     libraryDirectory: 'es',
    //     style: true
    //   }, 
    //   'vant'
    // ],
    [
      'import', 
      {
        libraryName: 'guo-ui',
        libraryDirectory: 'lib',
        // style: true
        style: 'style/index.css'
      }, 
      'guo-ui'
    ],
  ]
}
