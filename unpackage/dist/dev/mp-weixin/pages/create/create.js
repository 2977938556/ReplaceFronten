"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "create",
  setup(__props) {
    const presetImages = [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    ];
    const statusBarHeight = common_vendor.ref(0);
    const safeAreaBottom = common_vendor.ref(0);
    const navHeight = common_vendor.ref(0);
    const showDrawer = common_vendor.ref(false);
    const formData = common_vendor.ref({
      title: "",
      unit: "次",
      btnText: "",
      coverImage: presetImages[0]
    });
    const tags = ["次", "天", "本"];
    const displayTitle = common_vendor.computed(() => formData.value.title ? formData.value.title : "我的新足迹");
    const displayUnit = common_vendor.computed(() => formData.value.unit ? formData.value.unit : "次");
    const displayBtnText = common_vendor.computed(() => formData.value.btnText ? formData.value.btnText : "打卡");
    common_vendor.onMounted(() => {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = systemInfo.statusBarHeight || 44;
      safeAreaBottom.value = systemInfo.safeAreaInsets ? systemInfo.safeAreaInsets.bottom : 0;
      try {
        const menuButton = common_vendor.index.getMenuButtonBoundingClientRect();
        if (menuButton) {
          navHeight.value = menuButton.bottom + (menuButton.top - statusBarHeight.value);
        } else {
          navHeight.value = 44 + statusBarHeight.value;
        }
      } catch (e) {
        navHeight.value = 44 + statusBarHeight.value;
      }
    });
    const selectTag = (val) => {
      formData.value.unit = val;
    };
    const openDrawer = () => {
      showDrawer.value = true;
    };
    const closeDrawer = () => {
      showDrawer.value = false;
    };
    const selectPreset = (url) => {
      formData.value.coverImage = url;
      closeDrawer();
    };
    const chooseImageFromAlbum = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          formData.value.coverImage = res.tempFilePaths[0];
          closeDrawer();
        }
      });
    };
    const goBack = () => {
      common_vendor.index.navigateBack({ delta: 1 });
    };
    const saveData = () => {
      if (!formData.value.title.trim()) {
        common_vendor.index.showToast({ title: "请输入主题名称", icon: "none" });
        return;
      }
      common_vendor.index.showToast({ title: "创建成功", icon: "success" });
    };
    return (_ctx, _cache) => {
      return {
        a: statusBarHeight.value + "px",
        b: common_vendor.o(goBack),
        c: navHeight.value + "px",
        d: statusBarHeight.value + "px",
        e: formData.value.coverImage,
        f: common_vendor.t(displayUnit.value),
        g: common_assets._imports_0,
        h: common_vendor.o(openDrawer),
        i: common_vendor.t(displayTitle.value),
        j: common_vendor.t(displayBtnText.value),
        k: formData.value.title,
        l: common_vendor.o(($event) => formData.value.title = $event.detail.value),
        m: formData.value.unit,
        n: common_vendor.o(($event) => formData.value.unit = $event.detail.value),
        o: common_vendor.f(tags, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag),
            b: tag,
            c: formData.value.unit === tag ? 1 : "",
            d: common_vendor.o(($event) => selectTag(tag), tag)
          };
        }),
        p: formData.value.btnText,
        q: common_vendor.o(($event) => formData.value.btnText = $event.detail.value),
        r: common_vendor.o(saveData),
        s: safeAreaBottom.value + 20 + "px",
        t: showDrawer.value ? 1 : "",
        v: common_vendor.o(closeDrawer),
        w: common_vendor.o(closeDrawer),
        x: common_vendor.f(presetImages, (img, index, i0) => {
          return {
            a: img,
            b: index,
            c: common_vendor.o(($event) => selectPreset(img), index)
          };
        }),
        y: common_vendor.o(chooseImageFromAlbum),
        z: showDrawer.value ? 1 : ""
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-98f0e4ec"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/create/create.js.map
