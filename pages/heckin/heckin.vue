<template>
    <view class="container">
        <!-- === 3D 时间选择器 === -->
        <view class="picker-overlay" :class="{ visible: showPicker }" @click="closeTimePicker"></view>

        <view class="picker-panel" :class="{ visible: showPicker }">
            <view class="picker-header">
                <view class="picker-btn cancel" @click="closeTimePicker">取消</view>
                <view class="picker-title">选择时间</view>
                <view class="picker-btn confirm" @click="confirmTime">确定</view>
            </view>

            <view class="wheel-container">
                <view class="wheel-highlight"></view>

                <!-- 滚轮 1: 日期 -->
                <scroll-view class="wheel-col" scroll-y="true" :scroll-into-view="toViewDate"
                    :scroll-with-animation="true" @scroll="onScrollDate">
                    <view class="wheel-placeholder"></view>
                    <view v-for="(item, index) in dateOptions" :key="index" class="wheel-item" :id="'date' + index">
                        {{ item.label }}
                    </view>
                    <view class="wheel-placeholder"></view>
                </scroll-view>

                <!-- 滚轮 2: 小时 -->
                <scroll-view class="wheel-col" scroll-y="true" :scroll-into-view="toViewHour"
                    :scroll-with-animation="true" @scroll="onScrollHour">
                    <view class="wheel-placeholder"></view>
                    <view v-for="(item, index) in hourOptions" :key="index" class="wheel-item" :id="'hour' + index">
                        {{ item.label }}
                    </view>
                    <view class="wheel-placeholder"></view>
                </scroll-view>

                <!-- 滚轮 3: 分钟 -->
                <scroll-view class="wheel-col" scroll-y="true" :scroll-into-view="toViewMinute"
                    :scroll-with-animation="true" @scroll="onScrollMinute">
                    <view class="wheel-placeholder"></view>
                    <view v-for="(item, index) in minuteOptions" :key="index" class="wheel-item" :id="'min' + index">
                        {{ item.label }}
                    </view>
                    <view class="wheel-placeholder"></view>
                </scroll-view>
            </view>
        </view>

        <!-- 导航栏 -->
        <view class="nav-bar">
            <view class="close-btn" @click="handleCancel">
                <image style="width: 44rpx;height: 44rpx;" src="../../static/all-black.png"></image>
            </view>
            <view class="page-title">记录 · <text class="accent">健身</text></view>
            <view style="width: 72rpx"></view>
        </view>

        <!-- 内容区域 -->
        <scroll-view class="content-scroll" scroll-y="true">
            <!-- 文本输入 -->
            <view class="text-area-container">
                <textarea class="main-textarea" placeholder="此刻的想法...（选填）" v-model="postText"
                    :maxlength="-1"></textarea>
            </view>

            <!-- 图片网格 -->
            <view class="media-grid">
                <view v-for="(img, index) in imageList" :key="index" class="media-item">
                    <image mode="aspectFill" :src="img" class="media-img"></image>
                    <view class="delete-img" @click="deleteImage(index)">×</view>
                </view>

                <!-- 添加按钮 -->
                <view class="add-btn" @click="chooseImage" v-if="imageList.length < 9">
                    <view class="add-icon">
                        haohaohao
                        <image style="width: 44rpx;height: 44rpx;" src="../../static/add-image.png"></image>
                    </view>

                </view>
            </view>

            <!-- 元数据工具栏 -->
            <view class="meta-toolbar">
                <!-- 时间 -->
                <view class="meta-chip" :class="{ disabled: false }" @click="openTimePicker">
                    <svg class="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <text class="chip-text">{{ timeDisplay }}</text>
                </view>

                <!-- 地点 -->
                <view class="meta-chip" :class="{ disabled: !showLocation }" @click="toggleLocation">
                    <svg class="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <text class="chip-text">{{ locationText }}</text>
                </view>
            </view>
        </scroll-view>

        <!-- 提交按钮 -->
        <view class="bottom-bar">
            <button class="submit-btn" @click="submitPost">打卡</button>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";

// --- 状态数据 ---
const postText = ref("");
const imageList = ref([]);
const showLocation = ref(true);
const showPicker = ref(false);
const locationText = ref("乐刻健身(三里屯店)");
const timeDisplay = ref("今天 18:42");

// --- Picker 相关状态 ---
const ITEM_HEIGHT = 44; // px
let dates = [];
const dateOptions = reactive([]);
const hourOptions = reactive([]);
const minuteOptions = reactive([]);

// 滚轮吸附逻辑需要的 ID
const toViewDate = ref("");
const toViewHour = ref("");
const toViewMinute = ref("");

// 当前选中的索引（用于回显）
const currentDateIndex = ref(0);
const currentHourIndex = ref(0);
const currentMinIndex = ref(0);

// --- 生命周期 ---
onMounted(() => {
    initPickerData();
    // 设置默认时间显示
    const now = new Date();
    currentHourIndex.value = now.getHours();
    currentMinIndex.value = now.getMinutes();
    updateTimeDisplay();
});

