"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _component_line = common_vendor.resolveComponent("line");
  const _component_svg = common_vendor.resolveComponent("svg");
  const _component_circle = common_vendor.resolveComponent("circle");
  const _component_polyline = common_vendor.resolveComponent("polyline");
  const _component_path = common_vendor.resolveComponent("path");
  (_component_line + _component_svg + _component_circle + _component_polyline + _component_path)();
}
const ITEM_HEIGHT = 44;
const _sfc_main = {
  __name: "heckin",
  setup(__props) {
    const postText = common_vendor.ref("");
    const imageList = common_vendor.ref([]);
    const showLocation = common_vendor.ref(true);
    const showPicker = common_vendor.ref(false);
    const locationText = common_vendor.ref("乐刻健身(三里屯店)");
    const timeDisplay = common_vendor.ref("今天 18:42");
    const dateOptions = common_vendor.reactive([]);
    const hourOptions = common_vendor.reactive([]);
    const minuteOptions = common_vendor.reactive([]);
    const toViewDate = common_vendor.ref("");
    const toViewHour = common_vendor.ref("");
    const toViewMinute = common_vendor.ref("");
    const currentDateIndex = common_vendor.ref(0);
    const currentHourIndex = common_vendor.ref(0);
    const currentMinIndex = common_vendor.ref(0);
    common_vendor.onMounted(() => {
      initPickerData();
      const now = /* @__PURE__ */ new Date();
      currentHourIndex.value = now.getHours();
      currentMinIndex.value = now.getMinutes();
      updateTimeDisplay();
    });
    function initPickerData() {
      const today = /* @__PURE__ */ new Date();
      for (let i = -30; i <= 0; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        let label = "";
        if (i === 0)
          label = "今天";
        else if (i === -1)
          label = "昨天";
        else
          label = `${d.getMonth() + 1}月${d.getDate()}日`;
        dateOptions.push({ label, value: d });
      }
      for (let i = 0; i < 24; i++) {
        hourOptions.push({ label: String(i).padStart(2, "0"), value: i });
      }
      for (let i = 0; i < 60; i++) {
        minuteOptions.push({ label: String(i).padStart(2, "0"), value: i });
      }
    }
    function chooseImage() {
      common_vendor.index.chooseImage({
        count: 9 - imageList.value.length,
        success: (res) => {
          imageList.value = [...imageList.value, ...res.tempFilePaths];
        }
      });
    }
    function deleteImage(index) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定删除这张图片吗？",
        success: (res) => {
          if (res.confirm) {
            imageList.value.splice(index, 1);
          }
        }
      });
    }
    function toggleLocation() {
      showLocation.value = !showLocation.value;
      if (showLocation.value) {
        locationText.value = "乐刻健身(三里屯店)";
      } else {
        locationText.value = "不显示位置";
      }
    }
    function openTimePicker() {
      showPicker.value = true;
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
      var _a, _b, _c;
      const dIndex = currentDateIndex.value;
      const hIndex = currentHourIndex.value;
      const mIndex = currentMinIndex.value;
      const dateStr = ((_a = dateOptions[dIndex]) == null ? void 0 : _a.label) || "今天";
      const timeStr = `${(_b = hourOptions[hIndex]) == null ? void 0 : _b.label}:${(_c = minuteOptions[mIndex]) == null ? void 0 : _c.label}`;
      timeDisplay.value = `${dateStr} ${timeStr}`;
    }
    function scrollToIndex(prefix, index) {
      if (prefix === "date")
        toViewDate.value = `date${index}`;
      if (prefix === "hour")
        toViewHour.value = `hour${index}`;
      if (prefix === "min")
        toViewMinute.value = `min${index}`;
    }
    function onScrollDate(e) {
      const scrollTop = e.detail.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT) + 1;
      if (index >= 0 && index < dateOptions.length + 1) {
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
    function handleCancel() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定取消打卡吗？",
        success: (res) => {
          if (res.confirm)
            common_vendor.index.navigateBack();
        }
      });
    }
    function submitPost() {
      if (!postText.value && imageList.value.length === 0) {
        common_vendor.index.showToast({ title: "请输入内容或选择图片", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "发布中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "发布成功！", icon: "success" });
        setTimeout(() => common_vendor.index.navigateBack(), 1500);
      }, 1e3);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: showPicker.value ? 1 : "",
        b: common_vendor.o(closeTimePicker),
        c: common_vendor.o(closeTimePicker),
        d: common_vendor.o(confirmTime),
        e: common_vendor.f(dateOptions, (item, index, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: index,
            c: "date" + index
          };
        }),
        f: toViewDate.value,
        g: common_vendor.o(onScrollDate),
        h: common_vendor.f(hourOptions, (item, index, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: index,
            c: "hour" + index
          };
        }),
        i: toViewHour.value,
        j: common_vendor.o(onScrollHour),
        k: common_vendor.f(minuteOptions, (item, index, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: index,
            c: "min" + index
          };
        }),
        l: toViewMinute.value,
        m: common_vendor.o(onScrollMinute),
        n: showPicker.value ? 1 : "",
        o: common_assets._imports_0$1,
        p: common_vendor.o(handleCancel),
        q: -1,
        r: postText.value,
        s: common_vendor.o(($event) => postText.value = $event.detail.value),
        t: common_vendor.f(imageList.value, (img, index, i0) => {
          return {
            a: img,
            b: common_vendor.o(($event) => deleteImage(index), index),
            c: index
          };
        }),
        v: imageList.value.length < 9
      }, imageList.value.length < 9 ? {
        w: common_vendor.p({
          x1: "12",
          y1: "5",
          x2: "12",
          y2: "19"
        }),
        x: common_vendor.p({
          x1: "5",
          y1: "12",
          x2: "19",
          y2: "12"
        }),
        y: common_vendor.p({
          width: "64rpx",
          height: "64rpx",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "2"
        }),
        z: common_vendor.o(chooseImage)
      } : {}, {
        A: common_vendor.p({
          cx: "12",
          cy: "12",
          r: "10"
        }),
        B: common_vendor.p({
          points: "12 6 12 12 16 14"
        }),
        C: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        D: common_vendor.t(timeDisplay.value),
        E: common_vendor.o(openTimePicker),
        F: common_vendor.p({
          d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
        }),
        G: common_vendor.p({
          cx: "12",
          cy: "10",
          r: "3"
        }),
        H: common_vendor.p({
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          ["stroke-width"]: "2",
          ["stroke-linecap"]: "round",
          ["stroke-linejoin"]: "round"
        }),
        I: common_vendor.t(locationText.value),
        J: !showLocation.value ? 1 : "",
        K: common_vendor.o(toggleLocation),
        L: common_vendor.o(submitPost)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/heckin/heckin.js.map
