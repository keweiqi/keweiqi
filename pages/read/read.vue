<template>
  <view class="read-page" :class="{ dark: isDark }">
    <bread-crumb :breadList="breadList" :class="{ dark: isDark }" />
    <view class="read-bar">
      <view class="back" @click="goBack">← 返回</view>
      <view class="title">{{ bookName }}</view>
      <view class="tools">
        <text class="icon" @click="toggleFont">Aa</text>
        <text class="icon" @click="toggleCollect">{{ collected ? '★' : '☆' }}</text>
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
      <view v-for="(paragraph, index) in paragraphs" :key="index" class="paragraph-wrapper">
        <view 
          class="paragraph" 
          :style="{ fontSize: fontSize + 'rpx' }"
          :class="isDark ? 'dark-text' : ''"
        >
          {{ paragraph }}
        </view>
        <view class="paragraph-actions">
          <view class="note-btn" @click="openParagraphNote(index, paragraph)">
            <text class="note-icon">📝</text>
            <text class="note-count">{{ getParagraphNoteCount(index) }}</text>
          </view>
          <view class="comment-btn" @click="goToParagraphComments(index, paragraph)">
            <text class="comment-icon">💬</text>
            <text class="comment-count">{{ getParagraphCommentCount(index) }}</text>
          </view>
        </view>
      </view>

      <view class="book-end">
        <view class="divider">──────────</view>
        <text class="end-text">— 全文完 —</text>
        <view class="book-actions">
          <view class="book-notes-btn" @click="openBookNote">
            <text class="btn-icon">📝</text>
            <text class="btn-text">整本书笔记</text>
            <text class="btn-count">({{ notesCount }})</text>
          </view>
          <view class="book-comments-btn" @click="goComments">
            <text class="btn-icon">📖</text>
            <text class="btn-text">整本书讨论</text>
            <text class="btn-count">({{ bookCommentsCount }})</text>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="note-modal" v-if="showNoteModal" @click="closeNoteModal">
      <view class="note-content" @click.stop>
        <view class="note-header">
          <text class="note-title">
            📝 {{ noteContext.type === 'paragraph' ? '第 ' + (noteContext.index + 1) + ' 段笔记' : '整本书笔记' }}
          </text>
          <text class="note-close" @click="closeNoteModal">✕</text>
        </view>
        <view v-if="noteContext.preview" class="note-preview">
          <text class="preview-label">段落内容：</text>
          <text class="preview-text">{{ noteContext.preview }}</text>
        </view>
        <textarea 
          class="note-input" 
          v-model="noteContent" 
          placeholder="写下你的感悟..."
          :maxlength="500"
        />
        <view class="note-footer">
          <button class="note-btn cancel" @click="closeNoteModal">取消</button>
          <button class="note-btn save" @click="saveNote">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from '../../composables/useTheme.js'
import { useRead } from '../../composables/useRead.js'
import { useNotes } from '../../composables/useNotes.js'
import { useComments } from '../../composables/useComments.js'

const bookName = ref('')
const content = ref('')
const paragraphs = ref([])
const showFontBar = ref(false)
const fontSize = ref(32)
const collected = ref(false)
const yixiazai = ref(false)
const breadList = ref([])

const showNoteModal = ref(false)
const noteContent = ref('')
const noteContext = ref({ type: 'book', index: null, preview: '' })

const { isDark } = useTheme()
const { getNotesByBook, addNote, getNotesCountByParagraph } = useNotes()
const { getCommentsByBook, getCommentsCountByParagraph } = useComments()

const notesCount = computed(() => getNotesByBook(bookName.value).length)
const bookCommentsCount = computed(() => getCommentsByBook(bookName.value).length)

const { loadArticle, saveHistory, checkCollected, jianchaXiazai, toggleCollect, chuliXiazai, shengchengBreadList, setFont } = useRead(
  bookName, content, collected, yixiazai, breadList
)

const getParagraphCommentCount = (index) => {
  return getCommentsCountByParagraph(bookName.value, index)
}

const getParagraphNoteCount = (index) => {
  return getNotesCountByParagraph(bookName.value, index)
}

const splitIntoParagraphs = (text) => {
  if (!text) return []
  return text.split(/\n\n+|\n\s+\n/).map(p => p.trim()).filter(p => p.length > 0)
}



const openParagraphNote = (index, text) => {
  noteContext.value = { 
    type: 'paragraph', 
    index: index, 
    preview: text.substring(0, 50) + (text.length > 50 ? '...' : '') 
  }
  showNoteModal.value = true
}

const openBookNote = () => {
  noteContext.value = { type: 'book', index: null, preview: '' }
  showNoteModal.value = true
}

const closeNoteModal = () => {
  showNoteModal.value = false
  noteContent.value = ''
}

const saveNote = () => {
  if (!noteContent.value.trim()) {
    uni.showToast({ title: '请输入内容', icon: 'none' })
    return
  }
  addNote(bookName.value, noteContent.value, noteContext.value.index)
  uni.showToast({ title: '保存成功', icon: 'success' })
  closeNoteModal()
}

