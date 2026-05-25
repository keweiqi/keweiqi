<template>
  <view class="comments-page" :class="{ dark: isDark }">
    <view class="header">
      <view class="back" @click="goBack">← 返回</view>
      <view class="title">第 {{ paragraphIndex + 1 }} 段评论</view>
      <view style="width: 80rpx;"></view>
    </view>

    <view class="book-bar">
      <text class="book-name">《{{ bookName }}》</text>
      <text class="count">共 {{ bookComments.length }} 条评论</text>
    </view>

    <view class="paragraph-preview">
      <text class="preview-label">段落内容：</text>
      <text class="preview-text">{{ paragraphText }}</text>
    </view>

    <scroll-view scroll-y class="comments-list">
      <view v-if="bookComments.length === 0" class="empty">
        <text class="empty-icon">💬</text>
        <text class="empty-text">暂无评论，来说两句吧</text>
      </view>
      
      <view v-for="comment in bookComments" :key="comment.id" class="comment-item">
        <view class="comment-header">
          <view class="avatar-wrap">
            <text class="avatar">👤</text>
          </view>
          <view class="info">
            <text class="username">{{ comment.username }}</text>
            <text class="time">{{ formatTime(comment.createTime) }}</text>
          </view>
        </view>
        <view class="comment-content">{{ comment.content }}</view>
        <view class="comment-actions">
          <view class="action" @click="handleLike(comment.id)">
            <text class="action-icon">{{ comment.liked ? '❤️' : '🤍' }}</text>
            <text class="action-text">{{ comment.likes }}</text>
          </view>
          <view class="action" @click="toggleReply(comment.id)">
            <text class="action-icon">💬</text>
            <text class="action-text">回复</text>
          </view>
        </view>
        
        <view v-if="comment.replies.length > 0" class="replies">
          <view v-for="reply in comment.replies" :key="reply.id" class="reply-item">
            <view class="reply-header">
              <text class="reply-username">{{ reply.username }}</text>
              <text class="reply-time">{{ formatTime(reply.createTime) }}</text>
            </view>
            <text class="reply-content">{{ reply.content }}</text>
          </view>
        </view>

        <view v-if="replyTarget === comment.id" class="reply-input-wrap">
          <input 
            class="reply-input" 
            v-model="replyContent" 
            placeholder="写下你的回复..."
            :maxlength="200"
          />
          <view class="reply-btns">
            <text class="btn cancel" @click="cancelReply">取消</text>
            <text class="btn send" @click="sendReply(comment.id)">发送</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="input-area">
      <input 
        class="input" 
        v-model="newComment" 
        placeholder="对此段发表你的见解..."
        :maxlength="500"
        @confirm="sendComment"
      />
      <button class="send-btn" @click="sendComment">发送</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from '../../composables/useTheme.js'
import { useComments } from '../../composables/useComments.js'
import { useUser } from '../../composables/useUser.js'

const bookName = ref('')
const paragraphIndex = ref(0)
const paragraphText = ref('')
const newComment = ref('')
const replyContent = ref('')
const replyTarget = ref(null)

const { isDark } = useTheme()
const { getCommentsByParagraph, addComment, addReply, toggleLike } = useComments()
const { user } = useUser()

const bookComments = computed(() => getCommentsByParagraph(bookName.value, paragraphIndex.value))

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
  
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const toggleReply = (commentId) => {
  replyTarget.value = replyTarget.value === commentId ? null : commentId
}

const cancelReply = () => {
  replyTarget.value = null
  replyContent.value = ''
}

const sendComment = () => {
  if (!newComment.value.trim()) {
    uni.showToast({ title: '请输入内容', icon: 'none' })
    return
  }
  
  const username = user.value?.nickname || user.value?.username || '匿名用户'
  addComment(bookName.value, newComment.value, user.value?.id || 0, username, paragraphIndex.value)
  
  uni.showToast({ title: '发表成功', icon: 'success' })
  newComment.value = ''
}

