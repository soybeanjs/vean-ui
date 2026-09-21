# CONTEXT

> Vean 领域术语表。仅收录术语与精确定义，不含实现细节。

## 主题（theme）

一套完整的视觉令牌（token）集合：47 个颜色 token 的亮色 / 暗色两份取值，加一层非颜色（字面量）token。`@vean/theme` 是主题生成引擎；用户自定义的颜色（`overrides` 与具名 preset）经 ConfigProvider 落进主题信封，叠加在内置契约之上。

## 引擎（engine）

`@vean/theme` 包。持有一张**声明式契约**（`CORE_RULES` 的档位规则、镜像、按压态、字面量表），把选项解析成一张 `ThemeMap`（亮/暗各一份"每 token 一条调色板引用"的映射），再发射成 CSS。纯函数：不读 DOM、不测量颜色、不修正任何值。

## 三层（three layers）

- **调色板层**：26 个内置色板 × 11 档，以裸通道形态静态产出（构建期一次）；
- **语义层**：每个 token 是对调色板层的引用，每次主题变更重新生成；
- **字面量层**：尺寸、圆角刻度、间距网格单位、层级、线宽、字体族。

切主题只换语义层的引用，因此不需要重算调色板。

## 内置（builtin）

引擎自带的选项表：9 个中性色板（`base` 可选）、26 个色板（`primary` 可选）、5 套 feedback 方案（默认 `classic`）。图表色由 `primary` 派生，不设方案。

## 预设（preset）

一套可被用户重新应用的**具名颜色集**，随主题信封持久化。传入形式是 `theme.preset`：内联 `{ light, dark }`，或 `{ name }` 引用一个已保存的 preset。provider 在进入引擎前把它解析成 `overrides`，引擎只会收到已解析的选项。

## 维度（dimension）

token 的组织维度：`base` / `primary` / `feedback`；图表色随 `primary`。仅用于组织覆盖与面板分组，不改变 token 的扁平键契约。

## 核心 token（core token）

`CORE_RULES` 里显式声明档位的 28 个 token：表面、填充、文本、描边与焦点、品牌、反相、区域皮肤、状态与遮罩。其余 token 由镜像、按压态与角色 ramp 补全。

## 派生 token（derived token）

不由规则逐条定档、而从别处推出的 token：`card-foreground` / `popover-foreground` 镜像 `foreground`；6 个 `-active` 是实心角色的按压态；`chart-1` … `chart-5` 与 5 条角色 ramp（`primary` + 4 个状态）从 `primary` / feedback 方案派生。

## 覆盖（override）

逐 token、逐模式的替换（`overrides.{light, dark}`），优先级最高，**原样生效**——引擎不测量、不修正、不报告。取值必须是 `ColorValue`（`palette.level` 如 `stone.950`、简单键 `white` / `black`、或 CSS Color 4 的 `hsl()` / `oklch()`）；不是 token 的键、以及无法表达的值，一律被忽略。

## 档位（level）

两个含义，不要混用：

- **色板级别**：`indigo.500` 这类 `palette.level` 引用，是 token 取值的唯一引用形态；
- **表面级别**：由 `CORE_RULES` 固定声明的一整套档位。**没有**"整体调暗一档"的运行时旋钮——微调某个 token 用 `overrides`，整体更暗 / 更亮就换 `base` 色板或 `surfaceStyle`。

## 持久化主题（persistTheme）

ConfigProvider 上控制是否启用持久化主题读取（localStorage）的属性，默认关闭。关闭时只消费显式 `theme` prop；开启后按「显式 props > 存储信封 > 内置默认」合并，并由**单个防抖写入者**写回。

## 主题信封（theme envelope）

localStorage 里的单一条目（键 `__VEAN_THEME`），携带 schema 版本、引擎选项、亮 / 暗偏好、首帧样式快照与已保存的 preset 表。旧版本信封会被迁移（词汇改名、丢弃无对应项），**未来**版本被拒绝。

## SSR 主题配置（themeConfig）

由应用层解析后注入 ConfigProvider 的信封。SSR 时作为存储侧参与合并（仅补位未显式声明的键），客户端以 localStorage 为权威源。主题不通过 cookie 传输：服务端首帧渲染默认主题，由 `createThemeInitScript()` 内联脚本在客户端首帧前应用持久化主题，避免闪烁。

## 预设注册表（presetProvider）

服务端自定义 preset 解析器：把 `{ name }` 引用映射为颜色集，使 SSR 无需访问 localStorage 即可渲染已保存的 preset；客户端忽略，以信封里的 preset 表为准。

## 运行时环境判断（isServerRuntime）

`isServerRuntime()` 在调用时检测全局对象（`window`/`document` 是否存在）判断服务端运行。由于 `@vean/theme` 与 UI 库为预构建产物，`import.meta.env.SSR` 在构建时被固化而无法反映消费方运行时；应用应显式传 `isServer`（如 Nuxt 的 `import.meta.server`）驱动 SSR 专用存储路径。

## 主题提供者（ConfigProvider）

`@vean/ui` 的完整主题渲染组件（`SConfigProvider`）。接收 `theme`（引擎 `ThemeOptions` + UI 侧 `preset`）、`persistTheme`、`themeConfig`、`presetProvider`、`nonce`、`isServer`；把选项经 `buildThemeCss` 解析成 CSS，以内联 `<style id="vean-theme">` 注入（服务端与客户端都渲染以保证水合一致）。它独占该样式元素与全部写入。

