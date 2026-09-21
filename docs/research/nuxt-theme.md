# Nuxt UI 主题系统与 Theme Studio 实现分析

> 定位：调研 Nuxt UI（v4，仓库 `/Users/soybean/Web/Projects/OpenSource/nuxt-ui`）主题系统的实现原理，含主题编辑器与分享链接机制，并与 Vean 主题方案对比，供主题相关改动的方案选型与借鉴使用。
> 状态：📄 调研笔记（基于源码精读，非实施方案）。
> 基线：2026-09-09 · nuxt-ui 仓库本地副本

## 1. 总览

Nuxt UI 是**单包结构**（无 packages 目录），主题能力内嵌在 Nuxt module 里，分四层：

| 层             | 位置                                                      | 职责                                                            |
| :------------- | :-------------------------------------------------------- | :-------------------------------------------------------------- |
| 组件默认主题   | `src/theme/*.ts`                                          | 每组件一个纯数据工厂函数（slots / variants / compoundVariants） |
| 颜色系统       | `src/runtime/plugins/colors.ts` + `src/runtime/index.css` | 两层 CSS 变量 + 运行时注入                                      |
| 构建期模板     | `src/templates.ts`                                        | 生成 `#build/ui/<component>.ts`、`@source` 指令                 |
| 组件运行时合并 | `src/runtime/components/*.vue`                            | `tv({ extend: theme, ...defu(..., appConfig.ui) })`             |

编辑器（Theme Studio）与分享链接是 **docs 站点能力**，全部代码在 `docs/app/` 下（`utils/theme/`、`composables/useTheme*.ts`、`pages/theme.vue`），不进库本体。

## 2. 主题系统核心机制

### 2.1 组件默认主题：纯数据 + options 工厂

`src/theme/button.ts` 是接收 `options: Required<ModuleOptions>` 的工厂函数：

```ts
export default (options: Required<ModuleOptions>) => ({
  slots: { base: ['rounded-md font-medium ...'], label: 'truncate', ... },
  variants: {
    color: { ...Object.fromEntries((options.theme.colors || []).map(c => [c, ''])), neutral: '' },
    variant: { solid: '', outline: '', soft: '', subtle: '', ghost: '', link: '' },
    size: { xs: { base: 'px-2 py-1 text-xs gap-1' }, ... }
  },
  compoundVariants: [
    ...(options.theme.colors || []).map(color => ({
      color, variant: 'solid',
      class: `text-inverted bg-${color} hover:bg-${color}/75 ...`
    })),
    ...
  ],
  defaultVariants: { color: 'primary', variant: 'solid', size: 'md' }
})
```

关键点：**color variant 在构建期从 module options 动态展开**，每个 color × variant 组合生成具体 Tailwind class 字符串。

### 2.2 颜色系统：两层 CSS 变量，零自研推导

`src/runtime/plugins/colors.ts` 用 `useHead` 注入动态 CSS：

```css
/* 第一层（原始层）：alias → Tailwind v4 @theme 变量，带静态 fallback */
--ui-color-primary-500: var(--color-red-500, oklch(0.637 0.237 25.331));
/* 第二层（语义层）：light 取 500，dark 取 400 */
:root,
:host,
.light {
  --ui-primary: var(--ui-color-primary-500);
}
.dark {
  --ui-primary: var(--ui-color-primary-400);
}
```

- **不自研色阶推导**：50~950 十一级直接复用 Tailwind v4 `@theme` token（fallback 到 `tailwindcss/colors` 静态值）。
- 只做两件事：alias 映射 + dark 下「指针平移」（500→400）。
- 更高阶语义变量（`--ui-bg`、`--ui-text-muted`、`--ui-border-accented` 等）是 `src/runtime/index.css` 里**手写的静态 CSS**，light/dark 各一套，全部绑定 `--ui-color-neutral-*`。
- 暗色切换由 `@nuxtjs/color-mode` 的 `.dark` class 驱动，CSS 变量自动级联，**无 JS 重算**。
- SPA 模式下 hydration 前插临时 `<style data-nuxt-ui-colors>` 防闪烁。

### 2.3 构建期模板与运行时合并

- `src/templates.ts` 生成 `#build/ui/<component>.ts`，应用 `defaultVariants`（全局默认变体）、`unstyled`（清空 class 保留 slots 结构）、Tailwind prefix；为 Tailwind v4 生成 `@source` 指令（`experimental.componentDetection` 按需收窄，未用组件主题置空）。
- 组件内优先级：`ui`/`class` prop → `UTheme` context → `app.config.ui.<name>` → module 默认 theme。用户在 `app.config.ts` 按 slot 粒度覆盖。

## 3. Theme Studio 与分享链接

### 3.1 `?doc=` 参数格式（已解码验证）

样例链接 `https://ui.nuxt.com/theme?doc=q1YqSy0qzszPU7Iy1FEqKEotTi1RslJKSU1LLM0pUaoFAA` 解码为：

```json
{ "version": 1, "preset": "default" }
```

