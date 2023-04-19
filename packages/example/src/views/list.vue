<template>
  <div class="list-demo">
    list-demo
    <g-list 
      v-model="loading" 
      :loading="loading" 
      :finished="finished" 
      finished-text="没有更多了" 
      :refreshed.sync="refreshed"
      successText="刷新成功"
      @load="onLoad" 
      @refresh="onRefresh"
      ref="list">
      <p class="p-item" v-for="(item, index) in list" :key="index">{{item}}</p>
    </g-list>
  </div>
</template>

<script>
const initList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12, 13, 14, 15, 16, 17, 18, 19, 20]
export default {
  name: "list-demo",
  data() {
    return {
      list: initList,
      loading: false,
      finished: false,
      refreshed: 'normal'
    };
  },
  methods: {
    onLoad() {
      console.log("onLoad");
      setTimeout(() => {
        const len = this.list.length
        for (let i = 0; i < 5; i++) {
          this.list.push('pushed'+(len + i));
        }

        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 1000);
    },
    onRefresh() {
      console.log('onRefresh', this.refreshed);
      // this.refreshed = true
      setTimeout(() => {
        this.list = initList
        this.refreshed = 'refreshed'
        console.log('onRefresh----', this.refreshed);
        
      }, 1000)
      
    }
  }
};
</script>
<style lang="less" scoped>
.list-demo {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
</style>