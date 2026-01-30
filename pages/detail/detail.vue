<template>
    <view class="page-container">

        <!-- 1. 全屏图片查看器 -->
        <view class="image-viewer" :class="{ visible: showImageViewer }" @tap="closeImageViewer">
            <view class="close-hint">
                <view class="icon-close"></view>
            </view>
            <image :src="currentImage" mode="aspectFit" class="viewer-img" @tap.stop></image>
        </view>

        <!-- 2. 底部动作抽屉 -->
        <view class="drawer-overlay" :class="{ visible: showDrawer }" @tap="closeDrawer"></view>
        <view class="drawer-panel" :class="{ visible: showDrawer }">
            <view class="drawer-handle" @tap="closeDrawer"></view>

            <view class="drawer-item" @tap="handleEdit">
                <image src="https://img.icons8.com/ios-glyphs/60/000000/edit--v1.png" class="drawer-icon"></image>
                <text>编辑主题信息</text>
            </view>

            <view class="drawer-item danger" @tap="confirmDelete">
                <image src="https://img.icons8.com/ios-glyphs/60/FF3B30/delete-forever.png" class="drawer-icon"></image>
                <text>删除该足迹</text>
            </view>

            <view class="drawer-divider"></view>

            <view class="drawer-item cancel" @tap="closeDrawer">
                <text>取消</text>
            </view>
        </view>

        <!-- 3. 顶部导航栏 (动态高度适配核心) -->
        <view class="sticky-nav-bar" :class="{ scrolled: isNavScrolled }" :style="{
            paddingTop: navBar.statusBarHeight + 'px',
            height: navBar.navContentHeight + 'px'
        }">
            <view class="nav-content" :style="{ height: navBar.navContentHeight + 'px' }">
                <!-- 返回按钮组 -->
                <view class="nav-btn-group">
                    <view class="nav-btn" @tap="handleBack">
                        <view class="icon-back"></view>
                    </view>
                    <!-- 菜单按钮 -->
                    <view class="nav-btn" @tap="openDrawer" style="margin-left: 16rpx;">
                        <view class="icon-more"></view>
                    </view>
                </view>

                <!-- 标题 (滚动后显示) -->
                <text class="nav-title-center" :style="{ opacity: isNavScrolled ? 1 : 0 }">
                    {{ detailData.title }}
                </text>
            </view>
        </view>

        <!-- 4. 主内容滚动区 -->
        <scroll-view scroll-y class="main-scroll-view" :scroll-with-animation="true" @scroll="handleScroll">
            <!-- Hero 区域 (顶部大图) -->
            <view class="hero-section">
                <image :src="detailData.cover" mode="aspectFill" class="hero-bg"></image>
                <view class="hero-gradient"></view>
                <view class="hero-stats">
                    <view class="stats-main">
                        <text class="count-big">{{ detailData.count }}</text>
                        <text class="unit-small">{{ detailData.unit }}</text>
                    </view>
                    <text class="stats-sub">{{ detailData.title }} · 始于 {{ detailData.startDate }}</text>
                </view>
            </view>

            <!-- 时间轴内容 -->
            <view class="timeline-container">

                <!-- 10月 2023 -->
                <view class="month-header">
                    <text class="month-title">10月</text>
                    <text class="month-year">2023</text>
                </view>

                <!-- 记录 Item 1 -->
                <view class="timeline-row latest">
                    <view class="time-col">
                        <text class="day-num">28</text>
                        <text class="time-str">18:30</text>
                    </view>
                    <view class="line-col">
                        <view class="node-dot"></view>
                        <view class="v-line"></view>
                    </view>
                    <view class="content-col">
                        <view class="bubble-card">
                            <text class="bubble-text">背部训练日，状态不错，重量提升 5kg。</text>
                            <view class="media-grid col-2">
                                <image
                                    src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                                    mode="aspectFill" class="media-img"
                                    @tap.stop="viewImage('https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')">
                                </image>
                                <image
                                    src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                                    mode="aspectFill" class="media-img"
                                    @tap.stop="viewImage('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')">
                                </image>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 9月 2023 -->
                <view class="month-header">
                    <text class="month-title">9月</text>
                    <text class="month-year">2023</text>
                </view>

                <!-- 记录 Item 2 -->
                <view class="timeline-row">
                    <view class="time-col">
                        <text class="day-num">15</text>
                        <text class="time-str">20:00</text>
                    </view>
                    <view class="line-col">
                        <view class="node-dot"></view>
                        <view class="v-line"></view>
                    </view>
                    <view class="content-col">
                        <view class="bubble-card">
                            <text class="bubble-text">新哑铃到了，开练！</text>
                            <view class="media-grid col-1">
                                <image
                                    src="https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                                    mode="aspectFill" class="media-img"
                                    @tap.stop="viewImage('https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')">
                                </image>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 底部垫高，防止内容被底部按钮遮挡 -->
                <!-- 高度 = 按钮高度 + padding + 安全区 -->
                <view style="height: 200rpx;"></view>
            </view>
        </scroll-view>

        <!-- 5. 底部固定打卡按钮 (使用 absolute 修复转场问题) -->
        <view class="bottom-bar">
            <view class="checkin-btn" @tap="handleCheckIn">
                <view class="icon-plus"></view>
                <text>打卡</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const isNavScrolled = ref(false)