// --- 初始化 Picker 数据 ---
function initPickerData() {
    const today = new Date();

    // 生成日期 (过去30天)
    for (let i = -30; i <= 0; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push(d);

        let label = "";
        if (i === 0) label = "今天";
        else if (i === -1) label = "昨天";
        else label = `${d.getMonth() + 1}月${d.getDate()}日`;

        dateOptions.push({ label, value: d });
    }

    // 生成小时
    for (let i = 0; i < 24; i++) {
        hourOptions.push({ label: String(i).padStart(2, "0"), value: i });
    }

    // 生成分钟
    for (let i = 0; i < 60; i++) {
        minuteOptions.push({ label: String(i).padStart(2, "0"), value: i });
    }
}

// --- 方法 ---

// 1. 图片上传
function chooseImage() {
    uni.chooseImage({
        count: 9 - imageList.value.length,
        success: (res) => {
            imageList.value = [...imageList.value, ...res.tempFilePaths];
        },
    });
}

function deleteImage(index) {
    uni.showModal({
        title: "提示",
        content: "确定删除这张图片吗？",
        success: (res) => {
            if (res.confirm) {
                imageList.value.splice(index, 1);
            }
        },
    });
}

// 2. 地理位置切换
function toggleLocation() {
    showLocation.value = !showLocation.value;
    if (showLocation.value) {
        locationText.value = "乐刻健身(三里屯店)";
    } else {
        locationText.value = "不显示位置";
    }
}

// 3. 时间选择器逻辑
function openTimePicker() {
    showPicker.value = true;
    // 滚动到当前位置
    setTimeout(() => {
        scrollToIndex("date", currentDateIndex.value);
        scrollToIndex("hour", currentHourIndex.value);
        scrollToIndex("min", currentMinIndex.value);
    }, 100);
}

function closeTimePicker() {
    showPicker.value = false;
}

function confirmTime() {
    updateTimeDisplay();
    closeTimePicker();
}

function updateTimeDisplay() {
    const dIndex = currentDateIndex.value;
    const hIndex = currentHourIndex.value;
    const mIndex = currentMinIndex.value;

    const dateStr = dateOptions[dIndex]?.label || "今天";
    const timeStr = `${hourOptions[hIndex]?.label}:${minuteOptions[mIndex]?.label}`;

    timeDisplay.value = `${dateStr} ${timeStr}`;
}

// 辅助：滚动到指定索引
function scrollToIndex(prefix, index) {
    if (prefix === "date") toViewDate.value = `date${index}`;
    if (prefix === "hour") toViewHour.value = `hour${index}`;
    if (prefix === "min") toViewMinute.value = `min${index}`;
}

// 滚动事件监听 (计算当前选中项)
function onScrollDate(e) {
    const scrollTop = e.detail.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT) + 1; // +1 因为有占位符
    if (index >= 0 && index < dateOptions.length + 1) {
        // 只有当用户停止滚动时才更新，防止抖动，这里简化为直接计算
        // 实际项目中可能需要防抖
        currentDateIndex.value = Math.max(
            0,
            Math.min(index, dateOptions.length - 1)
        );
    }
}
function onScrollHour(e) {
    const scrollTop = e.detail.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT) + 1;
    if (index >= 0 && index < hourOptions.length + 1) {
        currentHourIndex.value = Math.max(0, Math.min(index, 23));
    }
}
function onScrollMinute(e) {
    const scrollTop = e.detail.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT) + 1;
    if (index >= 0 && index < minuteOptions.length + 1) {
        currentMinIndex.value = Math.max(0, Math.min(index, 59));
    }
}

// 4. 底部按钮
function handleCancel() {
    uni.showModal({
        title: "提示",
        content: "确定取消打卡吗？",
        success: (res) => {
            if (res.confirm) uni.navigateBack();
        },
    });
}

function submitPost() {
    if (!postText.value && imageList.value.length === 0) {
        uni.showToast({ title: "请输入内容或选择图片", icon: "none" });
        return;
    }

    uni.showLoading({ title: "发布中..." });

    // 模拟网络请求
    setTimeout(() => {
        uni.hideLoading();
        uni.showToast({ title: "发布成功！", icon: "success" });
        setTimeout(() => uni.navigateBack(), 1500);
    }, 1000);
}
</script>

<style>
/* 基础变量 */
page {
    background-color: #e0e0e0;
    height: 100%;
    --primary: #111111;
    --surface: #ffffff;
    --bg: #f5f7fa;
    --text-main: #1d1d1f;
    --text-sub: #8e8e93;
    --accent: #4a90e2;
    --radius: 48rpx;
    /* 24px * 2 */
}

view,
text,
button,
input,
textarea {
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
        "Helvetica Neue", sans-serif;
}

/* 主容器 */
.container {
    width: 100%;
    height: 100vh;
    background-color: var(--bg);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
}

