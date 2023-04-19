import {
  modeType,
  ImageCache,
  remove,
  hasIntersectionObserver,
  getDPR,
  supportWebp,
  throttle,
  some,
  inBrowser,
  isObject,
  getBestSelectionFromSrcset,
  _,
  scrollParent,
} from './util'

import ReactiveListener from './listener'

const DEFAULT_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
const DEFAULT_EVENTS = ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove']
const DEFAULT_OBSERVER_OPTIONS = {
  rootMargin: '0px',
  threshold: 0
}


export default function Lazy(Vue) {
  return class Lazy {
    constructor({
      preLoad,
      error,
      throttleWait,
      preLoadTop,
      dispatchEvent,
      loading,
      attempt,
      slient = true,
      scale,
      listenEvents,
      hasbind,
      filter,
      adapter,
      observer,
      observerOptions
    }) {
      this.version = '__VUE_LAZYLOAD_VERSION__'
      this.mode = modeType.event
      this.listenerQueue = []
      this.TargetIndex = 0
      this.TargetQueue = []
      this.options = {
        slient: slient,
        dispatchEvent: !!dispatchEvent,
        throttleWait: throttleWait || 200,
        preLoad: preLoad || 1.3,
        preLoadTop: preLoadTop || 0,
        error: error || DEFAULT_URL,
        loading: loading || DEFAULT_URL,
        attempt: attempt || 3,
        scale: scale || getDPR(scale),
        listnEvents: listenEvents || DEFAULT_EVENTS,
        hasbind: false,
        supportWebp: supportWebp(),
        filter: filter || {},
        adapter: adapter || {},
        observer: !!observer,
        observerOptions: observerOptions || DEFAULT_OBSERVER_OPTIONS
      }

      this._initEvent()
      this._imageCache = new ImageCache({max: 200})
      this.lazyLoadHandler = throttle(this._lazyLoadHandler.bind(this), this.options.throttleWait)
      // this.lazyLoadHandler = throttle(() => {console.log('1111')}, this.options.throttleWait)

      this.setMode(this.options.observer ? modeType.observer : modeType.event)
    }

    /**
     * 初始化事件
     * 采用发布订阅者模式
     */
    _initEvent() {
      this.Event = {
        listeners: {
          loading: [],
          loaded: [],
          error: []
        }
      }

      this.$on = (event, func) => {
        if(!this.Event.listeners[event]) this.Event.listeners[event] = []
        this.Event.listeners[event].push(func)
      }

      this.$once = (event, func) => {
        const vm = this
        function on() {
          vm.$off(event, on)
          func.apply(vm, arguments)
        }
        this.$on(event, on)
      }

      this.$off = (event, func) => {
        if(!func) {
          if(!this.Event.listeners[event]) return
          this.Event.listeners[event].length = 0
          return
        }
        remove(this.Event.listeners[event], func)
      }

      this.$emit = (event, context, inCache) => {
        if(!this.Event.listeners[event]) return
        this.Event.listeners[event].forEach(func => func(context, inCache))
      }
    }

    /**
     * 查找视口中的节点并触发加载
     */
    _lazyLoadHandler() {
      const freeList = []
      this.listenerQueue.forEach((listener) => {
        // 删除无node节点的监听器
        if(!listener.el || !listener.el.parentNode) {
          freeList.push(listener)
        }
        const catIn = listener.checkInView()
        if(!catIn) return
        listener.load()
      })
      freeList.forEach(item => {
        remove(this.listenerQueue, item)
        item.$distroy()
      })

    }

    setMode(mode) {
      if(!hasIntersectionObserver && mode === modeType.observer) {
        mode = modeType.event
      }

      this.mode = mode
      if(mode === modeType.event) {
        if(this.observer) {
          this.listenerQueue.forEach(listener => {
            this._observer.unobserve(listener.el)
          })
          this._observer = null
        }

        this.TargetQueue.forEach(target => {
          this._initListen(target.el, true)
        })
      } else {
        this.TargetQueue.forEach(target => {
          this._initListen(target.el, false)
        })
        this._initIntersectionObserver()
      }
    }

    /**
     * 添加或者移除 事件监听器
     * @param {*} el 
     * @param {*} start 
     */
    _initListen(el, start) {
      // ?['on']
      this.options.listnEvents.forEach(evt => _[start ? 'on': 'off'](el, evt, this.lazyLoadHandler))
    }

    /**
     * 初始化IntersectionObserver
     * 设置 mode = observer
     */
    _initIntersectionObserver() {
      if(!hasIntersectionObserver) return
      this._observer = new IntersectionObserver(this._observerHandler.bind(this), this.options.observerOptions)
    }

    /**
     * 初始化 IntersectionObserver
     * @param {*} entries 
     */
    _observerHandler(entries) {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          this.listenerQueue.forEach(listener => {
            if(listener.el === entry.target) {
              if(listener.state.loaded) return this._observer.unobserve(listener.el)
              listener.load()
            }
          })
        }
      })
    }


    /**
     * 从列表中删除监听器
     * @param {*} el 
     */
    remove(el) {
      if(!el) return
      this._observer && this._observer.unobserve(el)

      const existItem = find(this.listenerQueue, item => item.el === el)
      if(existItem) {
        this._removeListenerTarget(existItem.$parent)
        this._removeListenerTarget(window)
        remove(this.listenerQueue, existItem)
        existItem.$distroy()
      }
    }

    /**
     * 删除侦听器目标或减少目标子项计数
     */
    _removeListenerTarget(el) {
      this.TargetQueue.forEach((target, index) => {
        if(target.el === el) {
          target.childrenCount--
          if(!target.childrenCount) {
            this._initListen(target.el, false)
            this.TargetQueue.splice(index, 1)
            target = null
          }
        }
      })
    }

    /**
     * 添加图片监听器到队列中
     * @param {*} el 
     * @param {*} binding 
     * @param {*} vnode 
     */
    add(el, binding, vnode) {
      if(some(this.listenerQueue, item => item.el == el)) {
        this.update(el, binding)
        return Vue.nextTick(this.lazyLoadHandler)
      }

      let {src, loading, error, cors } = this._valueFormatter(binding.value)

      Vue.nextTick(() => {
        src = getBestSelectionFromSrcset(el, this.options.scale) || src
        this._observer && this._observer.observe(el)

        const container = Object.keys(binding.modifiers)[0]
        let $parent
        if(container) {
          $parent = vnode.context.$refs[container]
          $parent = $parent ? $parent.el || $parent : document.getElementById(container)
        }

        if(!parent) {
          $parent = scrollParent(el)
        }

        const newListener = new ReactiveListener({
          bindingType: binding.arg,
          $parent,
          el,
          loading,
          error,
          src,
          cors,
          elRenderer: this._elRenderer.bind(this),
          options: this.options,
          imageCache: this._imageCache
        })

        this.listenerQueue.push(newListener)

        if(inBrowser) {
          this._addListenerTarget(window)
          this._addListenerTarget($parent)
        }

        this.lazyLoadHandler()
        Vue.nextTick(() => this.lazyLoadHandler())
      })
    }

    /**
     * 更新 image src
     * @param {*} el 
     * @param {*} binding 
     * @param {*} vnode 
     */
    update(el, binding, vnode) {
      let {src, loading, error} = this._valueFormatter(binding.value)
      src = getBestSelectionFromSrcset(el, this.options.scale) || src
      
      const exist = find(this.listenerQueue, item => item.el === el)
      if(!exist) {
        this.add(el, binding, vnode)
      } else {
        exist.update({
          src,
          loading,
          error
        })
      }

      if(this._observer) {
        this._observer.unobserve(el)
        this._observer.observe(el)
      }

      this.lazyLoadHandler()
      Vue.nextTick(() => this.lazyLoadHandler())
    }

    /**
     * 生成加载已经加载的错误图像url
     * @param {*} value 
     */
    _valueFormatter(value) {
      let src = value
      let loading = this.options.loading
      let error = this.options.error

      if(isObject(value)) {
        if(!value.src && !this.options.slient) {
          console.error('Vue Lazyload warning: miss src with ' + value)
        }
        src = value.src
        loading = value.loading || this.options.loading
        error = value.error || this.options.error
      }
      return {
        src,
        loading,
        error
      }
    }

    _elRenderer (listener, state, cache) {
      if (!listener.el) return
      const { el, bindType } = listener

      let src
      switch (state) {
        case 'loading':
          src = listener.loading
          break
        case 'error':
          src = listener.error
          break
        default:
          src = listener.src
          break
      }

      if (bindType) {
        el.style[bindType] = 'url("' + src + '")'
      } else if (el.getAttribute('src') !== src) {
        el.setAttribute('src', src)
      }

      el.setAttribute('lazy', state)

      this.$emit(state, listener, cache)
      this.options.adapter[state] && this.options.adapter[state](listener, this.options)

      if (this.options.dispatchEvent) {
        const event = new CustomEvent(state, {
          detail: listener
        })
        el.dispatchEvent(event)
      }
    }


    _addListenerTarget (el) {
      if (!el) return
      let target = find(this.TargetQueue, target => target.el === el)
      if (!target) {
        target = {
          el: el,
          id: ++this.TargetIndex,
          childrenCount: 1,
          listened: true
        }
        this.mode === modeType.event && this._initListen(target.el, true)
        this.TargetQueue.push(target)
      } else {
        target.childrenCount++
      }
      return this.TargetIndex
    }

    /**
     * 添加懒加载组件到队列中
     * @param {Vue} vm 
     */
    addLazyBox(vm) {
      this.listenerQueue.push(vm)
      if(inBrowser) {
        this._addListenerTarget(window)
        this._observer && this._observer.observe(vm.el)
        if(vm.$el && vm.$el.parentNode) {
          this._addListenerTarget(vm.$el.parentNode)
        }
      }
    }
    
    /**
     * 从列表中移除懒加载组件
     * @param {*} vm 
     */
    removeComponent(vm) {
      if(!vm) return
      remove(this.listenerQueue, vm)
      this._observer && this._observer.unobserve(vm.el)
      if(vm.$parent && vm.$el.parentNode) {
        this._removeListenerTarget(vm.$el.parentNode)
      }
      this._removeListenerTarget(window)
    }
  }
}