const showImageViewer = ref(false)
const currentImage = ref('')
const showDrawer = ref(false)

// 导航栏高度数据
const navBar = reactive({
    statusBarHeight: 20, // 默认值，防止ssr报错
    navContentHeight: 44 // 默认高度
})

const detailData = reactive({
    id: 1,
    title: '健身打卡',
    count: 108,
    unit: '天',
    cover: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    startDate: '2023.08.15'
})

onMounted(() => {
    // --- 核心：计算导航栏高度 ---
    const sysInfo = uni.getSystemInfoSync()
    navBar.statusBarHeight = sysInfo.statusBarHeight

    // #ifdef MP-WEIXIN
    // 获取胶囊按钮位置
    const menuButton = uni.getMenuButtonBoundingClientRect()
    // 计算胶囊按钮与状态栏的间距
    const gap = menuButton.top - sysInfo.statusBarHeight
    // 导航内容高度 = (间距 * 2) + 胶囊高度
    navBar.navContentHeight = (gap * 2) + menuButton.height
    // #endif

    // #ifndef MP-WEIXIN
    // H5 或 App 端给个标准值
    navBar.navContentHeight = 44
    // #endif

    // 加载数据...
})

const handleScroll = (e) => {
    // 滚动超过 60px 后改变导航栏样式
    isNavScrolled.value = e.detail.scrollTop > 60
}

const handleBack = () => uni.navigateBack()
const openDrawer = () => showDrawer.value = true
const closeDrawer = () => showDrawer.value = false

const handleEdit = () => {
    closeDrawer()
    uni.showToast({ title: '编辑功能开发中', icon: 'none' })
}

const confirmDelete = () => {
    closeDrawer()
    uni.showModal({
        title: '确认删除',
        content: '确定要删除这个足迹吗？',
        confirmColor: '#FF3B30',
        success: (res) => {
            if (res.confirm) {
                uni.showToast({ title: '已删除', icon: 'success' })
                setTimeout(() => uni.navigateBack(), 1000)
            }
        }
    })
}

const viewImage = (src) => {
    currentImage.value = src
    showImageViewer.value = true
}

const closeImageViewer = () => {
    showImageViewer.value = false
    setTimeout(() => currentImage.value = '', 300)
}

const handleCheckIn = () => {
    // 跳转到 checkin.vue 页面
    uni.navigateTo({
        url: '/pages/heckin/heckin' // 请根据你的实际路径调整
    })
    // uni.showLoading({ title: '打卡中...' })
    // setTimeout(() => {
    // 	uni.hideLoading()
    // 	detailData.count++
    // 	uni.showToast({ title: '打卡成功', icon: 'success' })
    // }, 500)
}
</script>

<style lang="scss">
page {
    height: 100%;
    background-color: #F5F7FA;
    overflow: hidden;
    /* 防止页面整体滚动，只允许 scroll-view 滚动 */
}
</style>

<style lang="scss" scoped>
.page-container {
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
}

/* ================== 图片查看器 ================== */
.image-viewer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;

    &.visible {
        opacity: 1;
        pointer-events: auto;
    }
}

.viewer-img {
    width: 100%;
    height: 100%;
}

