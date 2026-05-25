<template>
  <view class="login-wrap" :class="{ dark: isDark }">
    <view class="header">
      <view class="back-icon" @click="goBack">←</view>
      <text class="title">登录</text>
      <view style="width: 80rpx;"></view>
    </view>

    <view class="form-wrap">
      <image class="logo" src="/static/icons/app.png"></image>
      <text class="app-name">静悟</text>

      <view class="input-group">
        <text class="label">账号</text>
        <input 
          class="input" 
          v-model="username" 
          placeholder="请输入账号" 
          placeholder-class="placeholder"
        />
      </view>

      <view class="input-group">
        <text class="label">密码</text>
        <input 
          class="input" 
          v-model="password" 
          type="password"
          placeholder="请输入密码" 
          placeholder-class="placeholder"
        />
      </view>

      <button class="login-btn" @click="handleLogin" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>

      <view class="footer">
        <text class="link" @click="goRegister">还没有账号？去注册</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from '../../composables/useTheme.js'
import { useUser } from '../../composables/useUser.js'

const { isDark } = useTheme()
const { login } = useUser()

const username = ref('')
const password = ref('')
const loading = ref(false)

const goBack = () => uni.navigateBack()
const goRegister = () => uni.navigateTo({ url: '/pages/wode/register' })

const handleLogin = async () => {
  if (!username.value || !password.value) {
    uni.showToast({ title: '请填写账号和密码', icon: 'none' })
    return
  }

  loading.value = true
  uni.showLoading({ title: '登录中...' })

  try {
    const result = await login(username.value, password.value)
    uni.hideLoading()
    
    if (result.success) {
      uni.showToast({ title: result.message, icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1000)
    } else {
      uni.showToast({ title: result.message, icon: 'none' })
    }
  } catch (e) {
    uni.hideLoading()
    uni.showToast({ title: '登录失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  background: #f5efe6;
  padding: 40rpx;
}
.dark {
  background: #121212;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 80rpx;
}
.back-icon {
  font-size: 48rpx;
  color: #333;
}
.dark .back-icon {
  color: #e0e0e0;
}
.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}
.dark .title {
  color: #e0e0e0;
}
.form-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.logo {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  margin-bottom: 20rpx;
}
.app-name {
  font-size: 48rpx;
  font-weight: bold;
  color: #2b582e;
  margin-bottom: 80rpx;
}
.dark .app-name {
  color: #e0e0e0;
}
.input-group {
  width: 100%;
  margin-bottom: 30rpx;
}
.label {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 10rpx;
}
.dark .label {
  color: #aaa;
}
.input {
  width: 100%;
  height: 90rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 0 30rpx;
  font-size: 32rpx;
  color: #333;
  box-sizing: border-box;
}
.dark .input {
  background: #222;
  color: #e0e0e0;
}
.placeholder {
  color: #aaa;
}
.login-btn {
  width: 100%;
  height: 90rpx;
  background: #8c3d1e;
  color: #fff;
  border: none;
  border-radius: 16rpx;
  font-size: 32rpx;
  margin-top: 40rpx;
}
.login-btn[disabled] {
  opacity: 0.6;
}
.footer {
  margin-top: 60rpx;
}
.link {
  color: #8c3d1e;
  font-size: 28rpx;
}
</style>
