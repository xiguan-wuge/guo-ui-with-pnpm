
# 组件库开发规范

为了更好进行组件库开发，采用统一的开发规范作为约束

## 样式开发规范
- 样式命名：`xx-button`, `xx-button-name`等
- 样式嵌套，尽量不要超过3层，减少样式查询消耗
- 组件通用样式或者变量抽离，便于实现组件主题等切换

## 组件开发规范
- 组件目录结构：如下：

package
    |-- button
        src
            |-- button.vue
            |-- button.less
        index.js