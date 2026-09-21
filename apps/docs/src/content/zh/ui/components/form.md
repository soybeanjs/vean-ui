---
head:
  title: 表单
  description: '面向表单构建与校验交互的组合式组件层，采用 Aria 核心 + 样式封装的结构。useForm 组合式函数由 TanStack Form 引擎（@tanstack/vue-form）驱动，承接字段级订阅、字段数组与提交生命周期，直接接受任意 Standard Schema 校验器（Zod、Valibot、ArkType、Yup 等），并返回携带 SFormField / SFormFieldArray 的上下文用于渲染表单。字段通过插槽注册，因此任何 VeanUI 输入组件（SInput、SSelect、SCheckbox、SSwitch、SRadioGroup 等）或自定义控件都能直接接入，无需逐控件适配。'
---

# 表单

## 概述

面向表单构建与校验交互的组合式组件层，采用 Aria 核心 + 样式封装的结构。`useForm` 组合式函数由 **TanStack Form 引擎**（`@tanstack/vue-form`）驱动——字段级订阅、字段数组与提交生命周期均来自引擎——并直接接受任意 **Standard Schema** 校验器（Zod、Valibot、ArkType、Yup 等）。它返回携带 `SFormField` / `SFormFieldArray` 的上下文对象用于渲染表单。字段通过插槽注册，因此任何 VeanUI 输入组件（`SInput`、`SSelect`、`SCheckbox`、`SSwitch`、`SRadioGroup` 等）或自定义控件都能直接接入，无需逐控件适配。

## 用法

<UsageCode component="form" />

## 特性

- 📜 Schema 校验 —— 直接传入任意 Standard Schema 校验器（Zod、Valibot、ArkType、Yup）；本库运行时不依赖 `@standard-schema/spec`。表单值类型由 schema 推导，schema 缺省时从 `defaultValues` 推导
- 🏎️ TanStack 引擎 —— 字段级订阅、字段数组、提交生命周期（`isSubmitting` / `isSubmitted` / `submissionAttempts`）由 `@tanstack/vue-form` 承接；完整 `FormApi` 经 `form` 暴露，可用于高级用法（`Subscribe`、`setFieldValue`、`pushFieldValue` 等）
- ✅ 字段级规则 —— 每个字段的 `validate` 接受同步/异步函数或 Standard Schema 校验器，由引擎与 schema 错误合并；经 Ref / ComputedRef 传入可响应式换规则
- 🔁 校验时机 —— `validateMode` 设定 schema 与字段校验器的运行时机（`blur` | `change` | `submit`），`validateOnMounted` 挂载即校验；校验器注册在引擎的异步槽上，每次触发只执行一次，并支持异步 Standard Schema
- 📦 字段数组 —— `append` / `prepend` / `remove` / `insert` / `swap` / `move` / `update` / `replace`，嵌套路径注册（`social[0].name`，TanStack 规范格式）
- 🧩 Aria/styled 分离 —— `@vean/aria` 中的 `useForm`/`FormCompact`（零样式）；`SForm*` 封装注入 `formVariants` 样式（6 个插槽：field/fieldArray/label/control/description/error）；错误进出场动画位于 UI 层
- ♿ 开箱即用的无障碍 —— label `<label :for>` 关联、错误时 `aria-invalid`、`aria-describedby` 将描述与错误链接到控件
- 🎨 可组合布局 —— `label` / `control` / `description` / `error` 插槽 + `*Props` 透传；`SFormFieldBase` 支持自定义行
- 🧰 控件无关 —— 字段通过插槽转发 `model-value` 与无障碍属性，任何具备值的控件均可集成

## 组件家族

- `useForm`（styled）—— 入口组合式函数；返回携带 `form`（TanStack `FormApi`）、`isSubmitting`、`handleSubmit`/`handleReset` 的上下文，以及绑定的 `SFormField` / `SFormFieldArray` 组件
- `SForm` / `FormCompact`（Aria）—— `<form>` 元素属主；经 context 向下传递 `orientation`/`fieldProps`/`fieldArrayProps`/`labelProps`/`controlProps`/`descriptionProps`/`errorProps`
- `SFormField` / `FormFieldCompact`（Aria）—— 按 `name` 注册单个字段；持有字段错误/meta 并渲染 label + description + control + error
- `SFormFieldArray` / `FormFieldArrayCompact`（Aria）—— 注册字段数组；默认插槽接收 `fields`/`append`/`prepend`/`remove`/`insert`/`swap`/`move`/`update`/`replace`
- `SFormFieldBase` / `FormFieldBaseCompact`（Aria）—— 自定义行的布局包装器；向插槽提供 `formFieldId` / `ariaDescribedBy` / `ariaInvalid`
- `FormField` / `FormLabel` / `FormControl` / `FormDescription` / `FormError`（Aria）—— 底层原语，compact 内部使用（也供自定义组合导出）
- 核心引擎 —— `@tanstack/vue-form`（`FormApi` + Vue 的 `Field` / `Subscribe` / `useSelector`）；原自研 `useHeadlessForm` / `useFormState` / `useFieldArray` 已于 v0.50.0 退役

