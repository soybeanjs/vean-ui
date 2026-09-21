# @vean/theme

[English](./README.md) | 中文

[![license](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)
[![npm version](https://img.shields.io/npm/v/@vean/theme)](https://www.npmjs.com/package/@vean/theme)
[![npm downloads](https://img.shields.io/npm/dt/@vean/theme)](https://www.npmjs.com/package/@vean/theme)
[![github stars](https://img.shields.io/github/stars/soybeanjs/vean-ui)](https://github.com/soybeanjs/vean-ui)

> 完整设计规格、token 契约与 AI Agent 接入手册见 [docs/theme.md](../../docs/theme.md)(本文只覆盖包级用法)。

Vean 主题引擎:**静态调色板层 + 语义别名层**——一张声明式映射表,不含任何测量或修正。

> 状态:✅ 已实施(第一代引擎已退役,本包是唯一实现;设计以 [docs/theme.md](../../docs/theme.md) 为准)。
> 适配器与运行时(UnoCSS 预设、`SConfigProvider`、首帧脚本、持久化、定制面板)分别在 `@vean/unocss` 与 `@vean/ui`,不在本包内。

## 📦 安装

```bash
pnpm add @vean/theme
```

## 🧩 三层模型

| 层           | 内容                                                   | 产物                                                                          |
| :----------- | :----------------------------------------------------- | :---------------------------------------------------------------------------- |
| **Palette**  | `@soybeanjs/colord` 的 26 色 × 11 级 + `white`/`black` | `generatePaletteCss()` / `dist/palette.css`(静态、可永久缓存)                 |
| **Semantic** | 41 个语义 token + 5 条角色 ramp,值是**调色板级别引用** | `resolveThemeMap()` → `emitThemeCss()`(159 条声明 ≈5.7 KB raw / gzip ≈1.2 KB) |
| **Literal**  | 尺寸 / 圆角 / 间距单位 / 层次 / 线宽 / 字体族          | 随语义层一并产出                                                              |

颜色变量一律是**裸通道**(`--zinc-50: 0 0% 98%`);语义 token 只做引用(`--background: var(--zinc-50)`),因此:

- 调色板层可以做成静态产物(切主题不重算它);
- 语义层极小,切主题只是替换引用;
- 需要完整色时用 `resolveTokenColor()`(纯函数,SSR / worker / canvas 均可用),与 CSS 走**同一个映射表**,不会分叉;
- 消费端统一用函数包裹:`hsl(var(--primary) / 0.5)`(裸 `var()` 会静默丢掉透明度)。

## ⚙️ 核心机制

**没有对比度护栏**:每个 token 的档位都在 `CORE_RULES` 里声明,`overrides` 原样生效,引擎既不测量也不修正。可读性由主题作者负责——面板与 `axe` 是检查它的地方。

表面级别是**固定声明**(`CORE_RULES`),没有"整体调暗一档"的运行时旋钮:需要微调某个 token 用 `overrides`,需要整体更暗/更亮就换 `base` 色板或 `surfaceStyle`。

## 📐 维度刻度

两条字面值刻度([space-control-scale.md](../../docs/space-control-scale.md)):

| 刻度             | 档位                                 | 值                                                                                                                                                                      |
| :--------------- | :----------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--spacing-unit` | —(唯一的间距变量)                    | 网格单位:`0.25rem`(默认)或 `calc(0.25rem * 倍率)`;18 档是这个单位的**系数**(在 UnoCSS 的 `theme.spacing` 映射里,不发 CSS 变量,默认单位下 = UnoCSS 同名同值 + 向下扩充)  |
| `--radius-*`     | `2xs` … `4xl`(9 档)+ `none` / `full` | 种子的**正系数倍**(`calc(var(--radius) * 0.25…2.25)`,`md` = 种子本身);改种子整条一起变,且任何种子都不会算出负档——负 `border-radius` 是非法值,声明被丢弃后会静默变成直角 |

UnoCSS 侧以具名 key 与数字 key 两条路暴露间距(`gap-md` / `p-2xl` / `mt-3xs`),圆角则整族接管(`rounded-2xs` … `rounded-4xl`、`none` / `full`,以及 `rounded` = 种子;`rounded-3xl` / `rounded-4xl` 也回主题,上游的固定长度不随种子移动,留在上游会让刻度在 `2xl` 处断链)。控件高度不由主题映射,用 UnoCSS 的数字 `h-*`(20–56px 即 `h-5`…`h-14`,随 `size` 缩放)。**具名档与数字类同源**(`gap-md` 与 `gap-4` 都产出 `calc(var(--spacing-unit) * 4)`),所以 `spacing` 一个选项同时带动两者;`w-*` / `h-*` / `size-*` 走 `theme.width` / `theme.height`,不受间距影响。

## 🚀 快速开始

```ts
import { resolveThemeMap, emitThemeCss, generatePaletteCss } from '@vean/theme';

// 1) Layer 1(静态,构建期产出一次)
const paletteCss = generatePaletteCss({ format: 'hsl' });

// 2) Layer 2(随主题配置重算)
const map = resolveThemeMap({ base: 'zinc', primary: 'indigo', surfaceStyle: 'layered' });
const themeCss = emitThemeCss(map); // token 名默认不带前缀;需要命名空间时传 { prefix: 'acme' }

// 3) 需要完整色时(canvas / 图表 / 颜色计算)
import { resolveTokenColor } from '@vean/theme';
const primary = resolveTokenColor({ primary: 'indigo' }, 'primary', 'dark');
```

UnoCSS 侧的颜色映射(通道 + `<alpha-value>`,这是 alpha 能生效的唯一形态):

```ts
const ref = (name: string, format: 'hsl' | 'oklch') => `${format}(var(${name}) / <alpha-value>)`;

theme.colors = {
  background: ref('--background', 'hsl'),
  'muted-foreground': ref('--muted-foreground', 'hsl'),
  'primary-500': ref('--primary-500', 'hsl'), // 角色 ramp(50–950,随主色板/方案换)
  indigo: { 500: ref('--indigo-500', 'hsl') }
};
```

## 🎛 选项

| 选项                           | 默认                    | 说明                                                                                                                                                                                                                                                                       |
| :----------------------------- | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `base` / `primary`             | `zinc` / `indigo`       | 26 个内置色板中任选(`primary` 取中性色板时切换为"亮色近黑 / 暗色近白")                                                                                                                                                                                                     |
| `feedback`                     | `classic`               | 状态色方案(见 `FEEDBACK_SCHEMES`);图表色不设方案,由 `primary` 派生(`CHART_RAMP`)                                                                                                                                                                                           |
| `overrides`                    | —                       | `{ light, dark }` 按 token 覆盖(`TokenOverride`:`stone.950` / `white` / `hsl(...)` / `oklch(...)` / `token.primary` 引用另一语义 token),最高优先级;完整色发射时编码成主题格式的通道,alpha 落到边框族的伴生变量,引用在解析期拷贝目标值(自引用 / 成环与其它非法值一样被忽略) |
| `surfaceStyle`                 | `layered`               | `flat` 回到"页面与容器同色、靠边框与阴影分层"的形态                                                                                                                                                                                                                        |
| `prefix`                       | `false`                 | 语义变量前缀;token 名默认与 shadcn 一一对应(`--background` / `--card` / `--ring`…),需要命名空间的宿主传字符串                                                                                                                                                              |
| `size` / `radius` / `spacing`  | `md` / `md` / `default` | 根字号(密度缩放,全维度)/ 圆角种子(9 档刻度 `calc()` 推导自种子,`md` 即种子)/ **间距网格单位**(预设 `compact` 0.75 · `default` 1 · `relaxed` 1.25 · `spacious` 1.5 或任意倍率;只动 padding / margin / gap / inset,不动字号、控件高度与圆角)                                 |
| `borderOpacity`                | `1`                     | 装饰性边框 alpha 的倍数                                                                                                                                                                                                                                                    |
| `format`                       | `hsl`                   | 调色板层格式(`oklch` 体积更小)                                                                                                                                                                                                                                             |
| `styleTarget` / `darkSelector` | `:root` / `class`       | 亮色块选择器 / 暗色表达(`media` → `@media (prefers-color-scheme: dark)`)                                                                                                                                                                                                   |

## 🧪 命令

```bash
pnpm --filter @vean/theme test        # 层级不变量、发射契约、JS↔CSS 同源、家族划分、维度刻度、预算
pnpm --filter @vean/theme typecheck
pnpm --filter @vean/theme build       # vp pack + dist/palette.css
```

## 📌 尚未包含

自定义色板注册(非内置 26 色)留待后续——目前用 `overrides` 覆盖单个 token。升级指南与文档站内容见 `apps/docs/src/content/{en,zh}/ui/migration/`。

## 📖 文档

设计规格与 AI Agent 接入手册:[docs/theme.md](../../docs/theme.md) · 刻度依据:[docs/space-control-scale.md](../../docs/space-control-scale.md) · 文档站:[veanui.com](https://veanui.com)

## 📄 License

MIT
