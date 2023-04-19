import Lazy from './src/lazy'
import LazyComponent from './src/lazy-component'
// import LazyContainer from './src/lazy-container'
// import LazyImage from './src/lazy-image'
// import {assign} from './src/util'
import './src/lazy.less'

export default {
  install(Vue, options = {}) {
    const LazyClass = Lazy(Vue)
    const lazy = new LazyClass(options)
    // const lazyContainer = new LazyContainer({lazy})
    const isVue2 = Vue.version.split('.')[0] === '2'

    Vue.prototype.$lazyload = lazy

    // if(options.lazyComponent) {
      // Vue.component('lazy-component', LazyComponent(lazy))
      Vue.use(LazyComponent)
    // }

    // if(options.lazyImage) {
    //   Vue.component('lazy-image', LazyImage(lazy))
    // }

    if(isVue2) {
      Vue.directive('lazy', {
        bind: lazy.add.bind(lazy),
        update: lazy.update.bind(lazy),
        componentUpdated: lazy.lazyLoadHandler.bind(lazy),
        unbind: lazy.remove.bind(lazy)
      })
      // Vue.directive('lazy-comtainer', {
      //   bind: lazyContainer.bind.bind(lazyContainer),
      //   componentUpdated: lazyContainer.update.bind(lazyContainer),
      //   unbind: lazyContainer.unbind.bind(lazyContainer)
      // })
    }
  }
}