<template>
  <view class="list-page" :class="{ dark: isDark }">
    <view class="header">
      <text class="title">道藏经典</text>
    </view>

    <view class="menu-wrap">
      <view class="menu-item touch-feedback" @click="goTo('zhenjing')">
        <text class="icon">📿</text>
        <text class="text">真经典籍</text>
      </view>

      <view class="menu-item touch-feedback" @click="goTo('weiyi')">
        <text class="icon">🛡️</text>
        <text class="text">义理精华</text>
      </view>

      <view class="menu-item touch-feedback" @click="goTo('xiushen')">
        <text class="icon">📖</text>
        <text class="text">修身养性</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme.js'

const { isDark } = useTheme()

const goTo = (type) => {
  uni.navigateTo({
    url: `/pages/dao/${type}`
  })
}
</script>

<style scoped>
.list-page {
  min-height: 100vh;
  background-color: #f5efe6;
  padding: 40rpx;
}
.dark {
  background-color: #121212;
}

.header {
  text-align: center;
  margin: 40rpx 0 60rpx;
}
.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #2b582e;
}
.dark .title {
  color: #e0e0e0;
}

/* 菜单布局 */
.menu-wrap {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}
.menu-item {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 36rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
}
.dark .menu-item {
  background: #1e1e1e;
}

.icon {
  font-size: 40rpx;
}
.text {
  font-size: 34rpx;
  font-weight: 500;
  color: #333;
}
.dark .text {
  color: #eee;
}

/* 点击反馈 */
.touch-feedback {
  transition: opacity 0.2s;
}
.touch-feedback:active {
  opacity: 0.7;
}
</style>