## 演示

<PlaygroundGallery component="form" />

- 01 基础 —— Zod schema 驱动，含单选/复选/开关/选择器与嵌套字段数组
- 02 水平 —— 水平 `orientation` 布局
- 03 Schema —— Zod schema 校验，含必填/最小长度规则
- 04 规则 —— 字段级 `validate` 规则与 schema 并用
- 05 异步 —— 字段级异步校验（如唯一性检查）
- 06 数组 —— append/remove/move 动态列表
- 07 禁用 —— 字段级 `disabled`（输入框/选择器/复选）

## API

<ComponentApi component="form" />

## 备注

### 架构与竞品差异

`useForm` 封装 TanStack 的 `useForm`：schema 注册为 form 级校验器，字段级 `validate` 注册为字段校验器，值、字段 meta、按路径的错误分发与提交生命周期全部由引擎承接。`validateMode` 映射到 TanStack 校验时机（`onChange` / `onBlur` / `onSubmit`）；schema 注册在异步槽上（异步槽同样接受同步返回），每个校验触发源只执行一次，因此支持异步 Standard Schema。提交时机的字段槽始终挂载，`handleSubmit` 会等待字段校验完成。`useFieldArray` 暴露基于引擎数组操作（`pushFieldValue`、`insertFieldValue`、`removeFieldValue`、`swapFieldValues`、`moveFieldValues`、`replaceFieldValue`）的变更助手。`FormFieldBaseCompact` 合并表单 context 中的 `fieldProps`/`labelProps`/`controlProps`/`descriptionProps`/`errorProps`，并向控件插槽注入无障碍状态（`aria-invalid`、`aria-describedby`）；错误进出场的高度塌缩动画由 UI 层组合。多数竞品把校验器绑定在框架专属的规则对象上；Standard Schema 接口 + 主流引擎之上的 Aria/styled 分离是本库的差异点。

| 能力                                | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | React Hook Form |
| :---------------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :-------------: |
| Aria/styled 分离                    |   ✅   |     —      |      —       |    —    |    —     |        —        |
| Standard Schema（Zod/Valibot…）     |   ✅   |     ⚠️     |      —       |   ✅    |    —     |       ✅        |
| 字段级同步/异步规则                 |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |       ✅        |
| `validateMode`                      |   ✅   |     ⚠️     |      ✅      |    —    |    ✅    |        —        |
| 字段数组（append/remove/move）      |   ✅   |     ✅     |      —       |   ✅    |    —     |       ✅        |
| 嵌套路径注册                        |   ✅   |     ✅     |      —       |    —    |    —     |       ✅        |
| 提交状态（`isSubmitting`）          |   ✅   |     —      |      —       |   ✅    |    —     |       ✅        |
| `aria-invalid` + `aria-describedby` |   ✅   |     —      |      —       |   ✅    |    —     |        —        |
| 逐部分插槽 + `*Props`               |   ✅   |     ⚠️     |      —       |    —    |    —     |        —        |

`⚠️` = 部分支持（Ant Design 经 `rules`/`validateTrigger` 覆盖大部分规则但没有 Standard Schema；其 `required`/`colon`/`labelAlign`/`labelWidth`/`layout` 属于样式层便捷项，VeanUI 不将其引入核心）。

### 从 v0.4x 迁移（`useHeadlessForm` → TanStack Form）

v0.50.0 用 `@tanstack/vue-form` 替换了自研 `useHeadlessForm` 引擎。组件面（`SForm` / `SFormField` / `SFormFieldArray` / `SFormFieldBase`、label/description/error 接线、无障碍属性）保持不变；钩子面变化如下：

