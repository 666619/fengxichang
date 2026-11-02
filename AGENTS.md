# AGENTS.md

本项目是静态 HTML/CSS/JS 课程项目（Gitee 仓库 `feng-xicheng/fxc403`）。没有构建工具、包管理器、测试、代码检查或 CI —— 验证改动的方式是在浏览器中打开对应的 `.html` 文件。

## 文档语言约定

- 所有说明、检查条目一律使用简体中文。
- 文件路径、HTML 标签与属性、CSS 选择器与属性、JS 标识符与 API 名称保留英文原文，不翻译。
- 后续在本项目内生成的文档、检查清单均遵守此约定。

## 先读这些

- `skills/project-rules/SKILL.md` —— 项目硬性规则。该文件未注册到 `skill` 工具，编辑前请直接读取。
- `skills/SKILL.md` —— 前端设计指引；编写界面代码前先规划配色、字体与布局。

## 强制工作流程

- 执行任何任务之前，先把用户提示词以**追加**方式写入 `fxc_prompt.md`，格式为 `## YYYY-MM-DD HH:mm:ss | <模型名>`，后接提示词原文与 `---`。绝不覆盖已有内容；敏感信息必须打码。
- 新增的 CSS 类名、id 名、JS 变量一律以 `fxc_` 开头。已有文件（`index.html`、`starter-level*`、`fxc_24001010403.html` 内部等）不符合此规则 —— 只对新增内容生效，不要全量重命名。
- 每个新建 HTML 页面必须包含返回首页的链接：`<a href="index.html">返回首页</a>`。
- 每个新建 HTML 文件必须带有头部注释块，包含功能名称、作者（冯玺成）、建立时间、使用模型与功能简介。JS 部分的每个函数上方都要有注释，说明该函数实际做了什么。详见下方「注释格式」。
- 第三方资源一律下载到本地（`cdn/`、`font/`）；页面必须能离线运行，不得引用远程 CDN 地址。

## 注释格式

每个新建 HTML 文件在 doctype 之后紧跟头部注释块：

```html
<!--
  功能名称: 移动端底部导航
  作者: 冯玺成
  建立时间: 2026-11-02 13:28
  使用模型: DeepSeek-V4.1-Flash
  功能简介: 固定底部四栏导航，含数字徽章与红点
-->
```

JS 部分每个函数上方加一行中文注释，说明它的实际行为，而不是复述函数名：

```js
// 切换选中态：清除其它标签的 fxc_active，并给当前标签加上
function fxc_switchTab(fxc_target) { ... }
```

注释使用简体中文，与项目语言保持一致。

## 布局与架构

- 根目录下的 `*.html` 都是独立演示页，CSS/JS 内联其中；没有统一的页面外壳或路由。
- `index.html` 是手工维护的课程目录。需要某页面出现在目录里时，手动增改其卡片。
- `data.js` 暴露 `window.STUDENTS` 与 `window.SUBJECTS`；`starter-level1.html` 与 `starter-level2.html` 依赖这两个全局名称。
- `font/` 存放 iconfont 字体包；`cdn/fontawesome/` 与 `cdn/lucide/` 存放本地化的第三方库。`my/` 与 `my2/` 是内容高度重复的两套 iconfont 演示。
- 部分练习文件命名有误导性：`html_basic.css` 与 `html_basic_css` 实际是完整 HTML 文档，而 `body`、`header` 之类的文件只是片段。使用前先确认类型。

## 注意事项

- 所有文件均为 UTF-8 无 BOM。Windows PowerShell 5.1 的 `Get-Content` / `Select-String` 会把中文按 ANSI 解码而显示乱码 —— 请改用 Read/Write/Edit 工具。
- 页面通过相对路径引用资源（`cdn/`、`font/`、`img/`）；HTML 保持在仓库根目录，移动文件时需同步更新路径。
- 远程仓库是 Gitee。既有提交使用中文 `feat:` / `fix:` / `merge:` 信息。未经明确要求，不要提交或推送。
