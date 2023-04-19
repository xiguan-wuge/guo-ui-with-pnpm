/**
 * 当触发mounted 或者activated生命周期时绑定事件
 */

import {on, off} from '../utils/dom/event'
let uid = 0

export function BindEventMixin(handler) {
  const key = `binded_${uid++}`

  function bind() {
    if(!this[key]) {
      handler.call(this, on, true)
      this[key] = true
    }
  }

  function unbind() {
    if(this[key]) {
      handler.call(this, off, false)
      this[key] = false
    }
  }

  return {
    mounted: bind,
    activated: bind,
    deactivated: unbind,
    beforeDestroy: unbind
  }
}
