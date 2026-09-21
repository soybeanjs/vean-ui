---
head:
  title: 主题
  description: VeanUI 内置三层主题引擎：静态调色板层、语义 token 层与字面量层。通过 SConfigProvider 配置，或在你需要自己拿到 CSS 时直接驱动引擎。
---

# 主题

## 概览

VeanUI 提供了灵活的主题系统，允许你根据应用的设计需求自定义组件外观。你可以轻松调整颜色、圆角以及全局尺寸等设置。

打开[主题编辑器](/theme-editor)，在实时组件集合中调整每一项配置——那里使用的面板就是应用内嵌给用户使用的 `SThemeCustomizer`。

`SThemeCustomizer` 支持 `ui` slot 表（配合 `class`）供宿主改写外壳：`:ui="{ root: 'w-full h-[70vh]' }"` 即可填满侧栏而不是使用默认固定盒子。

## 主题是怎么构成的

主题 = **一张静态调色板表 + 一张动态别名表**：

1. **调色板层**（26 个内置色板 × 11 档）以**裸通道**形态一次性注入——`--zinc-100: 240 4.8% 95.9%`——它不随主题变化；
2. **语义层**把每个设计 token 表示成对这张表的**引用**——`--background: var(--zinc-50)`——每次主题变更时重新生成。切主题只是换引用，不做任何颜色计算；
3. **字面量层**承载非颜色的值：尺寸（`--size`）、圆角刻度（`--radius` … `--radius-4xl`）、间距网格单位（`--spacing-unit`）、层级（`--z-layout` … `--z-max`）、线宽、字体族。

token 名沿用 shadcn 且**不带前缀**：`--background`、`--card` / `--popover`（各配 `-foreground`）、`--primary`、`--secondary`、`--muted`、`--accent`、`--destructive` / `--success` / `--warning` / `--info`（各配 `-foreground`）、`--border`、`--input`、`--ring`、`--carbon`、`--chart-1` … `--chart-5`、八条 `--sidebar-*`，另有自有 token：`--mask`（模态遮罩，浓度在 `--mask-alpha`）。按压态不再单独成 token，用填充的 alpha 修饰表达（`active:bg-primary/90`）。

调色板层是**静态**的，这正是切换主题便宜的原因：语义层只换引用，切换不做任何颜色计算。除此以外引擎**不测量任何东西**——每个 token 的档位都在 token 契约里声明，可读性由主题作者负责。字号、间距、圆角都是声明值；请用[主题编辑器](/theme-editor)（或 axe）检查配对，而不是指望引擎替你修正。

token 的消费形态是**「通道 + 函数包裹」**：`hsl(var(--primary) / 0.5)`。把裸 `var(--primary)` 当颜色用会静默失效（通道三元组不是颜色）。工具类（`bg-card`、`text-muted-foreground`、`border-input`）已经替你包好了，这是推荐用法；JS 里需要真实颜色时用 `resolveTokenColor`，不要自己拼字符串。

## 主题配置

在应用根部把主题对象传给 `SConfigProvider`：

```vue
<script setup lang="ts">
import { SConfigProvider } from '@vean/ui';
</script>

<template>
  <SConfigProvider
    :theme="{
      base: 'gray',
      primary: 'violet',
      radius: '0.5rem',
      size: 'md',
      spacing: 'default'
    }"
    persist-theme
  >
    <App />
  </SConfigProvider>
</template>
```

