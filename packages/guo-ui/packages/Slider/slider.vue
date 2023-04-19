<template>
  <div class="slider" 
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchEnd="onTouchEnd"
    @touchcancel="onTouchCancel"
    >
    <div class="slider-outer">
      <div class="slider-inner" :style="innerStyle" ref="slider">
        <!-- <div class="slider-value-bar"> -->
          <div class="slider-btn"></div>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'gSlider',
  props: {
    height: {
      type: Number,
      default: 26
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    }

  },
  data() {
    return {
      transformX: -100
    }
  },
  computed: {
    // 最大值与最小值之间的差值
    diffValue() {
      return this.max - this.min
    },
    
    // value-bar 样式
    innerStyle() {
      console.log('this.transformX', this.transformX)
      return {
        transform: `translateX(${this.transformX})`
      }
    }
  },
  mounted() {
    this.getRect()
  },
  methods: {
    getRect() {
      const node = this.$refs.slider.getBoundingClientRect()
      console.log('node', node)
      const { width, height } = node
      this.width = width
      this.domHeight = height
      this.paddingPercent = height / (width / 100)
      this.transformX = `${-100 + this.paddingPercent}%`
      // const body = document.querySelector('body').getBoundingClientRect()
      // console.log('body', body)
      this.screenW = screen.width
      console.log('screenW', this.screenW);

    },
    onTouchStart(e) {
      console.log('start',e)
      const {clientX, clientY} = e.changedTouches[0]
      console.log('clientX', clientX, 'Y', clientY)
      this.startX = clientX
      this.startY = clientY
      this.onMoveing = true
    },
    onTouchMove(e) {
      console.log('move', e)
      if(!this.onMoveing) return
      const {clientX, clientY} = e.changedTouches[0]
      this.moveX = clientX
      this.moveY = clientY
      this.calculate()
    },
    onTouchEnd(e) {
      console.log('end', e)
      this.onMoveing = false
    },
    onTouchCancel(e) {
      console.log('cancel', e)
      this.onMoveing = false
    },
    calculate()  {
      console.log('this.moveX - this.startX', this.moveX - this.startX)
      const diffX = (this.moveX - this.startX) / this.screenW * this.width
      // const diffY = (this.moveY - this.startY) / this.height
      let value = 0
      if(diffX > 0) {
        value = 0
      } else if(diffX < -100 + this.paddingPercent) {
        value = -100 + this.paddingPercent
      } else {
        value = diffX
      }
      console.log('value', value)
      this.transformX = `${value}%`
      
      // this.transformY = diffY

    }


  },

}
</script>
<style scoped>
.slider {
  width: 300px;
  height: 26px;
  background-color: pink;
  padding: 0 13px;
}
.slider-outer {
  height: 26px;
  background-color: yellow;
  border-radius: 26px;
  overflow: hidden;
}
.slider-inner {
  height: 26px;
  background-color: gray;
  border-radius: 26px;
  /* transform: translateX(-50%); */
  position: relative;
}
.slider-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: red;
  position: absolute;
  top: 0;
  right: 0;
}
</style>