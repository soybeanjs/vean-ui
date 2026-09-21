# Vean 主题系统深度分析与优化报告

> 定位：对 `packages/theme`（`@vean/theme`）及其消费面（`@vean/unocss`、`@vean/ui` 的 `SConfigProvider` / `SThemeCustomizer`）做一次工程级审计：架构、token 完整性、派生正确性、可访问性、持久化与首帧策略；同时与 11 个主流组件库的主题实现横向对比，并吸收 [nuxt-theme.md](../research/nuxt-theme.md) 的既有调研结论。
> 状态：📄 审计快照——描述的是**重构前**的引擎，结论针对旧实现，**不代表现状**（现状以 [theme.md](../theme.md) 为准）
> 基线：2026-09-18 · 分支 `vean` · `@vean/theme@0.50.0-beta.1`
> 方法：源码精读 + 引擎实测（本文所有数字均由附录 A 的脚本在本地跑出，非估算）+ 官方文档/源码检索（引用 URL 见附录 C）
>
> **后续：** 本报告是那次重构的输入，方案已落在 [theme.md](../theme.md)（三层架构 / token 契约 / 无对比度护栏 / 与新旧的逐项对照）。本报告为审计快照，落盘后不再更新。

---

## 0. 摘要（结论先行）

**总体评价：引擎的"少 seed + 确定性派生"方向是对的，且已经是主流之外少见的自研实现；但它的正确性护栏只覆盖了"派生是否稳定"，没有覆盖"派生结果是否可用"——对比度、surface 层级、token 语义在默认值与档位偏移下都会失效。同时 token 家族只覆盖了颜色 + 半径，缺失的面（尺寸/阴影/动效/z-index/组件 token）由 UnoCSS 默认值兜底，导致这些维度事实上不可主题化。**

按严重度排序的 13 条结论：

| #   | 结论                                                                                                                                                   | 级别 | 证据（本文）  |
| :-- | :----------------------------------------------------------------------------------------------------------------------------------------------------- | :--- | :------------ |
| 1   | **派生是"对比度盲"的**：light 下 `success`/`warning` 前景对比度 2.18 / 2.06（AA 需 4.5），`primary` 在 emerald/amber 下 2.43 / 2.05                    | P0   | §3.5 实测矩阵 |
| 2   | **`ring` token 在全部 6 组抽样、两种模式下都低于 3:1**（1.67–2.99）；它被 7 处 `focus-visible:ring-ring` 消费                                          | P0   | §3.5          |
| 3   | **`sidebarDerive: false` 会直接删除全部 `--sidebar*` 变量**（不是"回落到 base"），4 个消费它的组件层皮肤随之失效                                       | P0   | §3.4.3        |
| 4   | **档位偏移在 light 下破坏 surface 层级**：`lightLevel≥1` 后 `background = card = popover`，`muted = accent = secondary`（level 1 时还等于 `border`）   | P0   | §3.6.2        |
| 5   | **`borderOpacity` 在 `format: 'oklch'` 下完全失效**（`getAlphaCss` 提前返回）                                                                          | P1   | §3.2.4        |
| 6   | **持久化散成 4 个 key、2 个无防抖写入者**；跨标签只监听其中 2 个；`Object.assign` 无法清除陈旧字段                                                     | P1   | §3.7          |
| 7   | **没有 `color-scheme`**：暗色下原生控件/滚动条/画布仍是亮色，docs 站只能自己写 `.dark * { color-scheme: dark }` 兜底                                   | P1   | §3.7.5        |
| 8   | **首帧脚本无 `nonce`**，严格 CSP 下直接失效（文档已列为待办）                                                                                          | P1   | §3.7.4        |
| 9   | **palette ramp 占生成 CSS 的 68.3%（4950/7243 字节），但库内只有 16 处引用**；它是"运行时全量输出"，与静态语义层混在一起                               | P1   | §3.4.2        |
| 10  | **默认 `derived` sidebar 方案的 8 个 token 与 base 完全等值**（实测），`sidebar-ring` 全仓库 0 消费                                                    | P2   | §3.4.3        |
| 11  | **`muted` = `accent` = `secondary` 默认同值**，三个 token 一个值；`accentForeground` 与 `foreground` 仅差 1 个色阶                                     | P2   | §3.4.4        |
| 12  | **完全缺失尺寸/阴影/动效/z-index/组件 token 家族**；32 处 `shadow-*`、13 处 `z-50` 硬编码，不可主题化                                                  | P2   | §3.3          |
| 13  | **文档与规格漂移**：README 仍描述已删除的 `preset` 选项、`createThemeStore`、`menuColor/menuAccent`；源码注释引用已删除的 `§3.1/§4.2/D7/D8/ADR-4` 编号 | P2   | §3.9          |

三个直接提问的回答见 §1（lightLevel/darkLevel → **保留能力、重做机制**；token → **颜色层偏冗余、非颜色层缺失**；持久化 → **单信箱 + cookie 镜像 + `color-scheme`**）。

---

## 1. 对三个提问的直接回答

### 1.1 是否需要 `lightLevel` 和 `darkLevel`？

**结论：能力值得保留，但当前的机制与命名都不成立，必须先修机制再谈去留。**

三条实测依据：

1. **主流没有同类旋钮。** 逐库核对（§4）：Ant Design 用 `colorBgLayout / colorBgContainer / colorBgElevated` 这套**具名离散档位**表达层级；Semi 用 `--semi-color-bg-0..4`（5 级，带"页面/浮层/模态/Toast"语义）；Arco 用 `--color-bg-1..5`；Material 3 用 `surface-container-*`。**没有任何一个库暴露"把所有表面整体调暗/调亮的数值旋钮"**。最接近的是 Mantine `theme.primaryShade`（选一级色阶索引）与 Nuxt UI 的固定指针平移（dark 下 primary `500 → 400`）。也就是说：**明暗层级在主流里是"设计者定的具名档位"，不是"用户拧的滑块"。**
2. **当前实现在 light 下自毁层级。** 实测 `lightLevel = 1/2` 时 `background = card = popover`（三者基准都是 `white`，沿同一张表 `['white',50,100,200]` 前移，永远同值）；`lightLevel = 1` 时 `muted = accent = secondary = border = {p}.200`。档位旋钮唯一能做到的事是"给页面整体刷一层灰"，而不是"提升层级"——名字（level）承诺的语义与行为不符。
3. **它不驱动任何"层级"信号。** 阴影没有 token（32 处 `shadow-*` 是 UnoCSS 默认值），所以调暗页面不会让 card 看起来更"浮起"；`border` 在 light 表里会跟着偏移、在 dark 表里被固定为 `DARK_BORDER`，两端不一致。

**建议（二选一，推荐先 B 后 A）**：

- **B（低风险，立即可做）**：修正档位表，使不变量成立——`card` / `popover` 从 `LIGHT_SURFACE` 中移出（保持最浅端），light 只有"页面层 + 弱表面层"随档位移动；补一条断言测试：`lightLevel` 任一档位下 `background ≠ card`、`muted ≠ border`。同时把 `LightLevelOffset` / `DarkLevelOffset` 的语义在类型注释里改成"页面层染色档位"，别再宣称"整体调暗"。
- **A（目标形态）**：把它降格为**具名表面阶梯**，而不是数值偏移。核心模板给出真正的 elevation 阶梯（例如 `background / subtle / surface / raised / overlay`），档位旋钮退化为 `surface: 'flat' | 'tinted' | 'layered'` 三态预设。这样 token 数量可控（不引入 3×4 组合）、SSR/持久化状态更少、和主流语义对齐，且 `SThemeCustomizer` 的 UI 从滑块变成三选一，产品语义更清楚。

> 若最终决定保留数值旋钮，请把它的"哲学依据"写进 ADR：这是 Vean 相对主流的**差异化能力**（用户可整体调节明暗倾向），而不是"层级调节"。当前文档没有对此表态，是评审时的第一个争议点。

### 1.2 不考虑 shadcn 的设计，当前 token 是否合理、是否冗余？

**结论分两半：颜色层是"偏冗余 + 语义重叠"，非颜色层是"系统性缺失"。**

**（a）冗余 —— 有实测数字，不是感觉：**

- **6 条 palette ramp 占生成 CSS 的 68.3%**（4950 / 7243 字节；207 条声明里 121 条是 ramp），其中 5 条（destructive/success/warning/info/carbon）在暗色块里**整条重新生成**（暗色块 46.4% 的字节来自它们）。库内对 ramp 的真实引用只有 **16 处**（7 个样式文件里的 `bg-primary-600` / `bg-success-100` 之类），docs 里 2 处。
  → 建议把 ramp 从"运行时语义 CSS"里拆出去：`createTheme` 只输出语义层（约 86 条声明、≈2.3KB），ramp 改为**构建期静态产物 + 按需**（只输出被 UnoCSS 扫到的 level，或提供 `emitRamps: 'used' | 'all' | false`）。这同时解决了暗色下 ramp 重锚带来的"同一 level 两种明度"困惑（§3.4.2）。
- **sidebar 命名空间默认零差异**：`derived` 方案下 8 个 token 与 base **逐值相等**（实测全 `true`）；`sidebar-ring` 在全仓库（含 docs/examples）**0 处消费**。命名空间本身有价值（"侧栏区域皮肤"是真实需求，且主流只有 shadcn 提供），但"默认全等值 + 一个没人用的键"说明它需要收敛。
  → 建议：把 `derived` 改为**默认不派生**（即 `sidebarDerive: false` 成为默认，且修好回落语义），或删掉 `sidebarRing`、把 8 键压到 6 键。
- **`muted` = `accent` = `secondary` 三者同值**（light `{p}.100` / dark `{p}.800`），`accentForeground` 与 `foreground` 只差 1 个色阶（`.900` vs `.950`）。三个 token 一个值，主题定制面板却给了 9 个可调项（`use-theme-variants.ts:79-95`）。
  → 建议二选一：要么**让三者真正分化**（`muted` = 只读弱表面、`accent` = 交互 hover 表面、`secondary` = 次级实体面，各差 1 档），要么**合并 `secondary` 进 `muted`**（保留 `secondaryForeground` 别名以兼容）。前者更好，因为按钮/卡片确实需要次级实体面与 hover 面分离。
