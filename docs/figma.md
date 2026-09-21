# Figma 设计资源：`sui gen figma`

> 定位：把 `@vean/theme` 的 **token** 与 `@vean/ui` 的**组件取值词汇**导出成 Figma 可直接导入的产物（`apps/docs/public/figma/`），回答"组件库怎么变出对应的设计资源"。读者：设计维护者、前端维护者、**AI Agent**。
> 状态：✅ 已实施。生成物随 `pnpm sui gen figma` 提交，受 `pnpm check:generated` 漂移闸门约束。真相源是 [`packages/scripts/src/commands/figma-tokens.ts`](../packages/scripts/src/commands/figma-tokens.ts)（token 投影）、[`figma-components.ts`](../packages/scripts/src/commands/figma-components.ts)（prop 词汇表）、[`figma.ts`](../packages/scripts/src/commands/figma.ts)（写入编排）。
> 基线：2026-10-03 · 分支 `main` · 版本 `0.50.0-beta.3`
> 相关：[theme.md](./theme.md)（三层 token 契约与引擎 API）· [space-control-scale.md](./space-control-scale.md)（spacing / radius 两族刻度）· [ecosystem/commercialization.md](./ecosystem/commercialization.md)（完整 kit 的商业化位）

---

## 0. 速览

**旧路径**：把 41 个语义 token × 亮暗、286 个调色板值、11 档圆角手工誊进 Figma 变量 —— 一次性的，且主题一改就过期。

**这条路径**：主题引擎已经能输出**解析后的最终值**（`resolveThemeColors()` / `resolveThemeMap().literal`），把它们投影成 **DTCG** JSON 即可。Figma 原生支持导入 DTCG，所以"生成 → 拖进 Variables 视图"就是全部工作。

```bash
pnpm sui gen figma        # 生成 4 个文件（离线、确定性、可重复）
```

| 问题                         | 答案                                                                                                         |
| :--------------------------- | :----------------------------------------------------------------------------------------------------------- |
| 需要设计人力吗               | 不需要。跑一次命令 + 导入一次即可                                                                            |
| 主题改了怎么办               | 重跑命令，再用 **Import mode** 覆盖 Figma 侧已有 mode（§3.2）                                                |
| 能拿到组件库的变体**结构**吗 | 只有**取值词汇表**，没有交叉约束（§5.1）                                                                     |
| 是一套画好的组件库吗         | 不是。component set 仍需按词汇表搭建，属 [commercialization.md](./ecosystem/commercialization.md) 的商业化位 |
| 生成的 JSON 能提交/部署吗    | 能。落在 `apps/docs/public/figma/`，docs 站部署后可直接下载                                                  |

---

## 1. 产物

| 文件              | 初始体积 | 形态                                  | 用途                                                                   |
| :---------------- | :------- | :------------------------------------ | :--------------------------------------------------------------------- |
| `light.json`      | 75.7 KB  | DTCG，372 个 token                    | Figma Variables 导入 → **Light** mode                                  |
| `dark.json`       | 75.7 KB  | DTCG，372 个 token                    | 与上面**同一次多选导入** → **Dark** mode                               |
| `components.json` | 29.0 KB  | `{generatedAt, components}`           | 建 Figma 组件变体属性时的取值参考。**不是 token 文件，不要拖进 Figma** |
| `tokens.css`      | 4.3 KB   | 拍平后的 `:root` / `.dark` 自定义属性 | 走 CSS 变量导入插件的路径（§3.3）                                      |

两个 mode 文件的**顶层分组、token 名、`$type` 完全一致** —— 这是 Figma 的硬要求：新 collection 只会为"在全部被导入文件中都存在、且 `$type` 一致"的 token 建变量（§3.1）。`packages/scripts/test/figma.spec.ts` 用递归遍历断言了这一点。

## 2. 分组结构

对应 [theme.md](./theme.md) 的三层模型：

| 分组        | 层             | 数量 | 形态                                                           |
| :---------- | :------------- | :--- | :------------------------------------------------------------- |
| `color/*`   | Layer 2 语义   | 41   | `color`，**随 mode 变化**（41 个里 30 个亮暗不同）             |
| `palette/*` | Layer 1 调色板 | 288  | `color`，与 mode 无关（26 色板 × 11 档 + `white` / `black`）   |
| `radius/*`  | Layer 3 字面量 | 11   | `dimension`（px）                                              |
| `spacing/*` | Layer 3 字面量 | 19   | `dimension`（px）：`unit` 网格单位 + 18 个系数                 |
| `size/root` | Layer 3 字面量 | 1    | `dimension`（px），16px 根字号                                 |
| `font/*`    | Layer 3 字面量 | 4    | `fontFamily`：sans / heading / mono / serif                    |
| `line/*`    | Layer 3 字面量 | 4    | `dimension`（px）：border / border-strong / ring / ring-offset |
| `z/*`       | Layer 3 字面量 | 4    | `number`                                                       |

