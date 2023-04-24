const path = require('path')

class AddDefaultCssPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('AddDefaultCssPlugin', (compilation) => {
      compilation.hooks.optimizeChunkAssets.tap('AddDefaultCssPlugin', (chunks) => {
        chunks.forEach((chunk) => {
          chunk.files.forEach((file) => {
            if (file.endsWith('.js')) {
              const cssFile = file.replace(/\.js$/, '.css');
              if (!chunk.files.includes(cssFile)) {
                const cssPath = `${path.dirname(file)}/${cssFile}`;
                try {
                  fs.accessSync(cssPath, fs.constants.R_OK);
                  chunk.files.push(cssFile);
                } catch (err) {
                  console.warn(`[AddDefaultCssPlugin] The css file ${cssFile} not found`);
                }
              }
            }
          });
        });
      });
    });
  }
}
module.exports = AddDefaultCssPlugin