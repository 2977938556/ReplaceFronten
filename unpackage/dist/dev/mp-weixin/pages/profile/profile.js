"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "profile",
  setup(__props) {
    const version = common_vendor.ref("1.0.2");
    const buildNumber = common_vendor.ref("24");
    const userInfo = common_vendor.reactive({
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      nickname: "微信用户",
      id: "8839201",
      isLoggedIn: true
    });
    const stats = common_vendor.reactive({
      totalCheckins: 1208,
      categoryCount: 12
    });
    common_vendor.onMounted(() => {
      loadUserData();
    });
    const loadUserData = () => {
      const storedUserData = common_vendor.index.getStorageSync("userData");
      const isGuestMode = common_vendor.index.getStorageSync("isGuestMode");
      if (storedUserData && storedUserData.isLoggedIn) {
        userInfo.isLoggedIn = true;
        userInfo.id = storedUserData.id || "8839201";
        userInfo.nickname = storedUserData.nickname || "微信用户";
      } else if (isGuestMode) {
        userInfo.isLoggedIn = false;
        userInfo.nickname = "点击登录";
        userInfo.avatar = "https://static.yeahqq.com/images/default-avatar.png";
      }
    };
    const formatNumber = (num) => {
      return num ? num.toLocaleString() : "0";
    };
    const handleProfileClick = () => {
      if (userInfo.isLoggedIn)
        ;
      else {
        goToLogin();
      }
    };
    const handleLogout = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            userInfo.isLoggedIn = false;
            userInfo.nickname = "点击登录";
            common_vendor.index.showToast({ title: "已退出", icon: "none" });
          }
        }
      });
    };
    const goToLogin = () => common_vendor.index.navigateTo({ url: "/pages/login/login" });
    const viewTotalStats = () => common_vendor.index.showToast({ title: "统计详情", icon: "none" });
    const viewAllCategories = () => common_vendor.index.showToast({ title: "分类列表", icon: "none" });
    const goToFeedback = () => common_vendor.index.navigateTo({ url: "/pages/feedback/feedback" });
    const goToAbout = () => common_vendor.index.navigateTo({ url: "/pages/about/about" });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userInfo.avatar,
        b: common_vendor.t(userInfo.nickname),
        c: userInfo.isLoggedIn
      }, userInfo.isLoggedIn ? {
        d: common_vendor.t(userInfo.id)
      } : {}, {
        e: common_vendor.o(handleProfileClick),
        f: common_vendor.t(formatNumber(stats.totalCheckins)),
        g: common_vendor.o(viewTotalStats),
        h: common_vendor.t(stats.categoryCount),
        i: common_vendor.o(viewAllCategories),
        j: common_vendor.o(goToFeedback),
        k: common_vendor.o(goToAbout),
        l: userInfo.isLoggedIn
      }, userInfo.isLoggedIn ? {
        m: common_vendor.o(handleLogout)
      } : {}, {
        n: common_vendor.t(version.value),
        o: common_vendor.t(buildNumber.value)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dd383ca2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
