<template>
  <transition :name="$mRouter.tn">
    <keep-alive :include="$mRouter.keepAlives">
      <slot></slot>
    </keep-alive>
  </transition>
</template>

<script>
export default {
  name: 'MRouter',
  watch: {
    '$mRouter.tn': (val,old) => {
      console.log('tn-change', val, old)
    }
  }
}
</script>
<style>
@import './index.css';
</style>