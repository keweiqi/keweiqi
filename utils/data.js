// ========================================
// 静悟 - 数据获取工具
// 小白说明：这个文件负责获取经文数据，优先本地，其次云端
// ========================================

import daoJing from '../static/data/daojing.json'
import foJing from '../static/data/fojing.json'
import articles from '../static/data/articles.json'
import { jianyixiazai, duqujingwen } from './xiazai.js'
import { congYunduanHuoquJingwen } from './yunshuju.js'

// 获取道藏目录
export function getDaoJingList() {
  return daoJing
}

// 获取大藏经目录
export function getFoJingList() {
  return foJing
}

// 根据分类获取道藏经典
export function getDaoJingByCategory(category) {
  return daoJing.filter(item => item.category === category)
}

/**
 * 获取经文内容
 * 小白说明：优先看本地是否下载了，没有再看本地备用，最后看云端
 * @param {string} name - 书名
 * @returns {Promise<string>} 经文内容
 */
export async function getArticleContent(name) {
  try {
    // 1. 先检查本地是否已下载
    const yixiazai = jianyixiazai(name);
    if (yixiazai) {
      const neirong = duqujingwen(name);
      if (neirong) {
        return neirong;
      }
    }

    // 2. 看本地备用数据里有没有
    if (articles[name]) {
      return articles[name];
    }

    // 3. 从云端获取
    const yunduanneirong = await congYunduanHuoquJingwen(name);
    if (yunduanneirong) {
      return yunduanneirong;
    }

    // 4. 都没有，返回提示
    return '暂无此经文内容';
  } catch (e) {
    console.error('获取经文内容失败', e);
    return '暂无此经文内容';
  }
}

// 按分类分组道藏经典
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

// 按分类分组大藏经
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