- **`carbon` 的 ramp 方向是翻转的**：`carbon` 自身是"反相中性色"（light `{p}.800`、dark `{p}.100`），实测 `carbon-500` light = 15.8% 亮度 / dark = 95.9% 亮度，`carbon-900` light = 6% / dark = 49%——其余 5 条 ramp 的 level 语义在两种模式下都保持"越大越深"，只有 carbon 的可用区间在一端塌缩。它有 87 处消费（badge/toggle/button 等），是真实角色，但名字（碳）与语义（反相/高对比表面）不匹配，主流叫 `inverse`（Naive）/ `bright`（Mantine）/ step 12 "high-contrast"（Radix）。
  → 建议改名 `inverse`（或 `contrast`），或在 ramp 层面把 carbon 单列说明。
- **死导出**：`builtinFeedbackSchemeKeys`、`builtinChartSchemeKeys`、`builtinSidebarSchemeKeys`（`registry.ts:309-319`）全仓库无消费（含 apps）。`getDarkSelector` 也只在包内使用。
- **`chart1..5` 无库内消费**（只有 docs 的 chart 示例壳用）——这不是问题（面向消费者），但意味着它没有"被组件契约验证过"，scheme 的 5 组配色是人工挑选且无 CVD（色觉）分离度保证。

**（b）缺失 —— 与主流对比后最明显的三块洞（§3.3）：**

| 家族        | Vean 现状                                                              | 主流参照                                                                               |
| :---------- | :--------------------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| 尺寸 / 密度 | **无**。只有 `--size` = 根字号缩放（`html{font-size:var(--size)}`）    | Ant `sizeUnit` / `controlHeight(SM/LG)`；Mantine spacing scale；PrimeVue `formField.*` |
| 阴影 / 层级 | **无阴影 token**。32 处 `shadow-*` 用 UnoCSS 默认值                    | Ant `boxShadow/boxShadowSecondary`；Semi `--semi-shadow-elevated`                      |
| 动效        | **无 duration/easing token**（在 UnoCSS preset 里硬编码）              | Ant `motionDuration*`；Chakra `durations/easings` 为一等 token 类                      |
| z-index     | **无**。13 处 `z-50` + 少量 `--soybean-layout-*-z-index` 一次性变量    | Mantine `zIndex.{app,modal,popover,overlay,max}`；Radix 逐组件分层                     |
| 组件 token  | **无**。组件样式写死在 `packages/ui/src/styles/*.ts` 的 `scv()` recipe | Ant 70 个组件 token；PrimeVue 90 个组件 token 集                                       |
| 状态色派生  | 每个状态只有 base + foreground（2 个）                                 | Ant 每状态 10 个（含 hover/active/bg/border/text 族）；Semi 每状态 7 个                |

其中**"`--size` 是根字号缩放"值得单独说**：它不是一个密度 token，而是**全局 zoom**——`size: 'xs'` 会把 `1rem` 变成 12px，于是组件的 `text-sm`（0.875rem）渲染成 10.5px，直接撞上 `packages/unocss/src/global-css.ts:19-25` 里那条"iOS 输入框 <16px 会缩放"的补丁；同时 px 硬写的根字号会**覆盖用户浏览器的默认字号偏好**（WCAG 1.4.4 文本缩放的意图）。主流做法是保留 `font-size: 100%`，用 `controlHeight` / spacing 这类**独立维度 token** 表达密度。这是"缺失尺寸 token"的具体代价。

**（c）合理性评估（保留即可的）：**

- `borderOpacity` + `--border-alpha` 的设计（把 alpha 从颜色里拆出来单独可调）是有价值的，主流里只有 MUI 的 `*Channel` token 做同类事情（`--mui-palette-primary-mainChannel`）。**但它在 oklch 下失效（§3.2.4），且 `--border-alpha` 只在 hsl 下存在**，属于"设计对、实现半通"。
- `format: 'hsl' | 'oklch'` 双格式是对的（MUI/Ant 都没给这种自由度）；但要注意两者产出的 CSS 字节差 8%（7243 vs 7806），gzip 后反向（2271 vs 1760，oklch 更省），选型时别只看未压缩体积。
- 40 个颜色 token 的**数量**本身合理（Chakra 语义色 109、Semi 168、PrimeVue 227 语义叶子；shadcn 29）。问题不在数量，在**语义重叠**与**派生结果的可用性**。

### 1.3 主题持久化是否有最优方案？

**结论：有，而且和现状差别明确。最优形态是"单一版本化信箱 + cookie 镜像 + 永远同时设置 `color-scheme`"，并按运行时环境分三档；当前实现落在最弱的一档（纯 localStorage + 无 cookie + 无 color-scheme + 无 nonce）。**

三档的适用边界（详细论证见 §3.7 与 §4.3）：

| 运行时                            | 服务端能否知道偏好   | 首帧手段                                                                            | 是否需要 cookie | 是否必须内联脚本     |
| :-------------------------------- | :------------------- | :---------------------------------------------------------------------------------- | :-------------- | :------------------- |
| SSR（docs 若切 ubean SSR / Nuxt） | 能（读 `Cookie` 头） | 服务端直接把 `class="dark" style="color-scheme:dark"` 渲染进 HTML，**零脚本零闪烁** | 需要            | 不需要（可留作兜底） |
| SPA                               | 不能                 | `<head>` **第一个**内联脚本读 localStorage                                          | 不需要          | 需要                 |
| SSG（docs 现状）                  | 不能（HTML 共享）    | 同上；cookie 在 SSG 下**无收益**（HTML 无法按请求变化）                             | 无意义          | 需要                 |

对 Vean 的具体建议（可分批落地）：

1. **单信箱**：把 `__SOYBEAN_THEME` / `__SOYBEAN_THEME_CSS` / `__SOYBEAN_THEME_PRESETS` / `__SOYBEAN_THEME_APPLIED_PRESET` 合并为**一个带 `v` 字段的信封**（`{ v: 2, mode, config, presets, appliedPreset, css? }`），**一个防抖 250ms 的写入者**（Nuxt UI 的 `nuxt-ui-theme` 就是这么做的，见 [nuxt-theme.md](../research/nuxt-theme.md) §3.6）。这直接消灭第 6 条结论里的全部问题：写入竞争、跨标签漏听、`Object.assign` 清不掉字段。
2. **cookie 镜像**（仅在 SSR 场景启用）：`vean-theme=dark`（`Path=/; Max-Age=31536000; SameSite=Lax; Secure`，**不要 `HttpOnly`**），服务端读它 → 渲染 `<html class style="color-scheme">` + 用同一份 config 调 `createTheme()` 产出正确 CSS。**这样 `injectCss` + `!important` 那套补丁在 SSR 下可以整体删掉**（[docs/theme.md §9.4](../theme.md) 已论证过这条路径，本报告补充：cookie 会让 HTML 变为 per-user，`Vary: Cookie` 会摧毁 CDN 缓存命中率，所以只在 SSR 档启用，SSG 档继续用快照）。
3. **`color-scheme` 必须落到两处**：`<meta name="color-scheme" content="light dark">`（head 最前，防画布/滚动条首帧闪白）与 `html { color-scheme: light }` / `.dark { color-scheme: dark }`（引擎生成，或由脚本设 `style.colorScheme`）。这不是锦上添花：主流 4 个实现里 next-themes（`enableColorScheme`）、Mantine、MUI、Starlight 至少有一个在做，而**没有任何一家靠 `.dark class` 解决原生控件配色**。当前 docs 站被迫在 `apps/docs/src/styles/global.css:77` 写 `.dark * { color-scheme: dark }`，就是这条缺失的账单。
4. **首帧脚本的工程细节**：必须是 `<head>` 里**第一个** `<script>`（先于任何样式表与其他脚本），支持 `nonce`，读存储全部包 `try/catch`（Firefox 第三方上下文里访问 `localStorage` 会抛 `SecurityError`）。当前脚本已是 IIFE + try/catch（`ssr.ts:125-169`），但**缺 nonce**，且 `storage.ts:306-312` 的 `getStorage()` 用 `typeof window.localStorage === 'undefined'` 判断——**读属性本身就会抛**，必须包 try/catch。
5. **`auto` 三态维持现状**：显式存 `'auto'`（而不是 Tailwind 那种"键不存在 = system"）是对的，跨标签/跨设备语义更清晰。但要补上：`storage` 事件要覆盖**全部**键（现状只监听 2 个）、`matchMedia` 变更监听（现状已实现，`use-theme.ts:204-217`，✅）。
6. **可选增强（不是必需）**：View Transitions 圆形揭示切换（体验项，Safari 18 前降级）、`Sec-CH-Prefers-Color-Scheme` 客户端提示（仅 Chromium，且首访无值，作为 cookie 缺失时的兜底）、`light-dark()`（可省掉一半 token 声明，但需要 `color-scheme` 驱动，与 class 体系并用时要小心）。

---

## 2. 现状架构（事实基线）

### 2.1 分层与数据流

```
            ┌──────────────────── 消费者 ────────────────────┐
            │                                                │
  ┌─────────┴──────────┐                        ┌────────────┴──────────────┐
  │ @vean/unocss       │                        │ @vean/ui                  │
  │ presetUi()   │                        │ SConfigProvider           │
  │  ├ buildThemeColors│◄─── COLOR_VARIABLES ───│  ├ theme = computed(...)  │
  │  ├ borderRadius{}  │      (token 单一权威)   │  ├ createTheme(theme)     │
  │  ├ fontSize{root}  │                        │  ├ <ThemeStyle> 注入      │
  │  └ preflight(global/ui/reset css)          │  └ useTheme() 上下文       │
  └────────────────────┘                        └───────────────────────────┘
                                                            │
                       ┌────────────────────────────────────┴───────────────────────┐
                       │ @vean/theme（纯函数，无 DOM）                              │
                       │                                                            │
   ThemeOptions ──► core.ts createTheme ──► preset.ts resolveTheme ──► css.ts generateCss ──► string
                       │      (defu 默认值)      │  derive.ts 派生        │  · base 块（--size/--radius）
                       │                        │  core-template.ts 模板  │  · light 块（40 token + 6 ramp）
                       │                        │  registry.ts 方案表      │  · dark 块（diff-only）
                       │                        │  tokens.ts 档位表        │
                       └─────────────────────────────────────────────────────────────┘
                              storage.ts（localStorage 3 键 + 校验）  ssr.ts（首帧脚本）
```

