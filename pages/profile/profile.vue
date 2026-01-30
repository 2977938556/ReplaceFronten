<template>
	<view class="page-container">
		<!-- 顶部背景装饰 (固定定位) -->
		<view class="top-decoration"></view>

		<!-- 页面内容主体 -->
		<view class="content-wrapper">
			<!-- 状态栏占位 (防止刘海遮挡) -->
			<view class="status-bar"></view>
			
			<!-- 自定义导航栏标题 (可选，视设计而定) -->
			<view class="nav-bar">
				<text class="nav-title">个人中心</text>
			</view>

			<!-- 滚动区域 -->
			<scroll-view scroll-y class="scroll-content">
				
				<!-- 个人资料卡片 -->
				<view class="profile-card" @tap="handleProfileClick">
					<view class="avatar-wrapper">
						<image :src="userInfo.avatar" mode="aspectFill" class="avatar-img"></image>
						<!-- 编辑图标 -->
						<view class="edit-badge">
							<image src="https://img.icons8.com/ios-glyphs/60/ffffff/edit--v1.png" class="badge-icon"></image>
						</view>
					</view>
					
					<view class="profile-info">
						<text class="user-name">{{ userInfo.nickname }}</text>
						<view class="user-id-row" v-if="userInfo.isLoggedIn">
							<text class="id-text">ID: {{ userInfo.id }}</text>
							<!-- 复制图标 -->
							<image src="https://img.icons8.com/material-outlined/48/999999/copy.png" class="copy-icon"></image>
						</view>
					</view>
					
					<!-- 右侧箭头 -->
					<view class="card-arrow"></view>
				</view>

				<!-- 数据统计区域 -->
				<view class="stats-row">
					<view class="stat-card" @tap="viewTotalStats">
						<text class="stat-num">{{ formatNumber(stats.totalCheckins) }}</text>
						<text class="stat-label">累计打卡</text>
					</view>
					<view class="stat-card" @tap="viewAllCategories">
						<text class="stat-num">{{ stats.categoryCount }}</text>
						<text class="stat-label">足迹分类</text>
					</view>
				</view>

				<!-- 系统菜单 -->
				<view class="menu-group">
					<!-- 意见反馈 -->
					<view class="menu-item" @tap="goToFeedback">
						<view class="menu-left">
							<image src="https://img.icons8.com/fluency-systems-regular/48/000000/comments.png" class="menu-icon"></image>
							<text>意见反馈</text>
						</view>
						<view class="menu-right">
							<view class="arrow-right"></view>
						</view>
					</view>

					<!-- 关于我们 -->
					<view class="menu-item" @tap="goToAbout">
						<view class="menu-left">
							<image src="https://img.icons8.com/fluency-systems-regular/48/000000/info.png" class="menu-icon"></image>
							<text>关于生活足迹</text>
						</view>
						<view class="menu-right">
							<view class="arrow-right"></view>
						</view>
					</view>
				</view>
				
				<!-- 退出登录按钮 (仅登录可见) -->
				<view class="logout-btn" v-if="userInfo.isLoggedIn" @tap="handleLogout">
					<text>退出登录</text>
				</view>

				<!-- 版本信息 -->
				<view class="version-info">
					<text>Version {{ version }} (Build {{ buildNumber }})</text>
				</view>
				
				<!-- 底部垫高，防止被 TabBar 遮挡 -->
				<view style="height: 40rpx;"></view>

			</scroll-view>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const version = ref('1.0.2')
const buildNumber = ref('24')

const userInfo = reactive({
	avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
	nickname: '微信用户',
	id: '8839201',
	isLoggedIn: true
})

const stats = reactive({
	totalCheckins: 1208,
	categoryCount: 12
})

onMounted(() => {
	loadUserData()
})

const loadUserData = () => {
	const storedUserData = uni.getStorageSync('userData')
	const isGuestMode = uni.getStorageSync('isGuestMode')
	
	if (storedUserData && storedUserData.isLoggedIn) {
		userInfo.isLoggedIn = true
		userInfo.id = storedUserData.id || '8839201'
		userInfo.nickname = storedUserData.nickname || '微信用户'
		// userInfo.avatar = ...
	} else if (isGuestMode) {
		userInfo.isLoggedIn = false
		userInfo.nickname = '点击登录'
		userInfo.avatar = 'https://static.yeahqq.com/images/default-avatar.png'
	}
}

const formatNumber = (num) => {
	return num ? num.toLocaleString() : '0'
}

const handleProfileClick = () => {
	if (userInfo.isLoggedIn) {
		// 编辑资料逻辑
	} else {
		goToLogin()
	}
}

const handleLogout = () => {
	uni.showModal({
		title: '提示',
		content: '确定要退出登录吗？',
		success: (res) => {
			if (res.confirm) {
				userInfo.isLoggedIn = false
				userInfo.nickname = '点击登录'
				uni.showToast({ title: '已退出', icon: 'none' })
			}
		}
	})
}

