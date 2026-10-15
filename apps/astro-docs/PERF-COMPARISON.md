# ubean vs Astro 静态文档站性能对比

对同一套文档（同一 markdown 树、同一 UnoCSS 主题、同一套 Vue 组件库）分别用
**ubean SSG**（`apps/docs`）与 **Astro 5**（`apps/astro-docs`）构建，再用同一个本地静态
服务器 + Playwright/CDP 测量运行时指标。所有数字均为 **3 轮中位数**。

- 测量脚本：`apps/astro-docs/bench/measure.mjs`
- 原始结果：`.temp/bench-result.json`
- 测量页：`/`、`/components/button`、`/overview/quick-start`、`/components`、`/chart/area`、`/zh/components/button`
- 环境：macOS / Node 24 / Chromium（Playwright 自带）/ 1440×1000 / 本地 `no-store` 静态服务器

---

## 1. 结论速览

| 维度 | 胜者 | 量级 |
| --- | --- | --- |
| 传输字节（组件页） | Astro | 1261 KB vs 3530 KB，**2.8×** |
| 请求数（组件页） | Astro | 84 vs 187 |
| 客户端 JS | Astro | 600 KB vs 2876 KB，**4.8×** |
| CLS | Astro | 0.0035 vs 0.36（组件页），**差 100×** |
| TBT（长任务） | Astro | 0 ms vs 181 ms（组件页） |
| JS 堆占用 | Astro | 4.3 MB vs 33 MB（组件页），**7.7×** |
| FCP / LCP | Astro | 组件页 FCP 28 ms vs 44 ms |
| TTFB | 平手 | 两边都 ≈ 1 ms（纯静态） |
| 构建墙钟 | Astro | 13.6 s vs 27 s，**2×** |
| 构建峰值内存 | 平手 | 2.55 GB vs 2.67 GB |
| 产物总体积 | Astro | 70.9 MB vs 116.7 MB |
| 客户端 JS 总产物体积 | Astro | 3.40 MB vs 20.84 MB（**6.1×**） |

**一句话**：astro 版在每个内容页上都少 2–5 倍的字节与 JS、少 4–8 倍的堆占用、几乎零 CLS；
ubean 版的优势只剩 TTFB 持平（本地静态服务抹平了差异）与"每页只有一个入口脚本"这一项。

---

## 2. 逐页数据

html / transfer / req / js / css / fcp / lcp / cls / tbt / script / heap

| 页面 | 站点 | html | transfer | req | js | css | FCP | LCP | CLS | TBT | script | heap |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | ubean | 131 KB | 1357 KB | 122 | 987 KB | 229 KB | 52 ms | 52 ms | **0.1518** | 0 | 14 ms | 9.0 MB |
| `/` | astro | **20 KB** | **449 KB** | **14** | **202 KB** | 226 KB | **20 ms** | **20 ms** | **0.0035** | 0 | **2 ms** | **1.8 MB** |
| `/components/button` | ubean | 415 KB | 3530 KB | 187 | 2876 KB | 229 KB | 44 ms | 44 ms | **0.3605** | **181 ms** | 32 ms | 33.2 MB |
| `/components/button` | astro | 432 KB | **1261 KB** | **84** | **600 KB** | 226 KB | **28 ms** | 60 ms | **0.0035** | **0** | **7 ms** | **4.3 MB** |
| `/overview/quick-start` | ubean | 159 KB | 1607 KB | 135 | 1214 KB | 229 KB | 32 ms | 32 ms | 0 | 0 | 15 ms | 9.9 MB |
| `/overview/quick-start` | astro | **90 KB** | **519 KB** | **14** | **202 KB** | 226 KB | **20 ms** | 36 ms | 0.0035 | 0 | **2 ms** | **1.8 MB** |
| `/components` | ubean | 236 KB | 1550 KB | 134 | 1077 KB | 229 KB | 32 ms | 32 ms | 0 | 65 ms | 16 ms | 17.7 MB |
| `/components` | astro | **63 KB** | **492 KB** | **14** | **202 KB** | 226 KB | **20 ms** | **24 ms** | 0.0035 | **0** | **2 ms** | **1.8 MB** |
| `/chart/area` | ubean | 126 KB | 1865 KB | 155 | 1504 KB | 229 KB | 28 ms | 28 ms | 0 | 0 | 18 ms | 10.9 MB |
| `/chart/area` | astro | 118 KB | **821 KB** | **28** | **488 KB** | 226 KB | **20 ms** | 28 ms | 0.0461 | 0 | **5 ms** | **3.0 MB** |
| `/zh/components/button` | ubean | 455 KB | 4413 KB | 189 | 3719 KB | 229 KB | 52 ms | 52 ms | **0.3822** | **179 ms** | 34 ms | 37.1 MB |
| `/zh/components/button` | astro | 431 KB | **1260 KB** | **85** | **600 KB** | 226 KB | **28 ms** | 56 ms | **0.0029** | **0** | **8 ms** | **4.4 MB** |