设计上干净的地方（应当保持）：`createTheme(options): string` 是纯函数、无副作用、可 SSR、0.29ms/次（实测 50 次平均）；token 权威唯一在 theme 包，unocss 只做变量名映射；dark 层 diff-only 输出（与 light 等值的键不重复输出）。

### 2.2 文件职责与体量

| 文件                      |     行数 | 职责                                                      |
| :------------------------ | -------: | :-------------------------------------------------------- |
| `types.ts`                |      641 | 全部公开类型（含 40 个 token 的逐字段 doc）               |
| `storage.ts`              |      607 | 3 个 localStorage 键 + 逐字段校验 + 自定义 preset 表 CRUD |
| `registry.ts`             |      351 | 26 个 base/primary 色板 + 5+5+4 个方案 + 运行时注册表     |
| `preset.ts`               |      282 | 模板 ⊕ 方案 ⊕ overrides → FullThemePreset（含 dark 裁剪） |
| `derive.ts`               |      254 | light→dark 派生 + 档位偏移                                |
| `css.ts`                  |      174 | CSS 字符串生成（base/light/dark/palette）                 |
| `ssr.ts`                  |      172 | `isServerRuntime` + 首帧内联脚本                          |
| `shared.ts` / `utils.ts`  | 123 / 54 | 颜色解析、`defu`/`keysOf`（从 aria 复制而来）             |
| `variables.ts`            |      100 | 40 个变量名 + alpha 变量 + palette 键                     |
| `core-template.ts`        |       95 | 显式核心模板（base 10 键 + primary 2 键 × 2 family）      |
| `tokens.ts`               |       83 | 尺寸/圆角枚举 + 档位表 + 固定暗色边框                     |
| `defaults.ts` / `core.ts` |  20 / 46 | 默认值、`createTheme` 入口                                |

合计约 3000 行源码 / 5 个测试文件。**测试覆盖的偏斜是本次审计的起点**：派生确定性、档位快照、storage 解析、首帧脚本文本都有覆盖，但**没有一条测试断言"派生结果可用"**（对比度、surface 不塌陷、变量必须存在、ramp 语义）。13 条 P0/P1 里有 4 条属于这类"行为契约无人看守"的洞。

### 2.3 公开 API 面与真实消费

`@vean/theme` 导出面（`index.ts`）里，被外部真实消费的是：`createTheme`、`resolveTheme`、`DEFAULT_PRESET_OPTIONS`、`COLOR_VARIABLES`、`PALETTE_COLOR_KEYS`、`EXTENDED_THEME_VARIABLES`、`ALPHA_COLOR_VARIABLES`、`SIZE_VARIABLE`、`RADIUS_VARIABLE`、`THEME_SIZE`/`THEME_RADIUS` + `themeSizeKeys`/`themeRadiusKeys`、`resolveColorValue`、`getRegistry`、`paletteColorLevels`、`builtinBasePresetKeys`/`builtinPrimaryPresetKeys`。

无消费：`builtinFeedbackSchemeKeys`、`builtinChartSchemeKeys`、`builtinSidebarSchemeKeys`（§3.4.5）。

`@vean/ui` 侧真正决定主题的代码路径：`SConfigProvider`（`components/config-provider/hooks.ts`）→ `createTheme(themeContext.theme)` → `<style id="__Vean_theme">` 内联渲染（SSR 与客户端都渲染，靠 hydration 后重写 `textContent` 修正）；同时 `watch(themeCss)` 把 CSS 快照写进 localStorage。

### 2.4 生成物度量（实测）

| 指标                                  | 值                                    |
| :------------------------------------ | :------------------------------------ |
| `createTheme({})` 输出（hsl / oklch） | 7243 B / 7806 B                       |
| 同 gzip 后                            | 2271 B / 1760 B                       |
| 声明总数                              | 207（base 2 + light 109 + dark 96）   |
| 暗色块占比                            | 46.4%（3361 B）                       |
| palette ramp 占比                     | **68.3%（4950 B，121/207 条声明）**   |
| `createTheme` 耗时                    | ≈0.29 ms/次（zinc/indigo，50 次均值） |

结论：单次派生成本可以忽略，**问题在体积与"输出内容是否都有人用"**。这也是把它拆成"运行时语义层（小、动态）+ 构建期 ramp 层（大、静态、按需）"的量化依据。

---

## 3. 深度分析

### 3.1 架构与分层

**3.1.1 值得保持的三点**

1. **纯函数引擎 + 适配器分层**（theme → unocss → ui）比 Nuxt UI 的"单包内嵌 module"更可复用，也比 Ant/Naive 的 CSS-in-JS 方案更适合 SSG/静态站点。这是相对主流的**真实优势**（详见 §4.2）。
2. **token 权威唯一**：`COLOR_VARIABLES` 是唯一命名来源，unocss 的 `buildThemeColors` 只做 kebab 映射（`colors.ts:30-50`），没有第二套 token 表。
3. **dark 层 diff-only**（`css.ts:72-80`，`preset.ts:143-152` 先裁剪）：暗色块只输出与亮色不同的键，是体积优化的正确做法。

**3.1.2 缺一层：语义层与组件层之间是断的**

主流的分层是 **primitive → semantic → (component)**；Vean 有 primitive（colord 色板）、有 semantic（40 token），但**没有 component 层**，也没有"语义 → 组件"的桥。后果：

- 消费者想改单个组件的视觉，只能通过 `ui` prop 注入类名（shadcn 式），**无法通过 token 覆盖**（Ant 的 `theme.components.Button`、PrimeVue 的 90 个组件 token 集就是干这个的）。
- 组件作者写样式时用 `bg-sidebar-accent/15`、`shadow-lg`、`z-50` 这类"半 token"值（§3.3），这些值既不在 token 契约里，也不可被主题覆盖。

这不一定要照抄 Ant（组件 token 会让引擎与 UI 实现耦合，代价很大），但**至少要显式选边**并写入 ADR：Vean 的策略是"token 到语义层为止，组件级定制交给 `ui` prop + 类名"。当前没有这个声明，导致"为什么没有组件 token"变成一个反复被问的问题（也导致 shadow/z-index 这类**跨组件共享**的维度被漏掉——它们其实属于语义层，不该丢）。

**3.1.3 `@vean/ui` 与 `@vean/theme` 的耦合面偏厚**

`use-theme.ts`（467 行）同时承担：主题状态、持久化、SSR 注入、preset 解析、跨标签同步、暗色 class 切换、过渡禁用。其中至少三块应该下沉到 `@vean/theme`：

- **`disableTransition` 逻辑**（`use-theme.ts:259-271`，内联实现 VueUse 的做法）→ 应成为 theme 包的公共工具（并修掉它"reflow 后同步移除"的脆弱点：若 `appendChild` 与 `removeChild` 之间抛异常会永久禁用全站过渡）。
- **`getDarkClass` 与 `darkSelector` 解析**（`use-theme.ts:115-125`）与 `ssr.ts` 里的同名逻辑重复（`ssr.ts:158-161` 用正则去点）→ 两处实现必须保持行为一致，应合并。
- **`APPLIED_PRESET_KEY` 的读写**（`use-theme.ts:281-321`）绕过了 `storage.ts` 的校验层，且未包 try/catch。

### 3.2 派生引擎的正确性与可维护性

**3.2.1 同一规则有两份实现（light↔dark 映射）**

`core-template.ts` 给出各 family 的 light/dark 核心值（如中性 primary `{p}.800 → {p}.200`、ring `{p}.400 → {p}.500`），而 `derive.ts:114-138` 又把同一套规则**重新实现了一遍**，用于 `overrides` 场景（用户覆盖 light 时反推 dark）。目前两者一致，但只有 chromatic primary 的规则被抽成了共享函数（`chromaticDarkPrimary`）；neutral 的 `.800→.200`、ring 的两条规则仍是**双写**。

风险：只要有人在模板里调一个值而忘了改派生规则，**默认主题正确、一旦用户做 override 就派生出错误的暗色**——这类 bug 极难在评审中发现。
→ 建议：把映射做成**单一函数**（`deriveDark(key, lightValue, family)`），模板本身由它生成（或在测试里断言"模板 dark == derive(模板 light)"）。后者成本最低，可作为第一条护栏测试。

**3.2.2 全程字符串类型（stringly-typed）**

`ColorValue` 是联合字面量类型，但派生逻辑一律 `string.split('.')` 解析（`derive.ts:44-87` 的 `shiftToken`/`splitColor`），档位表是 `Record<string, string>`（`tokens.ts:48`），`LEVEL_FLIP` 没有 `satisfies Record<PaletteColorLevel, PaletteColorLevel>` 约束。同时"这是不是一个 palette.level 引用"在三处各写了一遍：`shared.ts:29-31`（前缀判断）、`derive.ts:71-87`（`splitColor`）、`storage.ts:389-398`（`isPaletteLevelColor`，这一处做得最严谨，用 `Object.hasOwn` 挡住了 `zinc.constructor` 这类原型键）。

→ 建议：定义 `type TokenColor = { kind: 'palette'; palette: string; level: PaletteColorLevel } | { kind: 'simple'; name: 'white'|'black' } | { kind: 'raw'; css: string }`，解析一次、全程携带。收益不只是类型安全：`LEVEL_FLIP` 的缺失键、`split('.')` 对 `hsl(...)` 的误判（当前靠调用顺序规避）都会变成编译期问题。

**3.2.3 副作用：`deriveDarkFromLight` 的兜底是"继承 light"**

`derive.ts:110-158` 对无法派生的值（绝对色、未知 level）返回 light 值，于是暗色块里该 token 与亮色相同 → 被 diff 逻辑裁掉 → 暗色下沿用亮色值。对绝对色 override（用户写 `oklch(...)`) 这**通常是错的**（一个深色 surface 在暗色模式下仍会显示深色），但用户无从得知。
→ 建议：至少 `console.warn` 或在文档中明确"绝对色 override 不参与暗色派生，需自行提供 `overrides.dark`"。

