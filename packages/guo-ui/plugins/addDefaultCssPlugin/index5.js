/**
 * 为没有依赖的组件添加一个默认的 CSS 文件
 * @param options 需要遍历的组件
 */

const fs = require('fs');
const path = require('path');

class AddDefaultCssPlugin {
  constructor(options) {
    console.log('options', options);
    this.options = options;
  }

  apply(compiler) {
    console.log('\n apply00 \n');
    compiler.hooks.emit.tapAsync('AddDefaultCssPlugin', (compilation, callback) => {
      console.log('\n apply--------------- \n');
      const components = this.options.components || [];
      if (!components || components.length === 0) {
        callback()
        return
      }
      try {
        // console.log('compilation.moduleGraph', compilation.moduleGraph)
        // 扫描所有组件的依赖关系，找出没有依赖的组件
        const noDepComponents = components.filter((component) => {
          const {
            dependencies
          } = compilation.moduleGraph.getModule(component);
          console.log('\n dependencies \n', dependencies);

          return !dependencies.size;
        });
        console.log('\n noDepComponents \n', noDepComponents);

        // 为没有依赖的组件生成一个默认的 CSS 文件，并添加到输出中
        noDepComponents.forEach((component) => {
          const cssFile = path.join(path.dirname(component), `${path.basename(component, '.js')}.css`);

          if (!fs.existsSync(cssFile)) {
            fs.writeFileSync(cssFile, '');
          }

          compilation.assets[path.basename(cssFile)] = {
            source: () => '',
            size: () => 0,
          };
        });

        callback();
      } catch (error) {
        console.log('插件报错', error)
        callback()
      }

    });
  }
}

module.exports = AddDefaultCssPlugin;