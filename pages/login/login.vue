<template>
	<view class="page-container">
		
		<!-- Toast 提示 -->
		<view class="toast" :class="{ visible: showToast }">
			<text>{{ toastMessage }}</text>
		</view>

		<!-- 品牌区域 -->
		<view class="brand-section">
			<view class="app-logo">👣</view>
			<text class="app-name">生活足迹</text>
			<text class="app-slogan">记录生活中的微小成就\n量化你的美好时光</text>
		</view>

		<!-- 底部操作区 -->
		<view class="action-section">
			
			<!-- 微信登录按钮 -->
			<view class="wechat-login-btn" @tap="handleLogin">
				<view class="btn-content" v-if="!isLoading">
					<image  style="width: 56rpx;height: 56rpx;" src="/static/weixin.png" mode=""></image>
					<text>微信一键登录</text>
				</view>
				<!-- Loading 状态 -->
				<view class="loading-spinner" v-else></view>
			</view>

			<!-- 暂不登录 -->
			<view class="skip-btn" @tap="handleSkip">
				<text>暂不登录，先逛逛</text>
			</view>

			<!-- 协议勾选区 -->
			<view class="agreement-box" @tap="toggleAgreement">
				<view class="checkbox-wrapper" :class="{ checked: isAgreed, shake: showShake }">
					<view class="custom-checkbox"></view>
				</view>
				<view class="agreement-text">
					我已阅读并同意 
					<text class="link" @tap.stop="viewUserAgreement">《用户协议》</text> 和 
					<text class="link" @tap.stop="viewPrivacyPolicy">《隐私政策》</text>，未注册手机号将自动创建账号。
				</view>
			</view>

		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

// 协议勾选状态
const isAgreed = ref(false)

// Loading 状态
const isLoading = ref(false)

// Toast 显示
const showToast = ref(false)
const toastMessage = ref('')

// 抖动动画
const showShake = ref(false)

// 切换协议勾选
const toggleAgreement = () => {
	isAgreed.value = !isAgreed.value
	showShake.value = false
}

// 显示 Toast 消息
const showToastMessage = (message) => {
	toastMessage.value = message
	showToast.value = true
	setTimeout(() => {
		showToast.value = false
	}, 2000)
}

// 查看用户协议
const viewUserAgreement = () => {
	uni.navigateTo({
		url: '/pages/about/about'
	})
}

// 查看隐私政策
const viewPrivacyPolicy = () => {
	uni.navigateTo({
		url: '/pages/about/about'
	})
}

// 处理微信登录
const handleLogin = () => {
	// 1. 校验协议
	if (!isAgreed.value) {
		// 触发抖动动画
		showShake.value = true
		setTimeout(() => {
			showShake.value = false
		}, 400)
		
		showToastMessage('请先阅读并同意用户协议')
		return
	}
	
	// 2. 进入 Loading 状态
	isLoading.value = true
	
	// 3. 调用微信登录
	uni.login({
		provider: 'weixin',
		success: (loginRes) => {
			console.log('微信登录成功:', loginRes)
			
			// 获取用户信息
			uni.getUserProfile({
				provider: 'weixin',
				desc: '用于完善用户资料',
				success: (profileRes) => {
					console.log('获取用户信息成功:', profileRes)
					
					// TODO: 调用后端接口进行登录验证
					handleLoginSuccess(profileRes.userInfo)
				},
				fail: (err) => {
					console.log('获取用户信息失败:', err)
					// 即使获取用户信息失败，也允许登录（可能用户拒绝了）
					handleLoginSuccess(null)
				}
			})
		},
		fail: (err) => {
			console.error('微信登录失败:', err)
			isLoading.value = false
			
			uni.showModal({
				title: '登录失败',
				content: '微信登录失败，请稍后重试',
				showCancel: false
			})
		}
	})
}

// 登录成功处理
const handleLoginSuccess = (userInfo) => {
	// 保存用户信息到本地存储
	if (userInfo) {
		uni.setStorageSync('userInfo', userInfo)
	}
	
	// TODO: 调用后端接口获取正式的用户数据
	const mockUserData = {
		id: 1,
		nickname: '用户' + Math.floor(Math.random() * 10000),
		avatar: userInfo?.avatarUrl || '',
		isLoggedIn: true
	}
	uni.setStorageSync('userData', mockUserData)
	
	uni.showToast({
		title: '登录成功',
		icon: 'success'
	})
	
	// 延迟跳转到首页
	setTimeout(() => {
		uni.navigateTo({
			url: '/pages/index/index'
		})
	}, 1500)
}