编码管线：**`JSON → deflate-raw → base64url`**（`+`→`-`、`/`→`_`、去 `=` padding）。

### 3.2 编解码实现（`docs/app/utils/theme/link.ts`）

零依赖，直接用浏览器原生 `CompressionStream` API：

```ts
const piped = new Response(bytes).body!.pipeThrough(new Stream('deflate-raw'));
return new Uint8Array(await new Response(piped).arrayBuffer());
```

三个细节：

1. **选 `deflate-raw` 而非 gzip**：无头尾字节。实测：自定义调色板（11 个相似 oklch 字符串）链接 ~750 → ~300 字符；两条 91 档色带 ~9200 → ~1000。
2. **preset 短链**：`ThemeLink = ThemeDoc & { preset?: string }`——主题恰好等于某内置预设且未修改时，只序列化 id（cobalt 834 → ~60 字符）。匹配必须精确：改过任何一点就回退完整文档。
3. **降级链**：解码 `parseDoc(decompressed) ?? parseDoc(raw)`，老浏览器生成的未压缩链接也能读。解码只做 shape 校验（`version === 1`），值消毒在应用层。

### 3.3 数据模型：稀疏文档 ThemeDoc（`docs/app/utils/theme/engine/types.ts`）

核心设计：**稀疏文档只存显式覆盖，缺省字段继承库默认值——序列化本身就是最小导出**，无需 diff。分层：

| 层  | 字段                                 | 落地形式                           |
| :-- | :----------------------------------- | :--------------------------------- |
| L0  | `palettes`（自定义调色板）           | 注入 `--color-{name}-{shade}`      |
| L1  | `colors`（alias → 调色板名）         | 映射 Tailwind ramp                 |
| L2  | `tokens.light/dark`（语义 token）    | 覆盖 `--ui-*`                      |
| —   | `radius / fontSize / font / icons`   | 各自的响应式 style 标签            |
| L3  | `style`（默认变体/尺寸/tokenShades） | 展开为组件 `defaultVariants`       |
| L4  | `components`                         | 合并进 `app.config ui.<component>` |

一个 schema 四通道复用：导出物、分享链接载荷、预设定义（presets 就是普通 ThemeDoc 数组）、AI 聊天改主题的输入格式。

### 3.4 还原链路：SSR 直出 + 消费即焚（`docs/app/pages/theme.vue`）

```ts
const link = typeof route.query.doc === 'string' ? await decodeThemeDoc(route.query.doc) : undefined;
if (linkApplied) applyDoc(linkedPreset?.doc ?? link!); // setup 顶层 await，服务端完成应用
```

- **query 而非 hash**：服务端能读到，SSR 阶段按分享主题渲染，首帧即正确。`nuxt.config` 为此把 `/theme` 设为按请求渲染（放弃 SSG）。
- **boot restore 让位**：`plugins/theme.ts` 和 FOUC 脚本检测 `?doc=`，存在则不恢复 localStorage 旧主题。
- **消费即焚**：`onMounted` 后 `router.replace` 把 `doc` 从 URL 剥掉。
- 应用成功后显式写回 localStorage（状态经 SSR payload 到达，不触发持久化 watcher）；链接无效则回退本地主题。
- 分享链接 `noindex`；og-image 用静态文件。

### 3.5 应用管线：appConfig 响应式驱动

`useThemeStudio.ts` 的 `applyDoc`：

```ts
theme.resetTheme({ track: false, immediate: false }); // immediate:false 保证标签原子切换，预设间不闪白帧
theme.applyThemeSettings(docToSettings(doc)); // colors → appConfig.ui.colors
theme.setStyleUi(styleComponents(style.value)); // 默认变体 → 组件 defaultVariants
```

与 2.2 的颜色插件衔接：`root` 是读 `appConfig.ui.colors` 的 `computed`，写一个赋值即响应式重算整段 `--ui-color-*` CSS。其余设置（radius/font/customColors/cssVariables）走 `useTheme.ts` 里 6 个带固定 id 的响应式 style 标签，unhead 原地 patch。

### 3.6 持久化与防闪烁

- **单一 storage key**（`nuxt-ui-theme`）原子写入：一个防抖 250ms watcher 拥有所有写入；含旧 key 自动迁移。
- **一个 FOUC 内联脚本**预填同样 id 的 style 标签：首帧前解析 localStorage、对 `#nuxt-ui-colors` 正则替换换 primary/neutral、clamp 数值（radius 0-4、fontSize 12-20）、SAFE_NAME 过滤后注入 Google Fonts link。所有值过 `/^[\w -]{1,50}$/` 与 `/[;{}<>]/` breakout 检查，防 CSS 注入。
- **跨标签页**：storage 事件监听即时采用。
- **次序约束**：colors 在 hydration 前落地；icons 必须推迟到 hydration 后（icon 名编译进元素 class，Vue 对 class 不匹配只警告不修补）。

## 4. 与 Vean 对比

