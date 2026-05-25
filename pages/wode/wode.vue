<template>
  <view class="mine-wrap" :class="{ dark: isDark }">
    <!-- 未登录状态 -->
    <view v-if="!isLoggedIn" class="not-login">
      <view class="login-prompt" @click="goLogin">
        <image class="avatar" src="/static/icons/chanyi.png"></image>
        <view class="login-text">
          <text class="title">点击登录</text>
          <text class="desc">登录后同步您的收藏和阅读历史</text>
        </view>
      </view>
    </view>

    <!-- 已登录状态 -->
    <view v-else class="user-info">
      <view class="user-head">
        <image class="avatar" :src="user.avatar || '/static/icons/chanyi.png'"></image>
        <view class="info">
          <text class="name">{{ user.nickname || user.username }}</text>
          <text class="desc">{{ user.username }}</text>
        </view>
        <view class="logout-btn" @click="handleLogout">退出</view>
      </view>
    </view>

    <view class="menu">
      <view class="item" @click="goNotes">
        <text class="item-icon">📝</text>
        <text class="item-text">个人心得</text>
        <text class="item-arrow">›</text>
      </view>
      <view class="item" @click="goCollect">
        <text class="item-icon">★</text>
        <text class="item-text">我的收藏</text>
        <text class="item-arrow">›</text>
      </view>
      <view class="item" @click="goHistory">
        <text class="item-icon">📚</text>
        <text class="item-text">阅读历史</text>
        <text class="item-arrow">›</text>
      </view>
      <view class="item" @click="switchTheme">
        <text class="item-icon">🌙</text>
        <text class="item-text">切换主题</text>
        <text class="item-arrow">›</text>
      </view>
      <view class="item" @click="clearCache">
        <text class="item-icon">🧹</text>
        <text class="item-text">清理缓存</text>
        <text class="item-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useTheme } from '../../composables/useTheme.js'
import { useUser } from '../../composables/useUser.js'

const { isDark, toggleTheme } = useTheme()
const { isLoggedIn, user, logout, loadUser } = useUser()

const goLogin = () => uni.navigateTo({ url: '/pages/wode/login' })
const goNotes = () => uni.navigateTo({ url: '/pages/wode/wodebiji' })
const goCollect = () => uni.navigateTo({ url: '/pages/wode/shoucang' })
const goHistory = () => uni.navigateTo({ url: '/pages/wode/yuedulishi' })
const switchTheme = toggleTheme

const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出吗？',
    success: (res) => {
      if (res.confirm) {
        logout()
      }
    }
  })
}

const clearCache = () => {
  uni.showModal({
    title: '清理缓存',
    content: '确定清空？',
    success: (res) => {
      if (res.confirm) {
        try {
          uni.clearStorageSync()
          uni.showToast({ title: '清理完成', icon: 'success' })
          // 重新加载用户状态
          setTimeout(() => {
            loadUser()
          }, 500)
        } catch (e) {
          console.error('清理缓存失败', e)
          uni.showToast({ title: '清理失败', icon: 'none' })
        }
      }
    }
  })
}
</script>

<style scoped>
.mine-wrap {
  min-height: 100vh;
  background: #f5efe6;
  padding: 40rpx;
}
.dark {
  background: #121212;
}

/* 未登录状态 */
.not-login {
  margin-bottom: 40rpx;
}
.login-prompt {
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
}
.dark .login-prompt {
  background: #222;
}
.login-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.login-text .title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
.dark .login-text .title {
  color: #e0e0e0;
}
.login-text .desc {
  font-size: 24rpx;
  color: #999;
}
.dark .login-text .desc {
  color: #aaa;
}

/* 已登录状态 */
.user-info {
  margin-bottom: 40rpx;
}
.user-head {
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  display: flex;
  align-items: center;
}
.dark .user-head {
  background: #222;
}
.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}
.dark .name {
  color: #e0e0e0;
}
.desc {
  font-size: 26rpx;
  color: #999;
}
.dark .desc {
  color: #aaa;
}
.logout-btn {
  font-size: 28rpx;
  color: #8c3d1e;
  padding: 16rpx 32rpx;
  border: 2rpx solid #8c3d1e;
  border-radius: 40rpx;
}

/* 通用 */
.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
}
.menu {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.item {
  background: #fff;
  padding: 30rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.dark .item {
  background: #222;
}
.item-icon {
  font-size: 40rpx;
}
.item-text {
  flex: 1;
  font-size: 32rpx;
  color: #333;
}
.dark .item-text {
  color: #e0e0e0;
}
.item-arrow {
  font-size: 48rpx;
  color: #ccc;
}
</style>