// 暂不登录
const handleSkip = () => {
	// 设置游客模式
	uni.setStorageSync('isGuestMode', true)
	
	uni.showToast({
		title: '进入游客模式',
		icon: 'none'
	})
	
	setTimeout(() => {
		uni.navigateTo({
			url: '/pages/index/index'
		})
	}, 1500)
}
</script>

<style lang="scss" scoped>
page {
	background-color: #FFFFFF;
}

.page-container {
	min-height: 100vh;
	background-color: #FFFFFF;
	display: flex;
	flex-direction: column;
	padding: 0 64rpx;
	justify-content: space-between;
}

/* Toast 提示 */
.toast {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) scale(0.9);
	background: rgba(0, 0, 0, 0.8);
	color: white;
	padding: 24rpx 48rpx;
	border-radius: 60rpx;
	font-size: 28rpx;
	font-weight: 500;
	opacity: 0;
	pointer-events: none;
	transition: all 0.2s;
	z-index: 1000;
	
	&.visible {
		transform: translate(-50%, -50%) scale(1);
		opacity: 1;
	}
}

/* 品牌区域 */
.brand-section {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding-bottom: 160rpx;
}

.app-logo {
	width: 192rpx;
	height: 192rpx;
	background: #111;
	border-radius: 48rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 96rpx;
	color: white;
	box-shadow: 0 40rpx 80rpx rgba(0, 0, 0, 0.15);
	margin-bottom: 48rpx;
	animation: breathe 4s ease-in-out infinite;
}

.app-name {
	font-size: 56rpx;
	font-weight: 800;
	color: #1D1D1F;
	letter-spacing: -1px;
	margin-bottom: 24rpx;
}

.app-slogan {
	font-size: 30rpx;
	color: #8E8E93;
	text-align: center;
	line-height: 1.6;
	max-width: 480rpx;
}

/* 底部操作区 */
.action-section {
	padding-bottom: 120rpx;
}

/* 微信登录按钮 */
.wechat-login-btn {
	width: 100%;
	height: 112rpx;
	background: #07C160;
	border-radius: 56rpx;
	border: none;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 20rpx;
	box-shadow: 0 20rpx 40rpx rgba(7, 193, 96, 0.25);
	transition: transform 0.1s, opacity 0.2s;
	
	&:active {
		transform: scale(0.98);
		opacity: 0.9;
	}
}

.btn-content {
	display: flex;
	align-items: center;
	gap: 16rpx;
	color: white;
	font-size: 34rpx;
	font-weight: 600;
}

.wechat-icon {
	width: 48rpx;
	height: 48rpx;
	flex-shrink: 0;
}

/* Loading 状态 */
.loading-spinner {
	width: 40rpx;
	height: 40rpx;
	border: 4rpx solid rgba(255, 255, 255, 0.3);
	border-top-color: white;
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

/* 暂不登录 */
.skip-btn {
	margin-top: 40rpx;
	text-align: center;
	font-size: 28rpx;
	color: #8E8E93;
	padding: 20rpx;
}

/* 协议勾选区 */
.agreement-box {
	margin-top: 48rpx;
	display: flex;
	align-items: flex-start;
	gap: 16rpx;
	justify-content: center;
}

.checkbox-wrapper {
	position: relative;
	width: 36rpx;
	height: 36rpx;
	flex-shrink: 0;
	margin-top: 4rpx;
}

.custom-checkbox {
	width: 100%;
	height: 100%;
	border: 3rpx solid #C7C7CC;
	border-radius: 50%;
	transition: all 0.2s;
	display: flex;
	justify-content: center;
	align-items: center;
}

/* 选中状态 */
.checkbox-wrapper.checked .custom-checkbox {
	background: #111;
	border-color: #111;
}

.checkbox-wrapper.checked .custom-checkbox::after {
	content: '';
	width: 16rpx;
	height: 8rpx;
	border-left: 4rpx solid white;
	border-bottom: 4rpx solid white;
	transform: rotate(-45deg) translate(2rpx, -2rpx);
}

/* 抖动动画 */
.shake {
	animation: shake 0.4s cubic-bezier(.36, .07, .19, .97) both;
}

.agreement-text {
	font-size: 24rpx;
	color: #999;
	line-height: 1.5;
	text-align: left;
}

.link {
	color: #576B95;
	font-weight: 500;
}

/* 动画定义 */
@keyframes fadeInDown {
	from {
		opacity: 0;
		transform: translateY(-40rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(40rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes breathe {
	0%, 100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.03);
	}
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

@keyframes shake {
	10%, 90% {
		transform: translate3d(-2rpx, 0, 0);
	}
	20%, 80% {
		transform: translate3d(4rpx, 0, 0);
	}
	30%, 50%, 70% {
		transform: translate3d(-8rpx, 0, 0);
	}
	40%, 60% {
		transform: translate3d(8rpx, 0, 0);
	}
}
</style>
