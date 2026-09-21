---
head:
  title: 卡片
  description: 将相关内容与操作分组到带边框、带阴影表面中的容器组件。SCard 是 UI-only 组合：折叠行为复用已准入的 CollapsibleRoot/CollapsibleContent/CollapsibleTrigger 基础组件，header/title/description/footer 装饰节点由 UI 层自持，样式来自 cardVariants 配方（8 个槽、6 种尺寸、scrollable/split 开关）。
---

# 卡片

## 概述

将相关内容与操作分组到带边框、带阴影表面中的容器组件。`SCard` 是 **UI-only** 组件：卡片唯一的真实逻辑是内容折叠，由已准入的 Aria `collapsible` 家族（`CollapsibleRoot` / `CollapsibleContent` / `CollapsibleTrigger`）提供，其余 header/title/description/footer 装饰节点由 UI 层自持，样式来自 `cardVariants` 配方（8 个槽、6 种尺寸、`scrollable`/`split` 开关）。

适用于仪表盘、资料卡片、设置面板，或任何需要「带标题、分区块」的容器内容。重复性的数据行请优先使用 `list` 或 `table`；浮动或模态表面请优先使用 `popover`/`dialog`。

卡片**默认可折叠**——内容区带动画展开/收起，可用 `v-model:open` 驱动。Aria 层不存在 `card` 家族：装饰节点仅为呈现服务，因此留在 UI 层，并保留 `data-vean-card-*` 属性供样式与测试使用。

## 用法

<UsageCode component="card" />

## 特性

- 🧩 UI-only 复用已准入原语 — 折叠行为来自 Aria `collapsible` 家族；`SCard` 自持 chrome，并通过 `provideCollapsibleUi` 注入 `cardVariants` 类
- 🧱 复合结构 — `header`/`title`/`description`/`content`/`footer` 以及 `title-leading`/`title-trailing`/`extra` 插槽
- 🔽 可折叠 — 内容区带动画展开/收起（基于 `CollapsibleRoot`/`CollapsibleContent`），由 `v-model:open`/`defaultOpen` 控制
- ➗ 分区 — `split` 在标题/内容/底部之间添加 `divide-y` 分隔线
- 📜 可滚动内容 — `scrollable` 使内容区在超出卡片高度时滚动
- 🎨 6 种尺寸 — 匹配 `ThemeSize` 的 xs–2xl `size`
- 🎛️ 逐部件控制 — `title`/`description` 支持 prop 或插槽；`headerProps`/`contentProps`/`footerProps`/`titleProps` 转发到各部件
- ♿ 无障碍友好 — 标题渲染为真实 `<h3>`，折叠触发器暴露 `aria-expanded`，`axe-core` 零违规

## 组件家族

- `SCard` — 入口组件；渲染 `CollapsibleRoot`（`defaultOpen: true`）加 `header` / `title-root` / `title` / `description` / `content` / `footer` 节点，并把 `cardVariants` 配方交给 `provideCollapsibleUi`
- `SCardCollapsibleTrigger` — 绑定卡片状态的折叠触发器；默认渲染 chevron `SButtonIcon`，并通过插槽 props 暴露 `open` 状态

## 演示

<PlaygroundGallery component="card" />

## API

<ComponentApi component="card" />

## 注意事项

### 架构与对标差异

`Card` 是 Aria 准入规则的 **UI-only 判例**：它唯一的真实逻辑是折叠，而已准入的 `collapsible` 家族已经提供，因此 Aria 层不存在 `card` 家族。`SCard` 负责结构编排（header/footer 显隐、默认标题/描述），并把配方的 `root` / `content` / `trigger` 槽交给 `provideCollapsibleUi`，让 `CollapsibleRoot` / `CollapsibleContent` / `CollapsibleTrigger` 从 `cardVariants` 解析各自的类。这与 shadcn/ui 的「组合优先」一致；而 Ant Design、Element Plus、Mantine、Naive UI 则提供带 `title`/`extra`/`actions` prop 的单一样式化卡片。VeanUI 通过 `CollapsibleRoot` 使卡片**默认可折叠**——这是多数对标库未提供的刻意扩展；`split` 与 `scrollable` 通过配方变体而非布局 prop 切换。