.close-hint {
    position: absolute;
    top: 180rpx;
    right: 40rpx;
    width: 80rpx;
    height: 80rpx;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}

.icon-close {
    width: 32rpx;
    height: 32rpx;
    position: relative;
}

.icon-close::before,
.icon-close::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 4rpx;
    background-color: #fff;
    border-radius: 2rpx;
}

.icon-close::before {
    transform: rotate(45deg);
}

.icon-close::after {
    transform: rotate(-45deg);
}


/* ================== 动作抽屉 ================== */
.drawer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 5000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;

    &.visible {
        opacity: 1;
        pointer-events: auto;
    }
}

.drawer-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #FFFFFF;
    border-radius: 40rpx 40rpx 0 0;
    z-index: 5001;
    transform: translateY(100%);
    transition: transform 0.3s ease-out;
    padding-bottom: calc(40rpx + env(safe-area-inset-bottom));

    &.visible {
        transform: translateY(0);
    }
}

.drawer-handle {
    width: 80rpx;
    height: 10rpx;
    background: #E5E5EA;
    border-radius: 6rpx;
    margin: 24rpx auto 40rpx auto;
}

.drawer-item {
    display: flex;
    align-items: center;
    padding: 32rpx 48rpx;
    font-size: 34rpx;
    font-weight: 500;
    color: #1D1D1F;

    &:active {
        background-color: #F5F5F5;
    }

    &.danger {
        color: #FF3B30;
    }

    &.cancel {
        justify-content: center;
        color: #8E8E93;
        padding-top: 32rpx;
    }
}

.drawer-icon {
    width: 48rpx;
    height: 48rpx;
    margin-right: 24rpx;
}

.drawer-divider {
    height: 2rpx;
    background: #F0F0F0;
    margin: 16rpx 32rpx;
}

/* ================== 导航栏 (适配核心) ================== */
.sticky-nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    /* 高度和 paddingTop 由内联样式控制 */
    box-sizing: content-box;
    transition: background 0.3s, box-shadow 0.3s;

    &.scrolled {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        box-shadow: 0 1rpx 0 rgba(0, 0, 0, 0.05);

        .nav-btn {
            background: transparent;
            border: 1rpx solid transparent;
        }

        .icon-back {
            border-color: #111;
        }

        .icon-more::before,
        .icon-more::after,
        .icon-more {
            background-color: #111;
        }
    }
}

.nav-content {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 32rpx;
    position: relative;
    box-sizing: border-box;
}

.nav-btn-group {
    display: flex;
    align-items: center;
    z-index: 10;
    height: 100%;
}

.nav-btn {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(10px);
    border: 1rpx solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
}

.icon-back {
    width: 20rpx;
    height: 20rpx;
    border-top: 4rpx solid #FFF;
    border-left: 4rpx solid #FFF;
    transform: rotate(-45deg);
    margin-left: 6rpx;
    transition: border-color 0.3s;
}

.icon-more {
    width: 8rpx;
    height: 8rpx;
    background-color: #FFF;
    border-radius: 50%;
    position: relative;
    transition: background-color 0.3s;
}

.icon-more::before,
.icon-more::after {
    content: '';
    position: absolute;
    width: 8rpx;
    height: 8rpx;
    background-color: #FFF;
    border-radius: 50%;
    top: 0;
    transition: background-color 0.3s;
}

.icon-more::before {
    left: -12rpx;
}

.icon-more::after {
    right: -12rpx;
}

.nav-title-center {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 34rpx;
    font-weight: 600;
    color: #1D1D1F;
    pointer-events: none;
    transition: opacity 0.3s;
}

/* ================== 主内容区域 ================== */
.main-scroll-view {
    flex: 1;
    height: 0;
    width: 100%;
}

.hero-section {
    position: relative;
    height: 600rpx;
    width: 100%;
}

.hero-bg {
    width: 100%;
    height: 100%;
}

.hero-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.6) 100%);
}

.hero-stats {
    position: absolute;
    bottom: 60rpx;
    left: 40rpx;
    color: #FFF;
    z-index: 2;
    text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}

.stats-main {
    display: flex;
    align-items: baseline;
}

.count-big {
    font-size: 100rpx;
    font-weight: 800;
    line-height: 1;
}

.unit-small {
    font-size: 32rpx;
    margin-left: 12rpx;
    opacity: 0.9;
}

