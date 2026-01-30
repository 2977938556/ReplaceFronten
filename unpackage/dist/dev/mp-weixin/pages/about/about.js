"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_polyline = common_vendor.resolveComponent("polyline");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_component_polyline + _component_svg)();
}
const _sfc_main = {
  __name: "about",
  setup(__props) {
    const handleFeatureIntro = () => {
      common_vendor.index.showToast({
        title: "跳转功能介绍",
        icon: "none"
      });
    };
    const handleUserAgreement = () => {
      common_vendor.index.showToast({
        title: "查看用户协议",
        icon: "none"
      });
    };
    const handlePrivacyPolicy = () => {
      common_vendor.index.showToast({
        title: "查看隐私政策",
        icon: "none"
      });
    };
    const handleThirdParty = () => {
      common_vendor.index.showToast({
        title: "查看第三方清单",
        icon: "none"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          points: "9 18 15 12 9 6"
        }),
        b: common_vendor.p({
          width: "18",
          height: "18",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "#C7C7CC",
          ["stroke-width"]: "2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        c: common_vendor.o(handleFeatureIntro),
        d: common_vendor.p({
          points: "9 18 15 12 9 6"
        }),
        e: common_vendor.p({
          width: "18",
          height: "18",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "#C7C7CC",
          ["stroke-width"]: "2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        f: common_vendor.o(handleUserAgreement),
        g: common_vendor.p({
          points: "9 18 15 12 9 6"
        }),
        h: common_vendor.p({
          width: "18",
          height: "18",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "#C7C7CC",
          ["stroke-width"]: "2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        i: common_vendor.o(handlePrivacyPolicy),
        j: common_vendor.p({
          points: "9 18 15 12 9 6"
        }),
        k: common_vendor.p({
          width: "18",
          height: "18",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "#C7C7CC",
          ["stroke-width"]: "2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        l: common_vendor.o(handleThirdParty)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-13a78ac6"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/about/about.js.map
