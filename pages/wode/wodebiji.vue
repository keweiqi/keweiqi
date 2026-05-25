<template>
  <view class="notes-page" :class="{ dark: isDark }">
    <view class="header">
      <view class="back" @click="goBack">← 返回</view>
      <view class="title">个人心得</view>
      <view style="width: 80rpx;"></view>
    </view>

    <scroll-view scroll-y class="content">
      <view v-if="groupedNotes.length === 0" class="empty">
        <text class="empty-icon">📝</text>
        <text class="empty-text">还没有写过心得</text>
        <text class="empty-desc">去阅读一本经书，记录下你的感悟吧</text>
      </view>

      <view v-for="(bookNotes, bookName) in groupedNotes" :key="bookName" class="book-group">
        <view class="book-title">
          <text class="book-name">《{{ bookName }}》</text>
          <text class="note-count">{{ bookNotes.length }} 条</text>
        </view>

        <view class="notes-list">
          <view v-for="note in bookNotes" :key="note.id" class="note-item">
            <view class="note-header">
              <text v-if="note.paragraphIndex !== null" class="paragraph-tag">
                第 {{ note.paragraphIndex + 1 }} 段
              </text>
              <text v-else class="book-tag">全书心得</text>
              <text class="note-time">{{ formatTime(note.createTime) }}</text>
            </view>
            <view class="note-content">{{ note.content }}</view>
            <view class="note-footer">
              <view class="note-actions">
                <text class="action-edit" @click="editNote(note)">✏️ 编辑</text>
                <text class="action-delete" @click="deleteNote(note.id)">🗑️ 删除</text>
              </view>
              <text v-if="note.updateTime !== note.createTime" class="update-time">
                编辑于 {{ formatTime(note.updateTime) }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 编辑弹窗 -->
    <view class="note-modal" v-if="editingNote" @click="closeEditModal">
      <view class="note-modal-content" @click.stop>
        <view class="note-modal-header">
          <text class="note-modal-title">✏️ 编辑心得</text>
          <text class="note-modal-close" @click="closeEditModal">✕</text>
        </view>
        <textarea 
          class="note-modal-input" 
          v-model="editingContent" 
          placeholder="修改你的心得..."
          :maxlength="500"
        />
        <view class="note-modal-footer">
          <button class="note-modal-btn cancel" @click="closeEditModal">取消</button>
          <button class="note-modal-btn save" @click="updateNote">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from '../../composables/useTheme.js'
import { useNotes } from '../../composables/useNotes.js'

const { isDark } = useTheme()
const { notes, updateNote: updateNoteInStore, deleteNote } = useNotes()

const editingNote = ref(null)
const editingContent = ref('')

// 按书籍分组的笔记
const groupedNotes = computed(() => {
  const groups = {}
  notes.value.forEach(note => {
    if (!groups[note.bookName]) {
      groups[note.bookName] = []
    }
    groups[note.bookName].push(note)
  })
  // 每组内部按时间倒序
  Object.keys(groups).forEach(bookName => {
    groups[bookName].sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
  })
  return groups
})

const goBack = () => uni.navigateBack()

const formatTime = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
  
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const editNote = (note) => {
  editingNote.value = note
  editingContent.value = note.content
}

const closeEditModal = () => {
  editingNote.value = null
  editingContent.value = ''
}

const updateNote = () => {
  if (!editingContent.value.trim()) {
    uni.showToast({ title: '请输入内容', icon: 'none' })
    return
  }
  
  updateNoteInStore(editingNote.value.id, editingContent.value)
  uni.showToast({ title: '更新成功', icon: 'success' })
  closeEditModal()
}

const deleteNote = (id) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这条心得吗？',
    success: (res) => {
      if (res.confirm) {
        deleteNote(id)
        uni.showToast({ title: '删除成功', icon: 'success' })
      }
    }
  })
}
</script>

<style scoped>
.notes-page {
  min-height: 100vh;
  background: #f5efe6;
  display: flex;
  flex-direction: column;
}
.dark {
  background: #121212;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 40rpx;
  background: #fff;
}
.dark .header {
  background: #222;
}
.back {
  font-size: 40rpx;
  color: #333;
}
.dark .back {
  color: #e0e0e0;
}
.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}
.dark .title {
  color: #e0e0e0;
}

.content {
  flex: 1;
  padding: 20rpx 40rpx;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150rpx 0;
}
.empty-icon {
  font-size: 100rpx;
  margin-bottom: 30rpx;
}
.empty-text {
  font-size: 32rpx;
  color: #999;
  margin-bottom: 10rpx;
}
.empty-desc {
  font-size: 26rpx;
  color: #aaa;
}

.book-group {
  margin-bottom: 40rpx;
}
.book-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
}
.book-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
.dark .book-name {
  color: #e0e0e0;
}
.note-count {
  font-size: 26rpx;
  color: #8c3d1e;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.note-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
}
.dark .note-item {
  background: #222;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}
.paragraph-tag, .book-tag {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  background: rgba(140, 61, 30, 0.1);
  color: #8c3d1e;
}
.dark .paragraph-tag, .dark .book-tag {
  background: rgba(232, 160, 120, 0.2);
  color: #e8a078;
}
.note-time {
  font-size: 24rpx;
  color: #999;
}

.note-content {
  font-size: 30rpx;
  color: #333;
  line-height: 1.8;
  margin-bottom: 20rpx;
}
.dark .note-content {
  color: #ddd;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16rpx;
  border-top: 1rpx solid #f0f0f0;
}
.dark .note-footer {
  border-top-color: #333;
}
.note-actions {
  display: flex;
  gap: 20rpx;
}
.action-edit, .action-delete {
  font-size: 24rpx;
  color: #8c3d1e;
}
.dark .action-edit, .dark .action-delete {
  color: #e8a078;
}
.update-time {
  font-size: 22rpx;
  color: #999;
}

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
.note-modal-content {
  width: 100%;
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding: 40rpx;
}
.dark .note-modal-content {
  background: #222;
}
.note-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}
.note-modal-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}
.dark .note-modal-title {
  color: #eee;
}
.note-modal-close {
  font-size: 40rpx;
  color: #999;
  padding: 10rpx;
}
.note-modal-input {
  width: 100%;
  height: 300rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
  padding: 20rpx;
  font-size: 30rpx;
  color: #333;
  box-sizing: border-box;
}
.dark .note-modal-input {
  background: #333;
  color: #eee;
}
.note-modal-footer {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
}
.note-modal-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 16rpx;
  font-size: 32rpx;
  border: none;
}
.note-modal-btn.cancel {
  background: #f5f5f5;
  color: #666;
}
.note-modal-btn.save {
  background: #8c3d1e;
  color: #fff;
}
</style>
