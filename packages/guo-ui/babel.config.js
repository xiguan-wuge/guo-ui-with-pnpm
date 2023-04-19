module.exports = {
  presets: [
    "@vue/cli-plugin-babel/preset",
    [
      "@vue/babel-preset-jsx",
      {
        injectH: false,
      },
    ],
    
  ],
  plugins: [
    // [
    //   'import',
    //   {
    //     libraryName: 'guo-ui',
    //     libraryDirectory: 'lib',
    //     // 指定样式路径
    //     style: (name) => {
    //       return `${name}/style.css`
    //     },
    //     camel2DashComponentName: false, // 是否需要驼峰转短横线
    //     camel2UnderlineComponentName: false // 是否需要驼峰转下划线
    //   }
    // ]
  ]
};
