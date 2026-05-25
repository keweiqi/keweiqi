import { ref } from 'vue'
import { jianyixiazai, baocunjingwen, shanchujingwen, querenShanchu } from '../utils/xiazai.js'
import { congYunduanHuoquJingwen } from '../utils/yunshuju.js'
import { getArticleContent } from '../utils/data.js'

export function useDownload(bookListRef) {
  const zhengzaixiazai = ref(false)

  const shuangxinZhuangtai = () => {
    if (bookListRef.value) {
      bookListRef.value.forEach(book => {
        const name = book.displayName || book.name
        book.yixiazai = jianyixiazai(name)
      })
    }
  }

  const chuliXiazai = async (book) => {
    const name = book.displayName || book.name

    if (book.yixiazai) {
      const queren = await querenShanchu(name)
      if (queren) {
        const chenggong = shanchujingwen(name)
        if (chenggong) {
          shuangxinZhuangtai()
          uni.showToast({ title: '已删除', icon: 'success' })
        }
      }
    } else {
      if (zhengzaixiazai.value) return
      zhengzaixiazai.value = true
      uni.showLoading({ title: '下载中...' })

      try {
        let neirong = await congYunduanHuoquJingwen(name)
        if (!neirong) {
          neirong = await getArticleContent(name)
        }

        if (neirong && neirong !== '暂无此经文内容') {
          const chenggong = baocunjingwen(name, neirong)
          uni.hideLoading()
          if (chenggong) {
            shuangxinZhuangtai()
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

  return {
    zhengzaixiazai,
    shuangxinZhuangtai,
    chuliXiazai,
    jianyixiazai
  }
}
