# 主题引擎：@vean/theme 与旧版引擎的差异

> 定位：`@vean/theme`（本分支）的**唯一权威文档**——它相对**旧版引擎**（`main` 上的第一代 `packages/theme`）在**产物、契约、机制、接线**四个层面上的差异与优势，以及新版当前的完整 token 契约、引擎 API、运行时接线与验收标准。读者：主题维护者、组件作者、**AI Agent**。
> 读法：第 0 节是速览与对照表；第 1–2 节回答"新版比旧版好在哪、代价是什么"；第 3 节起是新版自身的规格（token 表 / 机制 / 接线 / 验收）。旧版的实测数字来自 [theme-system-audit.md](./info/theme-system-audit.md)（重构前的审计快照，仅作**证据**保留，不代表现状）。
> 基线：2026-09-22 · 分支 `vean` · `@vean/theme@0.50.0-beta.1`

---

## 0. 速览（AI Agent 入口）

### 0.0 一句话差异

**旧版**：`createTheme(options)` 在运行时**算**出一份自包含的 CSS——调色板 ramp 混在别名块里一起重算，亮色档位把层级"抹平"，暗色 token 从亮色 token **派生**、整条表面阶梯还能被 `lightLevel` / `darkLevel` **位移**，区域皮肤可以被一个开关**整段删除**，输入几乎不校验。

**新版**：主题 = **一张静态调色板表**（26 色 × 11 级，构建期产出，永不变化）+ **一张声明式别名表**（每个 token → 调色板级别，亮暗各一份）+ **一层字面量**（半径 / 间距 / 层次 / 线宽 / 字体）。切换主题只换引用；每个档位都在契约里**声明**，引擎**不测量、不派生、不位移**；区域恒输出、输入逐字段校验、持久化单信封带版本与迁移。

### 0.1 实测对照

| 维度            | 旧版（`main`）                                                                                                                      | 新版（`@vean/theme`）                                                                                                                      | 差异                                    |
| :-------------- | :---------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------- |
| 颜色 token 数   | 40 个颜色 + 3 个 alpha                                                                                                              | **41 个语义 token** + 4 个 alpha                                                                                                           | +1 语义、+1 alpha（`mask`）             |
| 非颜色 token    | 只有 `--size` / `--radius`                                                                                                          | 26 条字面量 + 角色 ramp 引用                                                                                                               | 新增一整个字面量族                      |
| 运行时别名块    | 207 条声明 / 7,243 B / gzip 2,271 B                                                                                                 | **159 条声明 / 5,723 B / gzip 1,205 B**                                                                                                    | 声明 −23%、字节 −21%、**gzip −47%**     |
| 其中的色阶 ramp | 运行时重算，131 条声明 / 4,950 B（**68.3%**）                                                                                       | 55 条**静态引用**（`var(--indigo-500)`）                                                                                                   | 从"每次重算"变成"永不重算"              |
| 静态调色板层    | 有（`generatePaletteCss`，两代共有）                                                                                                | 同左：288 条声明 / 9,239 B / gzip 2,779 B                                                                                                  | 两代共有，新版把它作为唯一色源          |
| 档位来源        | 派生（`deriveDarkFromLight`）+ 位移（`lightLevel` 0–2 / `darkLevel` 0–3）                                                           | **全部声明**（`CORE_RULES` / scheme 数据）                                                                                                 | 同输入 → 同映射表（有快照）             |
| 对比度          | 状态实心配 `{b}.50`、`ring` 取 `{p}.400`/`{p}.900`：实测 **2.06–3.60 : 1** 与 **2.86 / 1.55**                                       | 定档：`primary` `.500` + `{b}.50`（**4.27**）、`ring` `.500`（**3.05–9.38**）；状态 `-foreground` 按模式翻档（亮 `{b}.50` / 暗 `{b}.900`） | 默认主题主体达标；状态 on-solid 见 §3.6 |
| 区域皮肤        | 8 条，`sidebarDerive: false` 时**整段删除**（产物里 `--sidebar*` 出现 0 次）                                                        | 8 条**镜像**，恒输出                                                                                                                       | 不再有"开关删变量"的失败模式            |
| 图表色          | 独立 chart scheme（5 套 × 明暗），可与品牌色互相矛盾                                                                                | 由 `primary` 派生（`CHART_RAMP` = 600/500/400/300/200，模式无关）                                                                          | 一个旋钮                                |
| 输入校验        | `size: 'huge'` → `--size: huge`；`borderOpacity: 5` → `--border-alpha: 5`；oklch 下 `borderOpacity` 静默失效；override 的引用不校验 | 逐字段白名单 + colord 成员表校验 + 未知键忽略                                                                                              | 坏值不再进产物                          |
| 持久化          | 4 个键（`__SOYBEAN_THEME{,_CSS,_PRESETS,_APPLIED_PRESET}`）、3 个写入者、状态写入无防抖、跨标签监听漏项、**全有或全无**             | 单键 `__VEAN_THEME`、单防抖写入者（250 ms）、逐字段校验、**版本门 + 词汇迁移**                                                             | 一个信封说清一切                        |
| 首帧            | 弱化静态块 + 持久化快照注入（两代共有，旧版还会"注入再移除"）                                                                       | 同左，且快照由 provider 改写同一元素（**无 `!important`、无二次注入**）                                                                    | 链路更短                                |
| API             | `createTheme(options)` / `createThemeCss` / `generateThemePreset` / 运行期 preset registry                                          | `resolveThemeMap` / `emitThemeCss` / `generatePaletteCss` / `buildThemeCss`（`@vean/ui`）                                                  | 纯函数流水线，无 registry               |
| token 词汇      | shadcn 原名、**无前缀**                                                                                                             | **同名**（无前缀）+ `mask` / `mask-alpha`                                                                                                  | 迁移面为 0（见 §3.12）                  |
| 组件作用域变量  | `--soybean-*`                                                                                                                       | `--vean-*`（组件自己的变量，与主题 token 分属两个面）                                                                                      | 只换品牌前缀                            |
| 主题 token 前缀 | 无前缀                                                                                                                              | **无前缀**（`prefix` 选项可加命名空间，默认关闭）                                                                                          | 与 shadcn 可原样互抄                    |

### 0.2 代码地图

| 位置                                             | 职责                                                                                                                                              |
| :----------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/theme/src/palette.ts`                  | Layer 1 数据访问：26 色 × 11 档的**裸通道**读写（键表/家族取自 colord）                                                                           |
| `packages/theme/src/semantic.ts`                 | **token 契约的数据定义**：家族数组、`CORE_RULES`（每个 token 的亮/暗档位）、`STATUS_NAMES` / `ROLE_RAMP_ROLES`                                    |
| `packages/theme/src/theme-map.ts`                | 流水线：声明的档位规则 → 区域镜像 → overrides → 完整性校验（**无测量、无修正**）                                                                  |
| `packages/theme/src/emit.ts`                     | CSS 发射：`generatePaletteCss`（Layer 1 静态）+ `emitThemeCss`（Layer 2 别名块 + 角色 ramp）                                                      |
| `packages/theme/src/resolve.ts`                  | JS 侧解析：`resolveTokenColor` / `resolveThemeColors` / `resolveColorRef` / `valueRef`（与 CSS 同源）                                             |
| `packages/theme/src/literals.ts` / `defaults.ts` | 字面量层（半径 / 间距 / 层次 / 线宽 / 字体）与默认选项 / 键表                                                                                     |
| `packages/theme/src/schemes.ts`                  | feedback scheme 数据（纯 `palette.level` 引用；图表色不设方案，由 primary 派生）                                                                  |
| `packages/theme/src/storage.ts` / `ssr.ts`       | 持久化信封（`__VEAN_THEME`，版本门 + 词汇迁移）与首帧脚本                                                                                         |
| `packages/unocss/src/theme.ts`                   | **唯一 UnoCSS 适配器**：theme.colors / theme 键映射 / token preflight                                                                             |
| `packages/ui/src/theme/`                         | UI 层：`adapter.ts`（运行时别名块）、`use-theme-settings.ts`（面板状态）、`use-theme-variants.ts`（逐 token 覆盖）、`types.ts`（`ThemeColor` 等） |
| `packages/ui/src/components/config-provider/`    | 运行时：`<style id="vean-theme">` 独占、单信封写入者、跨标签同步、`useTheme()` 上下文                                                             |
| `packages/ui/src/components/theme-customizer/`   | 定制面板（选板 / scheme / surfaceStyle / size / radius / spacing / 逐 token 覆盖）                                                                |

### 0.3 引擎 API 速查

```ts
// 解析与发射（纯函数，SSR / worker 安全）
resolveThemeMap(options): ThemeMap                            // 亮/暗映射 + alpha + 字面量（纯声明，无测量）
emitThemeCss(map, emitOptions?): string                      // Layer 2 别名块（含 55 条角色 ramp 引用）
generatePaletteCss({ format, styleTarget, weakSelectors }): string   // Layer 1 静态调色板表
resolveTokenColor(options, token, mode, format?)             // 单个 token → 完整色
resolveThemeColors(options, mode, format?)                   // 一个模式全部 token → 完整色
resolveColorRef('indigo.600' | 'white' | 'hsl(...)', format?) // 独立色引用 → 完整色
buildThemeCss(options, emit?)                                // @vean/ui：解析 + 发射一步到位（provider 用的就是它）

