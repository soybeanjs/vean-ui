---
head:
  title: 品牌迁移指南 — SoybeanUI 更名为 Vean
  description: SoybeanUI 更名为 VeanUI 的完整迁移指南：包名与 scope 变更、运行时契约（data-soybean-* / --soybean-*）改名、Nuxt 与 UnoCSS 配置调整、CLI 迁移，附全局替换清单与验收清单。
---

# 升级指南：SoybeanUI → Vean

SoybeanUI 更名为 **Vean**（**V**ue + Soy**bean**）。本次发布把 npm scope、逻辑层包名与品牌一并切换，并顺带完成逻辑层的 `headless → aria` 改名。所有改动集中在同一版本，你只需要迁移一次。

| 你需要知道的三件事                                                         |
| -------------------------------------------------------------------------- |
| 1. 五个包的 npm 名称与 scope 全部变更，**import 语句必须改**               |
| 2. `data-soybean-*` 与 `--soybean-*` 运行时契约改名，**自定义 CSS 会失效** |
| 3. 组件前缀 `S`、设计令牌、localStorage key **不变**                       |

## 1. 包名映射

| 旧名称                 | 新名称             | 说明                                      |
| ---------------------- | ------------------ | ----------------------------------------- |
| `@soybeanjs/headless`  | **`@vean/aria`**   | 无样式行为层，含 a11y 状态机与 composable |
| `@soybeanjs/ui`        | **`@vean/ui`**     | 样式层，`S` 前缀组件                      |
| `@soybeanjs/theme`     | **`@vean/theme`**  | 主题引擎                                  |
| `@soybeanjs/ui-uno`    | **`@vean/unocss`** | UnoCSS preset                             |
| `@soybeanjs/ui-skills` | **`@vean/skills`** | Agent skills 分发包                       |

子路径**逐一对应**，规则是「把旧包名整体换掉，`/` 之后原样保留」：

```diff
- import { SButton } from '@soybeanjs/ui';
- import { AccordionRoot } from '@soybeanjs/headless/accordion';
- import { useRovingFocusGroup } from '@soybeanjs/headless/composables';
- import { createTheme } from '@soybeanjs/theme';
- import { createThemeInitScript } from '@soybeanjs/theme/ssr';
- import { presetUi } from '@soybeanjs/ui-uno';
+ import { SButton } from '@vean/ui';
+ import { AccordionRoot } from '@vean/aria/accordion';
+ import { useRovingFocusGroup } from '@vean/aria/composables';
+ import { createTheme } from '@vean/theme';
+ import { createThemeInitScript } from '@vean/theme/ssr';
+ import { presetUi } from '@vean/unocss';
```

安装：

```bash
pnpm remove @soybeanjs/ui @soybeanjs/headless @soybeanjs/theme @soybeanjs/ui-uno
pnpm add @vean/ui @vean/aria @vean/theme @vean/unocss
```

> `presetUi()`、`UiUnocssOptions`、`resolveThemeMap()` 等 **API 名称不变**，只换了包来源。

## 2. Nuxt 项目

三处配置需要改，其中第三处**不会被包名替换规则命中**，最容易遗漏：

```diff
  // nuxt.config.ts
  export default defineNuxtConfig({
-   css: ['@soybeanjs/ui/styles.css'],
-   modules: ['@unocss/nuxt', '@soybeanjs/ui/nuxt'],
+   css: ['@vean/ui/styles.css'],
+   modules: ['@unocss/nuxt', '@vean/ui/nuxt'],
    imports: {
      transform: {
-       exclude: [/headless\/dist\//]
+       exclude: [/aria\/dist\//]
      }
    }
  });
```

`imports.transform.exclude` 里写的是**解析后的 dist 路径**，不是包名，所以 `@soybeanjs/headless` 的替换规则不会命中它，必须手工改。

模块的 `configKey` 同步变更：从 `@soybeanjs/ui` 变为 `@vean/ui`。如果你在 `nuxt.config` 里按旧 key 传过模块选项，请一并改名。

## 3. UnoCSS 项目

```diff
  // uno.config.ts
- import { presetUi } from '@soybeanjs/ui-uno';
+ import { presetUi } from '@vean/unocss';

- import { createTheme } from '@soybeanjs/theme';
+ import { createTheme } from '@vean/theme';
```

## 4. 运行时契约改名（⚠️ 最容易静默失效的部分）

组件的**槽位标记属性**与**作用域 CSS 变量**也随品牌改名。TypeScript 不会对它们报错，如果你的自定义样式里引用过旧名字，会**静默失效**。