const goToLogin = () => uni.navigateTo({ url: '/pages/login/login' })
const viewTotalStats = () => uni.showToast({ title: '统计详情', icon: 'none' })
const viewAllCategories = () => uni.showToast({ title: '分类列表', icon: 'none' })
const goToFeedback = () => uni.navigateTo({ url: '/pages/feedback/feedback' })
const goToAbout = () => uni.navigateTo({ url: '/pages/about/about' })

</script>

<style lang="scss">
page {
	/* 关键：固定页面高度，防止滚动穿透 */
	height: 100%;
	background-color: #F5F7FA;
	overflow: hidden;
}
</style>

<style lang="scss" scoped>
.page-container {
	height: 100%;
	position: relative;
	background-color: #F5F7FA;
}

/* 顶部装饰背景 */
.top-decoration {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 600rpx; /* 加高一点 */
	background: linear-gradient(180deg, #E3E9F3 0%, rgba(245, 247, 250, 0) 100%);
	z-index: 1;
}

.content-wrapper {
	position: relative;
	z-index: 2; /* 确保内容在背景之上 */
	height: 100%;
	display: flex;
	flex-direction: column;
}

/* 状态栏适配 */
.status-bar {
	height: var(--status-bar-height);
	width: 100%;
	flex-shrink: 0;
}

/* 简单的顶部标题栏 */
.nav-bar {
	height: 88rpx;
	display: flex;
	align-items: center;
	padding-left: 40rpx;
	flex-shrink: 0;
}
.nav-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #1D1D1F;
}

/* 滚动区域 */
.scroll-content {
	flex: 1;
	height: 0; /* Flex 布局下的滚动关键 */
	width: 100%;
}

/* 个人资料卡片 */
.profile-card {
	margin: 20rpx 40rpx 40rpx 40rpx; /* 上边距改小，因为有 navbar */
	display: flex;
	align-items: center;
	position: relative;
}

.avatar-wrapper {
	position: relative;
	margin-right: 32rpx;
}

.avatar-img {
	width: 140rpx;
	height: 140rpx;
	border-radius: 50%;
	border: 6rpx solid #FFFFFF;
	box-shadow: 0 12rpx 24rpx rgba(0,0,0,0.06);
	background-color: #eee;
}

.edit-badge {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 44rpx;
	height: 44rpx;
	background: #111;
	border-radius: 50%;
	border: 4rpx solid #FFFFFF;
	display: flex;
	justify-content: center;
	align-items: center;
}

.badge-icon {
	width: 22rpx;
	height: 22rpx;
}

.profile-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.user-name {
	font-size: 44rpx;
	font-weight: 800;
	color: #1D1D1F;
	margin-bottom: 8rpx;
	line-height: 1.2;
}

.user-id-row {
	display: flex;
	align-items: center;
	opacity: 0.6;
}

.id-text {
	font-size: 26rpx;
	color: #000;
	margin-right: 10rpx;
}

.copy-icon {
	width: 24rpx;
	height: 24rpx;
}

/* 手写CSS箭头 */
.card-arrow {
	width: 16rpx;
	height: 16rpx;
	border-top: 4rpx solid #C7C7CC;
	border-right: 4rpx solid #C7C7CC;
	transform: rotate(45deg);
}

/* 统计卡片 */
.stats-row {
	display: flex;
	margin: 0 40rpx 40rpx 40rpx;
	gap: 24rpx;
}

.stat-card {
	flex: 1;
	background: #FFFFFF;
	border-radius: 32rpx;
	padding: 32rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.03);
}

.stat-num {
	font-size: 48rpx;
	font-weight: 700;
	color: #1D1D1F;
	margin-bottom: 4rpx;
}

.stat-label {
	font-size: 24rpx;
	color: #8E8E93;
}

/* 菜单列表 */
.menu-group {
	background: #FFFFFF;
	border-radius: 32rpx;
	margin: 0 40rpx 40rpx 40rpx;
	padding: 0 32rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.03);
}

.menu-item {
	height: 110rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1rpx solid #F0F0F0;
}
.menu-item:last-child {
	border-bottom: none;
}
.menu-item:active {
	opacity: 0.7;
}

.menu-left {
	display: flex;
	align-items: center;
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
}

.menu-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 24rpx;
}

/* 统一的右侧箭头样式 */
.arrow-right {
	width: 14rpx;
	height: 14rpx;
	border-top: 3rpx solid #C7C7CC;
	border-right: 3rpx solid #C7C7CC;
	transform: rotate(45deg);
}

/* 退出登录按钮 */
.logout-btn {
	margin: 0 40rpx;
	height: 96rpx;
	background-color: #fff;
	border-radius: 32rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #FF3B30;
	font-size: 30rpx;
	font-weight: 600;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.03);
}
.logout-btn:active {
	background-color: #FAFAFA;
}

.version-info {
	text-align: center;
	font-size: 24rpx;
	color: #D1D1D6;
	margin-top: 40rpx;
	padding-bottom: 40rpx;
}
</style>
