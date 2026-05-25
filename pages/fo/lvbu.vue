<template>
  <view class="list-page" :class="{ dark: isDark }">
    <view class="header">
      <text class="title">律部典籍</text>
    </view>
    <book-list :bookData="bookData" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from '../../composables/useTheme.js'
import { foBooks } from '../../static/data/jingdian.js'

const { isDark } = useTheme()
const bookData = ref(foBooks.lvbu)
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
</style>
