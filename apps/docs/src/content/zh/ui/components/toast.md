---
head:
  title: 通知
  description: 出现在视口并自动消失的短暂通知。SToastProvider 渲染通知视口，toast 命令式 API 用于创建、更新、关闭与查询通知。它支持六种类型、六个位置、堆叠/展开、滑动关闭、Promise 通知、富色与反转主题，以及用于聚焦列表的键盘快捷键。
---

# 通知

## 概述

出现在视口并自动消失的短暂通知。`SToastProvider` 渲染通知视口，`toast` 命令式 API 用于创建、更新、关闭与查询通知。它支持六种类型、六个位置、堆叠/展开、滑动关闭、Promise 通知、富色与反转主题，以及用于聚焦列表的键盘快捷键。

适用于全局、非阻塞的反馈（已保存、错误、上传进度）。靠近内容的行内提示请优先使用 `alert`；需要用户决策的阻塞性确认请优先使用 `dialog`。

## 用法

在应用根部挂载一个 `SToastProvider`。如果你的应用已经被 `SConfigProvider` 包裹，那么默认会自动渲染一个 `SToastProvider`，除非将 `customToast` 设为 `true`。

<UsageCode component="toast" />

## 特性

- ⚡ 命令式 API — `toast()` 以及 `toast.success/error/warning/info/loading/custom/message/promise/dismiss`
- 🎨 6 种类型 — `default`/`success`/`info`/`warning`/`error`/`loading`，带默认图标
- 📍 6 个位置 — `top-left`/`top-right`/`top-center`/`bottom-left`/`bottom-right`/`bottom-center`
- 🗂️ 堆叠 — `visibleCounts` 限制每个位置的可见通知数；悬停展开堆叠（`defaultExpanded`）
- 👆 滑动关闭 — 左右/上下拖动（可配置 `swipeDirections`）以移除
- ⏱️ 自动消失 — 每条/全局 `duration`；`0` 或 `Infinity` 禁用；悬停与标签页隐藏时暂停
- 🔮 Promise 通知 — `toast.promise(promise, { loading, success, error })`，含 HTTP/错误处理
- 🎛️ 操作 — `action`/`cancel` 按钮带回调；`custom` 渲染完全自定义内容
- ♿ 无障碍 — `aria-live="polite"` 区域、带焦点归还的焦点管理、默认 `Alt+T` 快捷键聚焦列表

## 组件家族

- `SToastProvider`（样式层）— 入口 provider；注入 `toastVariants` 与动画样式表
- `ToastProvider`（Aria）— `Toaster` 的薄包装
- `Toaster`（Aria）— 状态所有者；订阅 `ToastState`，管理堆叠/展开/焦点，渲染 6 个视口
- `Toast`（Aria）— 单条通知；自动关闭计时、滑动逻辑、高度测量、action/cancel/close
- `toast`（命令式）— 暴露在 `@vean/ui` 上的共享 `toast` 控制器（`ToastState` 观察者）

## 演示

<PlaygroundGallery component="toast" />

## API

<ComponentApi component="toast" />

### 命令式 `toast` 方法

| 方法                                                                        | 说明                               |
| --------------------------------------------------------------------------- | ---------------------------------- |
| `toast(message, data?)`                                                     | 显示 `default` 通知；返回通知 id。 |
| `toast.success/error/warning/info/loading(message, data?)`                  | 显示带类型通知。                   |
| `toast.custom(component, data?)`                                            | 显示完全自定义 VNode。             |
| `toast.promise(promise, { loading, success, error, description, finally })` | 将 Promise 生命周期绑定到通知。    |
| `toast.dismiss(id?)`                                                        | 关闭单条通知；不传 id 时关闭全部。 |
| `toast.getHistory()`                                                        | 读取所有已创建的通知。             |
| `toast.getToasts()`                                                         | 读取当前活跃（未关闭）的通知。     |

常用 `data` 选项：`description`、`position`、`duration`、`action`/`cancel`（+ `onAction`/`onCancel`）、`icon`、`richColor`、`inverted`、`showClose`、`dismissible`、`toasterId`、`id`、`ui`。

## 注意事项

### 架构与对标差异

`Toaster` 是自包含的状态所有者，订阅模块级 `ToastState` 观察者并驱动堆叠/展开、滑动、焦点管理与自动关闭计时；`SToastProvider` 只注入配方类与动画样式表。这是命令式优先模型，类似 Ant Design 的 `message`/`notification`、Element Plus `ElMessage`、Mantine `notifications` 与 Naive UI `useMessage`——而 shadcn/ui 没有全局通知原语。VeanUI 的差异化能力是堆叠/可展开通知、滑动关闭、Promise 通知与焦点快捷键，对标 Sonner 的交互体验，同时保持 Aria/样式分离。

| 能力                    | VeanUI | shadcn/ui | Ant Design message | Element Plus ElMessage | Mantine notifications | Naive UI useMessage |
| :---------------------- | :----: | :-------: | :----------------: | :--------------------: | :-------------------: | :-----------------: |
| 命令式 API              |   ✅   |     —     |         ✅         |           ✅           |          ✅           |         ✅          |
| 类型（success/error/…） |   ✅   |     —     |         ✅         |           ✅           |          ✅           |         ✅          |
| 位置（6）               |   ✅   |     —     |         ✅         |           ✅           |          ✅           |         ✅          |
| 堆叠 / 展开             |   ✅   |     —     |         —          |           —            |          ✅           |          —          |
| 滑动关闭                |   ✅   |     —     |         —          |           —            |           —           |          —          |
| Promise 通知            |   ✅   |     —     |         ✅         |           —            |          ✅           |         ✅          |
| 富色 / 反转             |   ✅   |     —     |         ✅         |           —            |           —           |          —          |
| 悬停/隐藏时暂停         |   ✅   |     —     |         ✅         |           ✅           |          ✅           |         ✅          |
| 焦点快捷键              |   ✅   |     —     |         —          |           —            |           —           |          —          |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- 需要已挂载的 `SToastProvider` 才能渲染通知；`SConfigProvider` 会自动挂载一个（除非 `customToast`）。
- `duration` 为 `0` 或 `Infinity` 时禁用自动消失；通知被悬停、展开或标签页隐藏时计时器暂停。
- `visibleCounts`（默认 `3`）限制每个位置的可见通知数；`defaultExpanded` 时旧通知堆叠在后方并在悬停时展开。
- 通知默认可滑动关闭；设置 `dismissible: false` 可禁用（例如 `loading`）。
- 视口区域为 `aria-live="polite"`；默认快捷键 `Alt+T` 聚焦通知列表。可按需覆盖 `hotkey`/`containerAriaLabel`。

### Roadmap

核心通知 API 无阻塞缺口。

## FAQ

### 如何显示基础通知？

```ts
import { toast } from '@vean/ui';

toast('更改已保存');
```

### 如何显示带类型的通知？

```ts
toast.success('一切正常');
toast.error('出了点问题');
toast.loading('上传中…');
```

### 如何显示 Promise 通知？

```ts
toast.promise(fetchData(), {
  loading: '加载中…',
  success: data => `已加载 ${data.length} 项`,
  error: '加载失败'
});
```

### 如何改变位置或时长？

向调用传入 `data` 选项（或设置 provider 默认值）：

```ts
toast('左下角', { position: 'bottom-left', duration: 5000 });
```

### 如何让通知不自动消失？

设置 `duration: Infinity`：

```ts
toast('保持到手动关闭', { duration: Infinity });
```

### 如何渲染自定义内容？

使用 `toast.custom` 传入 VNode，或使用 `custom` 选项：

```ts
toast.custom(h(VNode));
```