`palette` 的 26 个色板是：slate、mist、gray、zinc、neutral、stone、taupe、olive、mauve、red、orange、amber、yellow、lime、green、emerald、teal、cyan、sky、blue、indigo、violet、purple、fuchsia、pink、rose；档位是 `50 … 950` 共 11 档。

## 3. 导入 Figma

### 3.1 首次导入（新建 collection）

1. 左侧导航打开 **Variables** 视图。
2. **先新建一个 collection**，然后**把 `light.json` 与 `dark.json` 一起多选拖进 Variables 视图**。
3. Figma 会为**每个文件建一个 mode**（"A new mode will be created for each file you import"），于是你得到一个 collection + 两个 mode，mode 名来自文件名。
4. 把两个 mode 重命名为 `Light` / `Dark`，并把 Light 设为 default（最左列）。

> ⚠️ 两个文件必须**同一次导入**。分两次拖，第二次会新建第二个 collection，而不是加一个 mode；要往已有 collection 补 mode，走下面的 Import mode。

### 3.2 更新已有 mode（主题改了之后）

1. 打开 Variables 视图，选中已有 collection。
2. 右键要更新的 mode → **Import mode** → 选文件 → Open。
3. "Any variables that match the token names and types will be updated."

导出反查用：右键 mode → **Export mode**；右键 collection → **Export modes**。想确认 Figma 侧命名是否与生成物一致，导出后比对即可。

### 3.3 走 CSS 那条路

`tokens.css` 是同一个主题的**扁平 CSS 镜像**（`:root` 67 条 = 41 色 + 26 字面量；`.dark` 30 条 = 只有与亮色不同的颜色）。用 CSS 变量导入插件（如 `CSS variables import/export`）读取它，适合"变量已经存在、只想覆盖值"的场景。

它的值是**完整颜色**（`--background: hsl(0 0% 98%)`），不是库源码里的**裸通道**（`hsl(var(--background))`），因为导入器拿到的必须是能直接解析成 Figma 变量的值。

下载地址：docs 站部署后为 `https://<docs-host>/figma/light.json` 等（`apps/docs/public/` 是静态资源根）。

## 4. 三个投影决定

产物"长这样"不是随意的，下面每条都是刻意的取舍，改之前请先读理由。

### 4.1 值已解析，而不是别名

库源码里语义 token 是**别名**（`--background: var(--zinc-50)`，见 theme.md 的 Layer 2 机制）。导出时每个 token 都写成**最终颜色**。

理由：DTCG 的别名形态（`{"$value": "{palette.zinc.50}"}`）有两种 fate —— 要么 Figma 找不到目标而落成字面量，要么依赖跨 collection 的 `com.figma.aliasData` 顺序，两者都比"直接给值"脆。别名模式是后续可选项，不是当前形态。

### 4.2 不发 alpha 伴生变量

CSS 契约把边框族拆成"通道变量 + 数值变量"（`hsl(var(--border) / var(--border-alpha))`），因为裸通道是 CSS 需要的中间形态。**Figma 的颜色变量自带 alpha**，所以 `color/border` 的 `$value.alpha` 就是 0.1，再发一个没人读的 number 变量没有意义。

### 4.3 radius 阶梯必须拍平

CSS 里圆角是 `calc(var(--radius) * <系数>)`（`--radius` 是种子，其余档是倍数，见 [space-control-scale.md](./space-control-scale.md)）。设计工具**无法表达表达式**，所以导出时按**默认种子**（`--radius` = `0.5rem`，根字号 16px）拍平成 px：

| `radius` | `2xs` | `xs` | `sm` | `md` | `lg` | `xl` | `2xl` | `3xl` | `4xl` | `none` | `full` |
| :------- | :---- | :--- | :--- | :--- | :--- | :--- | :---- | :---- | :---- | :----- | :----- |
| px       | 2     | 4    | 6    | 8    | 10   | 12   | 14    | 16    | 18    | 0      | 9999   |

> **推论：导出固定使用引擎默认值**（base `zinc` / primary `indigo` / radius `md` / size `md` / spacing `default` / borderOpacity `1`），不跟随运行时的 `ThemeOptions`。命令里没有 `--base` / `--radius` 之类的开关 —— 需要另一套皮肤时，先确认"拍平口径"（系数 × 新种子）是否也该变，而不是给生成器加参数。

