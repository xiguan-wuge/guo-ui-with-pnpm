<template>
  <div class="hello" ref="scrollContainer">
    <h1>{{ msg }}</h1>

    <g-button @click="handleButtonClick" :value="buttonValue">buttonValue</g-button>
    <g-tag></g-tag>
    <!-- <g-slider></g-slider> -->
    <!-- <p>configProvider包装button:</p>
    <g-config-provider tag="span" :themeVar="buttonTheme" className="config-p config-p2">
      <g-button>inner Button</g-button>
    </g-config-provider>
    <button @click="toggleTheme('')">切换主题：{{theme}}</button>
    <br>
    <button @click="toggleTheme('green')">切换自定义主题green：{{theme}}</button> -->
    <p>测试图片懒加载</p>
    <img v-for="img in list" v-lazy="img" :key="img" class="lazyload-img"/>

    <p>测试组件懒加载</p>
    <g-lazy-component @show="handleLazyComponent" class="week-rank">
      <g-button @click="handleButtonClick2" :value="buttonValue">buttonValueLazy</g-button>
    </g-lazy-component>
    <!-- 折叠面板 -->
    <!-- <g-collapse v-model="activeNames">
      <g-collapse-item title="标题1" name="1">内容</g-collapse-item>
      <g-collapse-item title="标题2" name="2">内容</g-collapse-item>
      <g-collapse-item title="标题3" name="3" disabled>内容</g-collapse-item>
    </g-collapse> -->
    <!-- <wconsole></wconsole> -->
  </div>
</template>

<script>
import {list} from '@/assets/imageList'
// import wconsole from './wconsole/wconsole.vue'
export default {
  name: 'HelloWorld',
  components: {
    // wconsole
  },
  props: {
    msg: String
  },

  
  data() {
    return {
      theme: 'default',
      buttonValue: '',
      list,
      activeNames: ['1']
    }
  },
  created() {
    this.buttonTheme = {
      buttonColor: 'blue'
    }
  },
  mounted() {
    this.htmlEl = document.documentElement
    // 监听系统主题切换
    this.themeMedia = window.matchMedia("(prefers-color-scheme: light)");
    console.log('themeMedia', this.themeMedia);
    this.listner = e => {
      console.log('e.matches', e.matches);
      this.theme = e.matches ? 'default' : 'dark'
      this.toggleTheme(this.theme)
    }
    this.themeMedia.addListener(
      this.listner
    );
    // 监听 orientation changes
//     window.addEventListener("orientationchange", function(event) {
//       console.log('event111', event)
//     // 根据event.orientation|screen.orientation.angle等于0|180、90|-90度来判断横竖屏
//     }, false);

//     var eventType = 'orientationchange';
// // 触发原生orientationchange
// const win = window
// var fire = function() {
//   var e;
//   if (document.createEvent) {
//     e = document.createEvent('HTMLEvents');
//     e.initEvent(eventType, true, false);
//     win.dispatchEvent(e);
//   } else {
//     e = document.createEventObject();
//     e.eventType = eventType;
//     if (win[eventType]) {
//       win[eventType]();
//     } else if (win['on' + eventType]) {
//       win['on' + eventType]();
//     } else {
//       win.fireEvent(eventType, e);
//     }
//   }
// }
// fire()
  },
  beforeDestroy() {
    if(this.themeMedia && typeof this.themeMedia === 'function'){
      this.themeMedia.removeListener(
        this.listner
      );
    }
    
  },
  methods: {
    handleButtonClick() {
      console.log('handleButtonClick')
      this.$router.push({
        name: 'mRouterPage1'
      })
    },
    handleButtonClick2() {
      console.log('handleButtonClick')
      this.$router.replace({
        name: 'mRouterPage1'
      })
    },
    toggleTheme(theme) {
      console.log('toggleTheme', theme);
      if(theme) {
        this.theme = theme
      } else {
        this.theme = this.theme === 'default' ? 'dark' : 'default'
      }
      this.htmlEl.setAttribute('data-theme', this.theme)
    },
    handleLazyComponent(val) {
      console.log('handleLazyComponent', val)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.hello {
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.config-p {
  display: inline-block;
}
.config-p2 {
  font-size: 18px;
}
</style>

<style lang="less">
// 使用css变量覆盖全局样式
:root {
  --g-button-color: red;
}
.lazyload-img {
  box-sizing: border-box;
  width: 100%;
  height: auto;
  margin-bottom: 16px;
  padding: 16px;
  background-color: pink;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 12px;
}
</style>