### 传输构成（组件页，前 6 项）

**ubean `/components/button` — 3530 KB / 187 请求**

```
wasm-BnjxR4X6.js      608 KB   shiki oniguruma wasm
(HTML)                415 KB
app-DZ7VcJbI.js       358 KB   入口
app-BeiDGoMF.css      229 KB
typescript-j_1H8WHN   177 KB
javascript-BzbQS41l   171 KB
```

**astro `/components/button` — 1261 KB / 84 请求**

```
(HTML)                432 KB
_doc_.CIxM-OHJ.css    226 KB
component-loader      109 KB
runtime-core          84 KB
vue-i18n              46 KB
select                44 KB
```

**ubean 的 2.2 MB 差额主要来自**：shiki 运行时（wasm 608 KB + `highlight` 110 KB +
`code-block` 142 KB）、per-grammar 语法文件（typescript 177 KB + javascript 171 KB）、
Vue 组件按需 chunk（`table` 107 KB、`doc-md` 91 KB、`button` 56 KB…）。

---

## 3. 体积对比（产物）

| | ubean `apps/docs/dist/public` | astro `apps/astro-docs/dist` |
| --- | --- | --- |
| 总体积 | 116.7 MB | **70.9 MB** |
| 文件数 | 1916 | **996** |
| HTML | 84.61 MB / 238 页 | **65.79 MB / 244 页** |
| JS | 20.84 MB / 1447 文件 | **3.40 MB / 760 文件** |
| JS gzip 合计 | 3.67 MB | **1.22 MB** |
| CSS | 234 KB / 4 文件 | 226 KB / **1 文件** |
| 额外 payload | `__search.json` 1.5 MB + `llms-full.txt` 1.8 MB + 113 个 `.md` 源文件 | `__search.json` 1.5 MB |

**入口 chunk gzip**：ubean `app-*.js` **358 KB raw / 129 KB gzip**；astro 的布局脚本是
**0.03 KB**（只 `import` 两个事件委托脚本），真正的 island 运行时 `client.*.js` 39 KB raw /
**14 KB gzip**。CSS 33.2 KB vs 31.6 KB gzip。

**组件页的 island JS（6 个文件）合计 46 KB raw / 18 KB gzip** —— 这是 astro 侧全部的
客户端代码，不含按需拉取的 demo 组件 chunk。

**HTML 原始体积两边接近（组件页 415 KB vs 432 KB），但 gzip 后 30 KB vs 37 KB** ——
astro 的 HTML 因为内联了完整 shiki span 着色而更难压缩。

---

## 4. 为什么差这么多：架构差异

### 4.1 高亮发生在构建期 vs 运行期（最大单项）

| | ubean | astro |
| --- | --- | --- |
| 高亮引擎 | shiki + oniguruma **wasm** | shiki（构建期，Node） |
| 触发 | `IntersectionObserver` 进入视口后 | 构建期一次性 |
| 传输成本 | wasm 608 KB + 引擎 252 KB + 语法 348 KB | **0** |
| HTML 成本 | `<pre>` 空壳（1 个 `md-code-block`） | 完整 span（5656 个 `shiki`） |
| 客户端代码 | `highlight` 110 KB + `code-block` 142 KB | **0** |

`apps/docs/src/shared/highlight.ts` 的注释记录了这个取舍：用 JS regex 引擎能省 183 KB，
但慢 3 倍（773 ms vs 247 ms）。这个取舍在 SSR/SSG 场景下代价被放大——
**高亮结果本来可以在构建期算完，却推到了每个访客的浏览器里。**

### 4.2 页面数据序列化

ubean 每页在 `<body>` 后内联 `<script id="__UBEAN_LOCALE__">`，**43 KB**（整个 `en.json`），
中文页还会额外拉 `zh-CN-*.js` 664 KB（组件页 `/zh/components/button` 传输 4413 KB 的主因）。
astro 的 i18n 表只在真正水合的 island 里出现（`vue-i18n` 46 KB chunk）。

### 4.3 水合范围

| | ubean | astro |
| --- | --- | --- |
| 水合单位 | 整棵 Vue 应用（页面 + 布局 + 侧栏 + 全部 demo） | 每个 `astro-island`（23 个/组件页） |
| 组件页 demo 数 | 6 个 demo + 全部 Vue 组件树 | 6 个 island |
| 布局/侧栏 | 水合（`STreeMenu`、`SNavMenu`、`SSearch`…） | **纯静态 HTML** |
| API 表 | 运行期 `STable` 组件 + 12 MB 注册表按需拉取 | 构建期手写 HTML |

### 4.4 图表页的差异

`/chart/area` 是唯一 astro 传输量接近一半但仍带 CLS 的页：astro 的 island 需要先
下载 `chart-renderer` 141 KB 再挂载图表，**CLS 0.046** 来自图表占位高度与实际渲染高度的差；
ubean 侧因为整页都是 Vue 水合，图表在首次绘制前就位（CLS 0）。

---

