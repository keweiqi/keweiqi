<template>
  <view class="list-page" :class="{ dark: isDark }">
    <view class="header">
      <text class="title">大藏经论</text>
    </view>

    <view class="menu-wrap">
      <view class="menu-item touch-feedback" @click="goTo('dacheng')">
        <text class="icon">📿</text>
        <text class="text">大乘经典</text>
      </view>

      <view class="menu-item touch-feedback" @click="goTo('lvbu')">
        <text class="icon">🛡️</text>
        <text class="text">律部典籍</text>
      </view>

      <view class="menu-item touch-feedback" @click="goTo('lunzhu')">
        <text class="icon">📖</text>
        <text class="text">先贤论著</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useTheme } from '../../composables/useTheme.js'

const { isDark } = useTheme()

  // 后续这里填列表页路径
const goTo = (type) => {
  switch(type){
    case 'dacheng':
      uni.navigateTo({url:'/pages/fo/dacheng'})
      break
    case 'lvbu':
      uni.navigateTo({url:'/pages/fo/lvbu'})
      break
    case 'lunzhu':
      uni.navigateTo({url:'/pages/fo/lunzhu'})
      break
  }
}
</script>

<style scoped>
.list-page {
  min-height: 100vh;
  background-color: #f5efe6;
  padding: 30rpx;
  transition: all 0.3s ease;
}

.header {
  text-align: center;
  margin: 40rpx 0 80rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #684526;
}

.menu-wrap {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.menu-item {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08);
}

.icon {
  font-size: 44rpx;
  margin-right: 24rpx;
}

.text {
  font-size: 34rpx;
  font-weight: 500;
  color: #333;
}

/* 暗黑模式 */
.dark {
  background-color: #121212;
}

.dark .title {
  color: #e0e0e0;
}

.dark .menu-item {
  background: #1e1e1e;
  color: #eee;
}

.dark .text {
  color: #eee;
}

/* 点击效果 */
.touch-feedback:active {
  transform: scale(0.97);
  opacity: 0.9;
}
</style>