| 维度          | Nuxt UI                                                                           | Vean                                                              |
| :------------ | :-------------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| 包结构        | 单包，主题内嵌 Nuxt module                                                        | 独立 `@vean/theme` 引擎 + `unocss` 适配 + `ui` 运行时，三层解耦   |
| 色阶来源      | 复用 Tailwind v4 `@theme` token                                                   | 自研 `generatePalette` 从单色值数学推导十级                       |
| dark 生成     | 手写静态 CSS 两套 + 语义指针 500→400                                              | 算法从 light token 确定性推导，dark 层 diff 最小化                |
| CSS 变量层级  | 三层：`--ui-color-*`（原始）→ `--ui-*`（alias）→ `--ui-bg/text`（静态语义）       | 两层：`--background` 等语义 token + `--primary-500` 等 palette 层 |
| 变量注入时机  | 动态部分 `useHead` SSR 注入；语义部分构建期静态产出                               | 全量运行时由 `createTheme` 生成注入（styleTarget 可配）           |
| 组件主题表达  | plain object + `tv()` 运行时消费，compoundVariants 按 color 展开                  | `cv()`/`scv()` variants，颜色走语义 token class                   |
| 定制入口      | `app.config.ts` + `ui`/`class` prop + `theme.unstyled`/`defaultVariants`/`prefix` | `createTheme` options + ConfigProvider props + overrides          |
| 尺寸/圆角     | 每组件 size variants 硬编码                                                       | 全局 `--size`/`--radius` 变量，运行时可调                         |
| dark selector | 固定 `.dark` class（color-mode 集成）                                             | 可配置 `class` / `media`（`prefers-color-scheme`）                |
| 框架耦合      | 深度绑定 Nuxt/Tailwind（另有 Vue plugin 版）                                      | 框架无关                                                          |

哲学差异：

- **Nuxt UI 把 Tailwind v4 当主题引擎**：token、色阶、CSS 产出全依托 `@theme` 与构建期扫描，自己只做 alias 映射、语义层静态 CSS、运行时指针切换。零冗余、生态即官方；代价是深度绑定 Tailwind/Nuxt，dark 语义层手工维护两套 CSS。
- **Vean 自研主题引擎**：确定性推导（dark 从 light 自动算出、diff 最小化）、`--size`/`--radius` 全局变量化、dark selector 可插拔、theme 包无 DOM 依赖可 SSR。UnoCSS 只是 class 引擎，token 单一权威在 theme 包。

## 5. 可借鉴点

面向 Vean 的潜在演进（未排期）：

1. **主题编辑器 / 分享链接**：`ThemeDoc` 稀疏文档模式与 `resolveTheme` 的稀疏 override 输入天然契合——一个 schema 可同时作为导出物、分享链接载荷、预设定义。传输层可直接复用 `CompressionStream('deflate-raw')` + base64url + preset 短路方案（现代浏览器零依赖）。
2. **`unstyled` 模式**：清空默认 class 保留 slots 结构（module 配置级），无样式定制场景友好。
3. **全局 `defaultVariants`**：一处配置改全库默认 size/color/variant，按「组件能力表」过滤不支持值（`VARIANT_SUPPORT` / `SIZE_SUPPORT`），避免给无该轴的组件注入无效默认值。
4. **分享链接的 SSR 直出模式**：`?doc=` query + 服务端解码应用 + boot restore 让位 + 消费即焚。若未来 docs 站做主题分享，此模式与 [theme.md §6.3](../theme.md) 方案 A 的快照注入互补（前者服务端渲染正确主题，后者首帧脚本补正）。
5. **单一 storage key 原子写**：多设置共享一个 key、一个防抖 watcher 拥有所有写入，消除恢复时序错乱——比我们按 key 分散存储更稳。

## 6. 参考资料（源码路径）

- `src/module.ts` — Nuxt module 入口，`theme.colors/transitions/unstyled/defaultVariants/prefix` 配置
- `src/theme/button.ts` — 组件默认主题样例（options 工厂）
- `src/templates.ts` — 构建期主题模板与 `@source` 生成
- `src/runtime/plugins/colors.ts` — 运行时颜色 CSS 变量注入
- `src/runtime/index.css` — 语义 token 静态 CSS（light/dark）
- `src/utils/theme.ts` — `applyUnstyled` / `applyDefaultVariants`
- `docs/app/utils/theme/link.ts` — 分享链接编解码（deflate-raw + base64url）
- `docs/app/utils/theme/engine/types.ts` — ThemeDoc schema 与能力表
- `docs/app/utils/theme/engine/presets.ts` — 预设定义
- `docs/app/utils/theme/storage.ts` — 单 key 持久化与迁移
- `docs/app/plugins/theme.ts` — boot restore / FOUC 脚本 / 跨标签页同步
- `docs/app/pages/theme.vue` — `?doc=` 消费与消费即焚
- `docs/app/composables/useThemeStudio.ts` — `applyDoc` 应用管线
- `docs/app/components/theme-studio/ThemeStudioShareModal.vue` — 分享链接生成