**3.2.4 `borderOpacity` 在 oklch 下是死参数（P1 实测）**

`css.ts:125-133`：

```ts
if (!alphaVariable || format === 'oklch' || isUnTransformedColor(...)) return { color: colorValue, alphaCss: '' };
```

实测：`createTheme({format:'oklch', borderOpacity:1}) === createTheme({format:'oklch', borderOpacity:0.2})` → `true`；hsl 下则正常产出 `--border-alpha: 0.02`。即**同一个 ThemeOption 在一个 format 下生效、另一个下静默失效**，且暗色边框在 oklch 下内联 `oklch(100% 0 0 / 0.1)`、在 hsl 下拆成 `--border: 180 100% 100%` + `--border-alpha: 0.1`——**同一个变量在两种 format 下语义不同**（一个是完整颜色、一个是裸通道）。
→ 修复方向：oklch 下也暴露 alpha（`--border-alpha` 与颜色解耦），或明确把 `borderOpacity` 标记为 `format:'hsl'` 专有并在类型上收窄。顺带：`0.1 * 0.2 = 0.020000000000000004` 这样的浮点噪声会原样进 CSS，建议 `toFixed(4)` 归一。

**3.2.5 `defu` 与 `overrides` 的语义**

`core.ts:25` 用 `defu(options, DEFAULT_PRESET_OPTIONS)` 合并默认值；`overrides` 是嵌套对象，`defu` 会**递归合并**，而 `preset.ts:114-141` 又对 `overrides` 单独做了一遍合并 + 派生。两条合并路径并存（一层在 core、一层在 preset），读代码时需要同时跟踪。不建议现在改动（有快照测试保护），但可以记为"可读性债"：把默认值合并收敛到 `resolveTheme` 一处。

### 3.3 Token 完整性（对齐主流）

主流语义层规模：Ant 106 map + 93 alias（≈199 非 seed 字段）、PrimeVue 227、Semi 168、Chakra 120、shadcn 29。**Vean 40 个颜色 token 属于"偏少但可用"**；真正的差距不在颜色，而在**其他维度完全缺席**：

| 维度         | Vean                             | 主流                                                                | 现状代价                                                                   |
| :----------- | :------------------------------- | :------------------------------------------------------------------ | :------------------------------------------------------------------------- |
| spacing/尺寸 | 无（`--size` 是根字号缩放）      | Ant `sizeUnit=4` + `controlHeight{SM,LG}`；Mantine spacing xs..xl   | 密度不可主题化；`size:'xs'` 把 1rem 变 12px，撞 iOS 补丁、覆盖用户字号偏好 |
| 阴影         | 无                               | Ant `boxShadow/Secondary`；Semi `--semi-shadow-elevated`            | 32 处 `shadow-lg/sm/md` 写死 UnoCSS 默认值，无法跟随主题；层级与阴影脱钩   |
| 动效         | 无                               | Ant `motionDuration*`；Chakra `durations/easings` 是一等 token 类   | 时长散落 UnoCSS preset 与组件类名（`transition-[width,height]-200`）       |
| z-index      | 无（13 处 `z-50`）               | Mantine `zIndex.{app,modal,popover,overlay,max}`                    | 弹层层级靠约定；`--soybean-layout-*-z-index` 是一次性变量                  |
| 边框宽度     | 无                               | Ant `lineWidth/lineWidthBold`；Radix 有 6-8 步 border               | `border` / `border-2` 写死                                                 |
| 状态色状态   | 每状态 2 个（base + foreground） | Ant 每状态 10 个；Semi 每状态 7 个（hover/active/disabled/light-*） | hover/active 只能靠 UnoCSS 透明度修饰（`bg-destructive/90`），不可主题化   |
| 组件 token   | 无                               | Ant 70 组件；PrimeVue 90 组件集                                     | 单组件不可 token 化定制（见 §3.1.2，需 ADR 表态）                          |
| 数据可视化   | 5（chart1-5）                    | shadcn 5；Semi 20                                                   | 数量可接受；但无 CVD 分离度保证、无明暗配对规则                            |

**建议的补齐顺序**（按"每增加一个 token 的成本 / 收益"）：

1. **阴影 + 动效 + z-index**（三者都是跨组件共享的语义维度，且现在被硬编码"污染"得最厉害）。阴影建议直接给 3–4 档（`xs/sm/md/lg`）而非 Ant 的 25 档；并让 surface 阶梯与阴影一起变（这是修复 §3.6 层级塌陷的另一半）。
2. **尺寸/密度**：把 `--size` 的根字号缩放降级为可选（保留 `--size` 供"整体缩放"场景），新增 `--control-height{,-sm,-lg}` 与 spacing 阶梯；`size` 枚举改为映射这组 token。注意兼容：`size` 已被持久化（`ThemeConfigState.size`），改动要保留旧值映射。
3. **状态色状态族**：至少补 `-hover` / `-active` / `-subtle`（`bg-destructive/10` 这类用法无法被主题控制，是当前最常被消费者投诉的点之一——从 `packages/ui/src/styles/*.ts` 里 600+ 处透明度修饰可见其普遍）。
4. **组件 token**：先写 ADR 明确"不做"，除非有商业化诉求（Ant 的组件 token 是它的护城河之一，但代价是引擎与 70 个组件耦合）。

### 3.4 Token 冗余（实测）

**3.4.1 冗余的判定标准**

"冗余"不等于"两个 token 值相同"——语义不同的 token 即使默认同值也有价值（用户可能只想改其中一个）。判定标准应是：**(i) 默认值是否完全等值；(ii) 是否存在消费方；(iii) 是否存在能让它分化的场景**。以下用实测数据逐项判定。

**3.4.2 palette ramp：68.3% 的体积，16 处消费**

实测（zinc/indigo 默认主题）：

| 断言                                                       | 结果                                                                     |
| :--------------------------------------------------------- | :----------------------------------------------------------------------- |
| ramp 字节 / 总字节                                         | 4950 / 7243 = 68.3%                                                      |
| ramp 声明 / 总声明                                         | 121 / 207 = 58.5%                                                        |
| 暗色块里 ramp 占比                                         | 55 / 96 条声明                                                           |
| `--primary-*` 是否在暗色重出                               | 否（chromatic 的暗色 primary 与亮色同为 `{p}.500`）                      |
| `--destructive/success/warning/info/carbon-*` 是否暗色重出 | 是（5 条 × 11 级）                                                       |
| 库内 ramp 引用                                             | 16 处（`bg-primary-600`、`bg-success-100` 等）                           |
| 暗色 ramp 是否仍保持"级别越大越深"                         | 是（已核对 success/destructive 的 50/100/500/600/900）                   |
| carbon 的 ramp 是否保持同一可用区间                        | **否**：`carbon-500` light 15.8% L → dark 95.9% L；`carbon-900` 6% → 49% |

即：**ramp 不是"错的"，而是"贵且少用"**，并且因为按模式重锚（保持单调但绝对明度不同），`--success-500` 在 light 是 45% L、dark 是 58% L——同一 level 两种明度，跨模式写 `bg-success-600` 时的心智负担不小。
→ 建议：(a) ramp 输出改为可配置（`emitRamps`），默认只输出被引用的 level；(b) 更彻底的做法是**把 ramp 移到构建期**（UnoCSS 在构建时知道哪些 utility 被用到，可生成静态 ramp 层），运行时只输出语义层——这同时把 CSS 快照从 7.2KB 压到 ~2.3KB，直接改善持久化体积与首帧注入成本。

**3.4.3 sidebar 命名空间：8 键 / 默认全等值 / 1 键零消费 / 1 个开关是坏的**

实测默认 `derived` 方案（light）：

```
sidebar === background            ? true
sidebarForeground === foreground  ? true
sidebarPrimary === primary        ? true
sidebarPrimaryForeground === primaryForeground ? true
sidebarAccent === accent          ? true
sidebarAccentForeground === accentForeground   ? true
sidebarBorder === border          ? true
sidebarRing === ring              ? true
```

消费方（库内）：`bg-sidebar`（layout/app-shell rail）、`bg-sidebar-accent`、`text-sidebar-foreground`、`text-sidebar-primary`、`bg-sidebar-primary/10`、`border-sidebar-border`（app-shell、tree-menu、split-nav、layout 四个样式文件，共 23 处）。`sidebar-ring` **0 处**。

**P0 缺陷：`sidebarDerive: false` 会删掉变量而不是回落。**
`preset.ts:249-251` 在 `sidebarDerive === false` 时直接返回不含 sidebar 键的 preset，`css.ts` 对每个 `COLOR_VARIABLES` 键只在 `preset[key]` 有值时才输出 → **`--sidebar*` 变量完全不生成**。而 `types.ts:483-489` 的文档承诺"fall back to the base background/foreground/border tokens"。实际后果：`bg-sidebar` 编译成 `hsl(var(--sidebar))` → 变量不存在 → 声明在计算值阶段失效 → **侧栏背景变透明**。这是"文档承诺 vs 实现"的直接冲突，且默认开启（`DEFAULT_PRESET_OPTIONS.sidebarDerive: true`）掩盖了它。

→ 修复（三选一）：(a) `sidebarDerive: false` 时仍输出变量、值等于 base 对应 token（推荐，与文档一致）；(b) 让 unocss 的映射带 fallback（`var(--sidebar, var(--background))`）——注意 `colors.ts:16-22` 目前对 hsl 是 `hsl(var(--vean-x))`，无法表达"整条 fallback"，需要改成 `hsl(var(--sidebar, var(--background)))`；(c) 删除该开关。

**结论**：sidebar 命名空间**作为能力应保留**（区域皮肤是真实需求，主流只有 shadcn 有），但需要收敛：去掉 `sidebarRing`（或让它真正被消费）、`derived` 方案改为"不输出/输出等值变量"二选一并修正语义、把这 8 个键的文档从"独立皮肤"改成"默认等值、按需分化"。

**3.4.4 `muted` / `accent` / `secondary`：三个 token 一个值**

