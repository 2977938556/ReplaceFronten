<template>
  <view class="page">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 导航栏 -->
    <view class="nav-bar">
      <!-- 纯CSS绘制的返回箭头 -->
      <view class="nav-btn" @click="goBack">
        <view class="icon-back"></view>
      </view>
      <view class="page-title">意见反馈</view>
      <view style="width:36px;"></view>
    </view>

    <!-- 滚动内容区 -->
    <scroll-view scroll-y class="scroll-content">
      
      <!-- 1. 类型选择 -->
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

      <!-- 2. 内容输入与图片上传 -->
      <view class="section-label">详细描述</view>
      <view class="input-card">
        <textarea 
          class="feedback-textarea" 
          v-model="content" 
          placeholder="请详细描述您遇到的问题或建议，您的声音对我们很重要..." 
          :maxlength="maxChar" 
          @input="handleInput"
          cursor-spacing="20"
        ></textarea>
        
        <!-- 图片上传区域 (九宫格逻辑) -->
        <view class="media-grid">
          <!-- 已选图片 -->
          <view class="media-item" v-for="(img, index) in imageList" :key="index">
            <image class="media-img" :src="img" mode="aspectFill"></image>
            <!-- 纯CSS绘制的删除叉号 -->
            <view class="delete-btn" @click="removeImage(index)">
              <view class="icon-close"></view>
            </view>
          </view>

          <!-- 添加按钮 (最多9张) -->
          <view class="add-btn" v-if="imageList.length < 9" @click="chooseImage">
            <!-- 纯CSS绘制的加号 -->
            <view class="icon-plus"></view>
          </view>
        </view>

        <view class="char-count">{{ currentCharCount }}/{{ maxChar }}</view>
      </view>

      <!-- 3. 联系方式 -->
      <view class="section-label">联系方式 (选填)</view>
      <view class="contact-input-box">
        <input 
          class="contact-input" 
          v-model="contactInfo" 
          placeholder="留下您的微信或邮箱，方便我们联系您" 
          placeholder-class="input-placeholder"
        />
      </view>
    </scroll-view>

    <!-- 底部提交按钮 -->
    <view class="bottom-bar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
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

const submitBtnText = computed(() => isSubmitting.value ? '提交中...' : '提交反馈');

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 44;
  safeAreaBottom.value = systemInfo.safeAreaInsets ? systemInfo.safeAreaInsets.bottom : 0;
});

const selectType = (index) => {
  currentTypeIndex.value = index;
};

const handleInput = (e) => {
  currentCharCount.value = e.detail.value.length;
};

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

const removeImage = (index) => {
  imageList.value.splice(index, 1);
};

const goBack = () => {
  uni.navigateBack({ delta: 1 });
};

const submitFeedback = () => {
  if (content.value.length < 1) {
    uni.showToast({ title: '请填写反馈内容', icon: 'none' });
    return;
  }
  isSubmitting.value = true;
  setTimeout(() => {
    isSubmitting.value = false;
    uni.showToast({ title: '提交成功，感谢反馈！', icon: 'success' });
  }, 1000);
};
</script>

<style scoped>
/* --- CSS 变量与基础重置 --- */
:root {
  --primary: #111111;
  --surface: #FFFFFF;
  --bg: #F5F7FA;
  --text-main: #1D1D1F;
  --text-sub: #8E8E93;
}

.page {
  background-color: var(--bg);
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* --- 导航栏 --- */
.nav-bar {
  height: 44px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--bg);
  z-index: 10;
  flex-shrink: 0;
}

.nav-btn {
  width: 36px; 
  height: 36px;
  border-radius: 50%;
  display: flex; 
  justify-content: center; 
  align-items: center;
  background: rgba(0,0,0,0.03);
}

/* --- 纯CSS图标核心样式 --- */

/* 1. 返回箭头 < */
.icon-back {
  width: 10px; 
  height: 10px; 
  border-left: 2.5px solid #1D1D1F; 
  border-bottom: 2.5px solid #1D1D1F; 
  /* 通过旋转 "L" 形得到 "<" */
  transform: rotate(45deg); 
  margin-right: 2px; /* 视觉微调 */
}

/* 2. 加号 + */
.icon-plus {
  position: relative;
  width: 24px;
  height: 24px;
}

.icon-plus::before,
.icon-plus::after {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background-color: #A0A0A5;
}

.icon-plus::before { width: 14px; height: 2px; } /* 横向 - */
.icon-plus::after { width: 2px; height: 14px; } /* 纵向 | */

/* 3. 删除叉号 x */
.icon-close {
  position: relative;
  width: 14px;
  height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-close::before,
.icon-close::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #fff;
}

/* 两条线旋转45度形成X */
.icon-close::before { transform: rotate(45deg); }
.icon-close::after { transform: rotate(-45deg); }

/* --- 页面其他样式 (保持不变) --- */

.page-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-main);
}

.scroll-content {
  flex: 1;
  padding: 0 20px 20px 20px;
  box-sizing: border-box;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 12px;
  margin-top: 24px;
  margin-left: 4px;
}
.section-label:first-child { margin-top: 0; }

.type-group {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.type-chip {
  flex: 1;
  height: 44px;
  background: var(--surface);
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-sub);
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
  border: 1px solid transparent;
}

.type-chip.active {
  background: var(--primary);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  transform: translateY(-1px);
}

.input-card {
  background: var(--surface);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.02);
  position: relative;
  margin-bottom: 24px;
}

.feedback-textarea {
  width: 100%;
  min-height: 120px;
  border: none; outline: none;
  background: transparent;
  font-size: 16px;
  line-height: 1.5;
  color: var(--text-main);
}

.char-count {
  position: absolute;
  bottom: 12px; right: 16px;
  font-size: 12px;
  color: #C7C7CC;
}

.media-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.media-item, .add-btn {
  width: calc((100% - 30px) / 4);
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #F2F4F7;
  position: relative;
}

.media-img { width: 100%; height: 100%; }

.delete-btn {
  position: absolute;
  top: 0; right: 0;
  background: rgba(0,0,0,0.5);
  border-bottom-left-radius: 12px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn {
  display: flex;
  justify-content: center; 
  align-items: center;
  cursor: pointer;
}

.contact-input-box {
  background: var(--surface);
  border-radius: 16px;
  padding: 0 20px;
  height: 56px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0,0,0,0.02);
}

.contact-input {
  width: 100%; border: none;
  background: transparent;
  font-size: 15px;
  color: var(--text-main);
}

.input-placeholder { color: #C7C7CC; }

.bottom-bar {
  position: absolute; bottom: 0; left: 0; width: 100%;
  padding: 20px 24px 20px 24px; 
  background: linear-gradient(to top, rgba(245,247,250,1) 80%, rgba(245,247,250,0));
  z-index: 100;
}

.submit-btn {
  width: 100%; height: 56px;
  background: var(--primary);
  border-radius: 28px;
  color: white;
  font-size: 17px;
  font-weight: 700;
  border: none;
  display: flex; justify-content: center; align-items: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  transition: opacity 0.2s;
}

.submit-btn::after { border: none; }
.submit-btn:active { opacity: 0.8; transform: scale(0.98); }
.submit-btn.disabled { background: #CCC; box-shadow: none; opacity: 1; }

</style>