## 主题 token（theme prop）

`SConfigProvider` 的 `theme` 属性，即引擎的 `ThemeOptions`：`base` / `primary` / `feedback` / `surfaceStyle` / `size` / `radius` / `spacing` / `borderOpacity` / `overrides` / `prefix` / `format` / `styleTarget` / `darkSelector`，外加 UI 侧的 `preset`。缺省键回退内置默认。

## 主题定制面板（SThemeCustomizer）

`@vean/ui` 的可视化主题定制组件，分七个分区：`mode` / `palette` / `radius` / `size` / `spacing` / `scheme` / `advanced`。高级页按分组逐 token 覆盖（含 `chart-1…5`）。它不自带容器——由调用方决定 popover / drawer / sidebar 外壳。

## 定制面板分组（customizer group）

高级页里 token 的组织方式：`surfaces` / `fills` / `hairlines` / `brand` / `sidebar` / `feedback` / `charts`。它是**展示层**词汇，与引擎的 token 契约（扁平键）解耦，只影响面板的分段与标签。

## 文档站主题配置器（docs ThemeConfigurator）

文档站侧的主题入口组件（`apps/docs/src/components/theme-configurator.vue`）：一个薄 `SPopover` 包装，内部渲染库组件 `SThemeCustomizer`，将定制结果写回持久化预设并经 `SConfigProvider` 实时生效。它不是自包含编辑器，也不直接输出 raw css。

## 外围包（peripheral package）

围绕核心 `@vean/aria` + `@vean/ui` 构建的领域扩展包。**当前仓库没有外围包**：`@soybeanjs/ui-x`（AI 组件）已于 2026-09 整包移除，AI/chat 组件改为在核心 aria/ui 内按标准两层契约实现（统一 `S` 前缀，领域逻辑放 aria `src/ai/`，见 [docs/ui-ai-roadmap.md](./docs/ui-ai-roadmap.md)）；`@soybeanjs/admin` 中后台方向同样回迁为核心内**壳领域**（aria `src/shell/` + ui 复合组件，见 [docs/ui-shell-roadmap.md](./docs/ui-shell-roadmap.md)）。未来领域（editor/table/form/ui-pro 等）是否采用外围包形态须立项时按 [docs/ecosystem/README.md](./docs/ecosystem/README.md) 决策；若采用，每个外围包为单一包（领域逻辑与样式同居），不另建"领域逻辑包"。图表不作为任何包交付：文档站直接基于 [TanStack Charts](https://tanstack.com/charts) 展示 shadcn 风格示例（`@soybeanjs/chart` 曾规划，已于 v0.40.0 移除）。

## 原子原语（atomic primitive）

具备全新原子功能（如新的无障碍模式、焦点管理变体、新交互原语）的组件。历史定义为「唯一允许进入核心 `@vean/aria` 的外围贡献类型」；2026-09 后 AI/壳等领域直接在核心内建设，准入统一按 aria admission R1–R8（删除测试）判定。判断标准是"提供了 aria 现有 primitives 无法组合而成的新原子能力"；不满足该标准的组件做 UI-only 或留在未来的外围包内。

## 包装型组件（wrapper component）

由现有 aria primitives 组合/包装而成、不引入新原子能力的组件。历史上指外围包组件（其领域逻辑 composables/types 与样式同居包内）；在核心内领域（ai/shell）中，同型装配走 aria Compact 聚合 + ui 薄包装的标准两层契约，而不是单包同居。

## 组件前缀（component prefix）

跨包组件命名规则。核心 `@vean/ui` 统一用 `S`（含回归核心的 AI 组件，如 `SBubble`/`SSender`/`SThoughtChain`；原 ui-x 的 `Sx` 前缀已随包移除）；未来外围包若具备强领域词汇表可用 2 字母前缀，否则用 `S` + 领域名词前缀防撞（历史先例：`S` + `App*`、`S` + `Chart*`）。判据是"领域词汇表强度"：当组件名构成该领域专属词汇表时用独立前缀，否则用领域名词前缀防撞。

## 命名空间 registry item（namespaced registry item）

vean registry 中的条目形式：name 以 `包名/组件名` 命名（当前全部为核心包条目，如 `ui/button`；未来外围包同理，如 `<pkg>/<component>`），并附 `package` 字段标识归属。单一 `registry.json` 承载所有包条目，CLI 通过命名空间路径寻址（核心 `ui` 可省略前缀，`vean add button`；其他包必须带前缀，`vean add <pkg>/<component>`），文档站按 `package` 字段分组展示。

## 工具链（tooling）

**vean**：
消费端源码分发 CLI（`packages/cli`，npm 包名 `@vean/cli`，bin `vean`）：把 registry 里的组件源码复制进用户项目，附带脚手架、registry 管理与 MCP server；配置文件是 `vean.json`。
_Avoid_: `sbean`（重命名前的旧包名与旧 bin 名）

**sui**：
本仓库私有的服务 CLI（`packages/scripts`，永不发布，bin `sui`）：分 `gen` / `translate` / `check` 三个命令组与若干工作区命令。与 `vean` 是两个工具，不可合并。
_Avoid_: 把 `sui` 当作 `vean`；称其为“用户侧 CLI”

**unocss**：
npm 包 `@vean/unocss`，物理目录为 `packages/unocss`——theme token 与 UnoCSS 之间的唯一适配层。
_Avoid_: 简称为“uno 包”