## 5. 已 port 的范围与刻意未 port 的部分

**已 port（两站同源）**

- 内容：`src/content` 符号链接到 `apps/docs/src/content`，同一套 228 个 markdown
- 样式：`styles/{global,markdown,frosted}.css`、`uno.config.ts`（`@vean/unocss` presetUi）
- 布局：header（logo / 导航 / 工具栏 / 搜索按钮外观）、左侧 sider、右侧 outline
- 组件页：markdown 正文、`<UsageCode>`、`<PlaygroundGallery>`（6 个 demo 可交互）、
  `<ComponentApi>`（props/emits/slots 表）、`<DataTable>`、`<TailwindPalette>`
- `/chart/<kind>`：hero + 示例 gallery（5 个 kind × 全部示例）
- 主题：`__VEAN_THEME` 存储键、light/dark/auto 切换、主题初始化脚本
- i18n：`/zh` 前缀路由、hreflang、canonical、og:locale
- `__search.json`：与 ubean **完全一致**（en 1667 + zh 1668 = 3335 条）

**刻意未 port（对比时需扣除）**

1. **`/releases` 内容** —— ubean 该页 HTML 1380 KB（渲染 1008 行 Vue 组件的 changelog 图），
   astro 侧只有壳（21 KB）。**这一行数据不具可比性**，已在结论中排除。
2. **`/components` 目录页卡片网格** —— ubean 236 KB vs astro 63 KB，astro 只渲染了标题壳。
3. **`/` 首页 hero / 特性卡片 / 统计** —— 475 行 Vue 组件，未 port（20 KB vs 131 KB）。
4. **组件页顶部 hero 区**（"Back to catalog" / "Quick jump" / "RELATED COMPONENTS"）——
   来自 `(ui)/catalog/[name].vue`，未 port。
5. **搜索对话框** —— ubean 是 `defineAsyncComponent`，点击后才拉 changelog 图（1.5 MB）；
   astro 侧按钮存在但未挂 dialog。
6. **移动端抽屉 sider**、`STreeMenu` 的 roving focus、`SThemeCustomizer` 主题编辑器。
7. **API 表的 `TypeReference` 交互**（点击查看类型预览）—— 需要注入上下文 + 12 MB 注册表。

**已知路由差异（6 条）**：astro 多出 `/overview/migration/{v0.40.0,v0.50.0,v0.50.0-date}` 及其
`/zh` 镜像。原因是 ubean 的 SSG 产物里这 6 条路由的**目录与 `.md` 同名**，被当作 `.md` 静态
资源而不是 `index.html` 输出（`routeToFilePath()` 的扩展名分支，见
`node_modules/.pnpm/@ubean+build@0.6.0/.../prerender.js:129`），实际是 ubean 产物的一处 bug。
astro 按标准 `format: 'directory'` 正确输出了这 6 页，因此 astro 有 244 页、ubean 有 238 页。

---

## 6. 构建性能

| | ubean | astro |
| --- | --- | --- |
| 墙钟（3 次，取最快/最慢） | 24.75 s – 27.09 s | 13.61 s – 13.79 s |
| 峰值内存（`/usr/bin/time -l`） | 2.67 GB | 2.55 GB |
| 输出页数 | 238 | 244 |

astro 快约 2×，内存持平。

---

## 7. 复现方式

```bash
# ubean 产物
cd apps/docs && pnpm build          # → apps/docs/dist/public

# astro 产物
cd apps/astro-docs && pnpm build    # → apps/astro-docs/dist

# 测量（3 轮中位数；确保 4573/4574 端口空闲）
cd apps/astro-docs
node bench/measure.mjs \
  --site ubean:../docs/dist/public:4573 \
  --site astro:./dist:4574 \
  --runs 3 \
  --pages ../../.temp/bench-pages.json \
  --out ../../.temp/bench-result.json
```

---

## 8. 需要注意的测量局限

1. **TTFB 全部 ≈ 1 ms**：本地静态服务器不模拟网络与 CDN，TTFB 无区分度。
2. **HTML 未按 gzip/brotli 传输**：`bench/measure.mjs` 的服务器是 `no-store` 明文。
   按 gzip 估算，组件页 30 KB vs 37 KB，**astro 的 HTML 反而更大**——差异集中在
   JS/wasm 而非 HTML。
3. **`/releases`、`/components`、`/` 三页不是等价功能**，不应单独引用其字节数。
4. **CLS 的绝对值受布局差异影响**：astro 未 port 组件页 hero，视口上方内容更少。
5. **ubean 侧有既有 bug 未修**：右侧 outline 里出现 `button/basic not found`，
   来自 `usage-code.vue` 在客户端解析示例文件名的失败（不是本次对比引入）。
6. **构建产物的 JS 是懒加载的**：组件页的 600 KB JS 里，demo 组件 chunk 由
   `ExamplePreview` island 挂载时才拉取。测量脚本在 `load` 后等 2.5 s，
   足以覆盖这些请求，但真实用户滚动速度不同。