light 三者同为 `{p}.100`，dark 同为 `{p}.800`；`secondaryForeground` light = `{p}.900`、`accentForeground` light = `{p}.900`、`foreground` = `{p}.950`（几乎不可区分）；dark 下 `secondaryForeground` = `{p}.50` = `foreground`。
`use-theme-variants.ts` 把它们拆成 9 个可调项（3 个背景 + 3 个前景 + …），但**默认状态下调任何一个都只是"改了个没人看见的值"**，因为组件的 hover 面（`accent`）与只读面（`muted`）视觉相同。
→ 建议：让三者分化（交互 hover 面应比只读弱面深一档，例如 `muted = {p}.50`、`accent = {p}.100`、`secondary = {p}.100`），或合并 `secondary` → `muted` 并保留 `secondaryForeground` 兼容别名。无论哪条，都应把"分化意图"写进类型注释，否则下一个人还会问同样的问题。

**3.4.5 死导出**

`builtinFeedbackSchemeKeys` / `builtinChartSchemeKeys` / `builtinSidebarSchemeKeys`（`registry.ts:309-319`，由 `index.ts:14-16` 导出）：全仓库（含 apps/docs/skills）无引用。保留成本低但会误导消费者以为它们是稳定 API。建议删除或标记 `@deprecated`。

### 3.5 对比度与可访问性（实测矩阵）

这是本次审计最重要的发现：**引擎的派生规则完全没有对比度约束**。`deriveBasePreset`(`derive.ts:177-222`) 对所有状态色的前景一律取 base 极值（light `{p}.50`、dark `{p}.900`），而状态色本身取自"亮色调板 500/400"——两者相撞时必然出现低对比。

实测 WCAG 对比度（`resolveColorValue(..., 'hsl')` → 标准相对亮度公式，脚本见附录 A）：

**light 模式（zinc base）**

| token 对                        | zinc/indigo | neutral/emerald | stone/amber | 判定       |
| :------------------------------ | ----------: | --------------: | ----------: | :--------- |
| `foreground` / `background`     |       19.90 |           19.80 |       19.76 | AA         |
| `cardForeground` / `card`       |       19.90 |           19.80 |       19.76 | AA         |
| `primaryForeground` / `primary` |        4.27 |        **2.43** |    **2.05** | ❌ / AA-lg |
| `destructiveForeground` / …     |        3.60 |            3.60 |        3.60 | AA-lg      |
| `successForeground` / …         |    **2.18** |        **2.18** |    **2.18** | ❌         |
| `warningForeground` / …         |    **2.06** |        **2.06** |    **2.05** | ❌         |
| `infoForeground` / …            |        3.52 |            3.52 |        3.52 | AA-lg      |
| `mutedForeground` / `muted`     |        4.39 |            4.35 |        4.40 | 临界 AA-lg |
| `ring` / `background`           |    **2.99** |        **1.92** |    **1.67** | ❌         |
| `border` / `background`         |        1.27 |            1.26 |        1.26 | ❌（边界） |

**dark 模式**：正文/卡片/`muted` 类全部 AA（16–19），状态色也普遍 AA（6.3–10.8，因为暗色下状态色取 400 级、前景取深色极值，方向正确）；**唯一持续失败的是 `ring`**：1.74（zinc 中性）/ 2.04（emerald）/ 2.18（amber）。

结论与建议：

1. **`ring` 是 P0**：light 下 neutral family 取 `{p}.400`（2.99，差 0.01）、chromatic 取 `{p}.400`（1.67–2.04）；dark 下 chromatic 取 `{p}.900`（1.74–2.18，几乎看不见）。而 `ring-ring` 被 7 处 `focus-visible` 消费 → **键盘用户的焦点指示在多数主题下达不到 WCAG 1.4.11 的 3:1**。修复：ring 取"与背景对比 ≥3:1 的 primary 级别"（light 用 `{p}.600`，dark 用 `{p}.400`），并把 3:1 写成测试断言。
2. **状态色前景应当"自动对比"而非"取 base 极值"**：`success`(green.500, 45% L) 与 `warning`(amber.500, 50% L) 配近白文字 = 2.2，无论 base 是哪个中性色都失败（这是**几何必然**，不是个别调色板问题）。修复：用一次亮度计算选前景（`{p}.50` 还是 `{p}.950`），即 Chakra 的 `contrast` token、Radix step 12、Mantine `filled-color` 的做法；引擎已依赖 `@soybeanjs/colord`，成本极低。**同时把"26 个内置 primary × 2 模式 × 状态色 ≥4.5"变成一条测试**——这是防止未来新增调色板引入不可读组合的唯一办法。
3. **`primaryForeground` 在部分品牌色下失败**（emerald 2.43 / amber 2.05）：同一根因，同一修复。
4. `border`/`input` 对 1.27：`input` 边框是表单控件的可见边界，WCAG 1.4.11 要求 3:1。建议把 `input` 与 `border` 解耦（`input` 至少 `{p}.400`），或为输入框提供非边框的视觉标识（背景填充），并在文档中记录该取舍。
5. `mutedForeground` 4.35–4.40 属临界（AA 需 4.5）：建议 light 的 `mutedForeground` 从 `{p}.500` 下调到 `{p}.600`（实测过线）。

### 3.6 `lightLevel` / `darkLevel` 专项

**3.6.1 设计意图（来自已删除的设计文档）**

`docs/theme-refactor-plan.md`（2026-08-13 由 `7943bc0eb` 删除）定义：`LIGHT_SURFACE = [white,50,100,200]` 作用于 `background/card/popover`；`LIGHT_WEAK = [100,200,300,400]` 作用于 `muted/accent/secondary/carbon`；`LIGHT_MUTED_FG = [500,600,700,800]`；dark 三张表同构；`foreground` 系与 `primary/ring/chart/border/input` 不偏移（决策 D8 / ADR-4/5）。**代码与设计文档一致**——也就是说 §3.6.2 的问题是**设计本身的**，不是实现跑偏。

**3.6.2 实测：档位在 light 下破坏层级**

| 档位    | background | card      | popover   | muted     | accent    | secondary | border    |
| :------ | :--------- | :-------- | :-------- | :-------- | :-------- | :-------- | :-------- |
| level 0 | `white`    | `white`   | `white`   | `{p}.100` | `{p}.100` | `{p}.100` | `{p}.200` |
| level 1 | `{p}.50`   | `{p}.50`  | `{p}.50`  | `{p}.200` | `{p}.200` | `{p}.200` | `{p}.200` |
| level 2 | `{p}.100`  | `{p}.100` | `{p}.100` | `{p}.300` | `{p}.300` | `{p}.300` | `{p}.200` |

三处塌陷：**(i)** `background = card = popover` 在所有档位（基准同为 `white`）；**(ii)** `muted = accent = secondary` 在所有档位；**(iii)** level 1 时 `muted = border = {p}.200`，弱表面与边框同色。

暗色侧健康（`background 950 → card 900/800 → muted 800` 始终分层），因为模板本来就给了 dark 三层不同的基准值——**这反证了 light 的塌陷源于模板里 `background/card/popover` 三者同为 `white`**。

→ 修复见 §1.1 的 B/A 两案。补一条不变量测试：**任一档位下 `background ≠ card ≠ border` 且 `muted ≠ border`**。

**3.6.3 主流对照**

| 库                 | 层级表达                                                                                          | 是否用户可调                |
| :----------------- | :------------------------------------------------------------------------------------------------ | :-------------------------- |
| Ant Design v5      | `colorBgLayout` / `colorBgContainer` / `colorBgElevated` / `colorBgSpotlight` + `colorFill*` 四档 | 否（具名 token）            |
| Semi Design        | `--semi-color-bg-0..4`（页面/提升内容/模态/Toast/特殊）                                           | 否                          |
| Arco               | `--color-bg-1..5` + `--color-bg-popup`                                                            | 否                          |
| Radix Themes       | `--color-background` / `panel-solid` / `panel-translucent` / `surface` / `overlay`                | 仅 `panelBackground` 二选一 |
| Mantine            | 无 surface 阶梯；`primaryShade`（每模式一个色阶索引）                                             | `primaryShade` 可调         |
| Nuxt UI            | dark 下 primary 固定 `500 → 400` 指针平移                                                         | 否（内部规则）              |
| Material 3（规范） | `surface-container-{lowest,low,high,highest}`                                                     | 否                          |

**唯一"数值可调"的先例是 Mantine 的 `primaryShade`**（选一个色阶索引当主色），且它是**每模式一个值**，不像 Vean 是"沿表前移 N 格"。这佐证了 §1.1 的建议：要么改成具名档位，要么保留数值但明确它只是"页面染色"。

### 3.7 持久化与首帧

**3.7.1 现状：4 个 key、2 个写入者、无防抖**

| key                              | 内容                      | 写入者                                                                | 是否被跨标签监听  |
| :------------------------------- | :------------------------ | :-------------------------------------------------------------------- | :---------------- |
| `__SOYBEAN_THEME`                | `ThemeConfigState`        | `use-theme.ts:225-235`（`watch(themeState, deep)`，**无防抖**）       | ✅ `hooks.ts:100` |
| `__SOYBEAN_THEME_CSS`            | 生成的 CSS 快照（≈7.2KB） | `hooks.ts:62-66`（`watch(themeCss)`）+ `onMounted` 补写               | ❌                |
| `__SOYBEAN_THEME_PRESETS`        | 自定义 preset 表          | `setStoredThemePreset`                                                | ✅ `hooks.ts:102` |
| `__SOYBEAN_THEME_APPLIED_PRESET` | 当前应用的 preset 名      | `use-theme.ts:317-320`（**裸 `localStorage.setItem`，无 try/catch**） | ❌                |

后果：拖一次 `SThemeCustomizer` 的档位滑块 = 每次 input 事件 1 次 config 写 + 1 次 7KB CSS 写；另一个标签页切换了 preset，本标签**不会同步**（漏听 applied-preset 键）。

**3.7.2 跨标签同步的字段级缺陷**

`refreshThemeConfig` 用 `Object.assign(themeState, stored)`（`use-theme.ts:300-303`）。由于 `JSON.stringify` 会丢掉 `undefined` 字段（例如用户清空 override 后的 `overrides: undefined`），**目标标签页的旧 `overrides` 会残留**——即"清除覆盖"这个操作在跨标签场景下不同步。

**3.7.3 解析策略过严**

