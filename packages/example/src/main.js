import Vue from 'vue'
import App from './App.vue'
import router from './router'

// import guoUI from 'guo-ui'
// console.log('guoUI', guoUI);
// Vue.use(guoUI)
// import {Button} from 'guo-ui'
// console.log('Button', Button);
// import 'guo-ui/lib/guoUI.css'
// Vue.use(Button)
// import { Button, Cell }s from 'vant';

// 全局引入
// import guoUI from '../../packages/index'
// import guoUI from 'guo-ui'
// // const guoUI = require('guo-ui').default
// console.log('guoUI', guoUI);
// Vue.use(guoUI)
// const uiPath = '../../guo-uis/packages/index'

// 按需引入
import {
  Button,
  List,
  Tag,
  Lazyload,
  MRouter,
  Slider,
  ConfigProvider
//   install
// } from 'guo-ui'
// } from '../../guo-ui/packages/index'
} from 'ui-path'

import { Skeleton, Area } from 'vant';

// guo-ui
Vue.use(Button)
Vue.use(List)
Vue.use(Tag)
Vue.use(Lazyload)
Vue.use(Slider)
Vue.use(ConfigProvider)

// import MRouter from 'ui-path'
Vue.use(MRouter, router)

// vant-ui
Vue.use(Skeleton);
Vue.use(Area);


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
