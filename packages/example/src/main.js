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

// 按需引入
import {
  Button,
  List,
  Tag,
  Lazyload,
  MRouter
  // install
// } from 'guo-ui'
} from '../../guo-ui/packages/index'


// console.log('install', install);
// import {gFn} from 'guo-ui/Utils'

Vue.use(Button)
Vue.use(List)
Vue.use(Tag)
Vue.use(Lazyload)
Vue.use(MRouter, router)



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
