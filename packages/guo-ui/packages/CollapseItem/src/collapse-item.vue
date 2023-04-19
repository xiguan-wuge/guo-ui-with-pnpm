<template>
  <div class="g-collapse-item">
    <div class="g-collapse-item__header" 
      :class="{'g-collapse-item__header--disabled': disabled}" 
      @click="onClick">
      <div class="g-collapse-item__header_title">默认title</div>
      <div class="g-collapse-item__header_icon" 
        :class="{'g-collapse-item__header_icon-up': this.show}">^</div>
    </div>
    <div v-if="this.inited || !this.lazyRender">
      <div v-show="show" 
        ref="wrapper" 
        class="g-collapse-item__wrapper" 
        @transitionend="onTransitionEnd">
        <div class="g-collapse-item__content" ref="content">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {createNameSpace} from '../../../utils/index.js'
import { sortChildren } from '../../../utils/vnodes.js';
import { raf, doubleRaf } from '../../../utils/dom/raf';
const [name] = createNameSpace('collapse-item')
export default {
  name,
  props: {
    name: [Number, String],
    disabled: Boolean,
    lazyRender: {
      type: Boolean,
      default: true
    },
    isLink: {
      type: Boolean,
      default: true
    },
    title: {
      type: [String,Number],
      default: ''  
    },
    icon: {
      type: String,
      default: '',
    }
  },
  inject: {
    gCollapse: {
      default: null,
    },
  },
  data() {
    return {
      show: null,
      inited: null
    }
  },
  computed: {
    currentName() {
      return this.name ?? this.index
    },
    expanded() {
      if(!this.parent) {
        return null
      }

      const {value, accordion} = this.parent
      if(process.env.NODE_ENV === 'development' &&
        !accordion &&
        !Array.isArray(value)
      ) {
        console.error('[Vant] Collapse: type of prop "value" should be Array');
        return;
      }

      return accordion
        ? value === this.currentName
        : value.some(name => name === this.currentName)
    },
    parent() {
      if (this.disableBindRelation) {
        return null;
      }

      return this.gCollapse;
    },
    index() {
      this.bindRelation();

      if (this.parent) {
        return this.parent.children.indexOf(this);
      }

      return null;
    },
  },
  watch: {
    expanded(expanded, prev) {
      if (prev === null) {
        return;
      }

      if (expanded) {
        this.show = true;
        this.inited = true;
      }

      // Use raf: flick when opened in safari
      // Use nextTick: closing animation failed when set `user-select: none`
      const nextTick = expanded ? this.$nextTick : raf;

      nextTick(() => {
        const { content, wrapper } = this.$refs;

        if (!content || !wrapper) {
          return;
        }

        const { offsetHeight } = content;
        if (offsetHeight) {
          const contentHeight = `${offsetHeight}px`;
          wrapper.style.height = expanded ? 0 : contentHeight;

          // use double raf to ensure animation can start
          doubleRaf(() => {
            wrapper.style.height = expanded ? contentHeight : 0;
          });
        } else {
          this.onTransitionEnd();
        }
      });
    },
  },
  created() {
    this.show = this.expanded
    this.inited = this.expanded
  },
  mounted() {
    this.bindRelation();
  },
  beforeDestroy() {
    if (this.parent) {
      this.parent.children = this.parent.children.filter(
        (item) => item !== this
      );
    }
  },

  methods: {
    // 调整父元素children顺序与展示
    bindRelation() {
      if (!this.parent || this.parent.children.indexOf(this) !== -1) {
        return;
      }

      const children = [...this.parent.children, this];

      sortChildren(children, this.parent);

      this.parent.children = children;
    },
    onClick() {
      if(!this.disabled) {
        this.toggle()
      }
    },
    toggle(expanded = !this.expanded) {
      const {parent, currentName} = this
      const close = parent.accordion && currentName === parent.value
      const name = close ? '' : currentName
      
      this.parent.switch(name, expanded)
    },
    onTransitionEnd() {
      if(!this.expanded) {
        this.show = false
      } else {
        this.$refs.wrapper.style.height = ''
      }
    }
  },
}
</script>
<style lang="less" scoped>
@import './collapse-item.less';
</style>