```diff
- [data-soybean-dialog-content] { max-width: 40rem; }
+ [data-vean-dialog-content] { max-width: 40rem; }

- [data-soybean-tree-item][data-state='open'] { font-weight: 600; }
+ [data-vean-tree-item][data-state='open'] { font-weight: 600; }

- .layout { height: var(--soybean-layout-header-height); }
+ .layout { height: var(--vean-layout-header-height); }
```

| 契约             | 规模                                                    | 典型用途                         |
| ---------------- | ------------------------------------------------------- | -------------------------------- |
| `data-soybean-*` | 511 个唯一属性（`data-soybean-{family}-{slot}` 形式）   | 自定义样式选择器、e2e 测试选择器 |
| `--soybean-*`    | 92 个唯一变量（组件作用域尺寸/偏移，如 layout、popper） | 读取组件测量值做自适应布局       |

**唯一的例外：设计令牌不受影响。** `--primary`、`--background`、`--size`、`--radius`、`--chart-*` 等主题令牌本就不带品牌前缀（保持 shadcn 兼容），无需改动。

```css
/* 这些不用改 */
:root {
  --primary: 222 47% 11%;
  --size: 16px;
  --radius: 0.5rem;
}
```

如果你的项目大量依赖 `data-soybean-*` 或 `--soybean-*`，用 §6 的 `--runtime-contract` 一次改完。

## 5. 明确不变的部分

| 不变项                                                     | 说明                                     |
| ---------------------------------------------------------- | ---------------------------------------- |
| `S` 组件前缀（`SButton`、`SDialog`、`SAccordionRoot`）     | 组件名一个都不改，只改 import 来源       |
| 设计令牌 `--primary` / `--size` / `--radius` / `--chart-*` | 无品牌前缀，shadcn 兼容契约              |
| `localStorage` key `__SOYBEAN_THEME`                       | 刻意保留，避免用户已保存的主题被静默清空 |
| `Symbol.for('ConfigProvider')` / `UiClass` 等类型          | 无品牌字符串                             |
| `@soybeanjs/cva`、`@soybeanjs/colord`                      | 通用工具包，仍在原 scope，依赖关系不变   |

> **`S` 是什么意思？** **`S` = Styled**，标识样式封装层——它与 `@vean/aria` 的无前缀原语（`Button`、`Dialog`）相对，也是让两层能在同一个文件里共存的原因：
>
> ```ts
> import { Button } from '@vean/aria'; // 无样式行为层
> import { SButton } from '@vean/ui'; // 样式封装层
> ```
>
> 前缀与品牌无关，因此**本次不随品牌改名**。改成 `V` 会让所有下游项目为零收益付出一次全量重命名，也会与 Vuetify 的 `VBtn` / `VCard` 前缀混淆。

## 6. 迁移：`vean migrate` 一键改写（或手工替换）

```bash
# 预览（默认不写盘）
npx @vean/cli@latest migrate rebrand

# 确认后落地
npx @vean/cli@latest migrate rebrand --write

# 代码里有 [data-soybean-*] 选择器或 var(--soybean-*)
npx @vean/cli@latest migrate rebrand --write --runtime-contract

# 同时迁移 sbean CLI 引用（含把 sbean.json 重命名为 vean.json）
npx @vean/cli@latest migrate rebrand --write --cli

# 代码 / 文档里写死过旧站点、CDN 或仓库地址
npx @vean/cli@latest migrate rebrand --write --new-domain veanui.com --repo-slug soybeanjs/vean-ui
```