/* --- 导航栏 --- */
.nav-bar {
    height: 200rpx;
    /* 100px * 2 */
    padding-top: 100rpx;
    /* 50px * 2 */
    padding-left: 40rpx;
    padding-right: 40rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg);
    z-index: 10;
}

.close-btn {
    width: 72rpx;
    height: 72rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.05);
    color: var(--text-main);
}

.page-title {
    font-size: 34rpx;
    font-weight: 600;
    color: var(--text-main);
}

.page-title .accent {
    color: var(--accent);
}

/* --- 内容区域 --- */
.content-scroll {
    flex: 1;
    height: 0;
    /* Flex布局关键 */
    padding: 40rpx 48rpx 200rpx 48rpx;
}

/* 文本输入 */
.text-area-container {
    background: transparent;
    margin-bottom: 48rpx;
}

.main-textarea {
    width: 100%;
    min-height: 240rpx;
    border: none;
    background: transparent;
    font-size: 36rpx;
    line-height: 1.5;
    color: var(--text-main);
    resize: none;
}

/* 媒体九宫格 */
.media-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16rpx;
    margin-bottom: 60rpx;
}

.media-item {
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    /* 1:1 正方形 */
    border-radius: 24rpx;
    overflow: hidden;
    background: #fff;
}

.media-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.delete-img {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    width: 40rpx;
    height: 40rpx;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
}

.add-btn {
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    background: #efeff4;
    border-radius: 24rpx;
    cursor: pointer;
}

.add-btn:active {
    background: #e5e5ea;
}

.add-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #a0a0a5;
}

/* --- 元数据工具栏 --- */
.meta-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 24rpx;
}

.meta-chip {
    height: 80rpx;
    padding: 0 32rpx;
    background: #ffffff;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
    cursor: pointer;
}

.meta-chip:active {
    transform: scale(0.96);
}

.chip-icon {
    width: 40rpx !important;
    height: 40rpx !important;
    margin-right: 16rpx;
    color: var(--accent);
}

.chip-text {
    font-size: 28rpx;
    font-weight: 500;
    color: #1d1d1f;
}

.meta-chip.disabled .chip-icon {
    color: #8e8e93;
}

.meta-chip.disabled .chip-text {
    color: #8e8e93;
}

/* --- 底部提交栏 --- */
.bottom-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 40rpx 48rpx 68rpx 48rpx;
    background: linear-gradient(to top,
            rgba(255, 255, 255, 1) 85%,
            rgba(255, 255, 255, 0));
    z-index: 100;
}

.submit-btn {
    width: 100%;
    height: 112rpx;
    background: var(--primary);
    border-radius: 56rpx;
    color: white;
    font-size: 34rpx;
    font-weight: 700;
    border: none;
    cursor: pointer;
    box-shadow: 0 20rpx 50rpx rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
}

.submit-btn:active {
    transform: scale(0.98);
}

/* =========================================
   3D 滚轮时间选择器样式
   ========================================= */
.picker-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
}

.picker-overlay.visible {
    opacity: 1;
    pointer-events: auto;
}

.picker-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #ffffff;
    border-radius: 48rpx 48rpx 0 0;
    z-index: 2001;
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    padding-bottom: 60rpx;
    box-shadow: 0 -20rpx 80rpx rgba(0, 0, 0, 0.1);
}

.picker-panel.visible {
    transform: translateY(0);
}

.picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 32rpx;
    border-bottom: 1rpx solid #f5f5f5;
}

.picker-btn {
    font-size: 32rpx;
    padding: 20rpx;
}

.picker-btn.cancel {
    color: #8e8e93;
}

.picker-btn.confirm {
    color: var(--accent);
    font-weight: 600;
}

.picker-title {
    font-weight: 600;
    font-size: 32rpx;
}

.wheel-container {
    position: relative;
    height: 440rpx;
    /* 220px * 2 */
    display: flex;
    justify-content: center;
    overflow: hidden;
    /* 3D 遮罩效果 - webkit mask */
    mask-image: linear-gradient(to bottom,
            transparent,
            black 20%,
            black 80%,
            transparent);
    -webkit-mask-image: linear-gradient(to bottom,
            transparent 0%,
            black 25%,
            black 75%,
            transparent 100%);
}

.wheel-highlight {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 88rpx;
    /* 44px * 2 */
    margin-top: -44rpx;
    background: rgba(0, 0, 0, 0.04);
    border-top: 1rpx solid rgba(0, 0, 0, 0.05);
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
    pointer-events: none;
    z-index: 0;
}

.wheel-col {
    flex: 1;
    height: 100%;
    z-index: 1;
}

.wheel-placeholder {
    height: 176rpx;
    flex-shrink: 0;
}

/* 88px * 2 */

.wheel-item {
    height: 88rpx;
    /* 44px * 2 */
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 34rpx;
    color: #111;
}
</style>
