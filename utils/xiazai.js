// ========================================
// 静悟 - 下载管理工具
// 小白说明：这个文件管下载、删除、检查已下载
// ========================================

// 存储的key名称
const CUNCHU_MINGCHENG = 'yixiazai_liebiao';
const JINGWEN_CUNCHU_QIANZHUI = 'jingwen_';

/**
 * 检查某本书是否已下载
 * @param {string} shuming - 书名
 * @returns {boolean} 是否已下载
 */
export function jianyixiazai(shuming) {
    try {
        const liebiao = huoquyixiazailiebiao();
        return liebiao.includes(shuming);
    } catch (e) {
        console.error('检查下载状态失败', e);
        return false;
    }
}

/**
 * 获取已下载列表
 * @returns {Array} 已下载书名数组
 */
export function huoquyixiazailiebiao() {
    try {
        const liebiao = uni.getStorageSync(CUNCHU_MINGCHENG);
        return liebiao || [];
    } catch (e) {
        console.error('获取已下载列表失败', e);
        return [];
    }
}

/**
 * 保存经文到本地
 * @param {string} shuming - 书名
 * @param {string} neirong - 经文内容
 * @returns {boolean} 是否成功
 */
export function baocunjingwen(shuming, neirong) {
    try {
        // 保存经文内容
        uni.setStorageSync(JINGWEN_CUNCHU_QIANZHUI + shuming, neirong);

        // 更新已下载列表
        const liebiao = huoquyixiazailiebiao();
        if (!liebiao.includes(shuming)) {
            liebiao.push(shuming);
            uni.setStorageSync(CUNCHU_MINGCHENG, liebiao);
        }

        return true;
    } catch (e) {
        console.error('保存经文失败', e);
        return false;
    }
}

/**
 * 读取本地已下载的经文
 * @param {string} shuming - 书名
 * @returns {string|null} 经文内容，没有返回null
 */
export function duqujingwen(shuming) {
    try {
        const neirong = uni.getStorageSync(JINGWEN_CUNCHU_QIANZHUI + shuming);
        return neirong || null;
    } catch (e) {
        console.error('读取经文失败', e);
        return null;
    }
}

/**
 * 删除已下载的经文
 * @param {string} shuming - 书名
 * @returns {boolean} 是否成功
 */
export function shanchujingwen(shuming) {
    try {
        // 删除经文内容
        uni.removeStorageSync(JINGWEN_CUNCHU_QIANZHUI + shuming);

        // 从已下载列表移除
        const liebiao = huoquyixiazailiebiao();
        const xinliebiao = liebiao.filter(mingcheng => mingcheng !== shuming);
        uni.setStorageSync(CUNCHU_MINGCHENG, xinliebiao);

        return true;
    } catch (e) {
        console.error('删除经文失败', e);
        return false;
    }
}

/**
 * 显示确认删除的弹框
 * @param {string} shuming - 书名
 * @returns {Promise<boolean>} 用户是否确认删除
 */
export function querenShanchu(shuming) {
    return new Promise((jiejue) => {
        uni.showModal({
            title: '确认删除',
            content: `确定要删除《${shuming}》吗？`,
            success: (res) => {
                jiejue(res.confirm);
            }
        });
    });
}
