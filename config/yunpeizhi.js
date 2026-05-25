// ========================================
// 静悟 - 云端配置文件
// 小白说明：这里放阿里云的地址，您把阿里云后台拿到的地址填到下面就行
// ========================================

const peizhi = {
    // 开关：是否启用云端功能
    // true = 用云端，false = 只用本地
    qiyongyunduan: false,

    // 阿里云地址配置
    // 小白说明：等您在阿里云上传文件后，把访问地址填到下面
    ali: {
        // 道藏目录地址
        daojing_list: '',

        // 大藏经目录地址
        fojing_list: '',

        // 诗词经典目录地址
        shici_list: '',

        // 儒教典籍目录地址
        rujiao_list: '',

        // 经文内容地址前缀
        // 比如：https://xxx.oss-cn-xxx.aliyuncs.com/articles/
        jingwen_qianzhui: ''
    },

    // 超时时间（毫秒）
    // 5秒没反应就算失败
    chaoshi: 5000
};

export default peizhi;
