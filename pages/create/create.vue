<template>
	<view class="page">

		<!-- 状态栏占位 -->
		<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

		<!-- 导航区 -->
		<view class="nav-area" :style="{
			height: navHeight + 'px',
			paddingTop: statusBarHeight + 'px'
		}">
			<view class="close-btn" @click="goBack">
				<view class="icon-close"></view>
			</view>
		</view>

		<scroll-view scroll-y class="scroll-content">
			<view class="content-wrapper">
				<view class="page-header">
					<text class="page-title">新建足迹</text>
					<text class="page-subtitle">定义一个新的生活记录主题</text>
				</view>

				<!-- 预览卡片 -->
				<view class="preview-wrapper">
					<view class="card-preview">
						<image class="card-bg" :src="formData.coverImage" mode="aspectFill"></image>
						<view class="card-gradient"></view>
						<view class="card-inner-layout">
							<view class="card-top-row">
								<view class="card-badge">
									0 <text class="unit-text">{{ displayUnit }}</text>
								</view>
								<view class="change-cover-hint" @click="openDrawer">
									<image src="/static/create-camera.png" mode="aspectFit"></image>
								</view>
							</view>
							<view class="card-bottom-row">
								<view class="info-text">
									<text class="card-title">{{ displayTitle }}</text>
									<text class="card-desc">点击相机图标更换封面</text>
								</view>
								<view class="preview-action-btn">
									<text>{{ displayBtnText }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 表单输入 -->
				<view class="input-block">
					<text class="input-label">主题名称</text>
					<input class="smart-input" v-model="formData.title" placeholder="例如：健身、阅读" :maxlength="20" />
				</view>

				<view class="input-block">
					<text class="input-label">记录单位</text>
					<input class="smart-input" v-model="formData.unit" placeholder="次 / 天 / 本" :maxlength="4" />
				</view>

				<view class="tags-row">
					<view v-for="tag in tags" :key="tag" class="tag" :class="{ active: formData.unit === tag }"
						@click="selectTag(tag)">
						{{ tag }}
					</view>
				</view>

				<view class="input-block">
					<text class="input-label">打卡按钮文案</text>
					<input class="smart-input" v-model="formData.btnText" placeholder="默认：打卡" :maxlength="6" />
				</view>

				<!-- 增加底部垫片，防止内容被底部固定按钮遮挡 -->
				<view style="height: 500rpx;"></view>
			</view>
		</scroll-view>

		<!-- 底部保存栏：修复核心 -->
		<!-- (safeAreaBottom + 20) 确保了按钮不会贴底 -->
		<view class="bottom-bar" :style="{ paddingBottom: (safeAreaBottom + 20) + 'px' }">
			<button class="main-btn" @click="saveData">创建主题</button>
		</view>

		<!-- 抽屉组件保持不变 -->
		<view class="drawer-overlay" :class="{ visible: showDrawer }" @click="closeDrawer"></view>
		<view class="drawer-panel" :class="{ visible: showDrawer }">
			<view class="drawer-header" @click="closeDrawer">
				<view class="drawer-handle"></view>
				<text class="drawer-title">选择封面</text>
			</view>
			<view class="drawer-grid">
				<view class="grid-item" v-for="(img, index) in presetImages" :key="index" @click="selectPreset(img)">
					<image :src="img" mode="aspectFill"></image>
				</view>
			</view>
			<view class="drawer-bottom-action">
				<view class="album-btn" @click="chooseImageFromAlbum">
					<view class="icon-album"></view>
					<text>从相册选择</text>
				</view>
			</view>
		</view>

	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const presetImages = [
	'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
	'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
	'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
	'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
	'https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
	'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
];

const statusBarHeight = ref(0);
const safeAreaBottom = ref(0);
const navHeight = ref(0);
const showDrawer = ref(false);

const formData = ref({
	title: '',
	unit: '次',
	btnText: '',
	coverImage: presetImages[0]
});

const tags = ['次', '天', '本'];

const displayTitle = computed(() => formData.value.title ? formData.value.title : "我的新足迹");
const displayUnit = computed(() => formData.value.unit ? formData.value.unit : "次");
const displayBtnText = computed(() => formData.value.btnText ? formData.value.btnText : "打卡");

onMounted(() => {
	const systemInfo = uni.getSystemInfoSync();
	statusBarHeight.value = systemInfo.statusBarHeight || 44;
	safeAreaBottom.value = systemInfo.safeAreaInsets ? systemInfo.safeAreaInsets.bottom : 0;

	// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
	try {
		const menuButton = uni.getMenuButtonBoundingClientRect();
		if (menuButton) {
			navHeight.value = menuButton.bottom + (menuButton.top - statusBarHeight.value);
		} else {
			navHeight.value = 44 + statusBarHeight.value;
		}
	} catch (e) {
		navHeight.value = 44 + statusBarHeight.value;
	}
	// #endif

	// #ifndef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
	navHeight.value = 44 + statusBarHeight.value;
	// #endif
});

const selectTag = (val) => { formData.value.unit = val; };
const openDrawer = () => { showDrawer.value = true; };
const closeDrawer = () => { showDrawer.value = false; };
const selectPreset = (url) => { formData.value.coverImage = url; closeDrawer(); };
const chooseImageFromAlbum = () => {
	uni.chooseImage({
		count: 1, sizeType: ['compressed'], sourceType: ['album', 'camera'],
		success: (res) => { formData.value.coverImage = res.tempFilePaths[0]; closeDrawer(); }
	});
};
const goBack = () => { uni.navigateBack({ delta: 1 }); };
const saveData = () => {
	if (!formData.value.title.trim()) {
		uni.showToast({ title: '请输入主题名称', icon: 'none' });
		return;
	}
	uni.showToast({ title: '创建成功', icon: 'success' });
};
</script>

<style scoped>
:root {
	--primary: #111111;
	--surface: #F5F7FA;
	--bg: #FFFFFF;
	--text-main: #000000;
	--text-sub: #8E8E93;
	--radius: 48rpx;
	--card-shadow: 0 40rpx 80rpx rgba(0, 0, 0, 0.15);
}

page {
	height: 100%;
}

.page {
	background-color: var(--bg);
	height: 100vh;
	width: 100%;
	display: flex;
	flex-direction: column;
	position: relative;
	box-sizing: border-box;
	overflow: hidden;
}

.nav-area {
	padding-left: 48rpx;
	display: flex;
	align-items: center;
	flex-shrink: 0;
	width: 100%;
}

.close-btn {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background: var(--surface);
	display: flex;
	justify-content: center;
	align-items: center;
}

.scroll-content {
	flex: 1;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
}

.content-wrapper {
	padding: 0 48rpx;
	box-sizing: border-box;
	width: 100%;
}

.page-header {
	margin-bottom: 48rpx;
	margin-top: 20rpx;
}

.page-title {
	font-size: 68rpx;
	font-weight: 800;
	color: var(--text-main);
	display: block;
	margin-bottom: 4rpx;
}

.page-subtitle {
	font-size: 28rpx;
	color: var(--text-sub);
	display: block;
	margin-top: 12rpx;
}

.preview-wrapper {
	margin-bottom: 64rpx;
	position: relative;
}

.card-preview {
	width: 100%;
	height: 280rpx;
	border-radius: var(--radius);
	position: relative;
	overflow: hidden;
	box-shadow: var(--card-shadow);
	transform: translateZ(0);
}

.card-bg {
	width: 100%;
	height: 100%;
	transition: transform 0.6s ease;
}

.card-preview:active .card-bg {
	transform: scale(1.02);
}

.card-gradient {
	position: absolute;
	inset: 0;
	background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.8) 100%);
}

