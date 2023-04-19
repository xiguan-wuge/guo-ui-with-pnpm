<template>
  <div class="g-list">
    <div class="g-list__container" ref="container" :style="refreshStyle">
      <div v-if="getRefreshStatusText">
        <slot name="refresh"></slot>
        <p >{{getRefreshStatusText}}</p>
      </div>
      <slot v-if="direction === 'down'"></slot>
      <div ref="placeholder" key="placeholder" class="g-list__placeholder"></div>
      <div v-if="loading && !this.finished" key="loading" class="g-list__loading">loading</div>
      <div v-if="this.finished" class="g-list__finished-text">{{finishedText}}</div>
      <div class="g-list__error-text">{{errorText}}</div>
    </div>
  </div>
</template>
<script>
import {createNameSpace, throttle} from '../../../utils/index.js'
import {getScroller}  from '../../../utils/dom/scroll.js'

const [name] = createNameSpace('list')
const TEXT_STATUS = ['pulling', 'loosing', 'success', 'loading']
export default {
  name,
  props: {
    error: Boolean,
    loading: Boolean,
    finished: Boolean,
    errorText: String,
    loadingText: String,
    finishedText: String,
    immediateCheck: {
      type: Boolean,
      default: true,
    },
    offset: {
      type: [Number, String],
      default: 90,
    },
    direction: {
      type: String,
      default: 'down',
    },
    refresh: false,
    refreshed: false,
    // 顶部内容高度
    headHeight: {
      type: [Number, String],
      default: 50
    },
    // 触发下刷新的距离
    pullDistance: {
      type: [Number, String],
      default: 50
    },
    // 下拉动画过渡时间
    refreshDuatation: {
      type: [Number, String],
      default: 300,
    },
    // 刷新成功后，成功文本展示时间
    refreshSuccessDuration: {
      type: [Number, String],
      default: 500,
    },
    pullingText: {
      type: String,
      default: '下拉即可刷新...'
    },
    loosingText: {
      type: String,
      default: '释放即可刷新...'
    },
    loadingText: {
      type: String,
      default: '加载中...'
    },
    successText: {
      type: String,
      default: ''
    },
    refreshDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      refreshDistance: 0,
      refreshStatus: 'normal',
      isRefreshing: false,
      duration: 0,
      refreshText: ''
    }
  },
  computed: {
    touchable() {
      return (
        this.refreshStatus !== 'loading' && this.refreshStatus !== 'success' && !this.refreshDisabled
      );
    },
    refreshStyle() {
      return {
        transitionDuration: `${this.duration}ms`,
        transform: this.refreshDistance ? `translate3d(0,${this.refreshDistance}px, 0)` : ''
      }
    },
    getRefreshStatusText() {
      let text = ''
      const statusText = this[`${this.refreshStatus}Text`]
      
      if(TEXT_STATUS.indexOf(this.refreshStatus) > -1) {
        text = statusText
      }
      // console.log('getRefreshStatusText', text, this.refreshStatus);

      return text

    }
  },
  watch: {
    loading: 'check',
    finished: 'check',
    refreshed: {
      // 监听父元素刷新动态完成
      handler: function(val, oldVal) {
        // 即时修改下拉过渡时间
        this.duration = this.refreshDuatation
        if(val === 'refreshing') {
          this.setStatus(+this.headHeight, true);
        }
        if(val === 'refreshed' && this.refreshStatus === 'loading') {
          console.log('handleRefreshed');
          
          this.handleRefreshed()
        }
      },
    }
  },
  mounted() {
    const parent = getScroller(this.$el)
    console.log('parent', parent)
    const app = document.getElementById('app')
    this.scroller = parent
    this.fn = throttle(
      () => {this.check()},
      60
    )
    this.scroller.addEventListener('scroll',this.fn)
    if(this.immediateCheck) {
      this.check()
    }
    
    // this.initRefresh()

    
  },
  beforeDestroy() {
    if(this.scroller) {
      this.scroller.removeEventListener('scroll', this.fn)

    }
    this.removeTouchEvent()

  },
  methods: {
    check() {
      console.log('check');
      
      this.$nextTick(() => {
        if(this.loading || this.finished || this.error) {
          return
        }
        const {$el:el, scroller, offset, direction} = this
        let scrollerRect

        if(scroller.getBoundingClientRect) {
          scrollerRect = scroller.getBoundingClientRect()
        } else {
          scrollerRect = {
            top: 0,
            bottom: scroller.innerHeight
          }
        }

        const scrollerHeight = scrollerRect.bottom - scrollerRect.top
        console.log('scrollerHeight', scrollerHeight);
        
        // if(!scrollerHeight || isHidden(el)) {
        if(!scrollerHeight) {
          return false
        }

        // 判断是否触底、触顶
        let isReachEdge = false
        const placeholderRect = this.$refs.placeholder.getBoundingClientRect()
        if(direction === 'up') {
          isReachEdge = scrollerRect.top - placeholderRect.top <= offset
        } else {
          isReachEdge = placeholderRect.bottom - scrollerRect.bottom <= offset
        }
        console.log('isReachEdge', isReachEdge);
        

        // 触发加载更多
        if(isReachEdge) {
          this.$emit('input', true)
          this.$emit('load')
        }
      })
    },
    clickErrorText() {
      this.$emit('update:error', false)
      this.check()
    },
    initRefresh() {
      const target = document.querySelector('.g-list__container')
      console.log('target', target);
      if(!target) return
      this.refreshDOM = target
      this.startFn = (e) => {
        this.handleTouchStart(e)
      }
      this.moveFn = throttle(
        (e) => {
          this.handleTouchMove(e)
        },
        60
      )
      this.endFn = (e) => {
        this.handleTouchEnd(e)
      }
      this.refreshDOM.addEventListener('touchstart', this.startFn,{passive: false})
      this.refreshDOM.addEventListener('touchmove', this.moveFn,{passive: false})
      this.refreshDOM.addEventListener('touchend', this.endFn,{passive: false})
    },
    removeTouchEvent() {
      if(!this.refreshDOM) return
      this.refreshDOM.removeEventListener('touchstart', this.startFn)
      this.refreshDOM.removeEventListener('touchmove', this.moveFn)
      this.refreshDOM.removeEventListener('touchend', this.endFn)
    },
    handleTouchStart(e) {
      e.preventDefault()

      if(!this.touchable) return
      // const rect = this.getScrollRect()
      // this.canRefresh = rect.top <= 20
      
      // if(!this.canRefresh) return
      this.duration = 0;
      this.startPos = e.touches[0].pageY
    },
    handleTouchMove(e) {
      e.preventDefault()

      // if(!this.canRefresh) return
      
      // this.refreshDistance = e.touches[0].pageY - this.startPos
      if(!this.touchable) return
      const distance = e.touches[0].pageY - this.startPos
      this.setStatus(this.ease(distance))
      // if(this.refreshDistance >= 100) {
      //   this.isRefreshing = true
      // }
    },
    handleTouchEnd(e) {
      e.preventDefault()

      // if(!this.canRefresh) return
      if(!this.touchable) return
      this.duration = this.refreshDuatation
      if(this.refreshStatus === 'loosing') {
        this.setStatus(this.headHeight, true)
        this.$emit("update:refreshed", 'refreshing');
        this.canRefresh = false // 避免重复结束后再触发刷新
        this.$nextTick(() => {
          this.$emit('refresh')
        })
      } else {
        this.setStatus(0)
      }
    },
    getScrollRect() {
      return this.scroller.getBoundingClientRect()
    },
    handleRefreshed() {
      this.refreshStatus = 'success'
      setTimeout(() => {
        this.setStatus(0)
        this.refreshStatus = 'normal'
      }, this.refreshSuccessDuration)
    },
    // 计算下拉展示高度,根据下拉高度动态调整展示高度
    ease(distance) {
      const pullDistance = +(this.pullDistance || this.headHeight)
      if(distance > pullDistance) {
        if(distance < pullDistance *2) {
          distance = pullDistance + (distance - pullDistance) / 2
        } else {
          distance = pullDistance * 1.5 + (distance - this.pullDistance * 2) /4
        }
      }
      console.log('ease-distance', distance);
      // fix: 阻止上拉带来的误移动
      // if(distance < 0) return -1
      
      return Math.round(distance)
    },
    setStatus(distance, isRefreshLoading) {
      if(distance === -1) return
      let status;
      if(isRefreshLoading) {
        status = 'loading'
      } else if(distance === 0) {
        status = 'normal'
      } else {
        status = 
          distance < (this.pullDistance || this.headHeight)
            ? 'pulling'
            : 'loosing'
      }
      this.refreshDistance = distance
      if(status !== this.refreshStatus) {
        this.refreshStatus = status
      }
    }

  },
}
</script>
<style lang="less" scoped>
@import './list.less';
</style>