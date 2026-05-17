<template>
  <view class="bread-crumb">
    <!-- 遍历面包屑路径列表 -->
    <block v-for="(item, index) in breadList" :key="index">
      <text 
        class="crumb-text" 
        :class="{last: index === breadList.length - 1}"
        @click="goPage(item.path, index)"
      >
        {{ item.name }}
      </text>
      <!-- 分隔符 → 最后一个不显示 -->
      <text class="arrow" v-if="index < breadList.length - 1">→</text>
    </block>
  </view>
</template>

<script>
export default {
  props: {
    // 传入路径数组：[{name:'标题', path:'页面路径'}]
    breadList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    goPage(path, index) {
      // 最后一级不允许点击
      if (index === this.breadList.length - 1) return;
      // 无路径只做展示，不跳转
      if (!path) return;
      // 跳转对应页面
      uni.navigateTo({
        url: path
      })
    }
  }
}
</script>

<style scoped>
.bread-crumb {
  padding: 25rpx 30rpx;
  background: rgba(255,255,255,0.6);
  border-radius: 12rpx;
  margin: 20rpx 30rpx;
}
.crumb-text {
  font-size: 26rpx;
  color: #888;
}
/* 当前最后一级加深高亮 */
.crumb-text.last {
  color: #5c3c21;
  font-weight: 500;
}
.arrow {
  font-size: 26rpx;
  color: #bbb;
  margin: 0 10rpx;
}
</style>