`parseThemeConfig`（`storage.ts:202-304`）对 `base/primary/feedback/chart/sidebar` 采用**全有或全无**：任一键不是当前注册表中的键 → `return null` → **整个配置被丢弃**（包括 `mode`、`size`、`radius`）。而其他字段（size/radius/format/level/overrides）是"逐字段校验、保留合法的"。两种策略混用是隐患：应用注册了自定义 `sidebar` 方案、但读配置发生在 `registerThemePresets` 之前（或该版本临时移除了某个内置方案）时，用户的**明暗模式偏好会一起丢失**。
→ 建议：统一为逐字段丢弃（把非法枚举键丢掉、保留其余），并在丢弃时 `console.warn`。已有一条测试覆盖"unknown base → null"，需要同步改期望。

**3.7.4 首帧脚本**

优点：纯 IIFE + try/catch（`ssr.ts:125-169`）、`media` 选择器时跳过 class 切换、`auto` 会读 `matchMedia`、按需注入 CSS 快照。
缺口：**(i) 无 `nonce`**（严格 CSP 下脚本被拦，`docs/theme.md` §5 已把它列为待补强）；**(ii) 不设置 `color-scheme`**；**(iii) 快照注入用正则给每条自定义属性加 `!important`**（`ssr.ts:136`），这是"服务端无法算出正确 CSS"的补偿手段——SSR 档启用 cookie 后可整体移除（§1.3）；**(iv) 文档没有强调脚本必须是 `<head>` 里第一个脚本**（HTML 规范里"有阻塞脚本的样式表"会把 parser-inserted script 延后，置于样式表或外链脚本之后会破坏"首帧前执行"的保证）。

**3.7.5 缺 `color-scheme`（P1）**

全仓库检索 `color-scheme`：引擎侧 **0 处**；只有 `apps/docs/src/styles/global.css:77` 的 `.dark * { color-scheme: dark }`（safari 注释）。影响：暗色下滚动条、`<select>` 下拉、自动填充背景、`input[type=date]` 选择器、画布/overscroll 区仍是亮色，移动端硬刷新会出现白屏闪烁。这是**组件库层级该解决的事**（next-themes `enableColorScheme`、Mantine/MUI/Starlight 都在做），不该由每个消费者自己补。
→ 修复：`generateCss` 的 base 块输出 `color-scheme: light`，dark 块输出 `color-scheme: dark`；`createThemeInitScript` 同步 `document.documentElement.style.colorScheme`；文档建议在 `<head>` 最前加 `<meta name="color-scheme" content="light dark">`。

**3.7.6 存储访问未做异常防护（P1）**

`storage.ts:306-312`：

```ts
const getStorage = (): Storage | null => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return null;
  return window.localStorage;
};
```

`typeof window.localStorage` **本身就是一次属性访问**，在"阻止持久化/第三方跟踪"上下文（Firefox 的 Storage Access Policy、禁用 cookie 的浏览器）会抛 `SecurityError`；`setItem` 在配额/隐私模式下会抛 `QuotaExceededError`。首帧脚本里有 try/catch，**应用层的每条读写路径都没有**。`use-theme.ts:317-320` 更是直接裸调用。
→ 修复：`getStorage` 整体包 try/catch 并返回 `null`（降级为内存态）；写路径包 try/catch 并返回布尔；`APPLIED_PRESET_KEY` 的读写收敛进 `storage.ts`。

### 3.8 与 `@vean/ui` 的耦合面

- `getDarkClass`（ui）与首帧脚本的 class 推导（theme/ssr）是**两份实现**，`darkSelector` 语义变化时必须同时改。
- `disableTransition` 内联在 `use-theme.ts`（复刻 VueUse），是"实现细节泄漏到应用层"的典型；且它在 `appendChild` 与 `removeChild` 之间**没有 try/finally**，异常会导致全站过渡永久失效。
- `watch(themeCss)` 写 CSS 快照没有防抖，且 `onMounted` 再补写一次（同一帧两次 7KB 写）。
- 时间维度：主题切换**每次都会重算整段 CSS（7.2KB）并重写 `<style>` 的 `textContent`**，触发全量样式重算。主流做法（MUI/Ant/Chakra）是把"变量值"与"样式规则"分离：切换模式只改属性或只重算变量，不重算规则。对 Vean 而言，**把 ramp 移出运行时（§3.4.2）就能把每次切换的重算量从 7.2KB 降到 ~2.3KB**，这是同一处改动的第二份收益。

### 3.9 命名与文档债

1. **品牌前缀不一致**：`THEME_STORAGE_KEY = '__SOYBEAN_THEME'`、`THEME_INIT_STYLE_ID = '__SOYBEAN_THEME_INIT'`（`ssr.ts:32`）vs 运行时 `<style id="__Vean_theme">`（`hooks.ts:47`）vs UI 层的 `--soybean-sidebar-width` / `--soybean-layout-*-z-index`（23 + 18 + 若干处）。最近一次提交整体改名 SoybeanUI → Vean（`ba2780547`），前缀应统一（存储键改名需带迁移：读旧键 → 写新键 → 删旧键）。
2. **README 过时**（`packages/theme/README.md`）：仍在描述 `createTheme({ preset })` 选项（现为 `overrides`）、`/ssr` 的 `cookie 解析` 与 `createThemeStore`（不存在）、`MenuColor` / `MenuAccent` 类型（已删除）。`docs/theme.md` §3 已自认这一点，但 README 未改。
3. **代码注释引用已删除的规格编号**：`§3.1` / `§3.2` / `§4.2` / `§5.6` / `§5.8.2` / `D7` / `D8` / `ADR-4` / `ADR-5` 大量出现在 `derive.ts` / `tokens.ts` / `preset.ts` / `use-theme.ts` 的注释与测试名里，而 `docs/theme-refactor-plan.md`、`docs/adr/000{7,8,9}-*` 已于 `7943bc0eb` 删除。**读者无法解析这些引用**。建议：要么恢复为 `docs/adr/0002-theme-engine.md` 之类的**现存** ADR（把 level 表、D8 不偏移规则、对比度契约写进去），要么把注释改写成自解释的散文。
4. **没有 token 参考文档**：40 个 token 的语义散在 `types.ts` 的 JSDoc 里（质量不错），但没有面向消费者的"token 表 + 各 token 在明暗下的值 + 用途"页面；主题能力（format/schemes/levels/overrides）只在 `SThemeCustomizer` 的交互面板里可发现。

---

## 4. 主流主题方案对比

### 4.1 总表（11 个库，实测/文档核对）

| 库                   | 分层模型                                              | 顶层语义 token 数                                  | surface/elevation 阶梯                                             | 暗色来源                                     | 作用域                        | 组件 token                        | 持久化 / SSR                                                |
| :------------------- | :---------------------------------------------------- | :------------------------------------------------- | :----------------------------------------------------------------- | :------------------------------------------- | :---------------------------- | :-------------------------------- | :---------------------------------------------------------- |
| Ant Design v5        | seed(34) → map(106) → alias(+93) → component          | ≈199 非 seed                                       | **layout/container/elevated/spotlight + 4 档 fill**                | 算法（`darkAlgorithm`/`compactAlgorithm`）   | CSS-in-JS / 可选 `cssVar`     | ✅ 70 组件                        | `extractStyle`/`static-style-extract`；无内置持久化         |
| Chakra v3            | tokens → semanticTokens → recipes/layer styles        | 120（色 109 + 半径 3 + 阴影 8）                    | `bg`/`bg.subtle`/`bg.muted`/`bg.emphasized`/`bg.panel`             | `_light`/`_dark` 条件值 + `.dark`            | CSS 变量（`chakra` 前缀）     | recipes（非 token 层）            | color-mode 文档页 404（未核实）                             |
| MUI v6/v7            | palette → colorSchemes → components                   | 6 intent × 4 + `background.{default,paper}`        | **仅 default/paper**；层级靠 25 档 shadow                          | 手写 schemes + `applyStyles`                 | `--mui-*` + `*Channel`        | `theme.components` 覆盖           | `InitColorSchemeScript`；localStorage `mode`/`color-scheme` |
| Radix Themes         | 12 阶色 + alpha 阶 + 具名 surface                     | 12×accent/gray + `--focus-1..12` + 5 surface       | background/panel-solid/panel-translucent/surface/overlay           | 同名变量换值                                 | CSS 变量                      | ❌                                | 交给 next-themes                                            |
| PrimeVue v4          | **primitive(248) → semantic(227) → component(90 集)** | 13 组语义；颜色在 `colorScheme.<mode>`（各 83 叶） | `surface.0..950` + `content`/`overlay`/`navigation`/`mask`         | 手写 `colorScheme` 块 + `darkModeSelector`   | `--p-*` + `definePreset`/`dt` | ✅ 90 组件                        | 无内置（文档明确交给应用）                                  |
| Mantine v7           | JS theme → CSS 变量（无分层）                         | ~20 具名色 + 每色 10 阶 + 变体变量                 | 无（`Paper` 用 `--mantine-color-body`）                            | `data-mantine-color-scheme` + `primaryShade` | `--mantine-*` + resolver      | Styles API                        | `ColorSchemeScript` + `localStorageColorSchemeManager`      |
| shadcn + Tailwind v4 | 扁平语义变量 → `@theme inline`                        | **29 + `--radius`**                                | background/card/popover（+sidebar）                                | `.dark` 覆盖同名变量                         | CSS 变量 / oklch              | 仅 `--sidebar-*`、`--chart-1..5`  | next-themes + `suppressHydrationWarning`                    |
| Element Plus         | SCSS map(261) → CSS 变量 → 组件 map                   | 状态色各 5 亮级 + dark-2；3 档 bg                  | `bg-color-page/-color/-overlay` + fill 阶梯 + mask                 | 手写 `dark/css-vars.css`                     | `--el-*` + 组件 map           | ✅ `--el-button-*` 等             | 未文档化                                                    |
| Naive UI             | common(130/131) + 每组件 theme 对象                   | 130 light / 131 dark                               | 逐 surface 类型（body/card/modal/popover/table…）                  | 第二个 JS theme 对象（`darkTheme`）          | CSS-in-JS 内联变量            | ✅ 每组件对象                     | 文档化（css-render 版本约束、`inline-theme-disabled`）      |
| Semi Design          | primitive(222) → semantic CSS 变量（167/155）         | ≈168                                               | **`--semi-color-bg-0..4`（5 级带语义）** + `overlay-bg` + `nav-bg` | 手写 `body[theme-mode="dark"]`               | CSS 变量 + theme 包           | SCSS 变量（无 `--semi-<组件>-*`） | 声称支持 Next/Gatsby/Remix                                  |
| Nuxt UI v4           | 组件 theme 工厂 + 两层 CSS 变量                       | 语义层手写（`--ui-bg/text/border-*`）              | 无阶梯（语义变量手写）                                             | dark 下 primary 指针 `500→400`               | CSS 变量 + `app.config`       | 每组件 theme 工厂                 | 单 key 原子写 + FOUC 脚本 + `?doc=` 分享                    |

