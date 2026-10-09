---
head:
  title: ThemeCustomizer
  description: SThemeCustomizer 是 Vean 主题引擎的可视化编辑面板——涵盖 mode、色板、圆角、尺寸、间距、字体、反馈方案以及逐 token 的明暗覆盖。它不自带容器（popover / drawer / sidebar），由调用方决定外壳。
---

# ThemeCustomizer

## 概述

`SThemeCustomizer` 是 Vean 主题引擎的可视化编辑主体：它暴露全部 `ThemeOptions` 字段以及逐 token 的明暗覆盖，并把每次改动直接写入运行时主题。适合需要提供应用内主题设置面板的场景。

它是一个**主体，不是外壳**——自身不渲染任何 popover / drawer / sidebar。调用方自行决定挂载位置：设置按钮背后的 `SPopover`、`SDrawer` 面板，或内联的侧栏区域。这一拆分是有意为之：面板只负责维持一个稳定的盒子，容器交给宿主决定。

它读写外层 `SConfigProvider` 持有的主题上下文，因此当宿主还需要紧凑的明暗控件时，可与 `SThemeModeSegment` / `SThemeModeSelect` 搭配使用。

## 用法

<UsageCode component="theme-customizer" />

## 特性

- 🧭 两个顶层标签页——**Theme**（常规设置）与 **Custom**（逐 token 覆盖）
- 🗂 通过 `sections` 可选八个分区：`mode` / `palette` / `radius` / `size` / `spacing` / `font` / `scheme` / `advanced`
- 🎨 七槽 `ui` 映射（`root` / `tabs` / `content` / `panel` / `actions`）用于外壳覆盖
- 🧱 稳定的盒子——固定 `w-96 h-[70vh]`，内容区滚动并保留 `scrollbar-gutter: stable`，切换标签页不会引起宿主 popover 尺寸变化
- 🌗 mode 由 `SThemeModeSegment` 承担，因此 `auto` 走系统解析而非二元开关
- ✍️ 字体编辑覆盖四条臂（`sans` / `serif` / `mono` / `heading`），每条可接受预设键或自定义字族栈
- 🧬 **Custom** 页按分组平铺约 41 个语义 token，并绑定引擎**派生值**，因此覆盖项能直接看到当前解析结果
- ♿ 文案随语言切换，`size` 转发给全部子控件，面板 `axe` 零违规
- ⚡ 高级分组按动画帧逐个挂载，打开 **Custom** 页不会阻塞首屏

## 演示

<PlaygroundGallery component="theme-customizer" />

## API

<ComponentApi component="theme-customizer" />

## 注意事项

### 架构与对标差异

| 维度   | Vean                                                                                                                              | Ant Design / Element Plus / Mantine                 |
| ------ | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| 引擎   | 单一主题引擎（`@vean/theme`）与单一 token 契约，面板直接编辑引擎选项                                                              | 各家主题算法或 CSS 变量预设，面板与自身配置结构耦合 |
| 容器   | `SThemeCustomizer` 只是**主体**，不带 popover / drawer / modal 外壳                                                               | 通常把面板内嵌在 modal 或 drawer 组件里             |
| 覆盖   | 两层：`ThemeOptions` 字段 + 逐 token 明暗覆盖，并实时预览派生值                                                                   | 色板列表，或独立路由里的原始 JSON / css-var 编辑器  |
| 持久化 | `SConfigProvider` 是 `__VEAN_THEME` 信封的唯一写入者，面板自身不写存储                                                            | 持久化交由应用处理                                  |
| token  | 扁平语义 token 契约；面板的分组（`surfaces` / `fills` / `hairlines` / `brand` / `sidebar` / `feedback` / `charts`）只是展示层词汇 | 分组与 token 是同一份列表                           |

### 运行时注意

- **必须处于 `SConfigProvider` 内部。** 面板读取 `useTheme()`，没有 provider 提供主题上下文时会抛出（`useTheme('ThemeCustomizer')`）。
- **`persist` 目前是空操作。** `SConfigProvider` 是唯一信封写入者（`apply` → `setThemeState` → 派生载荷），面板不自行写 `__VEAN_THEME`；持久化跟随 provider 的 `persistTheme`。
- **没有 `modelValue`。** 面板不是受控表单：改动立即作用于运行时主题，也没有取消操作。
- **`sections` 是白名单过滤。** 未列出的分区不渲染；`mode` 分区只渲染 `SThemeModeSegment`，`advanced` 同时覆盖 token 覆盖页与边框浓度 / 表面样式两行。
- **`Custom` 页较重。** 它会挂载约 41 个 `SPalettePicker`（每个内含完整 `SSelect`），因此分组按 `requestAnimationFrame` 逐个追加——断言要等挂载完成，不要只看第一帧。
- **`ui.root` 是盒子的逃生舱。** 宿主若已限定表面尺寸，应覆盖它以去掉默认的 `w-96 h-[70vh]`。
- **字体四臂不负责加载字体。** 选择字族只写入 CSS 变量；字体文件加载仍由应用负责。

## 常见问题

### 如何只显示部分分区？

传入 `sections`，例如 `:sections="['mode', 'palette', 'radius']"`。该数组是白名单，默认为全部八个分区。

### 如何放进 popover 里？

用你自己的容器包住面板——基础示例使用 `SPopover` 加一个设置按钮触发器。如果宿主已经限定了表面尺寸，覆盖 `ui.root` 去掉默认固定宽高。

### 改动写到哪儿了？

写入外层 `SConfigProvider` 的实时主题上下文。每次编辑立即提交到运行时并重新发出 provider 的主题事件；持久化由 provider 负责。

### 面板之外如何放明暗控件？

紧凑开关用 `SThemeModeSwitch`，需要可选 `auto` 时用 `SThemeModeSelect`。二者绑定同一主题上下文，因此与面板的 `mode` 分区始终同步。

### 如何自定义重置行为？

`showActions` 渲染的重置行调用 `useThemeSettings().reset`。若要自己决定重置目标，隐藏该行（`:show-actions="false"`），再通过 `SConfigProvider` / `setThemeState` 把主题拨回去。

### 为什么 token 编辑后显示的值与输入不同？

`Custom` 页把每个 `SPalettePicker` 绑定到**派生值**（`variants.final`）而非原始覆盖项。提交后编辑值是精确的：覆盖项按原样写入，但不在覆盖列表中的值显示的是引擎当前派生结果。