const goToParagraphComments = (index, text) => {
  uni.navigateTo({
    url: `/pages/read/paragraph-comments?book=${encodeURIComponent(bookName.value)}&index=${index}&text=${encodeURIComponent(text.substring(0, 100))}${text.length > 100 ? '...' : ''}`
  })
}

const goComments = () => {
  uni.navigateTo({
    url: `/pages/read/comments?book=${encodeURIComponent(bookName.value)}`
  })
}

const goBack = () => uni.navigateBack()

onMounted(() => {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  bookName.value = decodeURIComponent(current.options.name || '经文')

  try {
    const size = uni.getStorageSync('font_size')
    if (size) fontSize.value = size
  } catch (e) {
    console.error('加载字号失败', e)
  }

  loadArticle(bookName.value).then(() => {
    paragraphs.value = splitIntoParagraphs(content.value)
  })
  checkCollected(bookName.value)
  jianchaXiazai(bookName.value)
  saveHistory(bookName.value)
  shengchengBreadList(bookName.value)
})
</script>

<style scoped>
.read-page { min-height: 100vh; background: #f6f3ec; padding: 20rpx; }
.read-bar { display: flex; justify-content: space-between; padding: 20rpx 0; font-size: 32rpx; }
.tools { display: flex; gap: 20rpx; }
.icon { cursor: pointer; }
.font-bar { display: flex; justify-content: space-around; background: white; padding: 10rpx; border-radius: 10rpx; margin: 10rpx 0; }
.dark .read-page { background: #1a1a1a; }
.dark .font-bar { background: #333; color: #eee; }

.content-view { flex: 1; }

.paragraph-wrapper {
  margin-bottom: 40rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}
.dark .paragraph-wrapper {
  background: #2a2a2a;
}

.paragraph {
  line-height: 2;
  color: #333;
  text-align: justify;
}
.dark-text { color: #eee; }

.paragraph-actions {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
}
.dark .paragraph-actions {
  border-top-color: #444;
}

.note-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 20rpx;
  background: rgba(66, 153, 225, 0.08);
  border-radius: 30rpx;
}
.note-icon { font-size: 28rpx; }
.note-count {
  font-size: 24rpx;
  color: #4299e1;
  font-weight: bold;
}
.dark .note-btn {
  background: rgba(66, 153, 225, 0.15);
}
.dark .note-count {
  color: #90cdf4;
}

.comment-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 20rpx;
  background: rgba(140, 61, 30, 0.08);
  border-radius: 30rpx;
}
.comment-icon { font-size: 28rpx; }
.comment-count {
  font-size: 24rpx;
  color: #8c3d1e;
  font-weight: bold;
}
.dark .comment-btn {
  background: rgba(255, 255, 255, 0.08);
}
.dark .comment-count {
  color: #e8a078;
}

.book-end {
  text-align: center;
  padding: 60rpx 0;
}
.divider {
  color: #999;
  font-size: 28rpx;
  letter-spacing: 10rpx;
  margin-bottom: 30rpx;
}
.dark .divider {
  color: #666;
}
.end-text {
  font-size: 32rpx;
  color: #666;
  font-weight: bold;
  letter-spacing: 16rpx;
  margin-bottom: 40rpx;
}
.dark .end-text {
  color: #999;
}
.book-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  align-items: center;
}
.book-notes-btn {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 40rpx;
  background: #4299e1;
  color: #fff;
  border-radius: 50rpx;
}
.book-comments-btn {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 40rpx;
  background: #8c3d1e;
  color: #fff;
  border-radius: 50rpx;
}
.btn-icon { font-size: 32rpx; }
.btn-text { font-size: 28rpx; font-weight: bold; }
.btn-count { font-size: 24rpx; opacity: 0.9; }

.note-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}
.note-content {
  width: 100%;
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding: 40rpx;
}
.dark .note-content {
  background: #222;
}
.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}
.note-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}
.dark .note-title {
  color: #eee;
}
.note-preview {
  background: rgba(140, 61, 30, 0.05);
  border-left: 4rpx solid #8c3d1e;
  padding: 20rpx;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
}
.dark .note-preview {
  background: rgba(232, 160, 120, 0.1);
  border-left-color: #e8a078;
}
.preview-label {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 10rpx;
}
.preview-text {
  font-size: 28rpx;
  color: #555;
}
.dark .preview-text {
  color: #aaa;
}
.note-close {
  font-size: 40rpx;
  color: #999;
  padding: 10rpx;
}
.note-input {
  width: 100%;
  height: 300rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
  padding: 20rpx;
  font-size: 32rpx;
  color: #333;
  box-sizing: border-box;
}
.dark .note-input {
  background: #333;
  color: #eee;
}
.note-footer {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
}
.note-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 16rpx;
  font-size: 32rpx;
  border: none;
}
.note-btn.cancel {
  background: #f5f5f5;
  color: #666;
}
.note-btn.save {
  background: #8c3d1e;
  color: #fff;
}
</style>