命令是**规则式文本改写**（不是 AST 重写）：包名 / import 始终改写，运行时契约、CLI、域名三类需显式开启；默认 dry-run、幂等、跳过 `node_modules`、构建产物、lockfile 与 `CHANGELOG.md`。域名映射：`ui.soybeanjs.cn` → `--new-domain`，`r2.soybeanjs.tech` → `assets.<new-domain>`（可用 `--new-cdn` 覆盖），CDN 的对象路径前缀 `/soybeanjs/` 刻意保留（改它而不搬对象会 404）。完整选项见 [`vean migrate`](/cli#vean-migrate)。

命令**只面向 SoybeanUI 时代的项目**：先做 preflight（`package.json` 里的 `@soybeanjs/*` 依赖、`sbean.json`、源码标识符、`data-soybean-*` / `--soybean-*` 契约、`sbean` 调用），全都没有就拒绝执行——退出码 1、不写任何文件；只匹配到旧域名链接时也拒绝，除非你明确传了域名类选项。确实需要强制运行用 `--force`。每次运行结束会打印两组按项目实际情况生成的提示：**Worth adding**（本次没开、但项目里仍有对应改动的开关）与 **Still manual**（真正适用的人工步骤）。

**等价的手工替换**（不想跑命令时，按此表**从长到短**逐条替换即可；`@soybeanjs/ui` 是 `@soybeanjs/ui-uno` / `@soybeanjs/ui-skills` 的前缀，顺序不能反）：

| 旧名                   | 新名           | 影响面                                           |
| :--------------------- | :------------- | :----------------------------------------------- |
| `@soybeanjs/headless`  | `@vean/aria`   | import、Nuxt `modules`、文档                     |
| `@soybeanjs/ui-uno`    | `@vean/unocss` | import、UnoCSS 配置                              |
| `@soybeanjs/ui-skills` | `@vean/skills` | import                                           |
| `@soybeanjs/ui`        | `@vean/ui`     | import、`css`、Nuxt `modules` 与模块 `configKey` |
| `@soybeanjs/theme`     | `@vean/theme`  | import                                           |
| `data-soybean-`        | `data-vean-`   | 自定义 CSS 选择器、e2e 选择器、脚本（§4）        |
| `--soybean-`           | `--vean-`      | 自定义 CSS 变量（§4）                            |
| `sbean`                | `vean`         | CLI 命令与引用（配置文件名见下方手工项）         |

> `@soybeanjs/cva` / `@soybeanjs/colord` 不动，仍在原 scope。

**命令之外仍需手工完成：**

1. 删除 `pnpm-lock.yaml` / `package-lock.json` 后重新安装依赖，并换包：`pnpm remove @soybeanjs/ui @soybeanjs/headless && pnpm add @vean/ui @vean/aria`。
2. 确认 Nuxt 的 `imports.transform.exclude` 已是 `/aria\/dist\//`（命令会改写这个字符串，但配置本身请复核）。
3. 更新自定义 registry / 镜像地址到新域名；旧域名在过渡期做路径保持型 301（§9）。
4. `sbean.json`：加了 `--cli` 时命令会重命名为 `vean.json`；若目录里已经存在 `vean.json`，命令不会覆盖，需手工合并。

完成后按 §8 的验收清单收尾。

## 7. CLI 迁移（`sbean` → `vean`）

```diff
- npx sbean add button
+ npx @vean/cli@latest add button

- pnpm sbean init
+ pnpm dlx @vean/cli@latest init
```

配置文件同步改名：

```bash
git mv sbean.json vean.json
```

`init` / `add` / `build` / `diff` / `mcp` 子命令与参数**保持不变**，只有二进制名与配置文件名改变。

## 8. 迁移验收清单

```bash
# 1. 旧包名应彻底消失（cva / colord / ui-x 不在改名范围，可正常出现）
rg "@soybeanjs/(headless|ui|theme|ui-uno|ui-skills)" . --glob '!node_modules' --glob '!*lock*'
#    期望：无输出

# 2. 运行时契约应彻底消失（除非你刻意保留了旧选择器）
rg "data-soybean-|--soybean-" . --glob '!node_modules'
#    期望：无输出

# 3. 类型检查与构建
pnpm typecheck && pnpm build
```

- [ ] `package.json` 中五个旧包已全部替换
- [ ] `pnpm-lock.yaml` 已删除并重装
- [ ] Nuxt：`modules`、`css`、`imports.transform.exclude`、模块 `configKey` 已更新
- [ ] UnoCSS：preset 导入来源已更新
- [ ] 自定义 CSS 中的 `[data-soybean-*]` / `var(--soybean-*)` 已替换
- [ ] e2e 测试中的旧属性选择器已替换
- [ ] `sbean.json` 已改名为 `vean.json`，脚本中的 `sbean` 命令已改 `vean`
- [ ] `pnpm typecheck` 与 `pnpm build` 通过

## 9. 过渡期说明

- 旧包会发布最后一版转发包（re-export 到 `@vean/*` 并给出控制台警告），可安装但不再更新。
- 旧域名（`ui.soybeanjs.cn`）做**路径保持型 301**：`/r/*`、`/schema/*`、`/components/*.md`、`/llms*.txt` 在新域名（`veanui.com`）上同路径可用，因此**存量旧版 `sbean` CLI 不会失效**。新旧域名并行服务至少 12 个月。
- 过渡期结束后旧包会被标记 `deprecated`，旧域名仍保留 301 直到 SEO 权重完全转移。**建议尽快完成迁移，不要依赖转发包。**
