import daoJing from '../static/data/daojing.json'
import foJing from '../static/data/fojing.json'
import { jingwenContent } from '../static/data/jingdian.js'
import { jianyixiazai, duqujingwen } from './xiazai.js'
import { congYunduanHuoquJingwen } from './yunshuju.js'

export function getDaoJingList() {
  return daoJing
}

export function getFoJingList() {
  return foJing
}

export function getDaoJingByCategory(category) {
  return daoJing.filter(item => item.category === category)
}

export async function getArticleContent(name) {
  try {
    const yixiazai = jianyixiazai(name);
    if (yixiazai) {
      const neirong = duqujingwen(name);
      if (neirong) {
        return neirong;
      }
    }

    if (jingwenContent[name]) {
      return jingwenContent[name];
    }

    const yunduanneirong = await congYunduanHuoquJingwen(name);
    if (yunduanneirong) {
      return yunduanneirong;
    }

    return '暂无此经文内容';
  } catch (e) {
    console.error('获取经文内容失败', e);
    return '暂无此经文内容';
  }
}

export function groupDaoJingByCategory() {
  const groups = {}
  daoJing.forEach(item => {
    if (!groups[item.category]) {
      groups[item.category] = []
    }
    groups[item.category].push(item)
  })
  return groups
}

export function groupFoJingByCategory() {
  const groups = {}
  foJing.forEach(item => {
    if (!groups[item.category]) {
      groups[item.category] = []
    }
    groups[item.category].push(item)
  })
  return groups
}