| 能力                 | VeanUI | shadcn/ui | Ant Design Card | Element Plus Card | Mantine Card | Naive UI Card |
| :------------------- | :----: | :-------: | :-------------: | :---------------: | :----------: | :-----------: |
| Aria/样式分离        |   ✅   |    ✅     |        —        |         —         |      —       |       —       |
| 标题 / 描述          |   ✅   |    ✅     |       ✅        |        ✅         |      ✅      |      ✅       |
| 底部                 |   ✅   |    ✅     |       ✅        |        ✅         |      ✅      |      ✅       |
| 操作（extra）插槽    |   ✅   |     —     |       ✅        |        ✅         |      ✅      |      ✅       |
| 可折叠内容           |   ✅   |     —     |        —        |         —         |      —       |       —       |
| 分区 / 分隔线        |   ✅   |     —     |       ✅        |        ✅         |      ✅      |       —       |
| 可滚动内容           |   ✅   |     —     |       ✅        |         —         |      —       |      ✅       |
| 尺寸变体（6）        |   ✅   |     —     |       ✅        |        ✅         |      ✅      |      ✅       |
| 逐部件 `*Props` 通道 |   ✅   |    ✅     |        —        |         —         |      —       |       —       |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- 卡片默认可折叠且默认展开（`defaultOpen: true`）。收起时内容（及底部）会移出文档流；底部显隐取决于展开状态。
- 标题渲染为固定的 `<h3>`。若页面标题层级不同，请包裹或重设标题，避免跳级。
- 内容节点带有 `tabindex="-1"`，使可滚动主体能接收程序化聚焦；它本身不是交互控件，可通过 `contentProps` 覆盖。
- `SCardCollapsibleTrigger` 渲染的是纯图标按钮，请传入 `aria-label`（如 `aria-label="Toggle card content"`）为其提供可访问名称。
- `split` 使用 `divide-y`；可结合 `size` 控制纵向节奏。`scrollable` 仅在卡片高度受限时生效。
- 内容内边距会根据 `data-header-visible`/`data-footer-visible`（及折叠 `data-state`）自动调整，纯内容卡片也能保持视觉平衡。

### Roadmap

核心卡片 API 无阻塞缺口。交互式操作栏（`CardActions` 快捷方式）与 hover 抬升样式变体为已评估增强项，记录在 `docs/roadmap.md`。

## FAQ

### 如何构建带标题与描述的卡片？

传入 `title`/`description` prop（或对应插槽）：

```vue
<SCard title="设置" description="管理你的偏好">
  <p>主体内容</p>
</SCard>
```

### 如何在头部添加操作？

使用 `extra` 插槽（或在标题两侧使用 `title-leading`/`title-trailing`）：

```vue
<SCard title="个人资料">
  <template #extra><SButton variant="pure">编辑</SButton></template>
  <p>主体内容</p>
</SCard>
```

### 如何制作可折叠卡片？

用 `v-model` 绑定 `open`（或设置 `default-open`）：

```vue
<SCard v-model:open="open" title="可折叠">
  <p>此内容可以折叠。</p>
</SCard>
```

### 如何让内容可滚动？

限制卡片高度并设置 `scrollable`：

```vue
<SCard scrollable class="h-80" title="长列表">
  <p v-for="i in 50" :key="i">第 {{ i }} 行</p>
</SCard>
```

### 如何用分隔线分隔区块？

设置 `split`，在标题/内容/底部之间添加 `divide-y` 分隔线：

```vue
<SCard split title="分区">
  <template #footer><SButton>保存</SButton></template>
  <p>主体内容</p>
</SCard>
```