| 选项            | 类型                                                                       | 默认值      | 作用                                                                                      |
| :-------------- | :------------------------------------------------------------------------- | :---------- | :---------------------------------------------------------------------------------------- |
| `base`          | 中性色板键（`slate` / `mist` / `gray` / `zinc` / `neutral` / `stone` …）   | `'zinc'`    | 所有中性 token（表面、文字、描边）读取的色板。                                            |
| `primary`       | 任意色板键（26 个内置，中性或彩色）                                        | `'indigo'`  | 品牌色板：`primary`、`ring`、`chart-1…5` 与 primary 角色面板都跟随它。                    |
| `feedback`      | `classic` / `vivid` / `subtle` / `modern` / `professional`                 | `'classic'` | 四个状态角色（`destructive` / `success` / `warning` / `info`）背后的色板。                |
| `surfaceStyle`  | `'layered'` / `'flat'`                                                     | `'layered'` | `layered` 给页面加一层底色调、让浮起的面在其之上；`flat` 让所有表面停在该模式的极值。     |
| `size`          | `xs` / `sm` / `md` / `lg` / `xl` / `2xl`，或长度（`'15px'` / `'0.95rem'`） | `'md'`      | 根字号（密度旋钮）：所有以 rem 为单位的 token 随之缩放。                                  |
| `radius`        | `2xs` … `2xl`，或长度                                                      | `'md'`      | 圆角**种子**：七档都是 `calc(var(--radius) * k)`，改种子即整条刻度一起变。                |
| `spacing`       | `compact` / `default` / `relaxed` / `spacious`，或倍率（0 < k ≤ 4）        | `'default'` | 间距网格单位（`--spacing-unit`）：内外边距与 gap 工具类都是它的系数。                     |
| `borderOpacity` | 数字（0 – 1）                                                              | `1`         | 缩放装饰性发丝线的 alpha（`--border-alpha` / `--input-alpha`）；不作用于 `--mask-alpha`。 |
| `overrides`     | `{ light?: { [token]: TokenOverride }, dark?: … }`                         | —           | 逐 token、逐模式的覆盖——最锋利的工具，见下。可含 `token.*` 引用。                         |
| `preset`        | 内联的 `{ light, dark }` 颜色集，或 `{ name }` 引用一个已保存的 preset     | —           | 可复用的颜色集；进入引擎前会被解析成 `overrides`。                                        |
| `prefix`        | `false` / 字符串                                                           | `false`     | 给每个变量加命名空间（`--acme-background`）。只有页面内并存另一套设计系统时才需要。       |
| `format`        | `'hsl'` / `'oklch'`                                                        | `'hsl'`     | 调色板层的通道格式（语义层只存引用，与格式无关）。                                        |
| `darkSelector`  | `'class'` / `'media'` / 选择器                                             | `'class'`   | 暗色在产出 CSS 里的表达方式（默认 `.dark`）。                                             |
| `styleTarget`   | `'html'` / `':root'`                                                       | `':root'`   | 亮色块挂在哪个选择器上。                                                                  |

`SConfigProvider` 另有 `persistTheme`（读写 `localStorage` 中的主题信封）、`themeConfig`（SSR 注入的信封）、`presetProvider`（服务端解析已保存的 preset 名）、`nonce` 与 `isServer`。

## 自定义颜色 token（`overrides`）

`overrides` 按模式替换单个 token，优先级最高——它叠加在派生出的 base / primary / feedback / sidebar token 之上（图表色由 `primary` 派生，同样可以逐 token 覆盖）：

```vue
<script setup lang="ts">
import { SConfigProvider } from '@vean/ui';
</script>

<template>
  <SConfigProvider
    :theme="{
      base: 'gray',
      primary: 'violet',
      radius: '0.5rem',
      overrides: {
        light: {
          background: 'oklch(100% 0 0)',
          foreground: 'stone.950',
          card: 'oklch(100% 0 0)',
          'card-foreground': 'stone.950',
          primary: 'violet.700',
          ring: 'violet.500',
          border: 'stone.200',
          input: 'stone.200'
        },
        dark: {
          background: 'stone.950',
          foreground: 'stone.50',
          card: 'stone.900',
          'card-foreground': 'stone.50',
          primary: 'violet.400',
          ring: 'violet.600',
          border: 'oklch(100% 0 0 / 0.1)',
          input: 'oklch(100% 0 0 / 0.15)'
        }
      }
    }"
  >
    <App />
  </SConfigProvider>
</template>
```

键就是 **token 名**（`background`、`card-foreground`、`sidebar-ring` …）——与工具类同名，kebab 写法。取值有五种形态（`TokenOverride`）：`palette.level` 引用（`stone.950`）、简单键（`white` / `black`）、CSS Color 4 语法的 `hsl(...)` / `oklch(...)`（可带 `/ <alpha>`），以及 **token 引用** `token.${name}`（如 `ring: 'token.primary'`——解析时拷贝目标 token 的值，颜色覆盖先于引用落地）。颜色分量一律带 `%`——`hsl(238.732 83.529% 66.667%)`、`oklch(60% 0.2 250)`——不用无单位写法（必须与调色板层的通道保持同一种形状）。裸通道三元组（`0 0% 100%`）与 hex / `rgb()` 不在类型内：前者格式有歧义，后者请先用 `colord(...).toHslString()` / `toOklchString()` 转换。

**完整色会被编码成本主题格式的通道**（token 的消费形态是 `hsl(var(--vean-x) / <alpha>)`，直接塞完整色会让每条声明失效）：写 `border: 'oklch(100% 0 0 / 0.1)'` 时通道进 `--border`、`0.1` 进 `--border-alpha`。没有伴生变量的 token 里写的 alpha 会被丢弃（透明度请用工具类的 `/N` 修饰符）。既不是合法引用、也无法解析的值（`transparent` / `inherit` / 未知色板 / **自引用 `token.primary` 写在 `primary` 上** / `token.ghost` / 成环的 `token.*` 链）会被**忽略**，该 token 保留名义值；**不是 token 的键同样被忽略**——陈旧或手写的键既进不了样式表，也不会把样式表弄坏。

