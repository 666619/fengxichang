/*
  功能名称: Tab 选项卡组件（可复用）
  作者: 冯玺成
  建立时间: 2026-11-02 13:39
  使用模型: DeepSeek-V4.1-Flash
  功能简介: 通过事件委托监听选项卡点击，先清除全部选项卡与面板的选中状态，再设置当前选项卡及其对应面板为选中，可被任意页面外部引用。
*/
(function (fxc_global) {
  "use strict";

  var fxc_defaultOptions = {
    fxc_tabSelector: ".fxc_tab",
    fxc_panelSelector: ".fxc_panel",
    fxc_tabActiveClass: "fxc_tab_active",
    fxc_panelActiveClass: "fxc_panel_active",
    fxc_tabAttribute: "data-fxc-tab",
    fxc_panelAttribute: "data-fxc-panel"
  };

  // 合并配置：调用方传入的选项覆盖默认值，未传则保持默认
  function fxc_mergeOptions(fxc_options) {
    var fxc_merged = {};
    for (var fxc_key in fxc_defaultOptions) {
      if (Object.prototype.hasOwnProperty.call(fxc_defaultOptions, fxc_key)) {
        fxc_merged[fxc_key] = fxc_defaultOptions[fxc_key];
      }
    }
    for (var fxc_userKey in fxc_options) {
      if (Object.prototype.hasOwnProperty.call(fxc_options, fxc_userKey)) {
        fxc_merged[fxc_userKey] = fxc_options[fxc_userKey];
      }
    }
    return fxc_merged;
  }

  // 初始化一个选项卡容器：绑定一次事件委托，并按默认索引激活首屏选项卡
  function fxc_initTabs(fxc_root, fxc_options) {
    if (!fxc_root) {
      return null;
    }
    var fxc_opts = fxc_mergeOptions(fxc_options || {});
    var fxc_tabs = Array.prototype.slice.call(fxc_root.querySelectorAll(fxc_opts.fxc_tabSelector));
    var fxc_panels = Array.prototype.slice.call(fxc_root.querySelectorAll(fxc_opts.fxc_panelSelector));

    // 切换选中态：先清除所有选项卡与面板的选中类，再给当前索引的选项卡与面板加上选中类
    function fxc_activate(fxc_index) {
      var fxc_i;
      for (fxc_i = 0; fxc_i < fxc_tabs.length; fxc_i++) {
        fxc_tabs[fxc_i].classList.remove(fxc_opts.fxc_tabActiveClass);
        fxc_tabs[fxc_i].setAttribute("aria-selected", "false");
        fxc_tabs[fxc_i].setAttribute("tabindex", "-1");
      }
      for (fxc_i = 0; fxc_i < fxc_panels.length; fxc_i++) {
        fxc_panels[fxc_i].classList.remove(fxc_opts.fxc_panelActiveClass);
        fxc_panels[fxc_i].hidden = true;
      }
      if (fxc_index === null || fxc_index < 0 || fxc_index >= fxc_tabs.length) {
        return;
      }
      fxc_tabs[fxc_index].classList.add(fxc_opts.fxc_tabActiveClass);
      fxc_tabs[fxc_index].setAttribute("aria-selected", "true");
      fxc_tabs[fxc_index].setAttribute("tabindex", "0");
      for (fxc_i = 0; fxc_i < fxc_panels.length; fxc_i++) {
        if (Number(fxc_panels[fxc_i].getAttribute(fxc_opts.fxc_panelAttribute)) === fxc_index) {
          fxc_panels[fxc_i].classList.add(fxc_opts.fxc_panelActiveClass);
          fxc_panels[fxc_i].hidden = false;
        }
      }
    }

    // 读取被点击选项卡的索引；单独成函数便于复用于键盘操作
    function fxc_indexOfTab(fxc_trigger) {
      return Number(fxc_trigger.getAttribute(fxc_opts.fxc_tabAttribute));
    }

    // 事件监听：以事件委托方式监听容器内点击，命中选项卡后切换到其索引
    fxc_root.addEventListener("click", function (fxc_event) {
      var fxc_trigger = fxc_event.target.closest ? fxc_event.target.closest(fxc_opts.fxc_tabSelector) : null;
      if (!fxc_trigger || !fxc_root.contains(fxc_trigger)) {
        return;
      }
      fxc_activate(fxc_indexOfTab(fxc_trigger));
    });

    // 事件监听：左右方向键在同一组选项卡之间移动，供键盘用户操作
    fxc_root.addEventListener("keydown", function (fxc_event) {
      var fxc_isArrow = fxc_event.key === "ArrowLeft" || fxc_event.key === "ArrowRight";
      var fxc_trigger = fxc_event.target.closest ? fxc_event.target.closest(fxc_opts.fxc_tabSelector) : null;
      if (!fxc_isArrow || !fxc_trigger) {
        return;
      }
      var fxc_step = fxc_event.key === "ArrowRight" ? 1 : -1;
      var fxc_nextIndex = (fxc_indexOfTab(fxc_trigger) + fxc_step + fxc_tabs.length) % fxc_tabs.length;
      fxc_activate(fxc_nextIndex);
      fxc_tabs[fxc_nextIndex].focus();
      fxc_event.preventDefault();
    });

    var fxc_defaultIndex = Number(fxc_root.getAttribute("data-fxc-default") || 0);
    fxc_activate(fxc_defaultIndex);

    return {
      fxc_activate: fxc_activate
    };
  }

  // 自动初始化：页面上所有带 data-fxc-tabs 属性的容器各自成为一个独立选项卡组
  function fxc_autoInitTabs() {
    var fxc_roots = Array.prototype.slice.call(document.querySelectorAll("[data-fxc-tabs]"));
    fxc_roots.forEach(function (fxc_root) {
      fxc_initTabs(fxc_root);
    });
  }

  fxc_global.fxc_initTabs = fxc_initTabs;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fxc_autoInitTabs);
  } else {
    fxc_autoInitTabs();
  }
})(window);
