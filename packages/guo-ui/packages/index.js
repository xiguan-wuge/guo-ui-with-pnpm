// 整合所有组件，对外导出

import Button from "./Button";
import Tag from "./Tag";
import Slider from "./Slider";
import ConfigProvider from "./ConfigProvider";
import Lazyload from "./Lazyload";
import Collapse from "./Collapse";
import CollapseItem from "./CollapseItem";
import List from "./List";
import MRouter from "./MRouter";

const components = [
  Button,
  Tag,
  Slider,
  ConfigProvider,
  Lazyload,
  Collapse,
  CollapseItem,
  List,
  MRouter
]

const install = function(Vue) {
  if(install.installed) return

  components.map(comp => {
    
    // Vue.component(comp.name, comp)
    Vue.use(comp)
  })
}


// 判断是否直接引入文件
if(typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  install,
  Button,
  Tag,
  Slider,
  ConfigProvider,
  Lazyload,
  Collapse,
  CollapseItem,
  List,
  MRouter
}
export default {
  install,
  Button,
  Tag,
  Slider,
  ConfigProvider,
  Lazyload,
  Collapse,
  List,
  MRouter
}