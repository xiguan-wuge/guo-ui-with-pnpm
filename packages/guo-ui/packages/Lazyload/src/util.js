export const inBrowser = typeof window !== 'undefined' && window !== null

export const modeType = {
  event: 'event',
  observer: 'observer'
}

/**
 * 设置图片缓存,
 * 类似于栈结构，后添加的图片为新，超过max则删除最开始添加的图片
 */
class ImageCache {
  constructor({max}) {
    this.options = {
      max: max || 100
    }
    this._caches = []
  }

  has(key) {
    return this._caches.indexOf(key) > -1
  }
  add(key) {
    if(this.has(key)) return
    this._caches.push(key)
    if(this._caches.length > this.options.max) {
      this.free()
    }
  }
  free() {
    this._caches.shift()
  }
}

/**
 * 从已有数组中删除某一项
 * @param {*} arr 
 * @param {*} item 
 */
function remove(arr, item) {
  if(!arr.length) return
  const index = arr.indexOf(item)
  if(index > -1) return arr.splice(index, 1)
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

export const hasIntersectionObserver = checkIntersectionObserver()
function checkIntersectionObserver() {
  if(inBrowser &&
      'IntersectionObserver' in window &&
      'intersectionObserverEntry' in window &&
      'intersectionRatio' in window.IntersectionObserverEntry.prototype
  ) {
    if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
      Object.defineProperty(window.IntersectionObserverEntry.prototype,
        'isIntersecting', {
          get: function () {
            return this.intersectionRatio > 0
          }
        })
    }
    return true
  }
  return false
}

export const getDPR = (scale=1) => inBrowser ?  (window.devicePixelRatio || scale) : scale

/**
 * 是否支持webp图片
 */
export function supportWebp() {
  if(!inBrowser) return false 
  let support = true
  try {
    const elem = document.createElement('canvas')
    if(elem.getContext && elem.getContext('2d')) {
      support = elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
    }
  } catch (error) {
    support = false
  }
  return support
}

export function some(arr, item) {
  if(!arr) return
  const index = arr.indexOf(item)
  if(index > -1) return arr.splice(index, 1)
}

// 获取符合当前分辨率的图片路径
export function getBestSelectionFromSrcset(el, scale) {
  if(el.tagName !== 'IMG' || !el.getAttribute('data-srcset')) return

  let options = el.getAttribute('data-src')
  const result = []
  const container = el.parentNode
  const containerWidth = container.offsetWidth * scale

  let spaceIndex, tmpSrc, tmpWidth

  options = options.trim().split(',')

  options.map(item => {
    item = item.trim()
    spaceIndex = item.lastIndexOf(' ')
    if(spaceIndex === -1) {
      tmpSrc = item
      tmpWidth = 999998
    } else {
      tmpSrc = item.substr(o, spaceIndex)
      tmpWidth = parseInt(item.substr(spaceIndex + 1, item.length -spaceIndex -2), 10)
    }
    result.push([tmpWidth, tmpSrc])
  })

  result.sort(function(a, b) {
    if(a[0] < b[0]) return 1

    if(a[0] > b[0]) return -1

    if(a[0] === b[0]) {
      if(b[1].indexOf('.webp', b[1].length - 5) !== -1) {
        return 1
      }
      if(a[1].indexOf('.webp', a[1].length - 5) !== -1) {
        return -1
      }
    }

    return 0
  })

  let bestSelectedSrc = ''
  let tmpOption

  for(let i = 0, len = result.length; i < len; i++) {
    tmpOption = result[i]
    bestSelectedSrc = tmpOption[1]
    const next = result[i+1]
    if(next && next[0] < containerWidth) {
      bestSelectedSrc = tmpOption[1]
      break
    } else if(!next) {
      bestSelectedSrc = tmpOption[1]
      break
    }
  }
  return bestSelectedSrc
}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

export const loadImageAsync = (item, resolve, reject) => {
  let image = new Image()
  if (!item || !item.src) {
    const err = new Error('image src is required')
    return reject(err)
  }

  image.src = item.src
  if (item.cors) {
    image.crossOrigin = item.cors
  }

  image.onload = function () {
    resolve({
      naturalHeight: image.naturalHeight,
      naturalWidth: image.naturalWidth,
      src: image.src
    })
  }

  image.onerror = function (e) {
    reject(e)
  }
}

export function ObjectKeys (obj) {
  if (!(obj instanceof Object)) return []
  if (Object.keys) {
    return Object.keys(obj)
  } else {
    let keys = []
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        keys.push(key)
      }
    }
    return keys
  }
}

export function noop() {}

function testSupportsPassive () {
  if (!inBrowser) return
  let support = false
  try {
    let opts = Object.defineProperty({}, 'passive', {
      get: function () {
        support = true
      }
    })
    window.addEventListener('test', null, opts)
  } catch (e) {}
  return support
}

const supportsPassive = testSupportsPassive()
export const _ = {
  on (el, type, func, capture = false) {
    if (supportsPassive) {
      el.addEventListener(type, func, {
        capture: capture,
        passive: true
      })
    } else {
      el.addEventListener(type, func, capture)
    }
  },
  off (el, type, func, capture = false) {
    el.removeEventListener(type, func, capture)
  }
}

const overflow = (el) => {
  return style(el, 'overflow') + style(el, 'overflow-y') + style(el, 'overflow-x')
}

export const scrollParent = (el) => {
  if (!inBrowser) return
  if (!(el instanceof HTMLElement)) {
    return window
  }

  let parent = el

  while (parent) {
    if (parent === document.body || parent === document.documentElement) {
      break
    }

    if (!parent.parentNode) {
      break
    }

    if (/(scroll|auto)/.test(overflow(parent))) {
      return parent
    }

    parent = parent.parentNode
  }

  return window
}
export {
  ImageCache,
  remove
}