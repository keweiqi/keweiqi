<template>
  <view class="list-page" :class="{ dark: isDark }">
    <view class="header">
      <text class="title">真经典籍</text>
    </view>

    <view class="list-wrap">
      <view class="item" v-for="(book, index) in bookList" :key="index" @click="goRead(book.displayName)">
        <view class="item-left">
          <text class="name">{{ book.displayName }}</text>
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
import { getDaoJingList } from '../../utils/data.js'
import descriptions from '../../static/data/descriptions.js'
import { jianyixiazai, baocunjingwen, shanchujingwen, querenShanchu } from '../../utils/xiazai.js'
import { congYunduanHuoquJingwen } from '../../utils/yunshuju.js'

const { isDark } = useTheme()
const bookList = ref([])
const zhengzaixiazai = ref(false)

// 初始化书籍列表
const initBookList = () => {
  // 保持原有界面显示的两本经书
  const displayBooks = ['道德经', '太上老君说常清静经']
  const daoBooks = getDaoJingList()

  bookList.value = displayBooks.map(name => {
    const book = daoBooks.find(b => b.name === name) || { name }
    const displayName = name === '道德经' ? '道德真经' : name
    return {
      name: name,
      displayName: displayName,
      desc: descriptions[name] || descriptions[name.replace('经', '真经')] || '经典著作',
      yixiazai: jianyixiazai(displayName)
    }
  })

  // 如果没有找到匹配的，保持原样
  if (bookList.value.length === 0) {
    bookList.value = [
      { name: '道德经', displayName: '道德真经', desc: '老子著，万经之王，无为自然', yixiazai: false },
      { name: '太上老君说常清静经', displayName: '太上老君说常清静经', desc: '修道入门，清心寡欲，澄心遣欲', yixiazai: false }
    ]
  }
}

// 刷新下载状态
const shuangxinZhuangtai = () => {
  bookList.value.forEach(book => {
    book.yixiazai = jianyixiazai(book.displayName)
  })
}

// 处理下载/删除
const chuliXiazai = async (book) => {
  if (book.yixiazai) {
    // 已下载，执行删除
    const queren = await querenShanchu(book.displayName)
    if (queren) {
      const chenggong = shanchujingwen(book.displayName)
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
      const neirong = await congYunduanHuoquJingwen(book.displayName)
      if (neirong) {
        const chenggong = baocunjingwen(book.displayName, neirong)
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
  color: #2b582e;
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
