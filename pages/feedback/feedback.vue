<template>
  <view class="page">
    <!-- 1. 顶部区域 (状态栏 + 导航栏) -->
    <view class="header-section">
      <!-- 状态栏占位 -->
      <view :style="{ height: statusBarHeight + 'px' }"></view>
      <!-- 导航栏 -->
      <view class="nav-bar">
        <view class="nav-btn" @click="goBack">
          <!-- 修复：使用 Base64 图片代替 svg 标签 -->
          <image class="icon-img" src="../../static/all-black.png" mode="aspectFit"></image>
        </view>
        <view class="page-title">意见反馈</view>
        <view style="width:36px;"></view> <!-- 占位平衡 -->
      </view>
    </view>

    <!-- 2. 中间滚动内容区 (flex: 1 自动撑满剩余空间) -->
    <scroll-view scroll-y class="scroll-content">
      <view class="content-wrapper">
        
        <!-- 类型选择 -->
        <view class="section-label">反馈类型</view>
        <view class="type-group">
          <view 
            v-for="(item, index) in types" 
            :key="index"
            class="type-chip" 
            :class="{ active: currentTypeIndex === index }" 
            @click="selectType(index)"
          >
            {{ item.label }}
          </view>
        </view>

        <!-- 内容输入 -->
        <view class="section-label">详细描述</view>
        <view class="input-card">
          <textarea 
            class="feedback-textarea" 
            v-model="content" 
            placeholder="请详细描述您遇到的问题或建议..." 
            :maxlength="maxChar" 
            @input="handleInput"
            cursor-spacing="20"
            :disable-default-padding="true"
          ></textarea>
        
          <!-- 图片上传 -->
          <view class="media-grid">
            <view class="media-item" v-for="(img, index) in imageList" :key="index">
              <image class="media-img" :src="img" mode="aspectFill"></image>
              <view class="delete-btn" @click="removeImage(index)">
                <!-- 修复：删除图标 Base64 -->
                <image style="width:12px;height:12px;" src="../../static/all-delete.png" mode="aspectFit"></image>
              </view>
            </view>

            <view class="add-btn" v-if="imageList.length < 9" @click="chooseImage">
              <!-- 修复：添加图标 Base64 -->
              <image style="width:24px;height:24px;" src="../../static/all-add.png" mode="aspectFit"></image>
            </view>
          </view>

          <view class="char-count">{{ currentCharCount }}/{{ maxChar }}</view>
        </view>

        <!-- 联系方式 -->
        <view class="section-label">联系方式 (选填)</view>
        <view class="contact-input-box">
          <input 
            class="contact-input" 
            v-model="contactInfo" 
            placeholder="留下您的微信或邮箱" 
            placeholder-class="input-placeholder"
          />
        </view>

      </view>
    </scroll-view>

    <!-- 3. 底部固定区域 (不再使用 absolute，而是 Flex 布局的一部分) -->
    <view class="footer-section" :style="{ paddingBottom: (safeAreaBottom + 20) + 'px' }">
      <button 
        class="submit-btn" 
        :class="{ disabled: isSubmitting }" 
        :disabled="isSubmitting" 
        @click="submitFeedback"
      >
        {{ submitBtnText }}
      </button>
    </view>

  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// --- 状态定义 ---
const statusBarHeight = ref(0);
const safeAreaBottom = ref(0);
const currentTypeIndex = ref(0);
const content = ref('');
const contactInfo = ref('');
const maxChar = 200;
const currentCharCount = ref(0);
const imageList = ref([]);
const isSubmitting = ref(false);

const types = [
  { label: '功能建议', value: 'proposal' },
  { label: '产品 Bug', value: 'bug' },
  { label: '其他吐槽', value: 'other' }
];

// --- 计算属性 ---
const submitBtnText = computed(() => isSubmitting.value ? '提交中...' : '提交反馈');

// --- 生命周期 ---
onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 44;
  // 底部安全区，如果没有则给个默认值 0
  safeAreaBottom.value = systemInfo.safeAreaInsets ? systemInfo.safeAreaInsets.bottom : 0;
});

