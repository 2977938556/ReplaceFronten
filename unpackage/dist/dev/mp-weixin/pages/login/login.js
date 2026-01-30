"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const isAgreed = common_vendor.ref(false);
    const isLoading = common_vendor.ref(false);
    const showToast = common_vendor.ref(false);
    const toastMessage = common_vendor.ref("");
    const showShake = common_vendor.ref(false);
    const toggleAgreement = () => {
      isAgreed.value = !isAgreed.value;
      showShake.value = false;
    };
    const showToastMessage = (message) => {
      toastMessage.value = message;
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
      }, 2e3);
    };
    const viewUserAgreement = () => {
      common_vendor.index.navigateTo({
        url: "/pages/about/about"
      });
    };
    const viewPrivacyPolicy = () => {
      common_vendor.index.navigateTo({
        url: "/pages/about/about"
      });
    };
    const handleLogin = () => {
      if (!isAgreed.value) {
        showShake.value = true;
        setTimeout(() => {
          showShake.value = false;
        }, 400);
        showToastMessage("请先阅读并同意用户协议");
        return;
      }
      isLoading.value = true;
      common_vendor.index.login({
        provider: "weixin",
        success: (loginRes) => {
          common_vendor.index.__f__("log", "at pages/login/login.vue:116", "微信登录成功:", loginRes);
          common_vendor.index.getUserProfile({
            provider: "weixin",
            desc: "用于完善用户资料",
            success: (profileRes) => {
              common_vendor.index.__f__("log", "at pages/login/login.vue:123", "获取用户信息成功:", profileRes);
              handleLoginSuccess(profileRes.userInfo);
            },
            fail: (err) => {
              common_vendor.index.__f__("log", "at pages/login/login.vue:129", "获取用户信息失败:", err);
              handleLoginSuccess(null);
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/login/login.vue:136", "微信登录失败:", err);
          isLoading.value = false;
          common_vendor.index.showModal({
            title: "登录失败",
            content: "微信登录失败，请稍后重试",
            showCancel: false
          });
        }
      });
    };
    const handleLoginSuccess = (userInfo) => {
      if (userInfo) {
        common_vendor.index.setStorageSync("userInfo", userInfo);
      }
      const mockUserData = {
        id: 1,
        nickname: "用户" + Math.floor(Math.random() * 1e4),
        avatar: (userInfo == null ? void 0 : userInfo.avatarUrl) || "",
        isLoggedIn: true
      };
      common_vendor.index.setStorageSync("userData", mockUserData);
      common_vendor.index.showToast({
        title: "登录成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateTo({
          url: "/pages/index/index"
        });
      }, 1500);
    };
    const handleSkip = () => {
      common_vendor.index.setStorageSync("isGuestMode", true);
      common_vendor.index.showToast({
        title: "进入游客模式",
        icon: "none"
      });
      setTimeout(() => {
        common_vendor.index.navigateTo({
          url: "/pages/index/index"
        });
      }, 1500);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(toastMessage.value),
        b: showToast.value ? 1 : "",
        c: !isLoading.value
      }, !isLoading.value ? {
        d: common_assets._imports_0$2
      } : {}, {
        e: common_vendor.o(handleLogin),
        f: common_vendor.o(handleSkip),
        g: isAgreed.value ? 1 : "",
        h: showShake.value ? 1 : "",
        i: common_vendor.o(viewUserAgreement),
        j: common_vendor.o(viewPrivacyPolicy),
        k: common_vendor.o(toggleAgreement)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