| v0.4x                                                                                                  | v0.50.0                                                                                                                                                              |
| :----------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useForm(options, Field, FieldArray)` 返回元组                                                         | `useForm(options)` 返回上下文对象；styled 组件以 `SFormField` / `SFormFieldArray` 属性返回                                                                           |
| `initialValues`                                                                                        | 更名为 `defaultValues`（对齐 TanStack 命名）；重置时恢复                                                                                                             |
| `onSubmit(values, helper)`                                                                             | `onSubmit(values)`——`FormSubmitHelper` 移除，提交生命周期由 TanStack 承接                                                                                            |
| `initialErrors` / `initialTouched` / `resetForm(nextState)`                                            | 移除；通过暴露的 TanStack `FormApi` 使用 `form.setFieldMeta` / `form.reset()`                                                                                        |
| `formState.values` / `errors` / `touched` refs                                                         | 已移除 `useForm` 返回值上的 `state` 快照；响应式读取请用 `form.useSelector(state => …)` / `form.Subscribe`（原始 `form.state` 快照仍在暴露的 TanStack `FormApi` 上） |
| `setValues` / `setFieldValue` / `setFieldTouched` / `getFieldValue` / `validateForm` / `validateField` | `form` 上的 TanStack `FormApi` 方法：`setFieldValue`、`getFieldValue`、`validate`、`resetField` 等                                                                   |
| `reValidateMode`                                                                                       | 已移除；默认 `submit` 模式下错误随每次提交刷新——实时校验请设 `validateMode: 'change'`                                                                                |
| 字段级 `reset` 回调选项                                                                                | 已移除；`handleReset` 恢复 `defaultValues`，字段值经引擎自动同步                                                                                                     |
| `useField(name)` 返回 `Ref<FormFieldState>`                                                            | `useField(name)` 返回 computed：`{ name, value, meta: { dirty, error, touched }, handleChange, onBlur }`                                                             |
| `useFieldArray(name)` 返回 `{ fields, append, prepend, remove, swap, move, insert, update, replace }`  | 形状一致；`fields` 条目为 `{ key, name, value }`                                                                                                                     |
| 字段数组嵌套路径 `social.0.name`                                                                       | TanStack 规范格式 `social[0].name`（数组段用方括号）                                                                                                                 |
| `errors` 以点路径为键                                                                                  | `onInvalid` 错误（及 `form.state.fieldMeta`）以 TanStack 规范路径为键（数组段方括号）                                                                                |

### 注意事项

- `useForm` 返回上下文对象——按名称解构：`const { handleSubmit, SFormField, SFormFieldArray, isSubmitting } = useForm({...})`。
- 响应式读取表单状态请用 `form.useSelector(state => …)`；`form.state` 本身是 TanStack Store 快照，不具备 Vue 响应性。
- 校验时机：`validateMode` 静态生效；默认 `submit` 模式下错误在提交尝试后出现、并随每次提交刷新——实时校验请设 `validateMode: 'change'`。校验经引擎异步槽执行，结果在触发事件后的一个异步节拍落定。
- schema 报告无字段路径的问题（如跨字段 refine）时，`onInvalid` 错误以 `_form` 键暴露。
- TanStack `FormOptions` 的高级配置可通过 `formOptions` 声明式透传（如 `asyncDebounceMs`、`canSubmitWhenInvalid`、`listeners`）；封装接管的字段（`defaultValues` / `validators` / `onSubmit` / `onSubmitInvalid`）已被排除且始终以封装为准。
- 数组单项错误按方括号路径键（`emails[0]`）存储，不上浮到数组根——在数组层校验整体（如 `min(1)`），或用嵌套 `SFormField` 以方括号路径渲染逐项错误。
- Zod v4 中 `z.number()` 不做字符串 coercion——文本输入会报 `"Invalid input: expected number"`。当控件是 `<input type="text">` 时请用 `z.coerce.number()`（或先解析再校验）。
- 控件插槽与值无关：字段转发 `model-value`（及 `aria-invalid`/`aria-describedby`）。自定义控件必须接收并 emit `modelValue`。
- `<form>` 元素本身只渲染 `data-vean-form`/`data-orientation`——校验样式在 field/control/error 部分，通过 `SForm` 的 `ui`/`class` 设置。
- 字段级 `validate` 与 schema 在引擎的错误映射中合并——传函数（返回 `undefined` 表示通过）或 Standard Schema 校验器；经 Ref / ComputedRef 传入可响应式换规则。
- 禁用是控件层的：输入框 `disabled` 阻断交互，但字段在提交时仍会校验，除非同时拦截值。

## 常见问题

### 如何在 Zod 与 Valibot 之间切换？

无需切换——直接传 schema 即可。Standard Schema 校验器原样接受：`useForm({ schema: zodSchema })` 与 `useForm({ schema: valibotSchema })` 行为一致。

### 如何在输入时即时校验而不是提交时？

设置 `validateMode: 'change'`（或 `'blur'`）。时机从首次交互起静态生效——即「实时校验」模式；默认 `submit` 模式下错误在提交尝试后出现并随提交刷新。

### 如何构建动态字段列表？

使用 `SFormFieldArray`：

```vue
<SFormFieldArray name="social" label="Social">
  <template #default="{ fields, append, remove, move }">
    <div v-for="(field, index) in fields" :key="index">
      <SFormField :name="`${field.name}[${index}].name`" label="Name">
        <SInput />
      </SFormField>
      <SButtonIcon icon="lucide:minus" @click="remove(index)" />
    </div>
    <SButtonIcon icon="lucide:plus" @click="append({ name: '', url: '' })" />
  </template>
</SFormFieldArray>
```

### 提交时如何展示加载状态？

`isSubmitting` 在异步 `onSubmit` 期间为 `true`，resolve 后复位——可禁用提交按钮或显示 loading：

```vue
<SFormFieldBase>
  <SButton type="submit" :loading="isSubmitting">Submit</SButton>
</SFormFieldBase>
```

### 为什么数字输入报 "Invalid input: expected number"？

输入值为字符串。Zod v4 下请用 `z.coerce.number()`（再 `.min(...)`），或写一个先解析再校验的字段级 `validate`。

### 如何重置表单为初始值？

在 `SForm` 上把 `on-reset` 绑定到 `useForm` 返回的 `handleReset`。重置会恢复 `defaultValues`、清空 errors/touched，并保持字段值与控件同步。
