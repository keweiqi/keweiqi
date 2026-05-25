import { getArticleContent } from '../utils/data.js'
import { jianyixiazai, baocunjingwen, shanchujingwen, querenShanchu } from '../utils/xiazai.js'
import { congYunduanHuoquJingwen } from '../utils/yunshuju.js'
import { ref } from 'vue'

export function useRead(bookNameRef, contentRef, collectedRef, yixiazaiRef, breadListRef) {
  const zhengzaixiazai = ref(false)

  const loadArticle = async (name) => {
    try {
      contentRef.value = '加载中...'
      const neirong = await getArticleContent(name)
      contentRef.value = neirong
    } catch (e) {
      console.error('加载经文失败', e)
      contentRef.value = '加载失败，请重试'
    }
  }

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

  const checkCollected = (name) => {
    try {
      let collects = uni.getStorageSync('collect_list') || []
      collectedRef.value = collects.includes(name)
    } catch (e) {
      console.error('检查收藏失败', e)
    }
  }

  const jianchaXiazai = (name) => {
    yixiazaiRef.value = jianyixiazai(name)
  }

  const shengchengBreadList = (bookName) => {
    const pages = getCurrentPages()
    const sourcePage = pages.length > 1 ? pages[pages.length - 2] : null

    let list = [{ name: '首页', path: '/pages/index/index' }]

    if (sourcePage) {
      const sourceRoute = sourcePage.route || ''

      if (sourceRoute.includes('dao')) {
        list.push({ name: '道藏', path: '/pages/liebiao/dao-list' })
        if (sourceRoute.includes('zhenjing')) list.push({ name: '真经典籍', path: '/pages/dao/zhenjing' })
        else if (sourceRoute.includes('xiushen')) list.push({ name: '修身养性', path: '/pages/dao/xiushen' })
        else if (sourceRoute.includes('weiyi')) list.push({ name: '义理精华', path: '/pages/dao/weiyi' })
      } else if (sourceRoute.includes('fo')) {
        list.push({ name: '大藏经', path: '/pages/liebiao/fo-list' })
        if (sourceRoute.includes('dacheng')) list.push({ name: '大乘经典', path: '/pages/fo/dacheng' })
        else if (sourceRoute.includes('lvbu')) list.push({ name: '律部典籍', path: '/pages/fo/lvbu' })
        else if (sourceRoute.includes('lunzhu')) list.push({ name: '先贤论著', path: '/pages/fo/lunzhu' })
      }
    }

    list.push({ name: bookName, path: '' })
    breadListRef.value = list
  }

  const chuliXiazai = async () => {
    const name = bookNameRef.value

    if (yixiazaiRef.value) {
      const queren = await querenShanchu(name)
      if (queren) {
        const chenggong = shanchujingwen(name)
        if (chenggong) {
          yixiazaiRef.value = false
          uni.showToast({ title: '已删除', icon: 'success' })
        }
      }
    } else {
      if (zhengzaixiazai.value) return
      zhengzaixiazai.value = true
      uni.showLoading({ title: '下载中...' })

      try {
        let neirong = await congYunduanHuoquJingwen(name)
        if (!neirong) neirong = await getArticleContent(name)

        if (neirong && neirong !== '暂无此经文内容') {
          const chenggong = baocunjingwen(name, neirong)
          uni.hideLoading()
          if (chenggong) {
            yixiazaiRef.value = true
            if (neirong !== contentRef.value) contentRef.value = neirong
            uni.showToast({ title: '下载完成', icon: 'success' })
          } else {
            uni.showToast({ title: '下载失败', icon: 'none' })
          }
        } else {
          uni.hideLoading()
          uni.showToast({ title: '暂无内容', icon: 'none' })
        }
      } catch (e) {
        console.error('下载失败', e)
        uni.hideLoading()
        uni.showToast({ title: '下载失败', icon: 'none' })
      } finally {
        zhengzaixiazai.value = false
      }
    }
  }

  const toggleCollect = () => {
    try {
      let collects = uni.getStorageSync('collect_list') || []
      const name = bookNameRef.value
      collectedRef.value = !collectedRef.value

      if (collectedRef.value) collects.push(name)
      else collects = collects.filter(i => i !== name)

      uni.setStorageSync('collect_list', collects)
      uni.showToast({ title: collectedRef.value ? '收藏成功' : '取消收藏' })
    } catch (e) {
      console.error('收藏操作失败', e)
      uni.showToast({ title: '操作失败', icon: 'none' })
    }
  }

  const setFont = (size) => {
    try {
      uni.setStorageSync('font_size', size)
    } catch (e) {
      console.error('保存字号失败', e)
    }
  }

  return {
    loadArticle,
    saveHistory,
    checkCollected,
    jianchaXiazai,
    shengchengBreadList,
    chuliXiazai,
    toggleCollect,
    setFont
  }
}