// --- 方法 ---
const selectType = (index) => { currentTypeIndex.value = index; };
const handleInput = (e) => { currentCharCount.value = e.detail.value.length; };
const removeImage = (index) => { imageList.value.splice(index, 1); };
const goBack = () => { uni.navigateBack({ delta: 1 }); };

const chooseImage = () => {
  uni.chooseImage({
    count: 9 - imageList.value.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      imageList.value = [...imageList.value, ...res.tempFilePaths];
    }
  });
};

const submitFeedback = () => {
  if (content.value.length < 1) {
    uni.showToast({ title: '请填写反馈内容', icon: 'none' });
    return;
  }
  isSubmitting.value = true;
  setTimeout(() => {
    isSubmitting.value = false;
    uni.showToast({ title: '提交成功', icon: 'success' });
  }, 1000);
};
</script>

<style scoped>
/* --- 变量 --- */
:root {
  --primary: #111111;
  --surface: #FFFFFF;
  --bg: #F5F7FA;
  --text-main: #1D1D1F;
  --text-sub: #8E8E93;
}

/* 核心布局修复：使用 Flex Column 撑满屏幕 */
.page {
  background-color: var(--bg);
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止页面整体滚动 */
}

/* 头部固定 */
.header-section {
  flex-shrink: 0;
  background-color: var(--bg);
  z-index: 10;
}

.nav-bar {
  height: 44px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-btn {
  width: 32px; 
  height: 32px;
  border-radius: 50%;
  display: flex; 
  justify-content: center; 
  align-items: center;
  background: rgba(0,0,0,0.03);
}

.icon-img {
  width: 20px;
  height: 20px;
}

.page-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-main);
}

/* 中间滚动区 - 关键修复 */
.scroll-content {
  flex: 1; /* 占据剩余所有高度 */
  height: 0; /* 必须设置，否则 flex 可能会失效 */
  width: 100%;
}

.content-wrapper {
  padding: 10px 20px 40px 20px; /* 底部加点 padding 防止贴底 */
}

/* 底部固定区 - 关键修复 */
.footer-section {
  flex-shrink: 0; /* 不允许被压缩 */
  background: var(--bg); /* 确保背景不透明 */
  padding: 10px 24px;
  /* 阴影效果向上投射 */
  box-shadow: 0 -4px 10px rgba(0,0,0,0.03);
  position: relative;
  z-index: 100;
}

.submit-btn {
  width: 100%; 
  height: 52px;
  background: var(--primary);
  border-radius: 26px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  display: flex; 
  justify-content: center; 
  align-items: center;
}
.submit-btn::after { border: none; }
.submit-btn:active { opacity: 0.8; }
.submit-btn.disabled { background: #E5E5E5; color: #AAA; }

/* --- 样式细节 --- */
.section-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 12px;
  margin-top: 24px;
  margin-left: 4px;
}
.section-label:first-child { margin-top: 0; }

.type-group { display: flex; gap: 10px; margin-bottom: 10px; }

.type-chip {
  flex: 1;
  height: 40px;
  background: var(--surface);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-sub);
  border: 1px solid transparent;
}
.type-chip.active {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

.input-card {
  background: var(--surface);
  border-radius: 16px;
  padding: 16px;
  position: relative;
  margin-bottom: 24px;
}

.feedback-textarea {
  width: 100%;
  min-height: 100px;
  font-size: 15px;
  color: var(--text-main);
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #C7C7CC;
  margin-top: 8px;
}

.media-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }

.media-item, .add-btn {
  width: calc((100% - 24px) / 4);
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: #F2F4F7;
  position: relative;
}

.media-img { width: 100%; height: 100%; }

.delete-btn {
  position: absolute; top: 0; right: 0;
  background: rgba(0,0,0,0.4);
  border-bottom-left-radius: 8px;
  width: 20px; height: 20px;
  display: flex; align-items: center; justify-content: center;
}

.add-btn { display: flex; justify-content: center; align-items: center; }

.contact-input-box {
  background: var(--surface);
  border-radius: 14px;
  padding: 0 16px;
  height: 50px;
  display: flex;
  align-items: center;
}
.contact-input { flex: 1; font-size: 15px; }
.input-placeholder { color: #C7C7CC; }
</style>
