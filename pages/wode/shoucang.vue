<template>
  <view class="page" :class="{ dark: isDark }">
    <view class="title">我的收藏</view>
    <view class="item" v-for="item in list" :key="item" @click="goRead(item)">
      {{ item }}
    </view>
    <view class="empty" v-if="list.length===0">暂无收藏</view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from '../../composables/useTheme.js'

const list = ref([])
const { isDark } = useTheme()

onMounted(() => {
  try {
    list.value = uni.getStorageSync('collect_list') || []
  } catch (e) {
    console.error('加载收藏失败', e)
    list.value = []
  }
})

const goRead = (name) => {
  uni.navigateTo({ url: `/pages/read/read?name=${encodeURIComponent(name)}` })
}
</script>

<style scoped>
.page { min-height:100vh; background:#f5efe6; padding:40rpx; }
.dark { background:#121212; }
.title { font-size:40rpx; font-weight:bold; margin-bottom:30rpx; color:#333; }
.dark .title { color:#e0e0e0; }
.item { background:#fff; padding:30rpx; border-radius:16rpx; margin-bottom:20rpx; color:#333; }
.dark .item { background:#222; color:#fff; }
.empty { color:#999; text-align:center; margin-top:60rpx; }
.dark .empty { color:#888; }
</style>