"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const maxChar = 200;
const _sfc_main = {
  __name: "feedback",
  setup(__props) {
    const statusBarHeight = common_vendor.ref(0);
    const safeAreaBottom = common_vendor.ref(0);
    const currentTypeIndex = common_vendor.ref(0);
    const content = common_vendor.ref("");
    const contactInfo = common_vendor.ref("");
    const currentCharCount = common_vendor.ref(0);
    const imageList = common_vendor.ref([]);
    const isSubmitting = common_vendor.ref(false);
    const types = [
      { label: "功能建议", value: "proposal" },
      { label: "产品 Bug", value: "bug" },
      { label: "其他吐槽", value: "other" }
    ];
    const submitBtnText = common_vendor.computed(() => isSubmitting.value ? "提交中..." : "提交反馈");
    common_vendor.onMounted(() => {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = systemInfo.statusBarHeight || 44;
      safeAreaBottom.value = systemInfo.safeAreaInsets ? systemInfo.safeAreaInsets.bottom : 0;
    });
    const selectType = (index) => {
      currentTypeIndex.value = index;
    };
    const handleInput = (e) => {
      currentCharCount.value = e.detail.value.length;
    };
    const removeImage = (index) => {
      imageList.value.splice(index, 1);
    };
    const goBack = () => {
      common_vendor.index.navigateBack({ delta: 1 });
    };
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 9 - imageList.value.length,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          imageList.value = [...imageList.value, ...res.tempFilePaths];
        }
      });
    };
    const submitFeedback = () => {
      if (content.value.length < 1) {
        common_vendor.index.showToast({ title: "请填写反馈内容", icon: "none" });
        return;
      }
      isSubmitting.value = true;
      setTimeout(() => {
        isSubmitting.value = false;
        common_vendor.index.showToast({ title: "提交成功", icon: "success" });
      }, 1e3);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: statusBarHeight.value + "px",
        b: common_assets._imports_0$1,
        c: common_vendor.o(goBack),
        d: common_vendor.f(types, (item, index, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: index,
            c: currentTypeIndex.value === index ? 1 : "",
            d: common_vendor.o(($event) => selectType(index), index)
          };
        }),
        e: maxChar,
        f: common_vendor.o([($event) => content.value = $event.detail.value, handleInput]),
        g: content.value,
        h: common_vendor.f(imageList.value, (img, index, i0) => {
          return {
            a: img,
            b: common_vendor.o(($event) => removeImage(index), index),
            c: index
          };
        }),
        i: common_assets._imports_1,
        j: imageList.value.length < 9
      }, imageList.value.length < 9 ? {
        k: common_assets._imports_2,
        l: common_vendor.o(chooseImage)
      } : {}, {
        m: common_vendor.t(currentCharCount.value),
        n: common_vendor.t(maxChar),
        o: contactInfo.value,
        p: common_vendor.o(($event) => contactInfo.value = $event.detail.value),
        q: common_vendor.t(submitBtnText.value),
        r: isSubmitting.value ? 1 : "",
        s: isSubmitting.value,
        t: common_vendor.o(submitFeedback),
        v: safeAreaBottom.value + 20 + "px"
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a24b82f2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/feedback/feedback.js.map
