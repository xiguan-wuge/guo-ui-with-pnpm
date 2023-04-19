import Vue from 'vue'

export const isServer = Vue.prototype.$isServer

export function createNameSpace(name) {
  const prefixName = `g-${kebabCase(name)}`
  return [
    prefixName
  ]
}

// 组件统一添加install方法
export function withInstall(component) {
  component.install = (Vue) =>{
    const {name} = component
    if(name) {
      Vue.component(name, component)
    }
  }
  return component
}

// 驼峰转横杠
export function kebabCase(str) {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
}

export function throttle(action, delay) {
  let timeout = null
  let movement = null
  let lastRun = 0
  let needRun = false

  return function() {
    needRun = true
    if(timeout) return

    let elapsed = Date.now - lastRun
    let context = this
    let args = arguments
    let runCallback = function() {
      lastRun = Date.now()
      timeout = false
      action.apply(context, args)
    }
    if(elapsed >= delay) {
      runCallback()
    } else {
      timeout = setTimeout(runCallback, delay)
    }
    // ? 没有理解
    if(needRun) {
      clearTimeout(movement)
      movement = setTimeout(runCallback, 2*delay)
    }
  }
}