.stats-sub {
    display: block;
    margin-top: 16rpx;
    font-size: 24rpx;
    opacity: 0.8;
}

/* ================== 时间轴 ================== */
.timeline-container {
    padding: 20rpx 40rpx;
    background-color: #F5F7FA;
    border-radius: 40rpx 40rpx 0 0;
    margin-top: -40rpx;
    position: relative;
    z-index: 5;
}

.month-header {
    padding: 40rpx 0;
    display: flex;
    align-items: baseline;
}

.month-title {
    font-size: 44rpx;
    font-weight: 800;
    color: #1D1D1F;
    margin-right: 12rpx;
}

.month-year {
    font-size: 26rpx;
    color: #8E8E93;
}

.timeline-row {
    display: flex;
    /* 收紧间距 */
    padding-bottom: 32rpx;
}

.time-col {
    width: 100rpx;
    text-align: right;
    padding-right: 20rpx;
    flex-shrink: 0;
}

.day-num {
    display: block;
    font-size: 36rpx;
    font-weight: 700;
    color: #1D1D1F;
}

.time-str {
    display: block;
    font-size: 22rpx;
    color: #8E8E93;
    margin-top: 4rpx;
}

.line-col {
    width: 30rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex-shrink: 0;
}

.node-dot {
    width: 20rpx;
    height: 20rpx;
    border-radius: 50%;
    background: #FFF;
    border: 4rpx solid #C7C7CC;
    z-index: 2;
    margin-top: 10rpx;
}

.timeline-row.latest .node-dot {
    border-color: #007AFF;
    background: #007AFF;
    box-shadow: 0 0 0 8rpx rgba(0, 122, 255, 0.2);
}

.timeline-row.latest .day-num {
    color: #007AFF;
}

.v-line {
    width: 2rpx;
    flex: 1;
    background: #E5E5EA;
    margin-top: 4rpx;
    margin-bottom: 4rpx;
}

.timeline-row:last-child .v-line {
    display: none;
}

.content-col {
    flex: 1;
    padding-left: 20rpx;
}

.bubble-card {
    background: #FFF;
    padding: 24rpx;
    border-radius: 24rpx;
    border-top-left-radius: 4rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
}

.bubble-text {
    font-size: 30rpx;
    color: #333;
    line-height: 1.5;
    margin-bottom: 16rpx;
    display: block;
}

.media-grid {
    display: grid;
    gap: 12rpx;
    border-radius: 12rpx;
    overflow: hidden;
}

.media-grid.col-1 {
    grid-template-columns: 1fr;
    height: 300rpx;
}

.media-grid.col-2 {
    grid-template-columns: 1fr 1fr;
    height: 180rpx;
}

.media-img {
    width: 100%;
    height: 100%;
    background-color: #eee;
}

/* ================== 底部打卡栏 ================== */
.bottom-bar {
    position: absolute;
    /* 关键：absolute 定位修复转场问题 */
    bottom: 0;
    left: 0;
    width: 100%;

    box-sizing: border-box;
    padding: 20rpx 40rpx;
    /* 安全区适配 */
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));

    /* 白色渐变 + 毛玻璃 */
    background: linear-gradient(to top, rgba(255, 255, 255, 0.98) 70%, rgba(255, 255, 255, 0));
    backdrop-filter: blur(4px);

    z-index: 100;
    pointer-events: none;
}

.checkin-btn {
    pointer-events: auto;
    width: 100%;
    height: 100rpx;
    background: #1D1D1F;
    border-radius: 56rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFF;
    font-weight: 600;
    font-size: 34rpx;
    box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.2);
    transition: transform 0.1s;
}

.checkin-btn:active {
    opacity: 0.9;
    transform: scale(0.96);
}

.icon-plus {
    width: 24rpx;
    height: 24rpx;
    position: relative;
    margin-right: 16rpx;
}

.icon-plus::before,
.icon-plus::after {
    content: '';
    position: absolute;
    background: #FFF;
    border-radius: 2rpx;
}

.icon-plus::before {
    width: 100%;
    height: 4rpx;
    top: 50%;
    transform: translateY(-50%);
}

.icon-plus::after {
    height: 100%;
    width: 4rpx;
    left: 50%;
    transform: translateX(-50%);
}
</style>