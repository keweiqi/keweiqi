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
    // 如果没启用云端，直接返回null
    if (!peizhi.qiyongyunduan) {
        return null;
    }

    // 如果没配置地址，返回null
    if (!peizhi.ali.jingwen_qianzhui) {
        return null;
    }

    try {
        // 构建完整地址
        // 文件名处理：把书名中的特殊字符替换一下
        const wenjianming = shuming.replace(/[^\w\u4e00-\u9fa5]/g, '_') + '.json';
        const dizhi = peizhi.ali.jingwen_qianzhui + wenjianming;

        // 发起请求
        const jieguo = await uni.request({
            url: dizhi,
            method: 'GET',
            timeout: peizhi.chaoshi
        });

        // 检查是否成功
        if (jieguo[1].statusCode === 200) {
            // 返回内容
            const shuju = jieguo[1].data;
            // 如果是对象，取content字段；如果是字符串直接用
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
 * 下载经文并保存到本地
 * @param {string} shuming - 书名
 * @returns {Promise<boolean>} 是否成功
 */
export async function xiazaiBingBaocun(shuming) {
    try {
        // 先从云端下载
        const neirong = await congYunduanHuoquJingwen(shuming);

        if (!neirong) {
            uni.showToast({
                title: '下载失败',
                icon: 'none'
            });
            return false;
        }

        // 保存到本地
        const chenggong = await import('./xiazai.js').then(m => m.baocunjingwen(shuming, neirong));

        if (chenggong) {
            uni.showToast({
                title: '下载完成',
                icon: 'success'
            });
        }

        return chenggong;
    } catch (e) {
        console.error('下载失败', e);
        uni.showToast({
            title: '下载失败',
            icon: 'none'
        });
        return false;
    }
}
