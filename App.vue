<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			this.initTheme()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			initTheme() {
				try {
					const theme = uni.getStorageSync('app_theme') || 'light'
					this.applyTheme(theme)
				} catch (e) {
					console.error('主题初始化失败', e)
				}
			},
			applyTheme(theme) {
				const pages = getCurrentPages()
				if (pages.length > 0) {
					const page = pages[pages.length - 1]
					const data = page.data || {}
					if (data.theme !== theme) {
						page.setData({ theme })
					}
				}
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	
	/* ========================================
	 * 全局 CSS 变量系统
	 * ======================================== */
	
	/* 响应式字号系统 - 使用 clamp() 实现平滑过渡 */
	page {
		--font-h1: clamp(40rpx, 8vw, 56rpx);
		--font-h2: clamp(36rpx, 7vw, 48rpx);
		--font-h3: clamp(32rpx, 6vw, 40rpx);
		--font-body: clamp(28rpx, 5vw, 36rpx);
		--font-small: clamp(24rpx, 4vw, 32rpx);
		--font-meta: clamp(20rpx, 3.5vw, 28rpx);
		
		/* 响应式间距系统 */
		--space-xs: clamp(8rpx, 2vw, 16rpx);
		--space-sm: clamp(12rpx, 3vw, 24rpx);
		--space-md: clamp(20rpx, 5vw, 40rpx);
		--space-lg: clamp(30rpx, 8vw, 60rpx);
		--space-xl: clamp(40rpx, 10vw, 80rpx);
		
		/* 响应式组件尺寸 */
		--avatar-size: clamp(100rpx, 15vw, 160rpx);
		--icon-size: clamp(60rpx, 12vw, 100rpx);
		--btn-height: clamp(80rpx, 10vw, 100rpx);
		
		/* 基础样式 */
		background-color: var(--bg-page);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: var(--font-body);
		line-height: 1.6;
		color: var(--text-primary);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		box-sizing: border-box;
	}
	
	/* ========================================
	 * 浅色主题（默认）
	 * ======================================== */
	:root,
	page {
		--bg-page: #f8f3e8;
		--bg-secondary: #ffffff;
		--bg-card: rgba(255, 255, 255, 0.95);
		--bg-card-hover: rgba(255, 255, 255, 0.98);
		
		--text-primary: #333333;
		--text-secondary: #666666;
		--text-muted: #999999;
		
		--color-primary: #8c3d1e;
		--color-secondary: #c4703f;
		--color-accent: #e6a23c;
		--color-success: #67c23a;
		--color-warning: #e6a23c;
		--color-error: #f56c6c;
		
		--border-color: #e8e8e8;
		--shadow-color: rgba(0, 0, 0, 0.1);
		--shadow-card: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
	}
	
	/* ========================================
	 * 深色主题
	 * ======================================== */
	.dark,
	page.dark {
		--bg-page: #1a1a1a;
		--bg-secondary: #222222;
		--bg-card: rgba(34, 34, 34, 0.95);
		--bg-card-hover: rgba(45, 45, 45, 0.98);
		
		--text-primary: #e0e0e0;
		--text-secondary: #b0b0b0;
		--text-muted: #808080;
		
		--color-primary: #c4703f;
		--color-secondary: #8c3d1e;
		--color-accent: #e6a23c;
		--color-success: #67c23a;
		--color-warning: #e6a23c;
		--color-error: #f56c6c;
		
		--border-color: #333333;
		--shadow-color: rgba(0, 0, 0, 0.3);
		--shadow-card: 0 8rpx 24rpx rgba(0, 0, 0, 0.3);
	}
	
	/* ========================================
	 * 安全区域适配
	 * ======================================== */
	page {
		padding-top: env(safe-area-inset-top);
		padding-top: constant(safe-area-inset-top);
	}
	
	.safe-area-top {
		padding-top: env(safe-area-inset-top);
		padding-top: constant(safe-area-inset-top);
	}
	
	.safe-area-bottom {
		padding-bottom: env(safe-area-inset-bottom);
		padding-bottom: constant(safe-area-inset-bottom);
	}
	
	.safe-area-left {
		padding-left: env(safe-area-inset-left);
		padding-left: constant(safe-area-inset-left);
	}
	
	.safe-area-right {
		padding-right: env(safe-area-inset-right);
		padding-right: constant(safe-area-inset-right);
	}
	
	/* ========================================
	 * 全局工具类
	 * ======================================== */
	
	/* 全屏适配 */
	.full-screen {
		width: 100vw;
		width: 100%;
		min-height: 100vh;
		min-height: 100%;
	}
	
	/* 响应式容器 */
	.responsive-container {
		max-width: 750rpx;
		margin: 0 auto;
		padding-left: var(--space-md);
		padding-right: var(--space-md);
	}
	
	/* 图片响应式 */
	image {
		max-width: 100%;
		height: auto;
	}
	
	/* 按钮点击效果 */
	button::after {
		border: none;
	}
	
	/* 滚动条优化 */
	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
	}
	
	/* 触摸反馈 */
	.touch-feedback {
		transition: all 0.2s ease;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}
	
	.touch-feedback:active {
		transform: scale(0.97);
		opacity: 0.9;
	}
	
	/* ========================================
	 * 媒体查询优化
	 * ======================================== */
	
	/* 超小屏幕 */
	@media screen and (max-width: 320px) {
		page {
			--space-md: clamp(16rpx, 4vw, 20rpx);
			--space-lg: clamp(24rpx, 6vw, 30rpx);
		}
	}
	
	/* 平板横屏 */
	@media screen and (min-width: 768px) and (orientation: landscape) {
		page {
			max-width: 100vw;
		}
	}
	
	/* 大屏幕 */
	@media screen and (min-width: 1024px) {
		page {
			font-size: var(--font-body);
		}
	}
</style>
