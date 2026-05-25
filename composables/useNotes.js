import { ref } from 'vue'

const NOTES_KEY = 'jingwu_notes'

export function useNotes() {
  const notes = ref([])

  const loadNotes = () => {
    try {
      const saved = uni.getStorageSync(NOTES_KEY)
      notes.value = saved || []
    } catch (e) {
      console.error('加载笔记失败', e)
      notes.value = []
    }
  }

  const saveNotes = () => {
    try {
      uni.setStorageSync(NOTES_KEY, notes.value)
    } catch (e) {
      console.error('保存笔记失败', e)
    }
  }

  const getNotesByBook = (bookName) => {
    return notes.value.filter(note => note.bookName === bookName && note.paragraphIndex === null)
  }

  const getNotesByParagraph = (bookName, paragraphIndex) => {
    return notes.value.filter(note => note.bookName === bookName && note.paragraphIndex === paragraphIndex)
  }

  const getNotesCountByParagraph = (bookName, paragraphIndex) => {
    return getNotesByParagraph(bookName, paragraphIndex).length
  }

  const addNote = (bookName, content, paragraphIndex = null) => {
    const newNote = {
      id: Date.now(),
      bookName,
      paragraphIndex,
      content,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    }
    notes.value.push(newNote)
    saveNotes()
    return newNote
  }

  const updateNote = (id, content) => {
    const index = notes.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        content,
        updateTime: new Date().toISOString()
      }
      saveNotes()
      return true
    }
    return false
  }

  const deleteNote = (id) => {
    const index = notes.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notes.value.splice(index, 1)
      saveNotes()
      return true
    }
    return false
  }

  const deleteNotesByBook = (bookName) => {
    notes.value = notes.value.filter(n => n.bookName !== bookName)
    saveNotes()
  }

  loadNotes()

  return {
    notes,
    getNotesByBook,
    getNotesByParagraph,
    getNotesCountByParagraph,
    addNote,
    updateNote,
    deleteNote,
    deleteNotesByBook,
    loadNotes
  }
}