// 令牌与数据
SEMANTIC_TOKENS / CORE_RULES / STATUS_NAMES / ROLE_RAMP_ROLES / STATUS_FOREGROUND_LEVELS
PALETTE_KEYS / PALETTE_LEVELS / NEUTRAL_PALETTES / paletteColor(key, level, format)
FEEDBACK_SCHEMES / DEFAULT_OPTIONS / THEME_SIZE / THEME_RADIUS / THEME_SPACING / themeSizeKeys / themeRadiusKeys / themeSpacingKeys
LITERAL_DEFAULTS / literalTokens({ size, radius, spacingUnit, prefix }) / SPACING_RUNGS / RADIUS_RUNG_KEYS
SPACING_GRID / SPACING_GRID_COEFFICIENTS / resolveSpacingValue / isThemeSpacing
valueRef(value) / isPaletteLevelRef(ref) / isSemanticToken(name)   // 显示引用 / 引用校验 / 契约成员判定
// TokenOverride = ColorValue | `token.${SemanticToken}`           // 覆盖可引用另一语义 token（解析期拷贝）

// 运行时
readThemeEnvelope() / writeThemeEnvelope() / clearThemeEnvelope() / createThemeWriter()   // @vean/theme/storage
createThemeInitScript() / isServerRuntime()                                               // @vean/theme/ssr
```

### 0.4 消费方式（三条，别绕开）

1. **类名（首选）**：UnoCSS 工具类，语义 token 与 26 个调色板、5 条角色 ramp 一一对应——`bg-card`、`text-card-foreground`、`border-input`、`bg-destructive/10`、`bg-mask`、`bg-primary-500/30`、`bg-indigo-600`。
2. **CSS 里的完整色**：`hsl(var(--primary) / 0.5)`——**必须包裹**。裸 `var(--primary)` 当颜色用会静默失效（通道不是颜色，UnoCSS 也会丢 alpha）。
3. **JS 里要颜色值**：用 `resolveTokenColor` / `resolveThemeColors` / `resolveColorRef`，不要读 CSS 变量拼字符串。产物里**没有**完整色变量（不提供 `--{token}-solid` 这类孪生变量），JS 侧走这三个函数即可，它们与 CSS 同源。

### 0.5 硬规则 / 禁区

1. **语义层不存颜色值**，只存对调色板档位的引用；要完整色走 §0.4-3 的函数。
2. **不手写色板清单与档位数组**：键表取 colord 的 `tailwindPaletteKeys` / `tailwindNeutralPaletteKeys` / `paletteColorLevels`。
3. **不加 `!important`**：静态默认层用 `:where()` 降权到零特异性，普通选择器即可胜出（§5.3）。
4. **只有一个写入者**：`__VEAN_THEME` 信封由 provider 的防抖写入者独占；组件里别直接写 localStorage（`useThemeSettings` 默认 `persist: false`）。
5. **改档位改 `CORE_RULES`**，不要改发射逻辑或快照；引擎不会替你修正档位，改完看默认主题的快照 diff。
6. **维度刻度**：`radius-*` 改 `LITERAL_DEFAULTS`（UnoCSS 映射由 `RADIUS_RUNG_KEYS` 派生）；**`spacing` 档位改 `SPACING_GRID_COEFFICIENTS`**（档位是网格单位的系数，不进 CSS 变量；与 UnoCSS 同名的 12 档必须同名同值，有回归测试守住）；半径刻度必须以**种子的正系数倍**发射（`calc(var(--radius) * k)`）。
7. **`control` 有歧义**：它是**插槽名**（switch / checkbox / radio-group / carousel / form / input / textarea / tags-input / input-number 的 `control` 槽），与填充 token 无关，批量改名必须避开。
8. **对比度不由引擎保证**：档位都是声明的，引擎不测量、不修正、不报告；`overrides` 原样生效。换成明亮主色（yellow / lime / emerald…）时请自己确认文字可读（面板 / axe / 显式覆盖）。
9. **改 `packages/theme` 或 aria 源码后先 `pnpm build:libs` 再 typecheck**，否则下游读到旧 dist。
10. **`vp fmt` 会漂移在途示例**：`apps/docs/src/examples/ui/app-shell/*` 与 `split-nav/08-*` 属 SAppShell 在途工作，格式化后 `git checkout` 还原它们。
11. **生成物门禁**：改公共导出 / 组件类型后用 `pnpm sui gen all` 重跑，`pnpm sui check generated` 必须同步（CI 门禁）。
12. **主题 token 不带前缀，库自己的组件变量带 `--vean-`**：引擎发射的语义 token 与字面量是裸名（`var(--background)` / `bg-card` / `--radius`）；aria / UI 层 / UnoCSS 预设设置在元素上的组件作用域变量（`--vean-sidebar-width`、`--vean-layout-header-height`、`--vean-scrollbar-*`）保留 `--vean-`。前者是**主题契约**（与 shadcn 同名、宿主可覆盖），后者是**库的私有实现面**。

### 0.6 常见任务

| 任务                        | 做法                                                                                                                                                                                                           |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 新增一个语义 token          | `semantic.ts`：加入对应家族数组 → 写 `CORE_RULES[token]` → 跑测试与快照；UnoCSS 与发射**自动跟随**（由 `SEMANTIC_TOKENS` 驱动）                                                                                |
| 调整某个 token 的档位       | 改 `CORE_RULES[token].light/dark`（中性色板特例用 `neutral` 覆盖）→ `vitest -u` 更新映射快照 → 检查默认主题的逐值断言仍成立                                                                                    |
| 加/改维度刻度档位           | `radius-*`：改 `LITERAL_DEFAULTS`；`spacing-*`：改 `SPACING_GRID_COEFFICIENTS`（写"默认单位下的 rem 值 ÷ 0.25rem"这个系数）→ 快照与 UnoCSS 映射自动跟随；控件阶梯的策略表在 `packages/ui/src/styles/_field.ts` |
| 调整整族间距                | 改 `ThemeOptions.spacing`（预设 4 档或任意倍率）→ `--spacing-unit` 一个变量带动具名档与数字工具类；预设档位在 `defaults.ts` 的 `THEME_SPACING`                                                                 |
| 新增状态角色                | 往 `STATUS_NAMES` 加名 → `STATUS_SUFFIXES` 自动展开实心 / `-foreground`；再在 scheme 数据里补该角色                                                                                                            |
| 调整角色 ramp（50–950）     | 不用逐条改：`ROLE_RAMP_ROLES` 驱动发射的 55 条引用与 unocss 的 `buildRoleRampColors`                                                                                                                           |
| 改默认主题                  | `defaults.ts` 的 `DEFAULT_OPTIONS`（base / primary / feedback / surfaceStyle / size / radius / spacing）                                                                                                       |
| 让面板出现新 token 的覆盖项 | `packages/ui/src/theme/use-theme-variants.ts` 的 `DEFAULT_VARIANT_GROUPS` + `theme-customizer/locale.ts`（中英同步）                                                                                           |
| 新增 feedback 方案          | `schemes.ts` 加数据（`palette.level` 引用即可）                                                                                                                                                                |
| 改图表色                    | 不用动 token 表：`primary` 决定图表色，档位在 `semantic.ts` 的 `CHART_RAMP`；个别系列用 `overrides['chart-N']`                                                                                                 |

### 0.7 验证命令

```bash
pnpm build:libs                      # 改 theme/aria 后必须先跑（dist 缓存）
pnpm typecheck && pnpm lint
pnpm --filter @vean/theme test       # 层级不变量 / 映射快照 / 发射契约 / 预算断言（≤10 KB raw）
pnpm --filter @vean/unocss test      # 工具类与 alpha / ramp / preflight + 工具类解析门禁
pnpm --filter @vean/ui test          # provider 契约 / 尺寸刻度 / 面板
pnpm build:docs                      # 端到端 SSG 构建 + registry 重新生成
pnpm sui gen all && pnpm sui check generated   # 生成物同步门禁
cd packages/theme && pnpm exec vitest run -u   # 有意识地更新映射快照
```

### 0.8 文档地图

| 文档                                          | 角色                                                               |
| :-------------------------------------------- | :----------------------------------------------------------------- |
| **本文件**                                    | 唯一权威：新旧差异与优势 + token 契约 + 引擎 API + 接入手册 + 验收 |
| `packages/theme/README.md`                    | 包级 README（面向 npm 消费者，本文件的精简版）                     |
| `docs/info/theme-system-audit.md`             | 重构前审计快照（**历史证据**，本文的旧版数字来源）                 |
| `docs/space-control-scale.md`                 | 间距 / 半径刻度的契约与实测依据（§1.6 每 size 控件向量）           |
| `apps/docs/src/content/{en,zh}/ui/theming.md` | 面向用户的主题指南（配置项 / overrides / preset / 直接使用引擎）   |

---

## 1. 架构差异：单层运行时 vs 三层

```
旧版 · 运行时单层
┌──────────────────────────────────────────────────────────────────────────┐
│  createTheme(options)                                                    │
│   · 读色板 → 按 lightLevel / darkLevel 位移整条表面阶梯                   │
│   · 亮色档位决定一切，暗色 token 由 deriveDarkFromLight 派生              │
│   · 生成 11 级 ramp（每次重算，占产物 68.3%）                             │
│   · 一次性输出自包含 CSS（207 条声明 / gzip 2,271 B）                    │
└──────────────────────────────────────────────────────────────────────────┘
                                 ▲ 主题变更 = 整段重算 + 全量重写

新版 · 静态 + 动态 + 字面量
┌─ Layer 1 · Palette（静态，构建期一次）──────────────────────────────────┐
│  26 色 × 11 级 → --{palette}-{level}（裸通道），永不变化                  │
│  产物：静态样式表（UnoCSS preflight / palette.css），gzip 2,779 B 可缓存  │
└──────────────────────────────────────────────────────────────────────────┘
                                 ▲ var() 引用
┌─ Layer 2 · Semantic（动态，随主题配置重算）──────────────────────────────┐
│  每个语义 token → 调色板级别的「引用」+ 角色 ramp 引用                    │
│  产出：159 条声明 / 5,723 B / gzip 1,205 B（切换 = 换引用，无颜色数学）   │
└──────────────────────────────────────────────────────────────────────────┘
                                 ▲ 消费
┌─ Layer 3 · Adapters ─────────────────────────────────────────────────────┐
│  @vean/unocss：theme.colors / borderRadius / fontSize / spacing / …       │
│  @vean/ui   ：SConfigProvider 注入 Layer 2（默认主题已在 preflight 里）   │
└──────────────────────────────────────────────────────────────────────────┘
```

**数据流**：`ThemeOptions`（base / primary / feedback / surfaceStyle / size / radius / spacing / font / overrides）→ **映射表**（`Record<SemanticToken, TokenValue>`）→ 区域镜像 → overrides → 别名 CSS。全程没有颜色数学，也没有测量。

**新版为什么更快更小**：调色板层与 ramp 从"每次主题变更重算"变成"构建期一次 + 运行时引用"。旧版产物里 68.3% 的字节是 ramp，而 ramp 每次切主题都要重算并整段重写。

---

## 2. 逐项差异与优势

每节三段：**旧版怎么做 → 新版怎么做 → 优势**。

### 2.1 产物：ramp 从"运行时重算"变成"静态引用"

- **旧版**：11 级 ramp 由运行时生成，131 条声明、4,950 B（占产物 68.3%）；实测 ramp 与源色板还有轻微漂移（`--primary-50` 合成为 `233.7 75.0% 97.1%`，规范值是 `225.9 100% 96.7%`；`primary-950` 亮度偏差 0.73）。
- **新版**：ramp 是对静态色板的**引用**（`--primary-500: var(--indigo-500)`），55 条声明、零重算，逐值与 colord 的调色板一致。
- **优势**：别名块 gzip **2,271 → 1,205 B（−47%）**；调色板层是纯静态产物（可永久缓存、可进 preflight）；ramp 不可能与色板漂移；主题切换不再触发任何颜色计算。

### 2.2 档位：派生与位移 → 全声明

- **旧版**：亮色档位是"基准"，暗色 token 由 `deriveDarkFromLight` 按 per-key 档位翻转表**派生**（`LEVEL_FLIP` / `WHITE_TO_900_KEYS` / `LIGHT_SURFACE` / `DARK_SURFACE` / `LIGHT_WEAK` / `DARK_WEAK` …），整条表面阶梯还能被 `lightLevel`（0–2）/ `darkLevel`（0–3）**同向位移**。实测后果：亮色下三个表面同值（层级被抹平），档位 1 时 `muted = accent = secondary = border`。
- **新版**：每个 token 的亮/暗档位都是 `CORE_RULES` 里的一行（`{ kind: 'level', source, light, dark, neutral? }`），状态色来自 scheme 数据。没有"基准侧"，没有位移轴，没有派生表。
- **优势**：**同输入 → 同映射表**（有快照断言）；一张表就能完整描述主题；"改一个 base 会不会顺带改坏另一个 token"这类问题不存在；暗色不再是"亮色的副产品"，两模式各自可读、可 diff。

### 2.3 对比度：读极值 → 定档

- **旧版**：状态的实心填充固定配 `{b}.50` 白字（实测 `success` **2.18** / `warning` **2.06** / `info` **3.52** / `destructive` **3.60**，全部低于 4.5:1）；`ring` 取 `{p}.400` / 暗色 `{p}.900`（对页面 **2.86** / **1.55**，低于 3:1）。
- **新版**：同样是"声明"，但值是**按实测定出来的**——`primary` 保持 shadcn 的 `.500` + `{b}.50`（**4.27**）、`ring` 取 `{p}.500`（亮色对页面 **3.05–4.63**、暗色对浮层 **3.44–9.38**）、`muted-foreground` 取 `{b}.600`（`{b}.500` 在 `muted` 面上只有 4.39:1）。状态 `-foreground` **按模式翻档**（亮 `{b}.50` / 暗 `{b}.900`）：暗色填充会变浅，文字恒定近白会把间隙压没（实测 1.34–2.65:1），详见 §3.6。
- **优势**：默认主题的主链路文字/边界可读，且这些值是**契约的一部分**（可测、可覆盖），而不是某个运行时算法的输出。
- **边界**：引擎不测量也不修正——换成明亮主色（yellow / lime / emerald…）或明亮状态色时实心上的文字不会自动翻转，需要自己定档（§4.3）。

### 2.4 区域皮肤：可整段删除 → 恒输出 8 条镜像

- **旧版**：区域 8 条 token 由一个 `sidebar` **scheme** 提供（`derived` / `inverted-dark` / `soft` / `contrast` 四套），`sidebarDerive: false` 时**整段不输出**（产物里 `--sidebar*` 出现 0 次，体积 7,243 → 6,665 B）。
- **新版**：8 条全部是**全局角色的镜像**（`sidebar` ← 亮 `background` / 暗 `muted`、`sidebar-ring` ← `ring` …），无条件输出。
- **优势**：删掉了"一个开关能让整族变量消失"的失败模式（消费方拿到的是空值而不是报错）；区域与全局的对应关系写在规则里，一眼可查。

### 2.5 图表色：独立 scheme → 由 primary 派生

- **旧版**：`chart` 是独立的 scheme（5 套预设 × 明暗两色），能与 `primary` 互相矛盾——"品牌色是 indigo，图表却是橙色"是合法状态。
- **新版**：`chart-1..5` 是 `primary` 色板的固定五档（`CHART_RAMP` = 600 / 500 / 400 / 300 / 200），模式无关；相邻系列按明度递减区分。
- **优势**：图表配色与品牌色不再是两个可以打架的旋钮；`chart-N` 与 `--chart-N` 的长度由数据结构保证（不可能漂移）。

### 2.6 非颜色：只有 `--size` / `--radius` → 一整个字面量层

- **旧版**：非颜色 token 只有 `--size`（根字号 zoom）与 `--radius`（解析期换成的字面值）；圆角刻度没有、间距没有语义族、层次/线宽/字体都没有 token。
- **新版**：26 条字面量——半径**种子 + 9 档正系数倍**（`calc(var(--radius) * k)`，`md` 是种子的直接引用，`none` / `full` 两端极值）、间距**网格单位**（`--spacing-unit`，18 档是它的系数）、层次四档（`--z-*`）、线宽（`--border-width` / `-strong` / `--ring-width` / `-offset`）、字体四角色（`--font-sans` / `-serif` / `-mono` / `-heading`，对齐 shadcn）。字号 / 行高 / 阴影 / 动效**刻意不在**主题里（它们是 UnoCSS 的档位，见 §5.3）。
- **优势**：圆角、间距、层次第一次成为可主题化的量，且都以"种子 × 系数"的形式发射——改种子整条刻度一起动，运行时也成立（消费者在自己样式表里覆盖 `--radius` 同样生效）；同时没有把"组件怎么动、看起来多高"变成主题可以静默改掉的东西。

### 2.7 输入校验：原样输出 → 白名单 + 成员表

- **旧版**：`size: 'huge'` 原样产出 `--size: huge`；`borderOpacity: 5` 原样产出 `--border-alpha: 5`；override 的 `palette.level` 不校验（`'typo.500'` → 悬空 `var(--typo-500)`）；`borderOpacity` 在 oklch 格式下静默失效；持久化是全有或全无（一个未知枚举丢掉整份配置）。
- **新版**：`parseThemeOptions` 逐字段校验（枚举白名单、`borderOpacity` 夹在 0–1、`spacing` 有界）；override 的 key 必须是契约成员（`isSemanticToken`），值必须能被 colord 解析或在成员表内；未知键、非法引用一律**丢弃并保留名义值**；坏字段只丢自己。
- **优势**：脏数据进不了产物；产出的每一条声明都对应契约里的一个 token（有测试断言）。

### 2.8 持久化与首帧：4 键 3 写入者 → 单信封 + 版本门

- **旧版**：4 个键（`__SOYBEAN_THEME` / `_CSS` / `_PRESETS` / `_APPLIED_PRESET`）、3 个写入者、主题状态写入**无防抖**、跨标签监听只覆盖其中 2 个键；payload 全有或全无；CSS 快照与 options 分开存，可以互相错位。
- **新版**：**一个**键 `__VEAN_THEME`、**一个**防抖写入者（250 ms）、带 `v` 的信封（`options` + `mode` + `style` 快照 + `presets` + `appliedPreset`）、逐字段校验、**未来版本拒读**、**旧词汇自动迁移**（`surface` → `card` 等，已删除的 token 丢弃，旧快照丢弃由 provider 重发）。
- **首帧**：弱化静态块（`:where()` 零特异性）+ 持久化快照注入是两代共有的思路；新版把"注入再移除"去掉——脚本创建/改写**同一个** `<style id="vean-theme">`，provider 接管它，因此没有 `!important`、没有二次注入、也没有 SSR/客户端样式内容不一致。
- **优势**：一个键、一个写入者、一个版本号说清"这份主题是哪一代的形状"；升级路径明确（迁移或回落），不是"全丢"或"半读"。

### 2.9 词汇与 API：`createTheme` / `--soybean-*` → 纯函数流水线 / `--vean-*`（token 名不变）

- **旧版**：API 是 `createTheme(options)` / `createThemeCss` / `generateThemePreset` / `resolveTheme`，配一个**运行期 preset registry**；组件作用域变量是 `--soybean-*`；主题 token 用 shadcn 原名、无前缀。
- **新版**：API 是纯函数流水线（`resolveThemeMap` → `emitThemeCss`，或 `@vean/ui` 的 `buildThemeCss` 一步到位），没有 registry、没有"生成整份 CSS"的入口；组件作用域变量改品牌前缀 `--vean-*`；**主题 token 名与旧版完全一致**（无前缀），另加 `mask` / `mask-alpha`。
- **优势**：引擎只做"数据 → 数据"（映射表）与"数据 → 字符串"（发射），可单测、可快照、可在 SSR/worker 里跑；词汇与 shadcn 同名，文档、示例、主题 JSON 可以互相搬运。

---

## 3. token 契约（当前全表）

约定：`{b}` = base 色板，`{p}` = primary 色板，`{c}` = 该状态/scheme 的调色板，`{s}` = 状态名。所有取值都是**调色板级别引用**（`{b}.100` 即 `var(--zinc-100)`）。

### 3.1 表面阶梯（elevation 轴）——3 个表面 + 遮罩

| token          | 角色                              | light                         | dark                |
| :------------- | :-------------------------------- | :---------------------------- | :------------------ |
| `--background` | 页面基底                          | `{b}.50`                      | `{b}.950`           |
| `--card`       | 容器 / 卡片                       | `white`                       | `{b}.900`           |
| `--popover`    | 浮层 / menu / dialog              | `white`                       | `{b}.900`           |
| `--mask`       | 模态遮罩（浓度在 `--mask-alpha`） | `var(--black)` + alpha `0.25` | 同左 + alpha `0.30` |

- 验收不变量：`lum(background) < lum(card) ≤ lum(popover)`（`card` 与 `popover` 允许同值，层级靠 `--shadow-*` 分离）。
- `card` / `popover` 各配一个**镜像前景**（§3.3）：`text-card-foreground` / `text-popover-foreground` 与 shadcn 同名同值。
- `mask` 是"颜色 + 浓度"两个变量：`--mask` 是 black 通道、`--mask-alpha` 是浓度（亮 0.25 / 暗 0.30），消费形态 `bg-mask`；更重的遮罩用修饰符覆盖浓度（`bg-mask/80`）。`--mask-alpha` **不跟随** `borderOpacity`。

### 3.2 交互填充（interaction 轴）——3 个填充 + 2 个前景

| token                    | 角色                            | light     | dark      |
| :----------------------- | :------------------------------ | :-------- | :-------- |
| `--muted`                | 弱化块（badge / 内嵌井 / 表头） | `{b}.100` | `{b}.800` |
| `--accent`               | 弱档交互面（hover / 选中面）    | `{b}.100` | `{b}.800` |
| `--accent-foreground`    | 交互面文字                      | `{b}.900` | `{b}.50`  |
| `--secondary`            | 次级实心填充                    | `{b}.200` | `{b}.800` |
| `--secondary-foreground` | 次级填充文字                    | `{b}.900` | `{b}.50`  |

**`muted` / `accent` 同档，`secondary` 只在亮色抬一档**——填充族按 **角色（静态面 / 交互面）× 强弱** 分档：静态弱面是 `muted`、静态强面是 `secondary`、交互面是 `accent`（弱档；本版没有强档交互面）。强弱档位按**模式独立声明**：两模式的表面阶梯本来就不同（亮色 `card` 是白、页面是 `{b}.50`；暗色 `card` 是 `{b}.900`、页面 `{b}.950`），所以"这一档在白底上够不够读得出"本来就不是同一个问题。

`muted` 与 `accent` 同档是**有意**的（对齐 shadcn 默认）：一个是静态弱化面、一个是瞬时交互面，瞬时可见性改由同一填充的 alpha 阶梯承担，而不是档差。`muted` 不产出自己的前景——它的文字就是 `--muted-foreground`。

`secondary`（次级按钮 / badge / tag / alert 的静止面）亮色**抬一档到 `{b}.200`**：它直接压在白 `card` 上，弱档在那里只有 Δ11（页面底上 Δ6），读不出"这是一个填充"；抬档后对白卡 Δ27、对页面 Δ22。**暗色保持 `{b}.800`**：弱档在 `card`（`{b}.900`）上已有 Δ15，chip 读得出来，再抬到 `{b}.700` 会变成 Δ43 的亮块，与暗色克制的表面阶梯不符（`primary` 选中性色板时的亮 `{b}.800` / 暗 `{b}.200` 是同一类两模式独立定档）。

**代价（有意接受）**：亮色下 `secondary` = `border` / `input` = `{b}.200`，所以 `bg-secondary` 元素身上的 `border-border` 会与填充同色。库内的这类元素本来就用 `border-secondary-foreground/50`（tag / alert）或 `border-secondary`（stepper），只有"靠填充与发丝线的对比表达状态"的地方需要换 token：`stepper` 的 completed separator 已从 `bg-secondary` 改为 `bg-secondary-foreground`（亮 `{b}.900` / 暗 `{b}.50`），否则完成度在亮色下 Δ = 0；该约束由 `packages/ui/test/specs/styles/neutral-faces.spec.ts` 的 `the strong static fill never doubles as a hairline` 守。

**组件层的读法（中性面阶梯）**：静止 `accent/40`（或 `card` / 透明）→ hover `accent/60` → 选中 / 按压 `accent`。不带底色的中性交互面（icon 按钮、toggle、anchor 选中项）因此只由 `--accent` 驱动，改档位即整体跟随；需要中等灰度的标记（轨道、进度、指示点）不属于这个表面档位，不走 `--accent`。

**弱档同档带来的硬约束**：任何"静止实心弱填充 → 交互实心弱填充"的配方都是 **Δ = 0**（渲染成完全同色）。所以**静态弱面与交互面相邻时必须降为洗色**——`toggle.soft` / `toggle-group.soft` / `button.soft` 的静止面是 `bg-muted/40`、斑马纹表格行是 `even:bg-muted/40`、暗色侧栏的 hover / focus 是 `bg-sidebar-accent-foreground/10`（§3.9）。类名字符串由 `packages/ui/test/specs/styles/neutral-faces.spec.ts` 守，**实测色差**由 `packages/ui/test/browser/specs/theme/neutral-faces.e2e.spec.ts` 守（计算后的 `background-color` 之差不许为 0）。

**弱档的刻度上限是有意接受的**：亮色页面底 `{b}.50` 与弱填充 `{b}.100` 只差 6 个 sRGB 单位，两档平分后不可能每档都 ≥3。实测（亮色，落在页面底上）`rest 247.6 → hover 246.4 → on 244`：**状态判据是 OFF → ON（Δ 3.6）**，hover 是细步（落在 `card` 白底上约 4.2）；e2e 因此只对 OFF → ON 要求 ≥ 3，对 hover 只要求不是 Δ = 0。

### 3.3 内容色（文本 / 图标）

| token                  | 角色     | light                            | dark      |
| :--------------------- | :------- | :------------------------------- | :-------- |
| `--foreground`         | 主文本   | `{b}.900`                        | `{b}.50`  |
| `--muted-foreground`   | 次文本   | `{b}.600`                        | `{b}.400` |
| `--card-foreground`    | 卡片文字 | `{b}.900`（`foreground` 的镜像） | `{b}.50`  |
| `--popover-foreground` | 浮层文字 | 同上                             | 同上      |
| `--carbon-foreground`  | 反相文本 | `{b}.50`                         | `{b}.900` |

**只有两级中性文本**，第三级用透明度表达（`text-muted-foreground/70`，实测合成对比度 3.06–6.17，随次文本一起变）。

### 3.4 描边与焦点

| token              | 角色                        | light     | dark                          |
| :----------------- | :-------------------------- | :-------- | :---------------------------- |
| `--border`         | 常规分隔线（装饰）          | `{b}.200` | `var(--white)` + alpha `0.10` |
| `--sidebar-border` | 区域分隔线（镜像 `border`） | `{b}.200` | 同上                          |
| `--input`          | 输入框边界                  | `{b}.200` | `var(--white)` + alpha `0.15` |
| `--ring`           | 焦点环（primary 色板）      | `{p}.500` | `{p}.500`                     |

边框族（`border` / `sidebar-border` / `input`）在暗色下是**半透明白**：通道无法携带 alpha，因此各配一个**数值伴生变量**（`--border-alpha` 等），消费形态 `hsl(var(--border) / var(--border-alpha))`，UnoCSS 侧由适配器统一包好。三者都是**装饰性发丝线**，不承诺对比度；`ring` 才是可见性契约（≥3:1，实测 3.05–4.63 / 3.44–9.38）。

### 3.5 品牌与反相

| token                  | 角色         | light                             | dark                              |
| :--------------------- | :----------- | :-------------------------------- | :-------------------------------- |
| `--primary`            | 品牌实心色   | `{p}.500`（中性色板用 `{p}.800`） | `{p}.500`（中性色板用 `{p}.200`） |
| `--primary-foreground` | 实心上的文字 | `{b}.50`（中性 `{b}.50`）         | `{b}.50`（中性 `{b}.950`）        |
| `--carbon`             | 反相表面     | `{b}.800`                         | `{b}.100`                         |
| `--carbon-foreground`  | 反相表面文字 | `{b}.50`                          | `{b}.900`                         |

`{p}.500` 是 shadcn 谱系的习惯档位；它上面的白字对 indigo 约 4.27:1。`primary` 选中性色板时两支都换档（填充与文字同时处理）。

### 3.6 状态色（4 状态 × 2 角色 = 8 个 token）

| token              | 用途                                  | light     | dark      | 约束                                                               |
| :----------------- | :------------------------------------ | :-------- | :-------- | :----------------------------------------------------------------- |
| `--{s}`            | 实心按钮 / 实心标签（也是状态文字色） | `{c}.500` | `{c}.400` | 值随 scheme 走                                                     |
| `--{s}-foreground` | 实心上的文字                          | `{b}.50`  | `{b}.900` | 按模式翻档：填充在暗色下**变浅**，文字必须反向走深，否则间隙被压没 |

`{s}` ∈ `destructive` / `success` / `warning` / `info`；`{c}` 由 feedback scheme 提供（默认 classic：`red` / `green` / `amber` / `blue`）。按压态不再单独成 token，用填充的 alpha 修饰表达（`active:bg-destructive/90`）。

- **状态文字按模式翻档是必须的，不是风格选择**：填充在暗色下由 `{c}.500` 提亮到 `{c}.400`（状态要离深色页面更远），文字若两个模式都恒定近白，间隙反而被压没——实测 5 个 scheme × 4 状态全部落到 **1.34–2.65:1**，连 3:1 的 UI 底线都过不了，真实浏览器里 `axe` 对四个状态实心全部报 `serious`。翻档后（暗色 `.900`）20 个组合全部 **≥6.41:1**。护栏在 `engine-map.spec.ts` 的 `keeps every status foreground readable on its fill in dark mode`，且断言的是对比度而非具体档位。
- **亮色侧仍是已知缺口**：亮色状态实心配 `{b}.50` 在明亮填充上只有 **2.06–3.60:1**（`success` 2.18、`warning` 2.06 最低），这一档从旧版沿用至今。改成 `{b}.900` 可让多数组合达标（`professional` / `subtle` 的 `info` 仍不足），但那会把"白字色块"变成"淡彩块"，属视觉语言变更，需单独决策；在那之前需要 AA 就用 `overrides` 显式定档。
- **亮色 `--primary-foreground` 不受影响**：primary 填充两模式同为 `{p}.500`，不存在"填充变浅"的问题，所以它两模式都取 `{b}.50`（4.27:1）。

- **软底 / 状态文字是合成出来的**：`bg-destructive/10`（alert / tag / toast 的 soft 变体）、`border-destructive/30`、`text-destructive`——不是 token。需要某个具体深浅时取角色 ramp（`text-destructive-600`，配 `dark:` 变体）。
- **状态作为"中性底上的文字"没有对比度契约**：亮色下 `text-destructive` 约 3.6:1、`text-success` 约 2.2:1；需要 AA 请用面板档位或 `overrides` 显式定档。

### 3.7 角色 ramp（50–950 颜色面板）

五个角色（`primary` / `destructive` / `success` / `warning` / `info`）各携带一整条 50–950 面板，别名块输出 `--{role}-{level}: var(--{调色板}-{level})`（55 条**静态引用**）：

- `primary` 指向当前主色板（`primary: 'indigo'` → `--primary-500: var(--indigo-500)`）；状态色指向当前 feedback scheme 为该角色提供的色板；
- 面板是**模式无关**的字面档位（`-50` 恒为最浅档）；随模式自适应的状态色走 §3.6 的角色 token；
- 被完整色 override 的角色没有背书调色板，其面板跳过输出；
- UnoCSS 侧映射为 `bg-primary-500` / `text-destructive-100` 等工具类。

### 3.8 数据可视化

`--chart-1` … `--chart-5` = primary 的 **600 / 500 / 400 / 300 / 200** 五档（`CHART_RAMP`，模式无关）。换主色即换图表色；需要多色相时用 `overrides` 逐 token 覆盖。

### 3.9 区域皮肤（region 轴，8 个 token）

八条与 shadcn 的 `--sidebar-*` 一一对应，全部是**全局角色的镜像**：

| token                          | 默认（= 全局层）                           |
| :----------------------------- | :----------------------------------------- |
| `--sidebar`                    | `--background`（light）/ `--muted`（dark） |
| `--sidebar-foreground`         | `--foreground`                             |
| `--sidebar-border`             | `--border`（含 alpha 伴生）                |
| `--sidebar-accent`             | `--accent`                                 |
| `--sidebar-accent-foreground`  | `--accent-foreground`                      |
| `--sidebar-primary`            | `--primary`                                |
| `--sidebar-primary-foreground` | `--primary-foreground`                     |
| `--sidebar-ring`               | `--ring`                                   |

区域级差异只能来自 `overrides`；把侧栏做成反色皮肤时镜像会跟着走。

亮色 `--sidebar` 取 `background`（与页面同调，分界由 `--sidebar-border` 承担，差 1.04:1）；暗色取 `muted`（`{b}.800`，比主画布 `card` 的 `{b}.900` 亮一档）——暗色若也取 `card`，侧栏与主体**完全同色**，外壳读不出分界。

暗色因此出现一处**同值镜像**：`sidebar` = `muted` = `{b}.800`，而 `sidebar-accent` ← `accent` = `muted`（§3.2），所以 `--sidebar-accent` 与 `--sidebar` 在暗色下同值——实心 `bg-sidebar-accent` 的 hover / focus 会与静止面渲染成同色。侧栏的交互面因此改用**前景角色的 alpha 洗色** `bg-sidebar-accent-foreground/10`（`tree-menu.ts`），它在两种底色上都可见：亮色下 ≈ 重构前的 `accent` 档观感，暗色下是 `{b}.800` 上的一层浅色洗色。次级文字用全局 `--muted-foreground`（实测亮 7.41 / 暗 5.81，均过 4.5:1）。

### 3.10 alpha 伴生变量

| token                    | light  | dark   | 说明                                         |
| :----------------------- | :----- | :----- | :------------------------------------------- |
| `--border-alpha`         | `1`    | `0.10` | 随 `borderOpacity` 缩放                      |
| `--sidebar-border-alpha` | `1`    | `0.10` | 同上                                         |
| `--input-alpha`          | `1`    | `0.15` | 同上                                         |
| `--mask-alpha`           | `0.25` | `0.30` | **不随** `borderOpacity`（遮罩浓度是设计值） |

给边框族写带 alpha 的完整色（`border: 'oklch(100% 0 0 / 0.1)'`）时，通道进 `--{token}`、alpha 进 `--{token}-alpha`——这正是该族的两个变量分工。

### 3.11 非颜色族（字面量层，26 条）

| token                                                             | 默认值 / 推导                                                                                                                                                                                                                                                                    |
| :---------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--size`                                                          | `16px`（`ThemeSizeValue`：预设 `xs`…`2xl` 或长度）——根字号 / 密度旋钮                                                                                                                                                                                                            |
| `--radius`                                                        | `0.5rem`（种子，可配 `ThemeRadiusValue`；与预设表的 `md` 同值）                                                                                                                                                                                                                  |
| `--radius-2xs` … `--radius-4xl`                                   | **种子的正系数倍**：`calc(var(--radius) * k)`，k = 0.25 / 0.5 / 0.75 / **1（即 `--radius-md: var(--radius)`，直接引用）** / 1.25 / 1.5 / 1.75 / 2 / 2.25；另设 `--radius-none`（`0`）/ `--radius-full`（`9999px`）                                                               |
| `--spacing-unit`                                                  | 间距族**唯一的变量**（旋钮）：`0.25rem` 或 `calc(0.25rem * <倍率>)`（预设 `compact` 0.75 / `default` 1 / `relaxed` 1.25 / `spacious` 1.5，或任意倍率）；18 档是它对单位的**系数**（`SPACING_GRID_COEFFICIENTS`，0.5…32），进 UnoCSS 的 `theme.spacing` 映射而**不发射 CSS 变量** |
| `--z-layout` / `--z-base` / `--z-toast` / `--z-max`               | `10` / `50` / `100` / `2147483647`                                                                                                                                                                                                                                               |
| `--border-width` / `--border-width-strong`                        | `1px` / `2px`                                                                                                                                                                                                                                                                    |
| `--ring-width` / `--ring-offset-width`                            | `3px` / `2px`                                                                                                                                                                                                                                                                    |
| `--font-sans` / `--font-heading` / `--font-mono` / `--font-serif` | 四条字体角色，默认各取对应的系统栈。`sans` / `serif` / `mono` 是三条**根角色**，`heading` 是一条**独立角色**（可指向任意字族）——对齐 shadcn 的 `--font-sans` / `--font-serif` / `--font-mono` + `--font-heading` 模型，衬线体因此不再折叠进 heading 臂                           |

**字号 / 行高 / 阴影 / 动效不在主题里**（§5.3）：它们是 UnoCSS 的档位，前者还额外补了三档小号（`4xs` / `3xs` / `2xs`）。

### 3.12 与旧版的 token 对照

**旧版的每一个主题 token 名今天都存在**，因此从旧版迁移**不必改类名或变量名**：

| 组别            | 旧版（`main`）                                                               | 今天                                                      | 关系                                                          |
| :-------------- | :--------------------------------------------------------------------------- | :-------------------------------------------------------- | :------------------------------------------------------------ |
| 表面 / 表面前景 | `background` / `card` / `popover` / `card-foreground` / `popover-foreground` | 同左                                                      | **同名**；`card-foreground` 等今天由 `mirror foreground` 保证 |
| 填充            | `muted` / `accent` / `secondary` + 两个 `-foreground`                        | 同左（`secondary` 亮 `{b}.200` / 暗 `{b}.800`）           | 同名；`secondary` 亮色档位调整，其余同值                      |
| 文本            | `foreground` / `muted-foreground`                                            | 同左（`muted-foreground` 亮色 `{b}.600`，旧版 `{b}.500`） | 同名；新版按实测定档                                          |
| 描边与焦点      | `border` / `input` / `ring` + 三个 `-alpha`                                  | 同左                                                      | **同名**；`ring` 亮色 `{p}.500`（旧版 `{p}.400`）             |
| 状态            | `destructive` / `success` / `warning` / `info` + `-foreground`               | 同左                                                      | **同名**；`-foreground` 今天与 primary 同取 `{b}.50`          |
| 反相            | `carbon` / `carbon-foreground`                                               | 同左                                                      | **同名同值**                                                  |
| 区域            | 八条 `sidebar*`                                                              | 同左（八条）                                              | **同名**；旧版 `sidebarDerive: false` 会整段删除，新版恒输出  |
| 图表            | `chart-1` … `chart-5`                                                        | 同左                                                      | **同名**；旧版来自 chart scheme，新版由 `primary` 派生        |
| 非颜色          | `size` / `radius`                                                            | 同左 + 半径 9 档 + `spacing-unit` + 层次 / 线宽 / 字体    | **超集**                                                      |
| **新增**        | —                                                                            | `mask` + `mask-alpha`                                     | 遮罩成为可主题化的 token                                      |
| 组件作用域变量  | `--soybean-*`                                                                | `--vean-*`                                                | 只换品牌前缀（这些不是主题 token）                            |
| 持久化键        | `__SOYBEAN_THEME`（+3 个遗留键）                                             | `__VEAN_THEME`（单信封；旧键不再读取）                    | 品牌改名 + 信封化                                             |

---

## 4. 机制

### 4.1 Layer 1：静态调色板层

26 个内置色板 × 11 档（外加 `white` / `black`），以**裸通道**形态一次性注入：`--zinc-100: 240 4.8% 95.9%`。

- **裸通道**，不是完整色：消费时统一包裹（`hsl(var(--zinc-100))`），alpha 合成才有可能；`getComputedStyle` 读到的是真颜色。
- **静态**：与主题选项无关，因此可缓存、可进 preflight、可独立成 `.css`。
- **键表来自 colord**（`tailwindPaletteKeys` / `tailwindNeutralPaletteKeys` / `paletteColorLevels`），不手写清单。
- 通道分量统一带 `%`（`240 4.8% 95.9%` / `58.5% 0.204 277.117`），因此"完整色 = 通道 + 函数包裹"是同一种形状；`ColorValue` 的类型模板与全仓格式扫描守这条约定。

### 4.2 Layer 2：声明式别名层与发射

- 每个语义 token 是**一条对调色板级别的引用**（`--background: var(--zinc-50)`），因此别名块极小（gzip 1.2 KB）且切换主题只是换引用。
- 暗色块**只写与亮色不同的 token**（差异裁剪）：159 条声明里亮色 126、暗色差异 33。
- 颜色 override 会被编码成**通道**（`hsl(var(--x) / <alpha>)` 的消费形态要求如此），值内 alpha 落到伴生变量；无法表达的值被忽略并保留名义值。
- **token 引用**：`TokenOverride` 还接受 `token.${SemanticToken}`（如 `ring: 'token.primary'`）。解析在映射表内完成——**拷贝目标 token 的 `TokenValue`**（两端都有 alpha 伴生时一并拷贝浓度），不发射 `var(--other)` 链。颜色值先落地，引用后落地，因此 `primary` 被覆盖后 `ring: 'token.primary'` 拿到的是覆盖后的值；链上任一环是环（含自引用）则整条引用无效。
- 校验：`overrides` 的 key 必须是契约成员，值必须是成员表内的 `palette.level` / 简单键、能被 colord 解析的完整色，或指向契约成员的 `token.*` 引用；**自引用、未知 token 名、成环引用与其它非法值一样被忽略并保留名义值**。

### 4.3 为什么没有对比度护栏

引擎**曾经**有一道护栏：生成期对每对声明过的配对测量 WCAG 比值，用两个杠杆（选 on-solid 文字 / 沿色阶走档）修正，并输出修正报告。它被移除了，理由是：

1. **它让产物依赖调色板的实测值**——同一份 `ThemeOptions` 的产物会长在"引擎怎么量"上；档位一旦全声明，映射表就是纯函数，护栏把声明换成了一次计算。
2. **它需要一整套只为它存在的词汇**：两个杠杆、四条配对清单、`prefer` / `min` 例外、报告字段——而库内没有任何消费方读报告。
3. **它修的是预设自己的锅**：52 组变体里它只改了 44 处，默认主题 **0 处**（名义表本来就定好了档）。

**现在怎么保证可读性**：契约里定档（§2.3 的数字）+ `SThemeCustomizer` 的 Custom 页摊开每个 token 的解析值 + 文档站的"填充 ↔ 前景"预览面板 + 浏览器 e2e 的 axe（`color-contrast` 开启）+ 需要严格 AA 时用 `overrides` 显式定档。

**代价（明确记录）**：明亮主色（yellow / lime / emerald…）或换反馈方案时，实心上的文字不再自动翻转（`primary-foreground` 是声明的 `{b}.50`：`indigo.500` 上 4.27:1，`emerald.500` 上只有约 2.3:1），`ring` 也没有"不足 3:1 就走一档"的兜底。

### 4.4 与 shadcn 对齐（无前缀）

token 名与 shadcn 完全同名且**不带前缀**，因此 shadcn 的片段、主题 JSON、社区工具可以原样搬运；前缀只作为宿主逃生舱存在（`ThemeOptions.prefix`，默认 `false`——设成字符串后所有变量变成 `--{prefix}-{token}`，解析与发射必须同值）。

代价：裸名意味着**可能与宿主或第三方同名**（`--radius` / `--size` 这类通用词尤甚），谁后加载谁生效。接受这个风险是因为前缀给不了真正的隔离（UnoCSS 类名本来就会冲突），真要隔离应整体换词表。

**边界**：这条结论只覆盖**主题契约**（语义 token、alpha 伴生、字面量）。库自己的组件作用域变量（aria 的测量/布局变量、UI 的 `--vean-layout-*` / `--vean-drawer-*`、UnoCSS 预设的 `--vean-scrollbar-*` / `--vean-enter-*`）保留 `--vean-`——它们不是主题契约，加前缀正好划清"宿主可覆盖的主题面"与"库的私有实现面"。

---

## 5. UnoCSS 对齐

> `packages/unocss/src/theme.ts` 是**唯一适配器**：语义 token 与 26 个调色板都走 `hsl(var(--x) / <alpha-value>)`；带 alpha 伴生变量的四个 token（`border` / `sidebar-border` / `input` / `mask`）走 `hsl(var(--x) / var(--x-alpha, 1))`；调色板层 + 默认主题别名块作为 preflight 静态产物随预设发布（无需运行时 JS 即生效）。

### 5.1 theme key 归属表

| UnoCSS theme key                                               | 归属                            | Vean 侧映射                                                                                                                   |
| :------------------------------------------------------------- | :------------------------------ | :---------------------------------------------------------------------------------------------------------------------------- |
| `colors`                                                       | **主题拥有**                    | 语义色 → `hsl(var(--{token}) / <alpha-value>)`；26 调色板 → 同名通道引用；5 条角色 ramp                                       |
| `borderRadius`                                                 | **主题拥有**                    | `2xs`…`4xl` 全 9 档 + `none` / `full` → `var(--radius-*)`，`DEFAULT` → `var(--radius)`                                        |
| `fontSize`                                                     | **主题扩展三档**                | Wind3 的 `xs`…`9xl` 保持它自己的元组；预设只额外声明 `4xs` / `3xs` / `2xs`（库内实际写的三档）                                |
| `fontFamily`                                                   | **主题拥有**                    | `sans` / `serif` / `mono` / `heading` → `var(--font-*)`（`font-serif` 是独立类，对齐 shadcn）                                 |
| `spacing`                                                      | **主题拥有**（具名档 + 数字档） | 两条路都是 `calc(var(--spacing-unit) * k)`：18 具名档与数字系数 `0.0625`…`64`（1/16 步长）**值同形**，`DEFAULT` → `md` 的系数 |
| `zIndex`                                                       | **主题拥有**                    | `layout` / `base` / `toast` / `max` → `var(--z-*)`                                                                            |
| `lineWidth`                                                    | **主题拥有**                    | `DEFAULT` → `var(--border-width)`；`strong` → `var(--border-width-strong)`                                                    |
| `ringWidth`                                                    | **主题拥有**                    | `DEFAULT` → `var(--ring-width)`                                                                                               |
| `boxShadow` / `duration` / `easing`                            | **保留 UnoCSS 默认**            | 阴影与动效是 UnoCSS 的档位（`shadow-sm                                                                                        | md  | lg  | xl`、`duration-200`、`ease-out`），主题不改它们 |
| `height` / `minHeight`                                         | **不映射**                      | 控件高度是 size 向量的高度列；`h-5`…`h-14` 精确覆盖控件区间，且随 `size` 缩放                                                 |
| 其余（`breakpoints` / `width` / `blur` / `letterSpacing` / …） | 保留 UnoCSS 默认                | 与主题决策无关                                                                                                                |

### 5.2 颜色引用机制（实测依据，实现时不可省略）

| `theme.colors` 取值                           | `bg-x/50` 的产出                                                        | 结论                      |
| :-------------------------------------------- | :---------------------------------------------------------------------- | :------------------------ |
| `var(--x)`                                    | `background-color:var(--x)`                                             | ❌ **alpha 丢失**         |
| `hsl(var(--x))`                               | `hsl(var(--x) / 0.5)`                                                   | ✅                        |
| `hsl(var(--x) / <alpha-value>)`               | 无修饰：`hsl(var(--x) / var(--un-bg-opacity))`；有修饰：`… / 0.5`       | ✅ **推荐**               |
| `hsl(var(--border) / var(--border-alpha, 1))` | 无修饰：`--un-border-opacity:var(--border-alpha, 1)`；有修饰：`… / 0.6` | ✅ **边框族与 mask 专用** |

**必须用"函数 + 通道"形式**：裸 `var()` 会让透明度修饰符被静默丢弃。边框族与 `mask` 用第四种形态（值里带上自己的伴生变量），否则暗色下会画成纯白 / 全黑的实心块。

### 5.3 三处刻意的"不回主题"的刻度

| 刻度        | 归属                                                           | 理由                                                                            |
| :---------- | :------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| 字号 / 行高 | UnoCSS（`fontSize` 元组）+ 预设补 `4xs`/`3xs`/`2xs` 三档字面值 | 库内没有一处读 `--text-*` / `--leading-*`；"字体大小随主题变"不是排版该有的行为 |
| 阴影        | UnoCSS（`shadow-*`）                                           | 与旧版逐档同几何；主题不该改变组件的高度感                                      |
| 动效        | UnoCSS（`duration-*` / `ease-*`）                              | 同上；主题不该改变组件的运动                                                    |

---

## 6. 运行时接线

### 6.1 Provider 与样式元素

`SConfigProvider` 独占 `<head>` 里的**单一** `<style id="vean-theme">`：首帧脚本可能已创建它，provider 接管同一个元素（存在即复用、不存在则创建），响应式更新其内容。组件树里不渲染任何 `<style>`，因此没有 SSR/客户端样式内容不一致的问题，也不需要 `!important`——优先级来自**特异性**（静态默认层用 `:where()` 降权到零特异性）。

### 6.2 持久化信封

- 一个键 `__VEAN_THEME`，一个信封：`{ v, options, mode, style, presets, appliedPreset }`。
- **一个防抖写入者**（250 ms）独占写入；跨标签同步通过 `storage` 事件重读整份信封。
- **版本门**：`v` 高于当前 → 拒读（回落默认）；**低于当前 → 迁移**（词汇翻译：`surface` → `card` 等；已删除的 token 与未知键丢弃；`presets` 同规则；旧词汇的 `style` 快照丢弃，由 provider 挂载后重发并写回）。
- 逐字段校验：坏字段只丢自己、其余保留（不再"一个未知枚举丢掉整份配置"）。
- 信封里的 `presets` 是用户保存的自定义颜色集；`appliedPreset` 指向当前应用的那一条。

### 6.3 首帧（无 FOUC）

1. 静态层（Layer 1 + 默认 Layer 2 别名块）随预设 preflight 下发，位于样式表内 —— 默认主题**零 JS 即正确**。
2. `<head>` 最前的内联脚本（`createThemeInitScript()`）读信封：切换 `<html>` 的暗色类（`mode: 'auto'` 按 `prefers-color-scheme` 解析）、设置 `documentElement.style.colorScheme`、把快照写进 `<style id="vean-theme">`。
3. hydration 后 provider 接管同一元素并按当前状态重发。

脚本必须是 `<head>` 里**第一个** `<script>`，并在有 CSP 时带上 `nonce`；读写存储全部 `try/catch`（存储被禁时静默降级到静态默认主题）。

### 6.4 SSR

`persistTheme` 关闭时 provider 只消费显式 `theme` prop、不读存储；SSR 时用 `themeConfig`（服务端注入的信封）渲染同样的主题，`presetProvider` 用于解析已保存的 preset 名；`isServer` 可显式覆盖运行时探测。`SConfigProvider` 的 `theme` prop 与引擎 `ThemeOptions` 同词汇，另接受 `preset`（内联颜色集或 `{ name }` 引用）。

---

## 7. 验收标准（测试清单）

1. **声明式契约**：`resolveThemeMap` 的产物完全由 `CORE_RULES` / scheme 数据决定——同输入同映射表（快照），映射表即契约本身。
2. **默认主题的定档值**：`primary-foreground` = `{b}.50`（中性 primary 暗色 `{b}.950`）、状态 `-foreground` 亮 `{b}.50` / 暗 `{b}.900`——快照 + 逐值断言守住，另有暗色 on-solid 的对比度护栏（≥4.5:1）。
3. **阶梯不变量**：`lum(background) < lum(card) ≤ lum(popover)` 在两种模式下成立；亮色下 `background ≠ card`。
4. **别名完整性**：`SEMANTIC_TOKENS` 的每一个 token 在生成的 CSS 中都存在一条声明（防"某开关删变量"复发）。
5. **调色板层完整性**：26 × 11 + `white` / `black` 的通道都存在，且都能被 colord 解析为合法颜色。
6. **JS 与 CSS 同源**：`resolveTokenColor(options, token, mode)` 的结果等于生成的 CSS 中该 token 解析出的颜色（两条路径共用 `resolveThemeMap`）。
7. **UnoCSS 映射**：`bg-primary/50`、`text-card-foreground/70`、`border-border/20`、`bg-mask/80`、`bg-indigo-500/30` 均产出带 alpha 的合法声明；**工具类解析门禁**（`token-utilities.spec.ts`）保证库与 docs 里写下的每个 token 工具类都真能产出 CSS（UnoCSS 会静默丢弃死类名）。
8. **体积预算**：Layer 2 ≤ 10 KB 原始（实测 5,723 B / gzip 1,205 B）；Layer 1 ≤ 10 KB 原始（实测 9,239 B / gzip 2,779 B）。
9. **格式等价**：`hsl` 与 `oklch` 下 token 数量、映射表完全一致（只有值写法不同）。
10. **命名一致性**：语义 token 与字面量都是裸名；调色板 token 也是裸名；启用 `prefix` 时两者带**同一个**前缀。
11. **z-index 纪律**：库内样式除 `--z-layout` / `--z-base` / `--z-toast` / `--z-max` 外不得出现字面量 z-index（可用静态扫描断言）。
12. **sidebar 完整性**：8 个区域 token 在两种 `surfaceStyle`、两种模式、任意 scheme 下都存在，且八条默认值等于各自的全局镜像；**暗色**的 `--sidebar` 还必须不等于主画布 `card`（一条断言，防"侧栏与主体同色"复发；亮色按设计取页面基底 `background`，由 `sidebar-border` 区分）。
13. **通道约定**：库内与 docs 的样式/示例中不得出现以裸 `var(--*)` 作颜色值（正则可判）；产物里不得出现完整色变量。
14. **无遗留命名**：全仓不得出现旧引擎的组件变量前缀（`--soybean-*`）或主题 token 被写成带前缀的形式（`--vean-background`）；组件作用域变量则**必须**带 `--vean-`。两条扫描守这条线：`@vean/theme` 的 `token-usage.spec.ts`（名字）与 `@vean/unocss` 的 `token-utilities.spec.ts`（能否解析出 CSS）。

---

## 8. 相关

- [theme-system-audit.md](./info/theme-system-audit.md) — 重构前审计（**历史证据**，本文旧版数字的来源）
- [space-control-scale.md](./space-control-scale.md) — 间距 / 半径刻度的契约与实测依据
- [architecture.md](./architecture.md) — 工作区架构与依赖方向
- `packages/theme/README.md` — 包级用法（本文的精简版）
- 面向用户的主题指南：`apps/docs/src/content/{en,zh}/ui/theming.md`
