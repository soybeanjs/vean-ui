---
head:
  title: 步骤条
  description: '用于表示多步骤流程当前进度的步骤条组件。SStepper 将 StepperRoot 一族的 Aria 基础组件（零样式）与 stepperVariants 样式配方（8 个槽位：root/item/trigger/indicator/indicatorIcon/itemContent/separator/title/description，7 种颜色 × 7 种尺寸）组合。在线性模式（默认）下步骤必须按顺序完成——未来步骤被禁用且无法跳过；非线性模式下可自由激活任意步骤。当前步骤通过本地化的 role="status" 实时区域向屏幕阅读器播报，组的 aria-label 在未显式传入时回退到 stepper.ariaLabel 语言包消息。'
---

# 步骤条

## 概述

用于表示多步骤流程当前进度的步骤条组件。`SStepper` 将 `StepperRoot` 一族的 Aria 基础组件（零样式）与 `stepperVariants` 样式配方（8 个槽位：root/item/trigger/indicator/indicatorIcon/itemContent/separator/title/description，7 种颜色 × 7 种尺寸）组合。在**线性模式**（默认）下步骤必须按顺序完成——未来步骤被禁用且无法跳过；非线性模式下可自由激活任意步骤。当前步骤通过本地化的 `role="status"` 实时区域向屏幕阅读器播报，组的 `aria-label` 在未显式传入时回退到 `stepper.ariaLabel` 语言包消息。

## 用法

<UsageCode component="stepper" />

## 特性

- 🔁 默认线性模式 — `linear`（默认 `true`）禁用不可达的未来步骤并阻止跳步；已完成的历史步骤始终可达
- 🧭 水平 / 垂直 — `orientation` 切换布局、连接线方向与方向键导航轴
- 🎛️ 受控 / 非受控 — `modelValue` + `update:modelValue` 或 `defaultValue`（默认 `1`）；根插槽暴露 `goToStep` / `nextStep` / `prevStep` / `hasNext` / `hasPrev` / `totalSteps` 等
- 🖱️ 点击、Enter 或 Space 选中步骤；方向键移动焦点（感知方向并遵循 `dir`），Home/End 跳到首/尾可达步骤
- ♿ 默认无障碍 — `role="group"` 与本地化 `aria-label` 回退、激活项的 `aria-current="step"`、trigger/title/description 之间的 `aria-labelledby`/`aria-describedby` 关联，以及 `role="status"` 实时区域（`stepper.stepOf` 消息）
- 🧩 Aria/样式拆分 — `StepperCompact` 聚合 7 个基础组件并暴露 6 个 `*Props` 通道（item/trigger/indicator/separator/title/description）；`step` 始终由 item 顺序推导
- 🎨 8 槽位样式 — root/item/trigger/indicator/indicatorIcon/itemContent/separator/title/description，7 色（primary/destructive/success/warning/info/carbon/secondary/accent）与 7 尺寸（xs–2xl）
- 🌐 默认本地化 — 实时区域、组 `aria-label` 与指示器默认内容均使用 `useLocaleMessages`（`stepper.step` / `stepper.ariaLabel` / `stepper.stepOf`）

## 组件家族

- `SStepper`（styled）— 入口包装；`stepperVariants` 配方配合动态 8 槽位转发与 `useForwardListeners` 事件合并；镜像 `linear` 默认值，避免缺失的布尔 prop 被转成 `false`
- `StepperRoot`（Aria）— 状态所有者：基于 `modelValue`/`defaultValue` 的 `useControllableState`、`totalSteps`/`currentStep` 推导、`canGoToStep` 线性门控与 `goToStep`/`nextStep`/`prevStep` API；渲染 `role="group"`、`data-linear`、`data-orientation`、`aria-label` 回退与 `VisuallyHidden` 实时区域
- `StepperItem`（Aria）— `step`（从 1 开始）、`disabled`、`completed`；按位置推导 `data-state`（`completed`/`active`/`inactive`），按 `linear` + `disabled` 推导 `isFocusable`
- `StepperTrigger`（Aria）— 默认为 `button`；`mousedown.left` 加 Enter/Space 选中，方向键/Home/End 导航；对不可达步骤渲染 `disabled`/`data-disabled`/`tabindex="-1"` 并注册进根集合
- `StepperIndicator`（Aria）— 默认为 `span`；默认内容是本地化的 `stepper.step` 消息（`第 {step} 步`）
- `StepperTitle` / `StepperDescription`（Aria）— 默认为 `h4`/`p`；暴露被 trigger 的 `aria-labelledby`/`aria-describedby` 消费的 `id`
- `StepperSeparator`（Aria）— 基于 `SeparatorRoot` 的连接线；默认 `decorative`，方向与 `data-state` 来自 root/item 上下文
- `StepperCompact`（Aria）— 聚合复合组件；以 `step: index + 1` 规范化 items，默认指示器对已完成步骤显示对勾图标（经 ConfigProvider `iconRender` 渲染 `lucide:check`），否则显示步骤序号，默认标题回退为 `Step {n}`；插槽：`item`/`indicator`/`title`/`description`/`separator`

## 演示

<PlaygroundGallery component="stepper" />