### 4.4 hex 必须是 6 位

DTCG 的 color `$value.hex` 是 fallback 字段，规范要求 **6 位**："The fallback color _MUST_ be formatted in 6 digit CSS hex color notation format to avoid conflicts with the provided alpha value."

所以半透明色（dark `border` alpha = `0.1`）的 hex 是 `#ffffff`，**不是** `#ffffff1a`；透明度只由 `alpha` 承载。

## 5. 已知边界

### 5.1 `components.json` 不是变体矩阵

它是 prop 的**闭集取值**（从生成后的 API 类型里抓字面量联合），不是可求笛卡尔积的变体表：

- `@soybeanjs/cva` 的 recipe 用 `compoundVariants` 约束组合（例如 `solid` + `circle` 不出阴影），**这些交叉约束在类型表面里不存在**。要真相请看 `packages/ui/src/styles/*.ts`。
- 键是**家族**（`button`），值合并了该家族全部 symbol（`Button` / `ButtonGroup` / `ButtonIcon` / `ButtonLink`…），所以会带上非样式 prop（`type`、`dir`、`ariaCurrentValue`、`trailingSlash`…）。
- 只有 1 个取值的 prop 会被丢掉；没有任何多值 prop 的家族整条丢掉。当前 97 个 API 文件 → 91 个家族。
- 目前没有导出**是否需要某个变体轴**的元数据，也没有 compound 关系。

### 5.2 字面量层不含阴影 / 字号 / 控件高度

[theme.md](./theme.md) 与 [space-control-scale.md](./space-control-scale.md) 明确这三类不属于刻度族，因此 Figma 侧也没有对应变量。控件高度需在 Figma 组件里按 size 档手工设置（源码里是 size 与 spacing 的组合，不是一条 token）。

### 5.3 导入是"按名匹配"，重名只取第一个

DTCG 嵌套分组用 `/` 连接（`color.accent.light` → `color/accent/light`）。"If two tokens end up with the same normalized name, only the first one encountered will be imported. The duplicate will be ignored." 所以不要构造会归一化成同一路径的两个不同分组。

### 5.4 付费 kit 不可 fork 分发

若采用"换皮"路径（拿现成 shadcn kit 覆盖我们的变量），只能作为团队内部工作文件；**付费 kit 的再分发是违规的**。`sui gen figma` 不依赖任何第三方 kit，正是为了避开这个约束。

## 6. 验收与排查

**机械验收**（已进 CI）：

```bash
pnpm sui gen figma                              # 第二次执行必须是 no-op（不打印 generated）
pnpm --filter @vean/scripts test figma      # token 投影 + 组件词汇表的 9 个用例
pnpm sui check generated                         # 覆盖 apps/docs/public/figma（已登记进 generatedDataPaths）
```

`apps/docs/public/figma` 已在 `packages/scripts/src/commands/gen.ts` 的 `generatedDataPaths` 里，所以**手改产物会被闸门抓到**（`Generated data was out of date` + exit 1）；改产物请改生成器。

**导入后排查**：

| 症状                    | 先查什么                                                                                   |
| :---------------------- | :----------------------------------------------------------------------------------------- |
| 暗色颜色不对            | 是否把 `dark.json` 落成了第二个 collection；dark `color/background` 应是 `#09090b`         |
| 半透明边框变成不透明    | `color/border` 的 `alpha` 应是 `0.1`（白底 + 10%）                                         |
| 圆角档位对不上          | 产物按默认种子拍平（`md` = 8px）；如果主题改了 `--radius`，需重新生成                      |
| 变量比预期少            | Figma 会丢掉"只出现在一个文件里"或 `$type` 不一致的 token；两文件必须同源                  |
| 导入后颜色/尺寸仍是旧值 | mode 用了 **Import mode** 才会更新已有变量；新导入只能建新 collection                      |
| 改了生成器后产物没变    | `pnpm sui gen figma` 是内容感知写入，产物没变就是真的没变；`--force` 只对 `gen api` 有意义 |

## 7. 为什么不做成"直接吃 CSS 变量"

一句话记录这条被否掉的路径：CSS 变量里语义层是**别名 + 裸通道 + `calc()`**（`var(--zinc-50)`、`210 40% 98%`、`calc(var(--radius) * 1.25)`），三者都是设计工具的"非值"。把 CSS 交给插件去猜，等于把「解析」这一步外包给了一个没有主题引擎知识的解析器。所以这里用**引擎解析**（`resolveThemeColors` / `resolveThemeMap`）+ **生成器拍平**，产物是值，不是引用。
