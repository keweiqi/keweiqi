// 主题管理工具
export const THEME_LIGHT = 'light'
export const THEME_DARK = 'dark'
export const THEME_AUTO = 'auto'

// 获取当前主题（返回实际生效的主题，非 auto）
export function getCurrentTheme() {
  try {
    const savedTheme = uni.getStorageSync('app_theme') || THEME_LIGHT
    if (savedTheme === THEME_AUTO) {
      const systemInfo = uni.getSystemInfoSync()
      return systemInfo.theme || THEME_LIGHT
    }
    return savedTheme
  } catch (e) {
    console.error('获取主题失败', e)
    return THEME_LIGHT
  }
}

// 获取保存的主题设置（可能是 auto）
export function getSavedThemeSetting() {
  try {
    return uni.getStorageSync('app_theme') || THEME_LIGHT
  } catch (e) {
    return THEME_LIGHT
  }
}

// 检查是否为深色主题
export function isDarkTheme() {
  return getCurrentTheme() === THEME_DARK
}

// 设置主题
export function setTheme(theme) {
  try {
    uni.setStorageSync('app_theme', theme)
  } catch (e) {
    console.error('设置主题失败', e)
  }
}

// 切换主题（在亮色和深色之间切换）
export function toggleTheme() {
  const current = getCurrentTheme()
  const newTheme = current === THEME_DARK ? THEME_LIGHT : THEME_DARK
  setTheme(newTheme)
  return newTheme
}

// 初始化主题监听
export function initThemeListener(callback) {
  try {
    uni.onThemeChange?.((res) => {
      const savedTheme = getSavedThemeSetting()
      if (savedTheme === THEME_AUTO && callback) {
        callback(res.theme === THEME_DARK)
      }
    })
  } catch (e) {
    console.error('主题监听初始化失败', e)
  }
}
