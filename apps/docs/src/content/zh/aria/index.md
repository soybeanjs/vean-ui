---
head:
  title: Aria
  description: '无样式、完整可访问性的组件逻辑 —— @vean/ui 的底层基础。'
---

# Aria

> 无样式、完整可访问性的组件逻辑 —— `@vean/ui` 的底层基础。

`@vean/aria` 是 VeanUI 的逻辑层：状态、键盘交互、焦点管理与无障碍语义都在这里实现，不带任何视觉样式。`@vean/ui` 的样式化组件是它之上的一层薄封装。

## 安装

```bash
pnpm add @vean/aria
```

## 分层职责

| 层     | 包           | 负责                                   |
| ------ | ------------ | -------------------------------------- |
| 逻辑层 | `@vean/aria` | 状态、a11y、键盘导航、焦点管理、零样式 |
| 样式层 | `@vean/ui`   | UnoCSS 变体、class 注入、插槽转发      |

编译期依赖方向是 **UI → Aria**，Aria 不依赖 UI。

## 导出结构

- `.` —— 全部组件与类型
- `./composables` —— 28 个可复用 composable（`useControllableState`、`useContext`、`useUiContext` …）
- `./shared` —— 纯 TS 工具（DOM、焦点、树、表单、守卫、比较）
- `./types` —— `ClassValue`、`UiClass`、`ToContext` 等公共类型
- `./date`、`./locale`、`./constants`
- `./nuxt` 与 `./resolver` —— Nuxt 自动注册与 `unplugin-vue-components` 解析器
- `./namespaced` —— 命名空间导出（如 `Aria.Accordion.Root`）
- `./<component>` —— 单组件子路径（如 `@vean/aria/accordion`）

## 规模

- 96 个组件目录，其中 94 个公开导出
- 28 个 composable、20 个纯函数工具模块

`@vean/aria` 完全不产出样式 —— 连 `hidden`、`sr-only` 都没有。布局契约类的几何尺寸是唯一的结构性输出，表现层一律归样式层。