.card-inner-layout {
	position: absolute;
	inset: 0;
	padding: 40rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.card-top-row {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.card-badge {
	background: rgba(255, 255, 255, 0.25);
	backdrop-filter: blur(12px);
	padding: 16rpx 32rpx;
	border-radius: 40rpx;
	color: white;
	font-weight: 700;
	font-size: 32rpx;
	border: 1px solid rgba(255, 255, 255, 0.2);
	white-space: nowrap;
}

.unit-text {
	font-size: 26rpx;
	font-weight: 400;
	margin-left: 4rpx;
}

.change-cover-hint {
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(10px);
	width: 88rpx;
	height: 88rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
	border: 1px solid rgba(255, 255, 255, 0.3);
}

.change-cover-hint image {
	display: block;
	width: 44rpx;
	height: 44rpx;
}

.card-bottom-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 24rpx;
}

.info-text {
	flex: 1;
	min-width: 0;
	padding-right: 20rpx;
}

.card-title {
	color: white;
	font-size: 48rpx;
	font-weight: 700;
	display: block;
	margin-bottom: 8rpx;
	text-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.3);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	line-height: 1.2;
}

.card-desc {
	color: rgba(255, 255, 255, 0.85);
	font-size: 24rpx;
	display: block;
	line-height: 1.2;
}

.preview-action-btn {
	background: white;
	color: #111;
	padding: 16rpx 32rpx;
	border-radius: 60rpx;
	font-size: 26rpx;
	font-weight: 700;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.2);
	white-space: nowrap;
	flex-shrink: 0;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	height: fit-content;
}

