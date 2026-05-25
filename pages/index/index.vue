<template>
  <view class="home-page" :class="{ dark: isDark }" :style="{backgroundImage: 'url(/static/icons/beijing01.png)'}">
    <view class="header">
      <text class="title">静悟</text>
    </view>

    <!-- 两大入口 -->
    <view class="entry-wrap">
      <view class="entry-item dao touch-feedback" @click="goDaoList">
        <image 
          class="entry-icon" 
          src="/static/icons/xiangyun.png" 
          mode="aspectFit"
        ></image>
        <view class="entry-text">道藏经典</view>
      </view>

      <view class="entry-item fo touch-feedback" @click="goFoList">
        <image 
          class="entry-icon" 
          src="/static/icons/xianglu.png" 
          mode="aspectFit"
        ></image>
        <view class="entry-text">大藏经论</view>
      </view>
    </view>

    <!-- 预留入口提示（后期开发） -->
    <view class="future-entry">
      <text class="future-text">更多经典正在开发中...</text>
    </view>
  </view>
</template>

<script setup>
import { useTheme } from '../../composables/useTheme.js'

const { isDark } = useTheme()

const goDaoList = () => {
  uni.navigateTo({
    url: '/pages/liebiao/dao-list'
  })
}

const goFoList = () => {
  uni.navigateTo({
    url: '/pages/liebiao/fo-list'
  })
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  padding: 40rpx;
  padding-bottom: 120rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f8f3e8;
  transition: background-color 0.3s ease;
}

.dark {
  background-color: #121212 !important;
  background-image: none !important;
}

.header {
  text-align: center;
  margin-top: 120rpx;
  margin-bottom: 120rpx;
}

.title {
  font-size: 60rpx;
  font-weight: bold;
  color: #2b582e;
  transition: color 0.3s ease;
}

.dark .title {
  color: #e0e0e0;
}

.entry-wrap {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  gap: 40rpx;
  flex-wrap: wrap;
}

.entry-item {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 30rpx;
  padding: 50rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  min-width: 200rpx;
  transition: background-color 0.3s ease;
}

.dark .entry-item {
  background: rgba(0, 0, 0, 0.2);
}

.entry-icon {
  width: 140rpx;
  height: 140rpx;
  margin-bottom: 20rpx;
  transition: transform 0.2s ease;
}

.entry-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.dark .entry-text {
  color: #eee;
}

.touch-feedback:active {
  opacity: 0.8;
  transform: scale(0.96);
}

.future-entry {
  text-align: center;
  margin-top: 80rpx;
}

.future-text {
  font-size: 28rpx;
  color: #999;
  letter-spacing: 2rpx;
}

.dark .future-text {
  color: #666;
}
</style>