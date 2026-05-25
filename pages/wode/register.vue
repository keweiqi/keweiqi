<template>
  <view class="register-wrap" :class="{ dark: isDark }">
    <view class="header">
      <view class="back-icon" @click="goBack">←</view>
      <text class="title">注册</text>
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
          placeholder="请输入账号（至少3个字符）" 
          placeholder-class="placeholder"
        />
      </view>

      <view class="input-group">
        <text class="label">昵称</text>
        <input 
          class="input" 
          v-model="nickname" 
          placeholder="请输入昵称（选填）" 
          placeholder-class="placeholder"
        />
      </view>

      <view class="input-group">
        <text class="label">密码</text>
        <input 
          class="input" 
          v-model="password" 
          type="password"
          placeholder="请输入密码（至少6个字符）" 
          placeholder-class="placeholder"
        />
      </view>

      <view class="input-group">
        <text class="label">确认密码</text>
        <input 
          class="input" 
          v-model="confirmPassword" 
          type="password"
          placeholder="请再次输入密码" 
          placeholder-class="placeholder"
        />
      </view>

      <button class="register-btn" @click="handleRegister" :disabled="loading">
        {{ loading ? '注册中...' : '注册' }}
      </button>

      <view class="footer">
        <text class="link" @click="goLogin">已有账号？去登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from '../../composables/useTheme.js'
import { useUser } from '../../composables/useUser.js'

const { isDark } = useTheme()
const { register } = useUser()

const username = ref('')
const nickname = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const goBack = () => uni.navigateBack()
const goLogin = () => uni.navigateBack()

const handleRegister = async () => {
  if (!username.value || !password.value) {
    uni.showToast({ title: '请填写账号和密码', icon: 'none' })
    return
  }

  if (password.value !== confirmPassword.value) {
    uni.showToast({ title: '两次密码输入不一致', icon: 'none' })
    return
  }

  loading.value = true
  uni.showLoading({ title: '注册中...' })

  try {
    const result = await register(username.value, password.value, nickname.value || username.value)
    uni.hideLoading()
    
    if (result.success) {
      uni.showToast({ title: result.message, icon: 'success' })
      setTimeout(() => {
        uni.switchTab({ url: '/pages/wode/wode' })
      }, 1000)
    } else {
      uni.showToast({ title: result.message, icon: 'none' })
    }
  } catch (e) {
    uni.hideLoading()
    uni.showToast({ title: '注册失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-wrap {
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
  margin-bottom: 60rpx;
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
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  margin-bottom: 20rpx;
}
.app-name {
  font-size: 44rpx;
  font-weight: bold;
  color: #2b582e;
  margin-bottom: 60rpx;
}
.dark .app-name {
  color: #e0e0e0;
}
.input-group {
  width: 100%;
  margin-bottom: 24rpx;
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
.register-btn {
  width: 100%;
  height: 90rpx;
  background: #8c3d1e;
  color: #fff;
  border: none;
  border-radius: 16rpx;
  font-size: 32rpx;
  margin-top: 30rpx;
}
.register-btn[disabled] {
  opacity: 0.6;
}
.footer {
  margin-top: 50rpx;
}
.link {
  color: #8c3d1e;
  font-size: 28rpx;
}
</style>