**注意事项：**

- **亮暗两侧彼此独立。** 覆盖只作用于你写它的那个模式：`dark` 保留自己声明的档位，不会从 `light` 推导。两侧都要改就两侧都写。
- **覆盖值原样生效。** 引擎不测量、不修正、不报告它——引擎没有护栏，没有任何东西会替你走档。
- **覆盖是逐 token 的，不是逐角色的。** 想整体换品牌色，请改 `primary`（换色板），而不是把引用它的每个 token 都覆盖一遍。
- **引擎是纯函数。** 这里没有任何 DOM 操作：provider 负责解析映射表、发射别名块，并改写它自己那个 `<style id="vean-theme">`。

## 已保存的 preset（`theme.preset`）

preset 是一套可被用户重新应用的具名颜色集——主题定制面板会把它们存进主题信封。你可以内联传入，或按名字引用一个已保存的：

```vue
<template>
  <SConfigProvider
    :theme="{
      base: 'gray',
      primary: 'violet',
      preset: { name: 'midnight' }
    }"
    persist-theme
  >
    <App />
  </SConfigProvider>
</template>
```

内联 preset 就是按模式切开的 `overrides`（`preset: { light: { … }, dark: { … } }`），永远直接生效。而 `{ name }` 引用是在主题信封携带的 preset 表里查的：客户端需要 `persistTheme`，服务端需要 `presetProvider`（应用层的注册表解析函数），这样 SSR 才能渲染出客户端持久化过的那套颜色。查不到名字时回落到内置颜色。

## 直接使用引擎

常规路径是 provider——它独占那个 `<style>` 元素，负责信封持久化与跨标签页同步。当你需要自己拿到 CSS（SSR 渲染、静态构建、截图服务）时，底下这条流水线是公开的：

```ts
import { emitThemeCss, generatePaletteCss, resolveThemeMap, resolveTokenColor } from '@vean/theme';
import { buildThemeCss } from '@vean/ui';

// 一次调用完成「解析 + 发射」（SConfigProvider 内联的就是它）
const css = buildThemeCss({ base: 'gray', primary: 'violet' });

// 或者分步：映射表是唯一的中间表示
const map = resolveThemeMap({ base: 'gray', primary: 'violet' });
emitThemeCss(map); // Layer 2 —— 别名块，每次主题变更重新生成
generatePaletteCss(); // Layer 1 —— 静态调色板表，只需下发一次

// JS 里需要颜色值（canvas、图表库）
resolveTokenColor({ primary: 'violet' }, 'primary', 'dark'); // 'hsl(258.3 89.5% 66.3%)'
resolveThemeColors({}, 'light'); // 某个模式的全部 token
```

`map` 是唯一的中间表示：`light` / `dark` 各持一份"每 token 一条 `palette.level` 引用"的映射，`Object.keys(map.light)` 就是契约的 token 数量。

配合 **[UnoCSS](/overview/installation)** 时，`presetUi()`（主题写在 `vean.json` 里时用 `presetVean()`）把调色板层与默认别名块作为 preflight 一起下发，token 无需任何运行时代码即可生效；`@vean/ui/styles.css` 是等价的预构建样式表。适配器把每个 token 映射成工具类（`bg-card`、`text-card-foreground`、`border-input`、`bg-chart-1`），把色板映射成 `bg-indigo-500` 这类档位，把角色映射成 `bg-primary-500` / `text-destructive-100` 这类色阶。

### 颜色

主题系统使用 Tailwind CSS 的颜色预设。

<TailwindPalette />

## 组件级样式定制

除了全局主题配置，你还可以通过 `ui` prop 对单个组件的样式进行精细控制。

### 使用 ui prop

多插槽组件支持通过 `ui` prop 覆盖每个插槽的样式类：

```vue
<script setup lang="ts">
import { SAccordion } from '@vean/ui';

const items = [
  { title: '标题 1', value: 'item-1', description: '内容 1' },
  { title: '标题 2', value: 'item-2', description: '内容 2' }
];
</script>

<template>
  <SAccordion
    :items="items"
    :ui="{
      root: 'border-2 border-primary',
      item: 'bg-card hover:bg-accent',
      trigger: 'text-lg font-bold',
      content: 'text-sm text-muted-foreground'
    }"
  />
</template>
```

### class prop 合并

所有组件都支持 `class` prop，它会与默认样式智能合并：

```vue
<template>
  <SButton class="w-full rounded-full">自定义按钮</SButton>
</template>
```
