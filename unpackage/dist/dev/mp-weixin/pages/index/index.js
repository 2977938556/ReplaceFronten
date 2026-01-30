"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const footprintList = common_vendor.ref([
      {
        id: 1,
        title: "健身打卡",
        count: 108,
        unit: "天",
        cover: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        lastCheckIn: "今天 08:30",
        isActive: true,
        btnText: "打卡"
      },
      {
        id: 2,
        title: "海底捞",
        count: 24,
        unit: "次",
        cover: "https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        lastCheckIn: "2天前",
        isActive: false,
        btnText: "开吃 🍲"
      },
      {
        id: 3,
        title: "每日咖啡",
        count: 365,
        unit: "杯",
        cover: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        lastCheckIn: "昨天",
        isActive: true,
        btnText: "去喝一杯"
      }
    ]);
    const goToDetail = (item) => {
      common_vendor.index.navigateTo({ url: `/pages/detail/detail?id=${item.id}` });
    };
    const quickCheckIn = (item) => {
      common_vendor.index.showLoading({ title: "打卡中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        const index = footprintList.value.findIndex((p) => p.id === item.id);
        if (index !== -1) {
          footprintList.value[index].count++;
          footprintList.value[index].isActive = true;
          footprintList.value[index].lastCheckIn = "刚刚";
        }
        common_vendor.index.showToast({ title: "打卡成功！", icon: "success" });
      }, 500);
    };
    const handleCreate = () => {
      common_vendor.index.navigateTo({ url: "/pages/create/create" });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleCreate),
        b: common_vendor.f(footprintList.value, (item, k0, i0) => {
          return {
            a: item.cover,
            b: common_vendor.t(item.count),
            c: common_vendor.t(item.unit),
            d: common_vendor.t(item.title),
            e: !item.isActive ? 1 : "",
            f: common_vendor.t(item.lastCheckIn || "暂无记录"),
            g: common_vendor.t(item.btnText),
            h: common_vendor.o(($event) => quickCheckIn(item), item.id),
            i: item.id,
            j: common_vendor.o(($event) => goToDetail(item), item.id)
          };
        }),
        c: common_vendor.o(handleCreate)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
