<template>
  <view class="mine-wrap" :class="{ dark: isDark }">
    <view class="user-head">
      <image class="avatar" src="/static/icons/chanyi.png"></image>
      <view>
        <text class="name">静悟居士</text>
        <text class="desc">静心读典，修身自省</text>
      </view>
    </view>

    <view class="menu">
      <view class="item" @click="goCollect">我的收藏</view>
      <view class="item" @click="goHistory">阅读历史</view>
      <view class="item" @click="switchTheme">切换主题</view>
      <view class="item" @click="clearCache">清理缓存</view>
    </view>
  </view>
</template>

<script setup>
import { useTheme } from '../../composables/useTheme.js'

const { isDark, toggleTheme } = useTheme()

const goCollect = () => uni.navigateTo({ url:'/pages/wode/shoucang' })
const goHistory = () => uni.navigateTo({ url:'/pages/wode/yuedulishi' })
const switchTheme = toggleTheme

const clearCache = () => {
  uni.showModal({
    title:'清理缓存',
    content:'确定清空？',
    success:res=>{
      if(res.confirm){
        try {
          uni.clearStorageSync()
          uni.showToast({title:'清理完成'})
        } catch (e) {
          console.error('清理缓存失败', e)
          uni.showToast({title:'清理失败', icon:'none'})
        }
      }
    }
  })
}
</script>

<style scoped>
.mine-wrap { min-height:100vh; background:#f5efe6; padding:40rpx; }
.dark { background:#121212; }
.user-head { display:flex; align-items:center; margin-bottom:40rpx; }
.avatar { width:120rpx; height:120rpx; border-radius:50%; margin-right:20rpx; }
.name { font-size:36rpx; font-weight:bold; color:#333; }
.dark .name { color:#e0e0e0; }
.desc { font-size:26rpx; color:#888; }
.dark .desc { color:#aaa; }
.menu { display:flex; flex-direction:column; gap:20rpx; }
.item { background:#fff; padding:30rpx; border-radius:16rpx; font-size:32rpx; color:#333; }
.dark .item { background:#222; color:#fff; }
</style>