// ========================================
// 静悟 - 云端数据加载工具
// 小白说明：这个文件管从阿里云下载数据
// ========================================

import peizhi from '../config/yunpeizhi.js';

/**
 * 从云端获取经文内容
 * @param {string} shuming - 书名
 * @returns {Promise<string|null>} 经文内容，失败返回null
 */
export async function congYunduanHuoquJingwen(shuming) {
    if (!peizhi.qiyongyunduan) {
        return null;
    }

    if (!peizhi.ali.jingwen_qianzhui) {
        return null;
    }

    try {
        const wenjianming = shuming.replace(/[^\w\u4e00-\u9fa5]/g, '_') + '.json';
        const dizhi = peizhi.ali.jingwen_qianzhui + wenjianming;

        const jieguo = await uni.request({
            url: dizhi,
            method: 'GET',
            timeout: peizhi.chaoshi
        });

        if (jieguo[1].statusCode === 200) {
            const shuju = jieguo[1].data;
            if (typeof shuju === 'object' && shuju.content) {
                return shuju.content;
            }
            return shuju;
        }

        return null;
    } catch (e) {
        console.error('从云端获取经文失败', e);
        return null;
    }
}

/**
 * 从云端获取道藏目录
 * @returns {Promise<Array|null>} 目录数组，失败返回null
 */
export async function congYunduanHuoquDaojingMulu() {
    if (!peizhi.qiyongyunduan || !peizhi.ali.daojing_list) {
        return null;
    }

    try {
        const jieguo = await uni.request({
            url: peizhi.ali.daojing_list,
            method: 'GET',
            timeout: peizhi.chaoshi
        });

        if (jieguo[1].statusCode === 200) {
            return jieguo[1].data;
        }

        return null;
    } catch (e) {
        console.error('从云端获取道藏目录失败', e);
        return null;
    }
}

/**
 * 从云端获取大藏经目录
 * @returns {Promise<Array|null>} 目录数组，失败返回null
 */
export async function congYunduanHuoquFojingMulu() {
  if (!peizhi.qiyongyunduan || !peizhi.ali.fojing_list) {
    return null;
  }

  try {
    const jieguo = await uni.request({
      url: peizhi.ali.fojing_list,
      method: 'GET',
      timeout: peizhi.chaoshi
    });

    if (jieguo[1].statusCode === 200) {
      return jieguo[1].data;
    }

    return null;
  } catch (e) {
    console.error('从云端获取大藏经目录失败', e);
    return null;
  }
}

/**
 * 从云端获取诗词经典目录
 * @returns {Promise<Object|null>} 目录对象，失败返回null
 */
export async function congYunduanHuoquShiciMulu() {
  if (!peizhi.qiyongyunduan || !peizhi.ali.shici_list) {
    return null;
  }

  try {
    const jieguo = await uni.request({
      url: peizhi.ali.shici_list,
      method: 'GET',
      timeout: peizhi.chaoshi
    });

    if (jieguo[1].statusCode === 200) {
      return jieguo[1].data;
    }

    return null;
  } catch (e) {
    console.error('从云端获取诗词经典目录失败', e);
    return null;
  }
}

/**
 * 从云端获取儒教典籍目录
 * @returns {Promise<Object|null>} 目录对象，失败返回null
 */
export async function congYunduanHuoquRujiaoMulu() {
  if (!peizhi.qiyongyunduan || !peizhi.ali.rujiao_list) {
    return null;
  }

  try {
    const jieguo = await uni.request({
      url: peizhi.ali.rujiao_list,
      method: 'GET',
      timeout: peizhi.chaoshi
    });

    if (jieguo[1].statusCode === 200) {
      return jieguo[1].data;
    }

    return null;
  } catch (e) {
    console.error('从云端获取儒教典籍目录失败', e);
    return null;
  }
}

/**
 * 下载经文并保存到本地（已弃用，由页面直接处理）
 * @param {string} shuming - 书名
 * @returns {Promise<boolean>} 是否成功
 */
export async function xiazaiBingBaocun(shuming) {
    try {
        const neirong = await congYunduanHuoquJingwen(shuming);

        if (!neirong) {
            return false;
        }

        const { baocunjingwen } = await import('./xiazai.js');
        return baocunjingwen(shuming, neirong);
    } catch (e) {
        console.error('下载失败', e);
        return false;
    }
}
