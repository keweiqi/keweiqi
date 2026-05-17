import { ref, onMounted } from 'vue'
import { isDarkTheme, setTheme, toggleTheme as toggleThemeUtil, initThemeListener, THEME_LIGHT, THEME_DARK } from '../utils/theme.js'

export function useTheme() {
  const isDark = ref(false)

  // 加载主题
  const loadTheme = () => {
    try {
      isDark.value = isDarkTheme()
    } catch (e) {
      console.error('加载主题失败', e)
      isDark.value = false
    }
  }

  // 切换主题
  const toggleTheme = () => {
    toggleThemeUtil()
    isDark.value = !isDark.value
  }

  // 设置主题
  const setThemeMode = (theme) => {
    setTheme(theme)
    isDark.value = theme === THEME_DARK
  }

  onMounted(() => {
    loadTheme()
    initThemeListener((dark) => {
      isDark.value = dark
    })
  })

  return {
    isDark,
    loadTheme,
    toggleTheme,
    setThemeMode
  }
}
