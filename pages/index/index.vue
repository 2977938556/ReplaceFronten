<template>
	<view class="page-container">
		<!-- 头部 -->
		<view class="header">
			<view class="header-text">
				<text class="header-title">我的足迹</text>
				<text class="header-subtitle">记录生活中的微小成就</text>
			</view>
			<view class="header-add-btn" @tap="handleCreate">
				<view class="icon-plus"></view>
			</view>
		</view>

		<!-- 列表区域 -->
		<scroll-view scroll-y class="content" :scroll-with-animation="true">
			<view class="scroll-inner">
				<!-- 足迹卡片列表 -->
				<view 
					v-for="(item) in footprintList" 
					:key="item.id"
					class="immersive-card"
					@tap="goToDetail(item)"
				>
					<image :src="item.cover" mode="aspectFill" class="card-bg-img"></image>
					<view class="card-mask"></view>
					<view class="card-content-layer">
						<view class="count-badge">
							{{ item.count }}<text class="unit">{{ item.unit }}</text>
						</view>
						<view class="card-bottom-row">
							<view class="text-info">
								<text class="card-title">{{ item.title }}</text>
								<view class="card-meta">
									<view class="status-dot" :class="{ inactive: !item.isActive }"></view>
									<text>上次：{{ item.lastCheckIn || '暂无记录' }}</text>
								</view>
							</view>
							<view class="action-btn" @tap.stop="quickCheckIn(item)">
								{{ item.btnText }}
							</view>
						</view>
					</view>
				</view>

				<!-- 新建引导卡片 -->
				<view class="create-new-card" @tap="handleCreate">
					<text>+ 创建新的足迹分类</text>
				</view>
				
				<!-- 底部稍微留一点留白，防止内容贴底 -->
				<view style="height: 40rpx;"></view>
			</view>
		</scroll-view>

		<!-- 【已删除】：底部自定义导航 HTML -->
	</view>
</template>

<script setup>
import { ref } from 'vue'

// 【已删除】：currentTab 变量和 switchTab 函数，因为系统会自动处理

// 足迹列表数据
const footprintList = ref([
	{
		id: 1,
		title: '健身打卡',
		count: 108,
		unit: '天',
		cover: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
		lastCheckIn: '今天 08:30',
		isActive: true,
		btnText: '打卡'
	},
	{
		id: 2,
		title: '海底捞',
		count: 24,
		unit: '次',
		cover: 'https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
		lastCheckIn: '2天前',
		isActive: false,
		btnText: '开吃 🍲'
	},
	{
		id: 3,
		title: '每日咖啡',
		count: 365,
		unit: '杯',
		cover: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
		lastCheckIn: '昨天',
		isActive: true,
		btnText: '去喝一杯'
	}
])

// 跳转详情页
const goToDetail = (item) => {
	uni.navigateTo({ url: `/pages/detail/detail?id=${item.id}` })
}

// 快速打卡
const quickCheckIn = (item) => {
	uni.showLoading({ title: '打卡中...' })
	setTimeout(() => {
		uni.hideLoading()
		const index = footprintList.value.findIndex(p => p.id === item.id)
		if (index !== -1) {
			footprintList.value[index].count++
			footprintList.value[index].isActive = true
			footprintList.value[index].lastCheckIn = '刚刚'
		}
		uni.showToast({ title: '打卡成功！', icon: 'success' })
	}, 500)
}

// 跳转新建页面
const handleCreate = () => {
	uni.navigateTo({ url: '/pages/create/create' })
}
</script>

