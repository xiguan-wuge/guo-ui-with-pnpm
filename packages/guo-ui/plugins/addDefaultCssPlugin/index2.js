class AddDefaultCssPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('AddDefaultCssPlugin', (compilation) => {
      try {
        const chunkFilesMap = new Map();

        // 获取每个 chunk 对应的文件
        for (const chunk of compilation.chunks) {
          const files = new Set();
          for (const module of chunk.modulesIterable) {
            for (const file of module.readableIdentifier().split('|')) {
              if (/\.js$/.test(file)) {
                files.add(file);
              }
            }
          }
          chunkFilesMap.set(chunk.name, [...files]);
        }

        console.log('chunkFilesMap', chunkFilesMap)

        // 给没有 CSS 文件的 chunk 添加一个默认 CSS 文件
        for (const [chunkName, files] of chunkFilesMap) {
          const hasCssFile = files.some((file) => /\.css$/.test(file));
          if (!hasCssFile) {
            const defaultCssFile = `${chunkName}.css`;
            compilation.assets[defaultCssFile] = {
              source: () => '',
              size: () => 0,
            };
            const chunk = compilation.namedChunks.get(chunkName);
            if (chunk) {
              chunk.files.push(defaultCssFile);
            }
          }
        }
      } catch (error) {
        console.log('插件报错： \n', error)
      }

    });
  }
}

module.exports = AddDefaultCssPlugin;