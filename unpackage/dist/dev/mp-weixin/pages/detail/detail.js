"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const isNavScrolled = common_vendor.ref(false);
    const showImageViewer = common_vendor.ref(false);
    const currentImage = common_vendor.ref("");
    const showDrawer = common_vendor.ref(false);
    const navBar = common_vendor.reactive({
      statusBarHeight: 20,
      // 默认值，防止ssr报错
      navContentHeight: 44
      // 默认高度
    });
    const detailData = common_vendor.reactive({
      id: 1,
      title: "健身打卡",
      count: 108,
      unit: "天",
      cover: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      startDate: "2023.08.15"
    });
    common_vendor.onMounted(() => {
      const sysInfo = common_vendor.index.getSystemInfoSync();
      navBar.statusBarHeight = sysInfo.statusBarHeight;
      const menuButton = common_vendor.index.getMenuButtonBoundingClientRect();
      const gap = menuButton.top - sysInfo.statusBarHeight;
      navBar.navContentHeight = gap * 2 + menuButton.height;
    });
    const handleScroll = (e) => {
      isNavScrolled.value = e.detail.scrollTop > 60;
    };
    const handleBack = () => common_vendor.index.navigateBack();
    const openDrawer = () => showDrawer.value = true;
    const closeDrawer = () => showDrawer.value = false;
    const handleEdit = () => {
      closeDrawer();
      common_vendor.index.showToast({ title: "编辑功能开发中", icon: "none" });
    };
    const confirmDelete = () => {
      closeDrawer();
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这个足迹吗？",
        confirmColor: "#FF3B30",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({ title: "已删除", icon: "success" });
            setTimeout(() => common_vendor.index.navigateBack(), 1e3);
          }
        }
      });
    };
    const viewImage = (src) => {
      currentImage.value = src;
      showImageViewer.value = true;
    };
    const closeImageViewer = () => {
      showImageViewer.value = false;
      setTimeout(() => currentImage.value = "", 300);
    };
    const handleCheckIn = () => {
      common_vendor.index.navigateTo({
        url: "/pages/heckin/heckin"
        // 请根据你的实际路径调整
      });
    };
    return (_ctx, _cache) => {
      return {
        a: currentImage.value,
        b: common_vendor.o(() => {
        }),
        c: showImageViewer.value ? 1 : "",
        d: common_vendor.o(closeImageViewer),
        e: showDrawer.value ? 1 : "",
        f: common_vendor.o(closeDrawer),
        g: common_vendor.o(closeDrawer),
        h: common_vendor.o(handleEdit),
        i: common_vendor.o(confirmDelete),
        j: common_vendor.o(closeDrawer),
        k: showDrawer.value ? 1 : "",
        l: common_vendor.o(handleBack),
        m: common_vendor.o(openDrawer),
        n: common_vendor.t(detailData.title),
        o: isNavScrolled.value ? 1 : 0,
        p: navBar.navContentHeight + "px",
        q: isNavScrolled.value ? 1 : "",
        r: navBar.statusBarHeight + "px",
        s: navBar.navContentHeight + "px",
        t: detailData.cover,
        v: common_vendor.t(detailData.count),
        w: common_vendor.t(detailData.unit),
        x: common_vendor.t(detailData.title),
        y: common_vendor.t(detailData.startDate),
        z: common_vendor.o(($event) => viewImage("https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80")),
        A: common_vendor.o(($event) => viewImage("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80")),
        B: common_vendor.o(($event) => viewImage("https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80")),
        C: common_vendor.o(handleScroll),
        D: common_vendor.o(handleCheckIn)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eca06f3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