### 4.2 对 Vean 有价值的五条 / 不适用的一条

**值得借鉴：**

1. **Ant / Semi 的"具名 elevation 阶梯"**——直接替换 Vean 的数值档位（§3.6）。Semi 的 `bg-0..4` 语义命名（页面/提升内容/模态/Toast/特殊）可原样借用为 `background/raised/overlay/…`。
2. **PrimeVue 的 primitive → semantic → component 三层命名法**——Vean 已有前两层，第三层即使不实现，也应用"组件 token 表"的形式在文档里明确"哪些值属于组件契约"（Ant 的 70 个组件 token 也是这么被消费者理解的）。
3. **Radix 的 step 语义契约**（1–2 背景 / 3–5 组件背景 / 6–8 边框 / 9–10 实心 / 11–12 文本，且 11/12 保证 Lc60/Lc90 对比度）——Vean 的 10 级 ramp 可以照此**给每一级写死用途并保证对比度**，把"级别"从"亮度刻度"升级为"用途契约"。
4. **MUI 的 `*Channel` token**——与 Vean 的 `--border-alpha` 思路一致，但 MUI 是**为每个颜色自动生成 channel**，Vean 只给 3 个边框类 token。若要支持 `bg-primary/12` 这类任意透明度，channel 化是标准解法（UnoCSS 侧可映射为 `hsl(var(--primary) / <alpha>)`）。
5. **Nuxt UI 的"单 key 原子写 + 稀疏 ThemeDoc"**——前者修 §3.7.1，后者是主题分享/编辑器的现成 schema（`{version, preset, colors, tokens, style, components}` 稀疏文档：缺省即继承，序列化即最小导出）。Vean 的 `ThemeConfigState` + `overrides` 已经是稀疏形态，**可以直接升级为分享链接的载荷**（传输用 `deflate-raw` + base64url，Nuxt UI 已验证 ~3–5× 压缩，见 [nuxt-theme.md](../research/nuxt-theme.md) §3.2）。

**不适用（明确不做）：**

- **CSS-in-JS 运行时**（Ant/Naive 的路线）：Vean 的静态 CSS + 变量模型对 SSG/无 JS 场景更优，且体积与首帧表现更好。Ant v6 引入 `zeroRuntime`、Naive 提供 `inline-theme-disabled` 都是在往这个方向补课——Vean 起点就在终点，不应回头。
- **组件 theme 工厂 + `tv()` 运行时合并**（Nuxt UI）：需要 Tailwind 生态与构建期模板生成，且会把主题逻辑绑进组件实现。Vean 的 `scv()` recipe 已在 UI 层静态化，代价是不能像 Nuxt UI 那样在 `app.config` 里按 slot 覆盖——这是**用可定制性换体积与确定性**的自觉取舍，建议写进 ADR 而不是照抄。

### 4.3 Nuxt UI 专题（结合既有调研）

[nuxt-theme.md](../research/nuxt-theme.md) 已详述 Nuxt UI 的四层结构与 Theme Studio；与本轮审计相关的三条补充：

1. **它的"暗色指针平移"（primary `500 → 400`）本质就是一条固定的一档 `darkLevel` 规则**——即主流对"档位"的答案不是暴露旋钮，而是把一档偏移固化进引擎。这与 §1.1 的结论一致。
2. **它的颜色层零自研推导**（直接复用 Tailwind v4 `@theme` token + 手写两套语义 CSS）与本项目的"自研确定性推导"是两条哲学路线：前者零冗余、生态即官方、代价是深绑 Tailwind 且暗色语义层手工维护两套；后者框架无关、dark 自动派生、代价就是本报告发现的所有"派生正确性"问题。**既然选了自研，就必须把正确性护栏（对比度、层级、不变量）补上**——这正是 P0 清单的意义。
3. 它的持久化细节（单 key、250ms 防抖、`?doc=` 消费即焚、storage 事件跨标签、SAFE_NAME + CSS 注入防护）可直接作为 §1.3 的实现参考；其中"**boot restore 让位 `?doc=`**"和"**消费即焚 `router.replace`**"两条是主题分享功能的必备细节。

---

## 5. 问题清单与优先级

### P0（正确性 / 可访问性，应当独立提交修复）

| #    | 问题                                                                                   | 位置                                                   | 修复方向                                                        | 验证方式                                                  |
| :--- | :------------------------------------------------------------------------------------- | :----------------------------------------------------- | :-------------------------------------------------------------- | :-------------------------------------------------------- |
| P0-1 | 派生无对比度约束：`success`/`warning` 前景 2.06–2.18，`primary` 在部分品牌色 2.05–2.43 | `derive.ts:177-222`、`core-template.ts`                | 前景改"亮度自动对比"（`{p}.50` vs `{p}.950`），或按色相配置阈值 | 新增测试：26 primary × 2 模式 × 状态色 ≥4.5               |
| P0-2 | `ring` 在 6/6 抽样、2 模式下 <3:1（1.67–2.99），被 7 处 focus-visible 消费             | `core-template.ts:68-95`、`derive.ts:114-138`          | light `{p}.600`、dark `{p}.400`；ring/surface ≥3:1              | 断言 `ring` 对 `background` ≥3                            |
| P0-3 | `sidebarDerive: false` 删除 `--sidebar*`（文档承诺回落）                               | `preset.ts:249-251`、`css.ts:72-80`、`colors.ts:16-22` | 仍输出变量并取 base 值；或映射加 fallback                       | 断言 `sidebarDerive:false` 时 8 个变量存在且等于 base     |
| P0-4 | 档位偏移在 light 下塌陷 surface 层级                                                   | `tokens.ts:71-83`、`derive.ts:177-199`                 | 见 §1.1 B 案（card/popover 移出 light 偏移表）                  | 断言各档位 `background ≠ card ≠ border`、`muted ≠ border` |

### P1（功能失效 / 工程隐患）

| #     | 问题                                                      | 位置                                                                          |
| :---- | :-------------------------------------------------------- | :---------------------------------------------------------------------------- |
| P1-1  | `borderOpacity` 在 `format: 'oklch'` 下静默失效           | `css.ts:125-133`                                                              |
| P1-2  | 持久化 4 key / 2 无防抖写入者 / 跨标签漏听 1 键           | `storage.ts:159,342,376`、`use-theme.ts:40,225-235`、`hooks.ts:62-66,100-102` |
| P1-3  | `Object.assign` 无法清除陈旧 `overrides`（跨标签）        | `use-theme.ts:293-305`                                                        |
| P1-4  | `parseThemeConfig` 全有或全无：一个未知枚举键丢弃整份配置 | `storage.ts:235-249`                                                          |
| P1-5  | 无 `color-scheme`（原生控件/滚动条/画布）                 | `css.ts:44-52`、`ssr.ts:142-167`                                              |
| P1-6  | 首帧脚本无 `nonce`；文档未强调"必须是 head 第一个脚本"    | `ssr.ts:114-172`                                                              |
| P1-7  | `getStorage()` 用属性访问判空会抛；所有写路径无 try/catch | `storage.ts:306-312,324-326`、`use-theme.ts:317-320`                          |
| P1-8  | ramp 占 68.3% CSS 且随主题重算（切换成本 + 快照体积）     | `css.ts:155-174`、`variables.ts:65-72`                                        |
| P1-9  | `disableTransition` 无 try/finally，异常会永久禁用过渡    | `use-theme.ts:259-271`                                                        |
| P1-10 | `mutedForeground` 4.35–4.40 临界（AA 需 4.5）             | `core-template.ts:50`                                                         |

### P2（语义 / 一致性 / 文档）

| #     | 问题                                                                           | 位置                                                                     |
| :---- | :----------------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| P2-1  | `muted` = `accent` = `secondary` 三者同值；`accentForeground`≈`foreground`     | `core-template.ts:50-52`、`derive.ts:186-190`                            |
| P2-2  | `sidebar-ring` 零消费；default `derived` 8 键全等值                            | `registry.ts:118-140`、样式文件                                          |
| P2-3  | `carbon` 命名与语义不符（反相表面）；其 ramp 区间在暗色塌缩                    | `derive.ts:195-196,218-219`、`css.ts:155-174`                            |
| P2-4  | 缺失尺寸/阴影/动效/z-index token；32 处 `shadow-*`、13 处 `z-50` 硬编码        | `packages/ui/src/styles/*`、`unocss/src/preset.ts:105-121`               |
| P2-5  | `--size` 是根字号 zoom 而非密度 token（覆盖率/覆盖用户字号偏好）               | `unocss/src/global-css.ts:11`                                            |
| P2-6  | 死导出 `builtin{Feedback,Chart,Sidebar}SchemeKeys`                             | `registry.ts:309-319`、`index.ts:14-16`                                  |
| P2-7  | 派生规则双写（模板 vs `deriveDarkFromLight`）                                  | `core-template.ts` vs `derive.ts:114-152`                                |
| P2-8  | 全程字符串类型；"palette.level 判定"三处重复                                   | `derive.ts:44-87`、`shared.ts:29-31`、`storage.ts:389-398`               |
| P2-9  | 品牌前缀不一致（`__SOYBEAN_*` / `__Vean_theme` / `--soybean-*`）               | `storage.ts:159,342,376`、`ssr.ts:32`、`hooks.ts:47`、`styles/layout.ts` |
| P2-10 | README / 注释引用已删除规格（`§/D/ADR` 编号 + `createThemeStore`/`menuColor`） | `packages/theme/README.md`、多文件注释                                   |

