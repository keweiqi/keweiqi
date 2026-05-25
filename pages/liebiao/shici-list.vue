<template>
  <view class="list-page" :class="{ dark: isDark }">
    <view class="header">
      <text class="title">诗词经典</text>
    </view>

    <view class="coming-soon-wrap">
      <text class="emoji">🌿</text>
      <text class="main-text">内容开发中</text>
      <text class="sub-text">敬请期待...</text>
      <text class="hint">后期云端开放后即可使用</text>
    </view>
  </view>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme.js'

const { isDark } = useTheme()
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

.coming-soon-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 200rpx;
  gap: 20rpx;
}

.emoji {
  font-size: 120rpx;
  opacity: 0.6;
}

.main-text {
  font-size: 48rpx;
  font-weight: bold;
  color: #666;
  letter-spacing: 8rpx;
}

.dark .main-text {
  color: #999;
}

.sub-text {
  font-size: 36rpx;
  color: #888;
  letter-spacing: 4rpx;
}

.dark .sub-text {
  color: #777;
}

.hint {
  font-size: 28rpx;
  color: #aaa;
  margin-top: 40rpx;
  padding: 20rpx 40rpx;
  background: rgba(0,0,0,0.05);
  border-radius: 30rpx;
}

.dark .hint {
  color: #666;
  background: rgba(255,255,255,0.05);
}
</style>