<style lang="scss">
page {
	/* 重要：使用了系统TabBar后，窗口可用高度会自动减去TabBar的高度 */
	height: 100%;
	background-color: #F5F7FA;
	box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
.page-container {
	height: 100%; 
	display: flex;
	flex-direction: column;
	position: relative;
	overflow: hidden;
}

/* ================== 头部区域 ================== */
.header {
	padding: 140rpx 40rpx 40rpx 40rpx; 
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #F5F7FA;
	z-index: 10;
	flex-shrink: 0;
	align-items: flex-end;
}

.header-text {
	display: flex;
	flex-direction: column;
}

.header-title {
	font-size: 56rpx;
	font-weight: 800;
	color: #1D1D1F;
	letter-spacing: -1px;
}

.header-subtitle {
	font-size: 26rpx;
	color: #8E8E93;
	margin-top: 8rpx;
}

.header-add-btn {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background-color: white;
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
	display: flex;
	justify-content: center;
	align-items: center;
}

.icon-plus {
	width: 30rpx;
	height: 30rpx;
	position: relative;
}
.icon-plus::before, .icon-plus::after {
	content: '';
	position: absolute;
	background-color: #111;
	border-radius: 2rpx;
}
.icon-plus::before {
	width: 100%;
	height: 4rpx;
	top: 50%;
	left: 0;
	transform: translateY(-50%);
}
.icon-plus::after {
	width: 4rpx;
	height: 100%;
	left: 50%;
	top: 0;
	transform: translateX(-50%);
}

/* ================== 列表区域 ================== */
.content {
	flex: 1; 
	height: 0; 
	width: 100%;
}

.scroll-inner {
	padding: 20rpx 40rpx;
}

/* 沉浸式卡片 */
.immersive-card {
	position: relative;
	width: 100%;
	height: 280rpx;
	border-radius: 40rpx;
	margin-bottom: 40rpx;
	overflow: hidden;
	box-shadow: 0 20rpx 48rpx rgba(0, 0, 0, 0.08);
	transition: transform 0.2s ease;
	background-color: #fff;
}

.immersive-card:active {
	transform: scale(0.98);
}

.card-bg-img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.card-mask {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.85) 100%);
	z-index: 1;
}

.card-content-layer {
	position: absolute;
	width: 100%;
	height: 100%;
	padding: 40rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	z-index: 2;
	box-sizing: border-box;
}

.count-badge {
	align-self: flex-start;
	background: rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	padding: 12rpx 28rpx;
	border-radius: 40rpx;
	color: white;
	font-weight: 700;
	font-size: 32rpx;
	display: flex;
	align-items: baseline;
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.count-badge .unit {
	font-size: 24rpx;
	margin-left: 6rpx;
	font-weight: 400;
	opacity: 0.9;
}

.card-bottom-row {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	gap: 20rpx;
}

.text-info {
	flex: 1;
	color: white;
	text-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.4);
	min-width: 0;
}

.card-title {
	display: block;
	font-size: 40rpx;
	font-weight: 700;
	margin-bottom: 12rpx;
	letter-spacing: 1px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.card-meta {
	display: flex;
	align-items: center;
	font-size: 22rpx;
	opacity: 0.85;
	font-weight: 500;
}

.status-dot {
	width: 12rpx;
	height: 12rpx;
	background-color: #50E3C2;
	border-radius: 50%;
	margin-right: 12rpx;
	box-shadow: 0 0 12rpx #50E3C2;
}
.status-dot.inactive {
	background-color: #ccc;
	box-shadow: none;
}

.action-btn {
	height: 72rpx;
	padding: 0 32rpx;
	border-radius: 36rpx;
	background: rgba(255, 255, 255, 0.95);
	color: #111;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	font-weight: 700;
	white-space: nowrap;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
	flex-shrink: 0;
}
.action-btn:active {
	background: #E5E5E5;
}

.create-new-card {
	width: 100%;
	height: 160rpx;
	border: 4rpx dashed #D1D1D6;
	border-radius: 40rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #999;
	font-size: 28rpx;
	font-weight: 600;
	background-color: transparent;
	box-sizing: border-box;
}
.create-new-card:active {
	background-color: rgba(0,0,0,0.02);
}

/* 【已删除】：.safe-area-spacer, .bottom-nav, .nav-item, .nav-icon, .nav-text 样式 */
</style>