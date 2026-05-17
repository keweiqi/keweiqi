<template>
  <view class="read-page" :class="{ dark: isDark }">
    <view class="read-bar">
      <view class="back" @click="goBack">← 返回</view>
      <view class="title">{{ bookName }}</view>
      <view class="tools">
        <text class="icon" @click="toggleFont">Aa</text>
        <text class="icon" @click="toggleCollect">{{ collected ? '★' : '☆' }}</text>
        <!-- 下载/删除按钮 -->
        <text class="icon" @click="chuliXiazai">{{ yixiazai ? '删除' : '下载' }}</text>
      </view>
    </view>

    <view class="font-bar" v-show="showFontBar">
      <text @click="setFont(28)">小</text>
      <text @click="setFont(32)">中</text>
      <text @click="setFont(36)">大</text>
      <text @click="setFont(40)">超大</text>
    </view>

    <scroll-view scroll-y class="content-view">
      <view class="article" :style="{ fontSize: fontSize + 'rpx' }" :class="isDark ? 'dark-text' : ''">
        {{ content }}
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from '../../composables/useTheme.js'
import { getArticleContent } from '../../utils/data.js'
import { jianyixiazai, baocunjingwen, shanchujingwen, querenShanchu } from '../../utils/xiazai.js'
import { congYunduanHuoquJingwen } from '../../utils/yunshuju.js'

const bookName = ref('')
const content = ref('加载中...')
const showFontBar = ref(false)
const fontSize = ref(32)
const collected = ref(false)
const yixiazai = ref(false)
const zhengzaixiazai = ref(false)

const { isDark } = useTheme()

// 读取本地数据（收藏、历史、字号）
const loadLocalData = () => {
  try {
    const size = uni.getStorageSync('font_size')
    if (size) fontSize.value = size
  } catch (e) {
    console.error('加载本地数据失败', e)
  }
}

// 加载经文内容
const loadArticle = async (name) => {
  try {
    content.value = '加载中...'
    const neirong = await getArticleContent(name)
    content.value = neirong
  } catch (e) {
    console.error('加载经文失败', e)
    content.value = '加载失败，请重试'
  }
}

// 保存阅读历史
const saveHistory = (name) => {
  try {
    let history = uni.getStorageSync('read_history') || []
    history = history.filter(i => i !== name)
    history.unshift(name)
    uni.setStorageSync('read_history', history)
  } catch (e) {
    console.error('保存历史失败', e)
  }
}

// 检查是否已收藏
const checkCollected = (name) => {
  try {
    let collects = uni.getStorageSync('collect_list') || []
    collected.value = collects.includes(name)
  } catch (e) {
    console.error('检查收藏失败', e)
  }
}

// 检查是否已下载
const jianchaXiazai = (name) => {
  yixiazai.value = jianyixiazai(name)
}

// 处理下载/删除点击
const chuliXiazai = async () => {
  if (yixiazai.value) {
    // 已下载，执行删除
    const queren = await querenShanchu(bookName.value)
    if (queren) {
      const chenggong = shanchujingwen(bookName.value)
      if (chenggong) {
        yixiazai.value = false
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
      const neirong = await congYunduanHuoquJingwen(bookName.value)
      if (neirong) {
        const chenggong = baocunjingwen(bookName.value, neirong)
        if (chenggong) {
          yixiazai.value = true
          content.value = neirong
        }
      } else {
        // 如果云端没有，尝试用当前显示的内容保存
        if (content.value && content.value !== '加载中...' && content.value !== '暂无此经文内容') {
          const chenggong = baocunjingwen(bookName.value, content.value)
          if (chenggong) {
            yixiazai.value = true
          }
        } else {
          uni.showToast({ title: '下载失败', icon: 'none' })
        }
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

// 页面打开时执行
onMounted(() => {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  bookName.value = decodeURIComponent(current.options.name || '经文')

  loadLocalData()
  loadArticle(bookName.value)
  checkCollected(bookName.value)
  jianchaXiazai(bookName.value)
  saveHistory(bookName.value)
})

// 字体、收藏、返回功能
const toggleFont = () => (showFontBar.value = !showFontBar.value)
const setFont = (size) => {
  fontSize.value = size
  try {
    uni.setStorageSync('font_size', size)
  } catch (e) {
    console.error('保存字号失败', e)
  }
}
const goBack = () => uni.navigateBack()
const toggleCollect = () => {
  try {
    let collects = uni.getStorageSync('collect_list') || []
    const name = bookName.value
    collected.value = !collected.value

    if (collected.value) {
      collects.push(name)
    } else {
      collects = collects.filter(i => i !== name)
    }

    uni.setStorageSync('collect_list', collects)
    uni.showToast({ title: collected.value ? '收藏成功' : '取消收藏' })
  } catch (e) {
    console.error('收藏操作失败', e)
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}
</script>

<style scoped>
.read-page {
  min-height: 100vh;
  background: #f6f3ec;
  padding: 20rpx;
}
.read-bar {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  font-size: 32rpx;
}
.tools {
  display: flex;
  gap: 20rpx;
}
.icon {
  cursor: pointer;
}
.font-bar {
  display: flex;
  justify-content: space-around;
  background: white;
  padding: 10rpx;
  border-radius: 10rpx;
  margin: 10rpx 0;
}
.article {
  line-height: 2;
  padding: 10rpx;
  color: #333;
  white-space: pre-wrap;
}
.dark-text {
  color: #eee;
}
.dark .read-page {
  background: #1a1a1a;
}
.dark .font-bar {
  background: #333;
  color: #eee;
}
</style>
