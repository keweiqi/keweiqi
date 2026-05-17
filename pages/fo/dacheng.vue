<template>
  <view class="list-page" :class="{ dark: isDark }">
    <view class="header">
      <text class="title">大乘经典</text>
    </view>

    <view class="list-wrap">
      <view class="item" v-for="(book, index) in bookList" :key="index" @click="goRead(book.name)">
        <view class="item-left">
          <text class="name">{{ book.name }}</text>
          <text class="desc">{{ book.desc }}</text>
        </view>
        <view class="item-right">
          <text class="download-btn" @click.stop="chuliXiazai(book)" :class="{ 'delete-btn': book.yixiazai }">
            {{ book.yixiazai ? '删除' : '下载' }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from '../../composables/useTheme.js'
import { jianyixiazai, baocunjingwen, shanchujingwen, querenShanchu } from '../../utils/xiazai.js'
import { congYunduanHuoquJingwen } from '../../utils/yunshuju.js'
import descriptions from '../../static/data/descriptions.js'

const { isDark } = useTheme()
const bookList = ref([])
const zhengzaixiazai = ref(false)

// 初始化书籍列表
const initBookList = () => {
  const displayBooks = [
    '般若波罗蜜多心经',
    '金刚般若波罗蜜经',
    '妙法莲华经',
    '大佛顶首楞严经'
  ]

  bookList.value = displayBooks.map(name => ({
    name: name,
    desc: descriptions[name] || '经典著作',
    yixiazai: jianyixiazai(name)
  }))
}

// 刷新下载状态
const shuangxinZhuangtai = () => {
  bookList.value.forEach(book => {
    book.yixiazai = jianyixiazai(book.name)
  })
}

// 处理下载/删除
const chuliXiazai = async (book) => {
  if (book.yixiazai) {
    // 已下载，执行删除
    const queren = await querenShanchu(book.name)
    if (queren) {
      const chenggong = shanchujingwen(book.name)
      if (chenggong) {
        shuangxinZhuangtai()
        uni.showToast({ title: '已删除', icon: 'success' })
      }
    }
  } else {
    // 未下载，执行下载
    if (zhengzaixiazai.value) {
      return
    }
    zhengzaixiazai.value = true
    uni.showLoading({ title: '下载中...' })

    try {
      const neirong = await congYunduanHuoquJingwen(book.name)
      if (neirong) {
        const chenggong = baocunjingwen(book.name, neirong)
        if (chenggong) {
          shuangxinZhuangtai()
        }
      } else {
        uni.showToast({ title: '下载失败', icon: 'none' })
      }
    } catch (e) {
      console.error('下载失败', e)
      uni.showToast({ title: '下载失败', icon: 'none' })
    } finally {
      zhengzaixiazai.value = false
      uni.hideLoading()
    }
  }
}

const goRead = (name) => {
  uni.navigateTo({
    url: `/pages/read/read?name=${encodeURIComponent(name)}`
  })
}

onMounted(() => {
  initBookList()
})
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
  color: #8b4513;
}
.dark .title {
  color: #e0e0e0;
}
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