- 01 Basic — 基于 `items` 的受控 `v-model`
- 02 Vertical — `orientation="vertical"` 布局
- 03 Linear — 带上一步/下一步按钮的顺序完成
- 04 Custom styling — 8 槽位 `ui` 覆盖

## API

<ComponentApi component="stepper" />

## 说明

### 架构与对标差异

`StepperRoot` 拥有完整状态机（受控状态、有序 item 集合、线性门控），所有基础组件保持零样式，仅 UI 包装注入 `stepperVariants` 类名。`isFocusable` 逐项推导（`disabled || (!linear && step > currentStep + 1)`）并镜像为 DOM 上的 `disabled`/`data-disabled`/`tabindex`，因此不可达步骤既不可点击也不在 Tab 序列中。方向键导航使用 `useArrowNavigation`（`loop: false`）并遵循 `orientation`/`dir`；线性模式下焦点不会落在被禁用的未来步骤上。完成对勾图标需要 ConfigProvider 提供 `iconRender`（默认 `Icon` 组件不渲染任何内容），否则已完成步骤回退为序号。实时区域与 `aria-label` 回退经 `useLocaleMessages` 本地化，而 shadcn/ui 的 stepper 区块硬编码了英文文本。

| 能力                             | VeanUI | shadcn/ui (blocks) | Ant Design Steps | Element Plus Steps | Mantine Stepper |
| :------------------------------- | :----: | :----------------: | :--------------: | :----------------: | :-------------: |
| Aria/样式拆分                    |   ✅   |         —          |        —         |         —          |        —        |
| 线性模式（按顺序完成）           |   ✅   |         ✅         |        ⚠️        |         ✅         |       ✅        |
| 水平 / 垂直方向                  |   ✅   |         ✅         |        ✅        |         ✅         |       ✅        |
| 方向键导航（Home/End）           |   ✅   |         —          |        —         |         —          |        —        |
| 本地化实时区域 + 组 `aria-label` |   ✅   |         ⚠️         |        —         |         —          |        —        |
| 受控 / 非受控                    |   ✅   |         —          |        ⚠️        |         ⚠️         |       ✅        |
| 复合组件 + 逐部件 props          |   ✅   |         —          |        —         |         —          |        —        |
| 每步 `completed`/`disabled`      |   ✅   |         ✅         |        ✅        |         ✅         |       ✅        |

`⚠️` = 部分支持（AntD 用 `status` prop 代替线性门控；Element Plus 提供 `process-status`/`finish-status` 但没有导航门控；shadcn/ui 的 stepper 区块用硬编码英文渲染状态文本，且不是库组件）。

### 注意事项

- `StepperItem` 的 `step` 必须从 1 开始且连续：`canGoToStep` 与焦点逻辑按 `step - 1` 索引有序集合。Compact 会自动按 item 顺序规范化；自定义 Aria 组合必须保持 step 连续。
- `itemProps` 有意省略 `step`——它由 item 顺序推导，无法覆盖。
- 线性模式下仅当前步与下一步可达；`goToStep`/`nextStep` 对不可达目标静默忽略，请通过 `hasNext`/`hasPrev` 或 `nextStep`/`prevStep` 辅助方法驱动导航。
- 实时区域（`role="status"`）仅在 `totalSteps > 0` 时渲染；当默认语言包消息不合适时请为根元素显式传入 `aria-label`。
- 未配置 ConfigProvider `iconRender` 时默认指示器回退为步骤序号；配置后即可渲染完成对勾图标。
- 方向键导航会跳过 `disabled` 步骤，但集合仍然有序；完全禁用的步骤条也应暴露组 `aria-label`。

## 常见问题

### 如何让未来步骤可点击？

设置 `linear="false"`——无论当前位置如何，每个步骤都可聚焦、可选中：

```vue
<SStepper :items="items" :linear="false" />
```

### 如何用按钮驱动步骤条？

绑定 `v-model` 并从根插槽取 `hasNext`/`hasPrev` 来控制按钮：

```vue
<SStepper v-model="value" :items="items" linear>
  <template #default="{ hasNext, hasPrev, nextStep, prevStep }">
    <!-- 自定义布局，调用 nextStep() / prevStep() -->
  </template>
</SStepper>
```

### 如何渲染垂直步骤条？

设置 `orientation="vertical"`——连接线与方向键导航轴随之切换：

```vue
<SStepper :items="items" orientation="vertical" />
```

### 如何让某个步骤无论位置都显示为完成？

在 item 数据中传入 `completed`；显式 `completed` 优先于位置推导的状态：

```vue
<SStepper :items="[{ title: 'Account', completed: true }, { title: 'Profile' }]" />
```

### 如何自定义指示器内容？

使用 `indicator` 插槽——它接收 item 数据、step 与 state：

```vue
<SStepper :items="items">
  <template #indicator="{ state, step }">
    <span>{{ state === 'completed' ? '✓' : step }}</span>
  </template>
</SStepper>
```

### 如何本地化状态播报？

实时区域与组 `aria-label` 跟随 ConfigProvider 的语言环境（`stepper.stepOf` / `stepper.ariaLabel`）；需要时可用 `aria-label` 按实例覆盖：

```vue
<SStepper :items="items" aria-label="Checkout progress" />
```
