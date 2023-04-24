<template>
  <button class="g-button g-button-temp" @click="handleClick">
    <div class="g-button__content">
      <span v-if="value" class="g-button__text">{{value}}</span>
      <slot></slot>
      <!-- <g-tag></g-tag> -->
    </div>
  </button>
</template>
<script>
import {createNameSpace} from '../../../utils/index.js'
const [name] = createNameSpace('button')

// import gTag from '../../Tag'
export default {
  name,
  components: {
    // gTag
  },
  props: {
    value: String
  },
  created(){
    console.log('button-created');
  },
  mounted(){
    console.log('button-mounted');
  },
  methods: {
    handleClick() {
      console.log('handleClick');
      this.$emit('click')
    }
  },
}
</script>
<style lang="less">
@import './button.less';
// .g-button-temp {
//   margin: 4px 10px;
// }
</style>