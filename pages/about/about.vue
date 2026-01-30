<template>
	<view class="page-container">
		<!-- 品牌展示区域 -->
		<view class="brand-area">
			<view class="app-logo">
				<text class="logo-icon">👣</text>
			</view>
			<text class="app-name">生活足迹</text>
			<text class="app-version">Version 1.0.3</text>
		</view>

		<!-- 菜单列表 -->
		<view class="menu-group">
			<view class="menu-item" @click="handleFeatureIntro">
				<text class="menu-text">功能介绍</text>
				<svg class="menu-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="9 18 15 12 9 6"></polyline>
				</svg>
			</view>

			<view class="menu-item" @click="handleUserAgreement">
				<text class="menu-text">用户协议</text>
				<svg class="menu-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="9 18 15 12 9 6"></polyline>
				</svg>
			</view>

			<view class="menu-item" @click="handlePrivacyPolicy">
				<text class="menu-text">隐私政策</text>
				<svg class="menu-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="9 18 15 12 9 6"></polyline>
				</svg>
			</view>

			<view class="menu-item" @click="handleThirdParty">
				<text class="menu-text">第三方信息共享清单</text>
				<svg class="menu-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="9 18 15 12 9 6"></polyline>
				</svg>
			</view>
		</view>

		<!-- 版权信息 -->
		<view class="footer-copyright">
			<text class="copyright-text">Life Footprints Team © 2024</text>
			<text class="copyright-text">All Rights Reserved</text>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

// 功能介绍
const handleFeatureIntro = () => {
	uni.showToast({
		title: '跳转功能介绍',
		icon: 'none'
	})
	// TODO: 跳转到功能介绍页面
	// uni.navigateTo({
	// 	url: '/pages/featureIntro/index'
	// })
}

// 用户协议
const handleUserAgreement = () => {
	uni.showToast({
		title: '查看用户协议',
		icon: 'none'
	})
	// TODO: 跳转到用户协议页面
	// uni.navigateTo({
	// 	url: '/pages/userAgreement/index'
	// })
}

// 隐私政策
const handlePrivacyPolicy = () => {
	uni.showToast({
		title: '查看隐私政策',
		icon: 'none'
	})
	// TODO: 跳转到隐私政策页面
	// uni.navigateTo({
	// 	url: '/pages/privacyPolicy/index'
	// })
}

// 第三方信息共享清单
const handleThirdParty = () => {
	uni.showToast({
		title: '查看第三方清单',
		icon: 'none'
	})
	// TODO: 跳转到第三方清单页面
	// uni.navigateTo({
	// 	url: '/pages/thirdParty/index'
	// })
}
</script>

<style lang="scss" scoped>
/* 页面基础配置 */
page {
	background-color: #F5F7FA;
	height: 100%;
}

.page-container {
	min-height: 100vh;
	background-color: #F5F7FA;
	padding: 20rpx 40rpx;
	display: flex;
	flex-direction: column;
	/* 确保容器占满整个视口高度 */
	height: 100vh;
	box-sizing: border-box;
	overflow: hidden;
}

/* 品牌区域 */
.brand-area {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 60rpx;
	margin-bottom: 80rpx;
	flex-shrink: 0;
}

.app-logo {
	width: 192rpx;
	height: 192rpx;
	background-color: #111111;
	border-radius: 48rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.12);
	margin-bottom: 48rpx;
}

.logo-icon {
	font-size: 88rpx;
}

.app-name {
	font-size: 52rpx;
	font-weight: 800;
	color: #1D1D1F;
	margin-bottom: 16rpx;
	letter-spacing: -0.5px;
}

.app-version {
	font-size: 26rpx;
	color: #8E8E93;
	font-weight: 500;
	font-family: monospace;
	opacity: 0.8;
}

/* 菜单列表 */
.menu-group {
	background-color: #FFFFFF;
	border-radius: 40rpx;
	padding: 0 48rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.03);
	flex-shrink: 0;
}

.menu-item {
	height: 120rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
	transition: opacity 0.2s;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-item:active {
	opacity: 0.5;
}

.menu-text {
	font-size: 32rpx;
	font-weight: 500;
	color: #1D1D1F;
}

.menu-arrow {
	flex-shrink: 0;
}

/* 版权信息 */
.footer-copyright {
	margin-top: auto;
	text-align: center;
	padding: 60rpx 0;
	flex-shrink: 0;
}

.copyright-text {
	display: block;
	font-size: 22rpx;
	color: #D1D1D6;
	line-height: 1.8;
}

/* 响应式调整 - 大屏幕 */
@media screen and (min-width: 768px) {
	.page-container {
		padding: 40rpx 80rpx;
	}
	
	.brand-area {
		margin-top: 100rpx;
		margin-bottom: 100rpx;
	}
	
	.menu-group {
		border-radius: 48rpx;
		padding: 0 56rpx;
	}
}
</style>
