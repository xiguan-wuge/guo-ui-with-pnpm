import mRouterTpl from './src/index.vue'

let tempVue = null
class MRouter {
  constructor(Vue) {
    Vue.prototype.$mRouter = {
      tn: 'none', // 动画名
      keepAlives: [] // 需要缓存的路由页面
      
    }
    this.Vue = Vue
    tempVue = Vue
    // this.stack = new Map()
    this.stack = []
    this.PAGEKEY = new Date().getTime()
  }

  createPageKey() {
    this.PAGEKEY += 1
    return this.PAGEKEY.toString()
  }

  findStackKey(pageKey) {
    // return this.stack.has(pageKey)
    return this.stack.findIndex(item => item ===pageKey)
  }
  pushStack(pageKey) {
    // this.stack.set(pageKey, pageKey)
    this.stack.push(pageKey)
  }
  clearStack(pageKey) {
    if(pageKey) {
      const index = this.findStackKey(pageKey)
      if( index> -1) {
        // this.stack.delete(pageKey)
        this.stack.splice(index, 1)
      }
    } else {
      // this.stack.clear()
      this.stack = []
    }
  }

  rewriteRouter(router) {
    ['push', 'replace'].forEach(method => {
      const fn = router[method].bind(router)
      router[method] = (location, onComplete, onAbort) => {
        const obj = {}
        if(typeof location !== 'object') {
          obj.path = location
        } else {
          Object.assign(obj, location)
        }

        if(!obj.query) {
          obj.query = {}
        }

        if(method === 'push') {
          obj.query.$page_key = this.createPageKey()
          this.pushStack(obj.query.$page_key)
        }
        if(method === 'replace') {
          obj.query.$replace = true
        }
        // 执行原本的router方法
        fn(obj, onComplete, onAbort)
      }

    })
  }

  /**
   * 记录路由配置项中设置了keep-alive的路由
   * @param {*} router 
   */
  setKeepAlive(router) {
    const routes = router.options.routes
    if(routes && routes.length > 0) {
      routes.forEach(route => {
        const meta = route.meta
        if(meta && meta.keepAlive) {
          tempVue.prototype.$mRouter.keepAlives.push(route.name)
        }
      })
    }
  }

  /**
   * 切换transition组件的name属性，用于修改动画
   * @param {*} name 
   */
  changgeTn(name) {
    tempVue.prototype.$mRouter.tn = name
  }


  setTransition(from, to) {
    const fromIndex = this.findStackKey(from.query.$page_key)
    const toIndex = this.findStackKey(to.query.$page_key)

    if(fromIndex < toIndex) {
      // page enter (push)
      this.changgeTn('slidein')
    } else if(fromIndex > toIndex) {
      // page leave(back)
      this.changgeTn('slideout')
    } else {
      // repalace，不做任何动画
      this.changgeTn('none')
    }
    
  }

  /**
   * 缓存from page 的 scrollTop值
   * @param {*} vm 
   * @param {*} from 
   */
  storeFromScrollTop(vm, from) {
    const scrollContainer = vm.$refs.scrollContainer
    if(scrollContainer && from.meta) {
      console.log('storeFromScrollTop', scrollContainer.scrollTop);
      from.meta.scrollTop = scrollContainer.scrollTop
    }
  }

  /**
   * 返回页面时，设置回原来的位置
   * @param {*} vm 
   * @param {*} to 
   */
  reStoreToScrollTop(vm, to) {
    const scrollContainer = vm.$refs.scrollContainer
    if(scrollContainer && to.meta && to.meta.scrollTop) {
      console.log('reStoreToScrollTop', to.meta.scrollTop);
      scrollContainer.scrollTop = to.meta.scrollTop
    }
  }
}


export default (Vue, router) => {
  const mRouter = new MRouter(Vue)
  mRouter.setKeepAlive(router)
  mRouter.rewriteRouter(router)
  Vue.component(mRouterTpl.name, mRouterTpl)
  Vue.mixin({
    beforeRouteEnter(to, from, next) {
      console.log('beforeRouteEnter', to, from,);
      if(!to.query.$page_key) {
        // 首次进入时，没有$page_key
        const obj = Object.assign({}, to)
        obj.replace = true
        obj.query.$page_key = mRouter.createPageKey()
        mRouter.pushStack(obj.query.$page_key)
        next(obj)
      } else {
        next(vm => {
          mRouter.reStoreToScrollTop(vm, to)
        })
      }
    },
    beforeRouteLeave(to, from, next) {
      console.log('beforeRouteLeave', to, from,);
      if(to.query.$replace) {
        to.query.$page_key = from.query.$page_key
        delete to.query.$replace
        const obj = Object.assign({}, to)
        obj.replace = true
        next(obj)
        return
      }

      mRouter.storeFromScrollTop(this, from) // 记录离开时的位置
      mRouter.setTransition(from, to)
      next()
    },
  })
}