<template>
  <view class="list-wrap">
    <view class="item" v-for="(book, index) in bookList" :key="index" @click="goRead(book)">
      <view class="item-left">
        <text class="name">{{ book.displayName || book.name }}</text>
        <text class="desc">{{ book.desc }}</text>
      </view>
      <view class="item-right">
        <text class="download-btn" @click.stop="handleDownload(book)" :class="{ 'delete-btn': book.yixiazai }">
          {{ book.yixiazai ? '删除' : '下载' }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDownload } from '../../composables/useDownload.js'

const props = defineProps({
  title: String,
  bookData: Array
})

const bookList = ref([])
const { chuliXiazai, jianyixiazai } = useDownload(bookList)

const initBookList = () => {
  if (props.bookData && props.bookData.length > 0) {
    bookList.value = props.bookData.map(book => ({
      ...book,
      yixiazai: jianyixiazai(book.displayName || book.name)
    }))
  }
}

watch(() => props.bookData, initBookList, { immediate: true, deep: true })

const handleDownload = (book) => {
  chuliXiazai(book)
}

const goRead = (book) => {
  const name = book.displayName || book.name
  uni.navigateTo({
    url: `/pages/read/read?name=${encodeURIComponent(name)}`
  })
}
</script>

<style scoped>
.list-wrap {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.item {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dark .item {
  background: #222;
}
.item-left {
  flex: 1;
}
.name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
}
.dark .name {
  color: #eee;
}
.desc {
  font-size: 28rpx;
  color: #777;
  margin-top: 8rpx;
  display: block;
}
.dark .desc {
  color: #999;
}
.download-btn {
  font-size: 28rpx;
  padding: 10rpx 24rpx;
  background: #8c3d1e;
  color: #fff;
  border-radius: 8rpx;
}
.delete-btn {
  background: #999;
}
</style>
