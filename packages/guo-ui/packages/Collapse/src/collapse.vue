<template>
  <div class="g-collpase">
    <slot></slot>
  </div>
</template>

<script>
import {createNameSpace} from '../../../utils/index.js'
const [name] = createNameSpace('collapse')
export default {
  name,
  props: {
    accordion: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Array],
      default: () => []
    },
    border: {
      type: Boolean,
      default: true
    },
  },
  provide(){
    return {
      gCollapse: this
    }
  },
  data() {
    return {
      children: []
    }
  },
  methods: {
    switch(name, expand) {
      if(!this.accordion) {
        name = expand
          ? this.value.concat(name)
          : this.value.filter(activeName => activeName !== name)
      }
      this.$emit('change', name)
      this.$emit('input', name)
    }
  },
  // render() {
  //   return (
  //     <div class="g-collapse">
  //       {this.slots()}
  //     </div>
  //   )
  // }
}
</script>