.input-block {
	background: var(--surface);
	border-radius: 40rpx;
	padding: 36rpx 40rpx;
	margin-bottom: 32rpx;
	display: flex;
	flex-direction: column;
}

.input-label {
	font-size: 22rpx;
	color: var(--text-sub);
	margin-bottom: 16rpx;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.8px;
}

.smart-input {
	border: none;
	background: transparent;
	font-size: 34rpx;
	font-weight: 600;
	color: var(--text-main);
	width: 100%;
}

.tags-row {
	display: flex;
	gap: 16rpx;
	margin-bottom: 64rpx;
	overflow-x: auto;
	padding: 4rpx;
	white-space: nowrap;
}

.tags-row::-webkit-scrollbar {
	display: none;
}

.tag {
	padding: 16rpx 32rpx;
	background: var(--surface);
	border-radius: 28rpx;
	color: var(--text-sub);
	font-size: 26rpx;
	font-weight: 600;
	white-space: nowrap;
}

.tag.active {
	background: var(--primary);
	color: white;
}

/* --- 底部按钮修复样式 --- */
.bottom-bar {
	position: fixed;
	/* 使用 fixed 固定在底部 */
	bottom: 0;
	left: 0;
	width: 100%;
	/* 关键：防止 padding 将容器撑大超过 100% 宽度 */
	box-sizing: border-box;

	/* 上左右 padding，底部 padding 交给内联样式计算 */
	padding: 20rpx 48rpx 0 48rpx;

	background: linear-gradient(to top, rgba(255, 255, 255, 1) 90%, rgba(255, 255, 255, 0));
	z-index: 100;
}

.main-btn {
	width: 100%;
	height: 112rpx;
	background: var(--primary);
	border-radius: 56rpx;
	color: white;
	font-size: 34rpx;
	font-weight: 700;
	border: none;
	box-shadow: 0 20rpx 50rpx rgba(0, 0, 0, 0.15);
	display: flex;
	align-items: center;
	justify-content: center;
}

.main-btn::after {
	border: none;
}

.drawer-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.6);
	backdrop-filter: blur(2px);
	z-index: 500;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.3s;
}

.drawer-overlay.visible {
	opacity: 1;
	pointer-events: auto;
}

.drawer-panel {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 60%;
	background: #fff;
	border-radius: 48rpx 48rpx 0 0;
	z-index: 600;
	transform: translateY(100%);
	transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	display: flex;
	flex-direction: column;
}

.drawer-panel.visible {
	transform: translateY(0);
}

.drawer-header {
	height: 120rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-bottom: 1px solid #f0f0f0;
	flex-shrink: 0;
}

.drawer-handle {
	width: 80rpx;
	height: 10rpx;
	background: #E0E0E0;
	border-radius: 3px;
	margin-bottom: 16rpx;
}

.drawer-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
}

.drawer-grid {
	flex: 1;
	overflow-y: auto;
	padding: 40rpx;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 24rpx;
}

.grid-item {
	width: calc((100% - 24rpx) / 2);
	aspect-ratio: 16/9;
	border-radius: 24rpx;
	overflow: hidden;
}

.grid-item image {
	width: 100%;
	height: 100%;
}

.drawer-bottom-action {
	height: 160rpx;
	padding: 20rpx 40rpx 40rpx 40rpx;
	border-top: 1px solid #f0f0f0;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
}

.album-btn {
	width: 100%;
	height: 100rpx;
	background: #F2F2F7;
	color: var(--primary);
	border-radius: 50rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 600;
	font-size: 30rpx;
	gap: 16rpx;
}

.icon-close {
	width: 40rpx;
	height: 40rpx;
	position: relative;
}

.icon-close::before,
.icon-close::after {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	width: 100%;
	height: 4rpx;
	background: #111;
}

.icon-close::before {
	transform: translate(-50%, -50%) rotate(45deg);
}

.icon-close::after {
	transform: translate(-50%, -50%) rotate(-45deg);
}

.icon-album {
	position: relative;
	width: 40rpx;
	height: 40rpx;
}

.icon-album::before {
	content: '';
	position: absolute;
	width: 100%;
	height: 80%;
	border: 4rpx solid currentColor;
	top: 10%;
	left: 0;
	border-radius: 4rpx;
	border-bottom-left-radius: 50%;
}

.icon-album::after {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	width: 12rpx;
	height: 12rpx;
	border: 4rpx solid currentColor;
	border-radius: 50%;
}
</style>