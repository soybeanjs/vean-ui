# form — Schema 驱动表单技术方案（提案）

> **2026-09 前提变更：** 本文写于「外围包单包自治」时期，标题中的 `@soybeanjs/form` 是当时设想的包名；当前仓库无外围包，文中包结构、lockstep、跨包依赖等设定已不适用。**市场调研结论与能力设计仍然有效**；立项时须先按 [README §立项时必须回答的问题](./README.md#立项时必须回答的问题) 确定落地形态（并入核心 aria/ui、独立包、或 vean 源码配方）。

> 定位（提案）：提供基于核心 `useForm` + `SForm` 原语的 **Schema 驱动高级表单**——「一份表单 Schema（协议）→ 自动渲染 + 声明式联动 + 组件注册表 + 校验（Standard Schema）」；并作为高级数据网格查询工具栏的查询表单底座。对标 Formily 的深度能力，但以 Vue 3 一等公民 + TypeScript 类型安全 + UnoCSS 主题 + 中文生态差异化。
>
> 状态：**立项提案**（本文档），无任何代码。市场调研已完成（见 [research/form-ecosystem.md](../research/form-ecosystem.md)）。

## 1. 市场调研结论

> 完整调研见 [research/form-ecosystem.md](../research/form-ecosystem.md)；本节仅摘录对定位有决定性影响的结论。

### 1.1 能力金字塔趋同，范式是差异点

成熟高级表单在「嵌套/数组、字段级注册、异步校验、dirty/touched/errors/submitting、跨字段联动、错误聚焦」上高度趋同；差异在**实现范式**（hook 式 / 组件式 / schema 驱动）与**性能策略**（非受控 / 订阅 / 响应式依赖追踪）。

### 1.2 Vue 生态最大空白：schema 驱动 + 自动渲染

- **Formily** 是唯一完整实现「JSON Schema → 自动渲染 + `x-reactions` 声明式联动 + effects」的 Vue 方案，但其 Vue 侧长期低活跃、依赖自研 JSON-Schema 方言、设计器（Designable）2022 年后停滞（[GitHub alibaba/formily](https://github.com/alibaba/formily)、[vue.formilyjs.org](https://vue.formilyjs.org/)）。
- VeeValidate / TanStack Form / Element Plus / Naive UI 均**只把 schema 用于校验**，不做 schema→UI 自动渲染。
- **结论**：`@soybeanjs/form` 的差异化定位 =「aria 表单状态（已有 `useForm`）+ 协议驱动渲染层（新增）」。

### 1.3 Standard Schema v1 已是事实标准

Zod ≥3.24 / Valibot ≥1.0 / ArkType ≥2.0 / Effect Schema 均实现 Standard Schema v1；RHF resolver、VeeValidate、TanStack Form 原生消费（[standardschema.dev](https://standardschema.dev/schema)）。`@soybeanjs/form` 核心 `useForm` 已支持该接口——方向正确，建议对齐 RHF resolver 的 **raw/parsed 双结果**与 VeeValidate `toTypedSchema` 的 **input/output 类型体验**。

### 1.4 架构参照与设计器

- TanStack Form「form-core（框架无关）+ 框架绑定」分层与本项目 headless-first 约束最契合，但明确不做 schema→UI 渲染、不做 JSON Schema 协议、不做设计器（[TanStack Form](https://tanstack.com/form/latest/docs/framework/vue/guides/validation)）。
- 可视化设计器是商业价值高地：Formily Designable 已停滞；Vue 侧唯一活跃开源样本是 **form-create-designer**（MIT）（[npm](https://www.npmjs.com/package/@cg-devcenter/form-create.designer)）。建议**先做协议与渲染，再做设计器**。

### 1.5 风险提示

Formily 的 `x-reactions` 虽强大但不兼容标准 JSON Schema 校验器。`@soybeanjs/form` 必须分层：**UI 渲染用自有 Schema 扩展（ISchema），校验统一走 Standard Schema**（见 §3.3）。

## 2. 现状盘点：核心 useForm / SForm 能力与局限

> 基于 `packages/aria/src/components/form/`（`useForm` / `FormCompact` / `FormField*` / `core/use-form.ts` / `core/use-form-state.ts` / `core/use-field-array.ts`）与 `packages/ui/src/components/form/`，文档见 [apps/docs/src/content/zh/ui/components/form.md](../../apps/docs/src/content/zh/ui/components/form.md)。

### 2.1 已具备（核心表单状态引擎，全部保留）

| 能力                    | 说明                                                                                                             |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------- |
| Standard Schema v1 校验 | `useForm({ schema })` 接入 Zod / Valibot / ArkType / Yup，类型化值 + 字段级错误                                  |
| 字段级规则              | 同步/异步 `validate`，与 schema 错误合并（`fieldErrors` 优先，`defu` 合并）                                      |
| 校验时机                | `validateMode` / `reValidateMode`（blur/input/change/submit）+ `validateOnMounted`                               |
| 字段数组                | `append`/`remove`/`insert`/`swap`/`move`/`update`；嵌套路径注册（`social.0.name`）与逐项 meta                    |
| 表单生命周期            | `isSubmitting`/`isValidating`/`submitCount`/`dirty`/`touched`/`errors`；`handleSubmit`/`handleReset`/`onInvalid` |
| 命令式 API              | `setValues`/`setFieldValue`/`setFieldError`/`setErrors`/`resetForm`/`validateForm`/`getFieldState`…              |
| a11y                    | label `for` 关联、`aria-invalid`、`aria-describedby`                                                             |
| 布局与插槽              | `label`/`control`/`description`/`error` 插槽 + `*Props` 透传；`SFormFieldBase` 自定义行                          |

### 2.2 局限（`@soybeanjs/form` 的补齐空间）

|  #  | 局限                       | 说明                                                                               |
| :-: | :------------------------- | :--------------------------------------------------------------------------------- |
| L1  | **无 Schema 驱动渲染**     | `useForm` 是 hook/插槽式；没有「一段 JSON Schema → 自动渲染整张表单」的能力        |
| L2  | **无声明式联动**           | 条件显隐/必填/禁用随依赖字段变化需手写 watch + v-if（对标 Formily `x-reactions`）  |
| L3  | **无组件注册表**           | 没有「component key → Vean 控件」的映射与扩展机制                                  |
| L4  | **无布局协议**             | 无 FormGrid / 分组折叠 / 分步等布局声明能力（需手写 SFormFieldBase 布局）          |
| L5  | **无查询表单形态**         | 无「水平紧凑 + 查询/重置」的 ProForm 查询范式（`@soybeanjs/table` 需要）           |
| L6  | **无类型化 schema 转换器** | 无 `toTypedSchema` 式 input/output 双类型、默认值拾取、提交前 transform 的 DX 细节 |
| L7  | **无可视化设计器**         | 无拖拽式 Schema 编辑器（远期 Pro 能力）                                            |

> 定位边界：核心 `useForm`/`SForm` 保持「状态引擎 + 原语」不膨胀；上述 L1–L7 由 `@soybeanjs/form` 承接。

## 3. 定位与命名

### 3.1 定位一句话

**在核心 `useForm` 之上，提供「一份表单 Schema → 自动渲染 + 声明式联动 + 组件注册 + 校验」的协议驱动表单层**，并把「查询表单」作为一等形态（服务 `@soybeanjs/table`）。对标 Formily 的深度，落于 Vue 3 + 类型安全 + 主题集成。

### 3.2 与现有包边界

| 层       | 包                                          | 角色                                                                       |
| :------- | :------------------------------------------ | :------------------------------------------------------------------------- |
| 状态引擎 | `@vean/aria` `useForm` + `@vean/ui` `SForm` | 值/校验/数组/生命周期/a11y（**不新增**）                                   |
| **本包** | `@soybeanjs/form`                           | Schema 协议 + 渲染层 + 声明式联动 + 组件注册表 + 查询表单 + 设计器（远期） |

### 3.3 双层协议（关键架构决策）

借鉴 Formily 经验但规避其「schema 方言不兼容标准校验器」的坑，`@soybeanjs/form` 明确分两层：

- **UI 协议层（`ISchema`）**：描述「渲染什么 + 如何布局 + 如何联动」，是本包自有扩展。
- **校验协议层（Standard Schema）**：`ISchema` 的 `validate` 字段直接承载 Standard Schema（或复用核心 `useForm` 的 schema 参数），**校验与 UI 解耦**。

### 3.4 命名与前缀

- 包名 `@soybeanjs/form`；registry 命名空间 `form/*`。
- 组件前缀：`S` + `Form*`（领域名词二级语义段）。核心已有 `SForm`/`SFormField`/`SFormFieldArray`，本包用**更具体的语义段**避免混淆：
  - 旗舰 `SFormSchema`（schema 驱动渲染）+ `SFormItemSchema`（单条 schema 项）
  - `SFormQuery`（查询表单）/ `SFormDependency`（声明式联动容器）/ `SFormGrid`（布局）
  - `SFormDesigner`（远期，可视化设计器）
- 组合式：`useFormSchema` / `useFormReaction` / `useFormQuery` / `registryFormField`。

## 4. 架构设计

### 4.1 分层与依赖

```
Layer 4  @soybeanjs/form ──► @soybeanjs/{ui, headless, theme}
```

- **单包自治**（ADR-0001）：Schema 协议 + 渲染层 + 联动逻辑与样式同居于包内。
- 运行时依赖：`@vean/aria`、`@vean/ui`、`@vean/theme`；peer 依赖 `vue`、unplugin-vue-components（可选 nuxt / vue-router）。
- 核心 `useForm` 仍是唯一状态引擎；`@soybeanjs/form` 在其上做协议与渲染，不重写状态。

### 4.2 包结构（目标形态）

```
packages/form/
├── src/
│   ├── schema/                   # ISchema 协议与类型：SFormSchema / SFormItemSchema /
│   │   │                         # SFormReaction（when/fulfill） / SFormGridSchema / SFormPreset
│   │   └── transform.ts          # schema → useForm 注册 + 校验接线 + 默认值拾取（L6）
│   ├── components/
│   │   ├── form-schema/          # SFormSchema：递归渲染 schema 树（SFormItemSchema）
│   │   ├── form-item-schema/     # SFormItemSchema：单条渲染（label/control/description/error + 联动）
│   │   ├── form-query/           # SFormQuery：水平紧凑 + 查询/重置（服务 @soybeanjs/table）
│   │   ├── form-dependency/      # SFormDependency：声明式联动容器（dependencies + when/fulfill）
│   │   ├── form-grid/            # SFormGrid：栅格布局（复用 layout/Fieldset 原语）
│   │   └── form-designer/        # SFormDesigner：可视化设计器（P2，远期）
│   ├── composables/              # use-form-schema / use-form-reaction / use-form-query
│   ├── registry/                 # registry-form-field：component key → Vean 控件映射（L3）
│   ├── styles/                   # cv()/scv() recipe + @unocss-include
│   ├── constants/components.ts   # SForm* 名称注册表
│   ├── resolver/ · nuxt/
│   └── types.ts                  # SFormSchema / SFormReaction / SFormQueryProps / FormFieldRegistry
└── test/                         # 单测（happy-dom）+ browser e2e（含 axe）
```

### 4.3 协议示例（ISchema）

```ts
// types.ts —— 核心抽象（示意）
interface SFormReaction {
  dependencies: string[]; // 依赖字段路径
  when: (values: Record<string, any>) => boolean;
  fulfill: {
    visible?: boolean; // 显隐
    required?: boolean; // 必填
    disabled?: boolean; // 禁用
    props?: Record<string, any>; // 联动改 props（对标 Formily x-reactions fulfill）
  };
}
interface SFormItemSchema {
  field: string; // 字段路径（嵌套 a.b.c）
  label?: string;
  description?: string;
  component: string; // component key → 注册表（input/select/checkbox/…）
  props?: Record<string, any>; // 转发给控件的 props
  defaultValue?: unknown;
  validate?: StandardSchemaV1; // 校验协议层（Standard Schema，与 UI 解耦）
  rules?: FormRegisterOptions; // 复用核心字段级规则
  reactions?: SFormReaction[]; // 声明式联动（L2）
  grid?: { span?: number; group?: string }; // 布局协议（L4）
  items?: SFormItemSchema[]; // 嵌套/数组（L1）
  hidden?: boolean; // 查询表单隐藏
}
```

### 4.4 组件注册表（L3）

`registryFormField(key, component)` 注册/覆盖「component key → Vean 控件（或自定义控件）」；`SFormItemSchema` 渲染时查注册表，未注册的 key 报错并提示。内置注册 `input`/`select`/`checkbox`/`radio-group`/`switch`/`date-picker`/`input-number`/`tags-input`/`slider` 等核心常用控件，用户可整体替换默认注册表（对齐 Vean「控件无关」理念）。

## 5. 核心功能

| 优先级 | 组件 / 能力                           | 说明                                                                                                                                                                                        |
| :----: | :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|   P0   | `SFormSchema` + `useFormSchema`       | schema 驱动渲染：递归渲染 `SFormItemSchema` 树，自动生成校验/默认值/布局；`schema` 变化响应式重渲染                                                                                         |
|   P0   | `SFormItemSchema` + `useFormReaction` | 单条渲染（label/control/description/error 复用核心插槽 + a11y）；声明式联动执行器（when/fulfill）                                                                                           |
|   P0   | `SFormQuery`                          | 查询表单：水平紧凑布局、查询/重置、字段隐藏（`hidden`）、与 `@soybeanjs/table` 数据源联动（`params`）                                                                                       |
|   P0   | 组件注册表                            | `registryFormField` 注册/覆盖/自定义控件映射（§4.4）                                                                                                                                        |
|   P1   | `SFormDependency`                     | 命令式/声明式混合联动 fallback（复杂联动场景）                                                                                                                                              |
|   P1   | `SFormGrid`                           | 栅格/分组/分步布局协议（复用 `layout`/`Fieldset`/`stepper` 原语）                                                                                                                           |
|   P1   | `toTypedSchema` 式转换                | `useFormSchema` 提供 input/output 双类型、schema 默认值拾取、提交前 transform（对齐 VeeValidate [toTypedSchema](https://vee-validate.logaretm.com/v4/guide/composition-api/typed-schema/)） |
|   P1   | raw/parsed 双结果                     | 对齐 RHF resolver 的 `raw` 选项，提交时返回解析后值或原始输入                                                                                                                               |
|   P2   | `SFormDesigner`                       | 可视化设计器（拖拽 + JSON 预览 + 出码），远期 Pro 能力候选                                                                                                                                  |

## 6. 实现路径

|        阶段        | 内容                                                                                  | 前置              |
| :----------------: | :------------------------------------------------------------------------------------ | :---------------- |
|   FR-0 立项确认    | 本方案评审；ISchema 协议冻结（v1 最小集：字段/组件/校验/联动/布局）；输出 ADR         | 生态首发 M-EC5 后 |
|    FR-1 包骨架     | 复用 chart/admin 骨架模板 + registry `packages` 元数据 + docs/playground 命名空间接线 | FR-0              |
|    FR-2 P0 组件    | `useFormSchema` + `SFormSchema` + `SFormItemSchema` + 组件注册表 + `SFormQuery`       | FR-1              |
|    FR-3 P1 能力    | 声明式联动完善、`SFormGrid` 布局、toTypedSchema 转换、raw/parsed                      | FR-2              |
| FR-4 P2 与生态联动 | `SFormDesigner`（远期）、`@soybeanjs/table` 查询表单正式接线、admin ProForm 改依赖    | FR-3、table 包 M2 |

## 7. 技术选型

| 选型        | 决策                                                          | 理由                                        |
| :---------- | :------------------------------------------------------------ | :------------------------------------------ |
| 状态引擎    | 复用核心 `useForm`（不重写）                                  | Standard Schema 已内建；aria 唯一逻辑层约束 |
| 校验协议    | Standard Schema v1（一级接口）+ 字段级 `validate`             | 事实标准；与 RHF/VeeValidate/TanStack 一致  |
| 联动语言    | 自研 `when/fulfill`（参照 Formily `x-reactions`，但类型安全） | 声明式联动是复杂表单高频诉求                |
| UI 底座     | `@vean/ui` 原子组件（SInput/SSelect/SCheckbox…）              | 查询优先，禁止重复造原子                    |
| 布局        | 复用 `layout`/`Fieldset`/`stepper` 原语                       | 不重复实现栅格/分组/分步                    |
| 样式        | `cv()`/`scv()` + theme token                                  | 亮暗联动，禁原始 CSS                        |
| 构建 / 测试 | `vp pack` + vitest + Playwright + axe                         | 对齐 packages/ui                            |

## 8. 兼容性考虑

- **SSR / Nuxt**：schema 是纯数据，SSR 首帧可完整渲染（服务端校验在提交阶段，客户端执行）；Nuxt module 与 resolver 对齐其他包。
- **类型安全**：`SFormSchema` 与 `Path<Values>` 严格绑定；`component` key 的 props 做条件类型收敛（联动 `props` 强类型约束 `when` 返回类型）。
- **体积**：schema/渲染层为纯组合与轻组件；控件从 `@vean/ui` 按需引入。
- **可访问性**：复用核心 `FormField` 的 label-for / aria-invalid / aria-describedby；联动后的显隐/必填/禁用同步到 a11y 状态；纳入 browser e2e 必测项。
- **版本**：lockstep 同版本；ISchema v1 冻结后新增字段走扩展位（向后兼容）。

## 9. 风险

| 风险                            | 缓解                                                                                          |
| :------------------------------ | :-------------------------------------------------------------------------------------------- |
| ISchema 协议设计过重/过早       | 先冻结 v1 最小集（字段/组件/校验/联动/布局五项），其余渐进扩展                                |
| 与 Formily（MIT）正面竞争       | 差异化：Vue3 一等公民 + 类型安全 + Standard Schema + 中文生态 + `@soybeanjs/table` 联动       |
| 与核心 `useForm` 边界模糊       | 本文档 §2.2 明确 L1–L7 归属；「应上浮核心」的能力（如通用联动原语）按原子原语判据评估         |
| schema 驱动过度抽象（学习成本） | 提供「命令式 useForm 直用 + 协议式 SFormSchema」双路径，协议层可渐进采用                      |
| 设计器（P2）工程量              | 先协议与渲染（FR-2/3），设计器等需求信号（见 [commercialization.md](./commercialization.md)） |
