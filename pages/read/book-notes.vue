<template>
  <view class="notes-page" :class="{ dark: isDark }">
    <view class="header">
      <view class="back" @click="goBack">← 返回</view>
      <view class="title">整本书笔记</view>
      <view style="width: 80rpx;"></view>
    </view>

    <view class="book-bar">
      <text class="book-name">《{{ bookName }}》</text>
      <text class="count">共 {{ bookNotes.length }} 条笔记</text>
    </view>

    <scroll-view scroll-y class="notes-list">
      <view v-if="bookNotes.length === 0" class="empty">
        <text class="empty-icon">📝</text>
        <text class="empty-text">还没有笔记，来写第一条吧</text>
      </view>

      <view v-for="note in bookNotes" :key="note.id" class="note-item">
        <view class="note-header">
          <text class="note-time">{{ formatTime(note.createTime) }}</text>
          <view class="note-actions">
            <text class="action-edit" @click="editNote(note)">✏️ 编辑</text>
            <text class="action-delete" @click="deleteNote(note.id)">🗑️ 删除</text>
          </view>
        </view>
        <view class="note-content">{{ note.content }}</view>
        <view class="note-footer">
          <text class="update-time">更新于 {{ formatTime(note.updateTime) }}</text>
        </view>
      </view>
    </scroll-view>

    <view class="input-area">
      <textarea 
        class="input" 
        v-model="newNote" 
        placeholder="写下对整本书的感悟..."
        :maxlength="500"
      />
      <button class="send-btn" @click="saveNote">保存</button>
    </view>

    <view class="note-modal" v-if="editingNote" @click="closeEditModal">
      <view class="note-modal-content" @click.stop>
        <view class="note-modal-header">
          <text class="note-modal-title">✏️ 编辑笔记</text>
          <text class="note-modal-close" @click="closeEditModal">✕</text>
        </view>
        <textarea 
          class="note-modal-input" 
          v-model="editingContent" 
          placeholder="修改你的笔记..."
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

const bookName = ref('')
const newNote = ref('')
const editingNote = ref(null)
const editingContent = ref('')

const { isDark } = useTheme()
const { getNotesByBook, addNote, updateNote: updateNoteInStore, deleteNote } = useNotes()

const bookNotes = computed(() => {
  return getNotesByBook(bookName.value).sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
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
  
  return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const saveNote = () => {
  if (!newNote.value.trim()) {
    uni.showToast({ title: '请输入内容', icon: 'none' })
    return
  }
  
  addNote(bookName.value, newNote.value, null)
  uni.showToast({ title: '保存成功', icon: 'success' })
  newNote.value = ''
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
    content: '确定要删除这条笔记吗？',
    success: (res) => {
      if (res.confirm) {
        deleteNote(id)
        uni.showToast({ title: '删除成功', icon: 'success' })
      }
    }
  })
}

onMounted(() => {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  bookName.value = decodeURIComponent(current.options.book || '')
})
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

.book-bar {
  padding: 20rpx 40rpx;
  background: rgba(140, 61, 30, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.book-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #8c3d1e;
}
.count {
  font-size: 26rpx;
  color: #666;
}

.notes-list {
  flex: 1;
  padding: 20rpx 40rpx;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}
.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}
.empty-text {
  font-size: 28rpx;
  color: #999;
}

.note-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}
.dark .note-item {
  background: #222;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}
.note-time {
  font-size: 24rpx;
  color: #999;
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
  padding-top: 16rpx;
  border-top: 1rpx solid #f0f0f0;
}
.dark .note-footer {
  border-top-color: #333;
}
.update-time {
  font-size: 22rpx;
  color: #999;
}

.input-area {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 20rpx 40rpx;
  background: #fff;
  border-top: 1rpx solid #f0f0f0;
}
.dark .input-area {
  background: #222;
  border-top-color: #333;
}
.input {
  width: 100%;
  height: 200rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
  padding: 20rpx;
  font-size: 30rpx;
  color: #333;
  box-sizing: border-box;
}
.dark .input {
  background: #333;
  color: #eee;
}
.send-btn {
  width: 100%;
  height: 80rpx;
  background: #8c3d1e;
  color: #fff;
  border: none;
  border-radius: 40rpx;
  font-size: 30rpx;
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