---

## 6. 建议的目标形态（分阶段）

> 本节只给"修什么、什么顺序"；**"改成什么样"（分层参照、token 清单、机制与迁移）见 [theme.md](../theme.md)**。

### 阶段 1：止血（不改变公开 API，1 个 PR 可完成 P0 全部 + P1 的 7 项）

- 修复 P0-1/2/3/4（对比度自动派生、ring 级别、sidebar 回落、light 档位表）。
- `getStorage` + 所有写路径 try/catch；`borderOpacity` 在 oklch 下生效或类型收窄。
- 输出 `color-scheme`（CSS + 脚本 + 文档建议 meta）；`createThemeInitScript` 增加 `nonce` 选项。
- 单信箱 + 防抖写入（合并 4 key，带 `v` 版本与旧键迁移）；跨标签监听补齐；`Object.assign` 改为"先删后并"。
- `parseThemeConfig` 改为逐字段丢弃。
- 新增护栏测试（见 §7）。

### 阶段 2：token 层补齐（有 API 增量，无破坏）

- **surface/elevation 阶梯**（§1.1 A 案）：`background/subtle/surface/raised/overlay` 具名 token + 阴影 token，档位旋钮退化为三态预设。
- **ramp 出运行时**：`createTheme` 只输出语义层；ramp 由 UnoCSS/构建期按需生成（或 `emitRamps: 'used' | 'all' | false`）。预期收益：运行时 CSS 7.2KB → ~2.3KB，快照与切换成本同步下降。
- **尺寸/密度 token**：`--control-height{,-sm,-lg}` + spacing 阶梯，`size` 枚举映射到它们，`--size` 保留为可选的"整体缩放"。
- **状态色状态族**：至少 `-hover` / `-active` / `-subtle`，替换散落的 `/10`、`/90` 透明度修饰。
- 收敛 sidebar（去 `sidebarRing` 或落地消费）、分化 `muted`/`accent`/`secondary`、`carbon` 更名 `inverse`。

### 阶段 3：主题平台化（可选，取决于产品诉求）

- **主题编辑器 / 分享链接**：`ThemeConfigState` + 稀疏 `overrides` 已是现成 schema → `JSON → deflate-raw → base64url`；`?doc=` 服务端解码直出 + 消费即焚（复刻 [nuxt-theme.md](../research/nuxt-theme.md) §3.4）。这会把 `SThemeCustomizer` 从"应用内面板"升级为可分享的主题工作室。
- **SSR 档位的 cookie 路径**：服务端 `createTheme()` 直出，删除 `injectCss` + `!important`。
- **组件 token 层**：仅在商业化诉求明确时做（Ant/PrimeVue 的护城河，但耦合成本高）。

---

## 7. 验收与测试建议

新增测试（按价值排序，全部可在现有 vitest 结构内落地）：

1. **对比度契约**：遍历 26 个内置 primary × 2 模式 × {状态色/primary/ring}，断言 ≥4.5（正文文案）或 ≥3（ring 等非文本）。（当前 0 覆盖，且已发现 5 类失败）
2. **结构不变量**：任一档位下 `background ≠ card`、`muted ≠ border`、`card ≠ border`。
3. **变量存在性契约**：`sidebarDerive` 两种取值下，`COLOR_VARIABLES` 的 **全部 40 个键**都必须出现在生成的 CSS 里（这一条能同时拦住 P0-3 与未来任何"某开关删变量"的回归）。
4. **格式一致性**：同一 options 在 `hsl` / `oklch` 下，**语义等价**（token 数一致、alpha 变量一致、`borderOpacity` 生效）；`--border-alpha` 的浮点归一化（`0.020000000000000004` → `0.02`）。
5. **模板 ↔ 派生一致性**：断言 `deriveDarkFromLight(key, core.light[key], base) === core.dark[key]` 对所有核心键成立（拦住 P2-7 的双写漂移）。
6. **体积预算**：断言 `createTheme({}).length` 不超过阈值（例如 4KB），ramp 出运行时后收紧；防止未来无意识膨胀。
7. **storage 健壮性**：localStorage 抛异常时全部 API 不抛（用 happy-dom 覆盖 `getItem`/`setItem` 抛错）；未知枚举键只丢该字段；`clear()`（`event.key === null`）行为明确。
8. **首帧脚本**：含 `nonce` 时属性出现在 `<script>` 上；`color-scheme` 被设置；脚本在 dev 环境下 `eval` 后 class/属性/样式三者一致。
9. **UI 侧**：CSS 快照写入被防抖（断言短时间内多次主题变更只写 1 次）；跨标签预设切换同步（模拟 `StorageEvent`）。

---

## 8. 附录

### A. 复现脚本

本报告的全部实测数字由以下探针复现。**仓库内没有常驻脚本**——把代码粘到 `probe.ts`（**放在仓库内**，`/tmp` 下解析不到 `@soybeanjs/colord`），然后：

```bash
node_modules/.bin/tsx probe.ts
```

```ts
import { createTheme, generateThemePreset, resolveTheme } from '../packages/theme/src/index';
import { resolveColorValue } from '../packages/theme/src/shared';

// ① 档位塌陷
for (const lightLevel of [0, 1, 2] as const) {
  const p = generateThemePreset({ base: 'zinc', primary: 'indigo', lightLevel });
  console.log(lightLevel, p.light.background, p.light.card, p.light.popover, p.light.muted, p.light.border);
}

// ② sidebar 等值
const p = resolveTheme({ base: 'zinc', primary: 'indigo' });
console.log(p.light.sidebar === p.light.background, p.light.sidebarRing === p.light.ring);

// ③ oklch 下 borderOpacity 失效
console.log(createTheme({ format: 'oklch', borderOpacity: 0.2 }) === createTheme({ format: 'oklch' })); // true

// ④ 对比度（hsl 通道串 → 相对亮度）
const rgb = (css: string) => {
  const [h, s, l] = css
    .replace(/^hsl\(|\)$/g, '')
    .split('/')[0]
    .trim()
    .split(/\s+/)
    .map(Number);
  const S = s / 100,
    L = l / 100,
    k = (n: number) => (n + h / 30) % 12;
  const a = S * Math.min(L, 1 - L),
    f = (n: number) => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
};
const lum = (c: string) => {
  const [r, g, b] = rgb(c);
  const t = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * t(r) + 0.7152 * t(g) + 0.0722 * t(b);
};
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const v = (key: string) => resolveColorValue(p.light[key], 'hsl');
console.log('success:', ratio(v('successForeground'), v('success')).toFixed(2)); // 2.18
console.log('ring:', ratio(v('ring'), v('background')).toFixed(2)); // 2.99
```

### B. 实测数据汇总

| 项                                      | 值                                                                |
| :-------------------------------------- | :---------------------------------------------------------------- |
| `createTheme({})` hsl / oklch           | 7243 B / 7806 B（gzip 2271 / 1760）                               |
| 声明数（base/light/dark）               | 2 / 109 / 96 = 207                                                |
| ramp 占比                               | 68.3% 字节、58.5% 声明                                            |
| 暗色块占比                              | 46.4%                                                             |
| `createTheme` 耗时                      | ≈0.29 ms                                                          |
| 默认主题下 sidebar 8 token 与 base 等值 | 8/8                                                               |
| `sidebar-ring` 全仓库消费               | 0                                                                 |
| 库内 ramp 引用                          | 16 处（7 个样式文件）+ docs 2 处                                  |
| `--*` 组件级变量                        | 28 个（全部是布局/测量值，无视觉 token）                          |
| 硬编码 `shadow-*` / `z-50`              | 32 处 / 13 处                                                     |
| 失败对比度样例                          | success 2.18、warning 2.06、primary(emerald) 2.43、ring 1.67–2.99 |

### C. 参考来源

**本仓库**

- `packages/theme/src/*.ts`（引擎 12 个模块，约 2350 行）、`packages/theme/test/*.spec.ts`
- `packages/unocss/src/{colors,preset,global-css,options}.ts`、`packages/ui/src/theme/*.ts`
- `packages/ui/src/components/config-provider/{use-theme,hooks}.ts`、`packages/ui/src/components/theme-customizer/*`
- [docs/theme.md §9.4](../theme.md)（持久化与 FOUC 策略）、[docs/research/nuxt-theme.md](../research/nuxt-theme.md)（Nuxt UI 调研）
- 已删除的规格文档（`git show 7943bc0eb^:docs/theme-refactor-plan.md`）：核心 10 键、档位表、D7/D8/ADR-4/5 决策原文

**外部（官方文档 / 源码）**

- Ant Design 主题定制：https://ant.design/docs/react/customize-theme ；`colorBg*` 族：https://github.com/ant-design/ant-design/blob/master/components/theme/interface/alias.ts
- Chakra v3 semantic tokens：https://chakra-ui.com/docs/theming/semantic-tokens
- MUI color schemes / CSS 变量：https://mui.com/material-ui/customization/dark-mode/ ；https://mui.com/material-ui/customization/css-theme-variables/configuration/
- Radix Themes 色阶语义：https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
- PrimeVue v4 分层：https://primevue.org/theming/styled/
- Mantine CSS 变量 / 配色方案：https://mantine.dev/styles/css-variables/ ；https://v7.mantine.dev/theming/color-schemes
- shadcn 主题变量：https://ui.shadcn.com/docs/theming ；Tailwind v4 `@theme inline`：https://tailwindcss.com/docs/theme
- Element Plus 暗色模式：https://element-plus.org/en-US/guide/dark-mode.html
- Semi Design 暗色模式与 token：https://github.com/DouyinFE/semi-design/blob/main/content/advanced/dark-mode/index-en-US.md
- `color-scheme` 的作用：https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme ；https://web.dev/articles/color-scheme
- next-themes 首帧脚本与 `enableColorScheme`：https://github.com/pacocoursey/next-themes
- `@nuxtjs/color-mode` 的 cookie / `data-color-mode-forced`：https://github.com/nuxt-modules/color-mode
- WCAG 1.4.11 非文本对比度：https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- HTML 规范（parser-inserted script 与阻塞样式表）：https://html.spec.whatwg.org/multipage/scripting.html
- View Transitions（主题切换的可选增强）：https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using
