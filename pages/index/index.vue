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
  </view>
</template>

<script setup>
import { useTheme } from '../../composables/useTheme.js'

const { isDark } = useTheme()

// 跳转道教分类页
const goDaoList = () => {
  uni.navigateTo({
    url: '/pages/liebiao/dao-list'
  })
}

// 跳转佛教分类页
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

/* 暗黑模式背景 */
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
  background: transparent;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  min-width: 200rpx;
}

.entry-icon {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 20rpx;
  transition: transform 0.2s ease;
}

.entry-icon:active {
  transform: scale(0.95);
}

.entry-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.dark .entry-text {
  color: #eee;
}

/* 点击反馈 */
.touch-feedback:active {
  opacity: 0.8;
  transform: scale(0.96);
}
</style>