const sendReply = (commentId) => {
  if (!replyContent.value.trim()) {
    uni.showToast({ title: '请输入内容', icon: 'none' })
    return
  }
  
  const username = user.value?.nickname || user.value?.username || '匿名用户'
  addReply(commentId, replyContent.value, user.value?.id || 0, username)
  
  uni.showToast({ title: '回复成功', icon: 'success' })
  cancelReply()
}

const handleLike = (commentId) => {
  toggleLike(commentId)
}

onMounted(() => {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  bookName.value = decodeURIComponent(current.options.book || '')
  paragraphIndex.value = parseInt(current.options.index || '0')
  paragraphText.value = decodeURIComponent(current.options.text || '')
})
</script>

<style scoped>
.comments-page {
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

.paragraph-preview {
  margin: 20rpx 40rpx;
  padding: 30rpx;
  background: #fff9e6;
  border-radius: 16rpx;
  border-left: 6rpx solid #f0c040;
}
.dark .paragraph-preview {
  background: rgba(240, 192, 64, 0.1);
}
.preview-label {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 10rpx;
}
.preview-text {
  font-size: 30rpx;
  color: #555;
  line-height: 1.8;
}
.dark .preview-text {
  color: #ccc;
}

.comments-list {
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

.comment-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}
.dark .comment-item {
  background: #222;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}
.avatar-wrap {
  width: 70rpx;
  height: 70rpx;
  background: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar {
  font-size: 36rpx;
}
.info {
  flex: 1;
}
.username {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
}
.dark .username {
  color: #e0e0e0;
}
.time {
  font-size: 24rpx;
  color: #999;
}

.comment-content {
  font-size: 30rpx;
  color: #333;
  line-height: 1.8;
  margin-bottom: 20rpx;
}
.dark .comment-content {
  color: #ddd;
}

.comment-actions {
  display: flex;
  gap: 40rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}
.dark .comment-actions {
  border-top-color: #333;
}
.action {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.action-icon {
  font-size: 28rpx;
}
.action-text {
  font-size: 26rpx;
  color: #666;
}

.replies {
  margin-top: 20rpx;
  padding-left: 90rpx;
  border-left: 4rpx solid #f0f0f0;
}
.dark .replies {
  border-left-color: #333;
}

.reply-item {
  padding: 16rpx 20rpx;
  background: #f9f9f9;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
}
.dark .reply-item {
  background: #2a2a2a;
}
.reply-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8rpx;
}
.reply-username {
  font-size: 24rpx;
  font-weight: bold;
  color: #666;
}
.dark .reply-username {
  color: #aaa;
}
.reply-time {
  font-size: 22rpx;
  color: #999;
}
.reply-content {
  font-size: 26rpx;
  color: #333;
}
.dark .reply-content {
  color: #ddd;
}

.reply-input-wrap {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}
.dark .reply-input-wrap {
  border-top-color: #333;
}
.reply-input {
  width: 100%;
  height: 70rpx;
  background: #f5f5f5;
  border-radius: 35rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}
.dark .reply-input {
  background: #333;
  color: #eee;
}
.reply-btns {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  margin-top: 16rpx;
}
.reply-btns .btn {
  font-size: 28rpx;
  padding: 12rpx 30rpx;
  border-radius: 30rpx;
}
.reply-btns .cancel {
  background: #f5f5f5;
  color: #666;
}
.dark .reply-btns .cancel {
  background: #333;
  color: #aaa;
}
.reply-btns .send {
  background: #8c3d1e;
  color: #fff;
}

.input-area {
  display: flex;
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
  flex: 1;
  height: 80rpx;
  background: #f5f5f5;
  border-radius: 40rpx;
  padding: 0 30rpx;
  font-size: 30rpx;
}
.dark .input {
  background: #333;
  color: #eee;
}
.send-btn {
  height: 80rpx;
  width: 140rpx;
  background: #8c3d1e;
  color: #fff;
  border: none;
  border-radius: 40rpx;
  font-size: 30rpx;
}
</style>
