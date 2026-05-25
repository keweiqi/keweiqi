import { ref } from 'vue'

const COMMENTS_KEY = 'jingwu_comments'

export function useComments() {
  const comments = ref([])

  const loadComments = () => {
    try {
      const saved = uni.getStorageSync(COMMENTS_KEY)
      comments.value = saved || getDefaultComments()
    } catch (e) {
      console.error('加载评论失败', e)
      comments.value = getDefaultComments()
    }
  }

  const getDefaultComments = () => {
    return [
      {
        id: 1,
        bookName: '般若波罗蜜多心经',
        paragraphIndex: null,
        userId: 1,
        username: '静心居士',
        content: '读了很多遍心经，每次都有新的感悟。"照见五蕴皆空"这句话真是博大精深。',
        likes: 12,
        liked: false,
        replies: [
          {
            id: 101,
            userId: 2,
            username: '悟道者',
            content: '同感！空性的智慧确实需要慢慢体会。',
            createTime: '2024-01-15T10:30:00Z'
          }
        ],
        createTime: '2024-01-14T08:00:00Z'
      },
      {
        id: 2,
        bookName: '般若波罗蜜多心经',
        paragraphIndex: 0,
        userId: 3,
        username: '禅心',
        content: '观自在菩萨，这个开篇就很有深意。',
        likes: 8,
        liked: true,
        replies: [],
        createTime: '2024-01-13T15:20:00Z'
      },
      {
        id: 3,
        bookName: '道德真经',
        paragraphIndex: null,
        userId: 4,
        username: '无为子',
        content: '"道可道，非常道"，老子开篇就点出了道的本质。道是无法用言语完全表达的。',
        likes: 15,
        liked: false,
        replies: [
          {
            id: 102,
            userId: 5,
            username: '自然行者',
            content: '道生一，一生二，二生三，三生万物。',
            createTime: '2024-01-12T09:45:00Z'
          },
          {
            id: 103,
            userId: 6,
            username: '清静散人',
            content: '无为而无不为，这是道家的精髓。',
            createTime: '2024-01-12T11:00:00Z'
          }
        ],
        createTime: '2024-01-12T08:30:00Z'
      }
    ]
  }

  const saveComments = () => {
    try {
      uni.setStorageSync(COMMENTS_KEY, comments.value)
    } catch (e) {
      console.error('保存评论失败', e)
    }
  }

  const getCommentsByBook = (bookName) => {
    return comments.value.filter(c => c.bookName === bookName && c.paragraphIndex === null)
  }

  const getCommentsByParagraph = (bookName, paragraphIndex) => {
    return comments.value.filter(c => c.bookName === bookName && c.paragraphIndex === paragraphIndex)
  }

  const getCommentsCountByParagraph = (bookName, paragraphIndex) => {
    return getCommentsByParagraph(bookName, paragraphIndex).length
  }

  const addComment = (bookName, content, userId = 0, username = '匿名用户', paragraphIndex = null) => {
    const newComment = {
      id: Date.now(),
      bookName,
      paragraphIndex,
      userId,
      username,
      content,
      likes: 0,
      liked: false,
      replies: [],
      createTime: new Date().toISOString()
    }
    comments.value.push(newComment)
    saveComments()
    return newComment
  }

  const addReply = (commentId, content, userId = 0, username = '匿名用户') => {
    const comment = comments.value.find(c => c.id === commentId)
    if (comment) {
      const reply = {
        id: Date.now(),
        userId,
        username,
        content,
        createTime: new Date().toISOString()
      }
      comment.replies.push(reply)
      saveComments()
      return reply
    }
    return null
  }

  const toggleLike = (commentId) => {
    const comment = comments.value.find(c => c.id === commentId)
    if (comment) {
      if (comment.liked) {
        comment.likes--
        comment.liked = false
      } else {
        comment.likes++
        comment.liked = true
      }
      saveComments()
      return true
    }
    return false
  }

  const deleteComment = (commentId) => {
    const index = comments.value.findIndex(c => c.id === commentId)
    if (index !== -1) {
      comments.value.splice(index, 1)
      saveComments()
      return true
    }
    return false
  }

  const deleteReply = (commentId, replyId) => {
    const comment = comments.value.find(c => c.id === commentId)
    if (comment) {
      const index = comment.replies.findIndex(r => r.id === replyId)
      if (index !== -1) {
        comment.replies.splice(index, 1)
        saveComments()
        return true
      }
    }
    return false
  }

  loadComments()

  return {
    comments,
    getCommentsByBook,
    getCommentsByParagraph,
    getCommentsCountByParagraph,
    addComment,
    addReply,
    toggleLike,
    deleteComment,
    deleteReply,
    loadComments
  }
}
