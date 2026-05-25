import { ref, computed } from 'vue'

// 存储key
const STORAGE_KEY = 'jingwu_user'
const USERS_KEY = 'jingwu_users'

// 用户状态
const user = ref(null)
const isLoggedIn = computed(() => user.value !== null)

// 初始化用户状态
export function useUser() {
  // 从本地存储加载用户
  const loadUser = () => {
    try {
      const saved = uni.getStorageSync(STORAGE_KEY)
      if (saved) {
        user.value = saved
      }
    } catch (e) {
      console.error('加载用户失败', e)
    }
  }

  // 保存用户到本地存储
  const saveUser = (userData) => {
    try {
      user.value = userData
      uni.setStorageSync(STORAGE_KEY, userData)
      return true
    } catch (e) {
      console.error('保存用户失败', e)
      return false
    }
  }

  // 注册
  const register = async (username, password, nickname = username) => {
    try {
      // 简单验证
      if (!username || !password) {
        return { success: false, message: '请填写账号和密码' }
      }
      
      if (username.length < 3) {
        return { success: false, message: '账号至少3个字符' }
      }
      
      if (password.length < 6) {
        return { success: false, message: '密码至少6个字符' }
      }

      // 获取已注册用户列表
      let users = []
      try {
        const saved = uni.getStorageSync(USERS_KEY)
        if (saved) {
          users = saved
        }
      } catch (e) {
        // 忽略
      }

      // 检查账号是否已存在
      if (users.find(u => u.username === username)) {
        return { success: false, message: '该账号已存在，请直接登录' }
      }

      // 创建新用户
      const newUser = {
        id: Date.now(),
        username,
        password, // 实际项目中应该加密存储
        nickname,
        avatar: '/static/icons/chanyi.png', // 默认头像
        createTime: new Date().toISOString()
      }

      users.push(newUser)
      uni.setStorageSync(USERS_KEY, users)

      // 自动登录
      const loginResult = await login(username, password)
      return loginResult

    } catch (e) {
      console.error('注册失败', e)
      return { success: false, message: '注册失败，请重试' }
    }
  }

  // 登录
  const login = async (username, password) => {
    try {
      if (!username || !password) {
        return { success: false, message: '请填写账号和密码' }
      }

      // 获取用户列表
      let users = []
      try {
        const saved = uni.getStorageSync(USERS_KEY)
        if (saved) {
          users = saved
        }
      } catch (e) {
        // 忽略
      }

      // 查找用户
      const foundUser = users.find(u => u.username === username && u.password === password)
      
      if (!foundUser) {
        return { success: false, message: '账号或密码错误' }
      }

      // 保存登录状态（不保存密码）
      const loginUser = {
        id: foundUser.id,
        username: foundUser.username,
        nickname: foundUser.nickname,
        avatar: foundUser.avatar,
        loginTime: new Date().toISOString()
      }

      saveUser(loginUser)
      return { success: true, message: '登录成功' }

    } catch (e) {
      console.error('登录失败', e)
      return { success: false, message: '登录失败，请重试' }
    }
  }

  // 退出登录
  const logout = () => {
    try {
      user.value = null
      uni.removeStorageSync(STORAGE_KEY)
      uni.showToast({ title: '已退出登录', icon: 'success' })
    } catch (e) {
      console.error('退出失败', e)
    }
  }

  // 更新用户信息
  const updateUser = (updates) => {
    try {
      if (!user.value) return false

      user.value = { ...user.value, ...updates }
      saveUser(user.value)
      return true
    } catch (e) {
      console.error('更新用户失败', e)
      return false
    }
  }

  // 初始化加载
  loadUser()

  return {
    user,
    isLoggedIn,
    login,
    register,
    logout,
    updateUser,
    loadUser
  }
}
