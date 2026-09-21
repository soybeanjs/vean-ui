# 主流高级表单库能力调研报告

> 面向 `@soybeanjs/form`(规划中的 schema 驱动 / 高级表单外围包)的生态对标研究。
> 调研方式:通过 WebSearch + WebFetch 从官方文档、GitHub README、npm 等一手来源收集事实,并尽可能交叉验证。标注「未验证」的条目表示未找到一手来源、仅为推测。
> 生成日期:2026-08-14。Vue 3 + TypeScript + headless-first 技术栈视角。

---

## 1. 调研范围与结论摘要

### 1.1 调研范围

对 8 组主流高级表单方案逐项拆解其「表单模型 / 校验 / 状态与性能 / 集成 / 可视化设计器 / Schema 互操作 / 可访问性 / 许可模式」8 个维度:

1. **Formily**(阿里巴巴,@formily/core + @formily/vue + Designable 表单设计器)
2. **React Hook Form**(hook 式、非受控、resolver 集成)
3. **VeeValidate**(Vue,Form/Field 组件 + schema 校验)
4. **TanStack Form**(框架无关、headless 表单状态,Vue 绑定)
5. **Ant Design Form + @ant-design/pro-components ProForm**
6. **Element Plus Form / Naive UI Form**(Vue 组件库自带表单)
7. **Final Form / Formik**(React,可选)
8. 附:**表单可视化设计器**(Formily Designable / form-create-designer)与 **Standard Schema 规范**

### 1.2 结论摘要

- **主流高级表单库在「能力金字塔」上高度趋同**:嵌套对象/数组、字段级注册、异步校验、dirty/touched/errors/submitting 状态、跨字段联动(依赖/条件显隐)、错误聚焦(scrollToField)几乎是标配;差异主要在**实现范式**(hook 式 vs 组件式 vs schema 驱动)与**性能策略**(非受控/订阅/响应式依赖追踪)。
- **Vue 生态在「schema 驱动 + 自动渲染」方向上存在明显空白**:Formily 是唯一完整实现「JSON Schema 描述 → 自动渲染 + 联动(效果/反应)」的 Vue 方案,但其维护重心已转向 React(Vue 版长期低活跃),且生态(设计器)基本停滞;VeeValidate / TanStack Form / Element Plus / Naive UI 均只把 schema 用于**校验**,不用于自动渲染。这是 `@soybeanjs/form` 最值得切入的差异化点。
- **Standard Schema v1 已成为事实上的跨库校验接口标准**(Zod ≥3.24 / Valibot ≥1.0 / ArkType ≥2.0 / Effect Schema 均实现),`@soybeanjs/form` 已支持该接口,与主流生态一致,是正确方向。
- **Vue 3 下「headless 表单引擎」= TanStack Form 的定位最接近**,但 TanStack Form 明确**不做** schema→UI 自动渲染、不做 JSON Schema 协议、不做设计器;`@soybeanjs/form` 可以在其「headless 表单状态 + 逻辑」之上叠加「协议驱动渲染层」。
- **可视化设计器是付费/商业价值高地**:Formily 的 Designable 开源但已停滞(2022 年后无实质提交);form-create-designer 开源(MIT)且 Vue2/Vue3 双支持,是当前 Vue 侧可参考的落地样本。
- 许可层面绝大多数为 MIT;Formik 为 Apache-2.0。这对 `@soybeanjs/form` 采用 MIT 无商业障碍。

---

## 2. 逐库分析

### 2.1 Formily(阿里巴巴)

- 仓库:[github.com/alibaba/formily](https://github.com/alibaba/formily),最新发布 v2.3.7(2025-05-15),MIT 许可;官方定位「阿里巴巴统一前端表单解决方案,支持普通表单 / 动态(JSON Schema)表单 / 表单构建器,兼容 React / React Native / Vue 2 / Vue 3」(来源:[GitHub README](https://github.com/alibaba/formily)、[vue.formilyjs.org](https://vue.formilyjs.org/))。
- 架构分层(来源:[deepwiki 架构页](https://deepwiki.com/alibaba/formily)):核心层 `@formily/core` + 响应式 `@formily/reactive` + 校验器 `@formily/validator` + 路径 `@formily/path` + JSON Schema 层 `@formily/json-schema` + 框架绑定层 `@formily/react` / `@formily/vue` + UI 适配层 `@formily/antd` / `@formily/next` / `@formily/element`。

#### 表单模型

- MVVM:用 `createForm()` 创建表单根模型,字段是独立模型 `Field` / `ArrayField` / `ObjectField` / `VoidField`(虚拟字段,用于布局、无值字段),每个字段是**最小颗粒度的观察单元**,可被任意位置订阅(来源:[vue.formilyjs.org 核心概念](https://vue.formilyjs.org/guide/concept.html)、[CSDN Formily 模型解析](https://blog.csdn.net/gitblog_00837/article/details/148393293))。
- 两种范式可互相转换(来源:[GitHub README](https://github.com/alibaba/formily)):① 命令式组件 `Field`(传 `decorator=[FormItem]`、`component=[Input,...]`);② 协议驱动组件 `SchemaField`(基于标准 JSON-Schema 渲染,「一份协议,多端渲染」,来源:[vue.formilyjs.org 介绍](https://vue.formilyjs.org/guide/))。
- 联动:声明式 `reactions` / schema 里的 `x-reactions`(`when` + `fulfill` 改 state,如 required/visible),命令式 `effects`(`onFieldValueChange(...)` 等)(来源:[vue.formilyjs.org 快速开始](https://vue.formilyjs.org/#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)、[deepwiki 扩展协议](https://deepwiki.com/alibaba/formily)、[掘金 Formily 组件通信方案](https://juejin.cn/post/7536835149430947840))。
- Schema 扩展字段:`x-component` / `x-decorator` / `x-reactions` / `x-validator` / `x-display` / `x-editable`(来源:[deepwiki](https://deepwiki.com/alibaba/formily))。

#### 校验

- `@formily/validator` 内置 20+ 常用规则,支持自定义;`createForm({ validateFirst })` 短路校验;字段级 `field.selfErrors`(来源:[vue.formilyjs.org 示例](https://vue.formilyjs.org/)、[CSDN](https://blog.csdn.net/gitblog_00252/article/details/152249189))。

#### 状态与性能

- 基于 `@formily/reactive` 的依赖追踪、按需渲染、精确更新(类似 MobX 思想),`observer` 包裹组件,只有依赖的字段变化才重渲染;无状态时不做任何性能优化也能获得高性能(来源:[vue.formilyjs.org 介绍](https://vue.formilyjs.org/guide/)、[掘金 Formily 2.0 深度实践](https://juejin.cn/post/7120187061025374245))。

#### 集成

- 通过 `connect(mapProps)` 把字段状态映射到第三方 UI 组件(如 antd `Form.Item` 的 `validateStatus`/`help`/`extra`),接入成本低(来源:[vue.formilyjs.org 快速开始](https://vue.formilyjs.org/#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B))。

#### 表单设计/可视化构建器

- 官方设计器基于 **Designable**(`@designable/formily-antd` 等),提供设计/JSON/标记/预览多视图、撤销重做;社区还维护了 `@formily-design/formily-designer`(基于 Designable + Formily,提供 `FormilyDesigner`、`SchemaFormView`,内置 zh-CN/en-US/ko-KR 语言)(来源:[GitHub README](https://github.com/alibaba/formily)、[npm @formily-design/formily-designer](https://www.npmjs.com/package/@formily-design/formily-designer)、[CSDN 设计器介绍](https://blog.csdn.net/gitblog_01096/article/details/153241594))。

#### Schema 互操作

- 深度集成 JSON Schema(标准 JSON-Schema + `x-` 前端扩展),后端可下发 schema 驱动前端渲染(来源:[deepwiki](https://deepwiki.com/alibaba/formily)、[vue.formilyjs.org](https://vue.formilyjs.org/))。

#### 可访问性与表单 UX

- `decorator`(如 FormItem)统一处理校验状态/错误提示/说明文案;DevTools 可观测模型状态(来源:[vue.formilyjs.org](https://vue.formilyjs.org/guide/))。ARIA 级细节(如 aria-describedby 的自动接线)主要取决于所选 UI 库,Formily 自身未强制。

#### 许可

- MIT(来源:[GitHub README](https://github.com/alibaba/formily))。

#### 维护现状(观察)

- 官方仓库最新提交 2025-06-21、发布 v2.3.7(2025-05-15)(来源:[GitHub](https://github.com/alibaba/formily));Vue 适配(`@formily/vue` + `@formily/element`/antdv)长期低活跃,**选择 Formily 需评估维护风险**。

---

### 2.2 React Hook Form(RHF)

- 官方文档:[react-hook-form.com](https://react-hook-form.com/),MIT,周下载约 5750 万、44.8k star(来源:[npm-compare](https://npm-compare.com/final-form,formik,react-hook-form))。核心设计:非受控组件优先 + 最小重渲染(来源:[React Hook Form Guide](https://tomodahinata.com/en/blog/react-hook-form))。

#### 表单模型

- hook 式:`useForm()` 返回 `register` / `handleSubmit` / `watch` / `setValue` / `getValues` / `reset` / `formState` 等(来源:[react-hook-form.com](https://react-hook-form.com/))。
- `register('email')` 直接绑原生 input(非受控,性能最优);第三方受控组件用 `<Controller>` / `useController`;`FormProvider` + `useController` 做类型安全的可复用字段(来源:[React Hook Form Guide](https://tomodahinata.com/en/blog/react-hook-form)、[LobeHub skill](https://lobehub.com/skills/jezweb-claude-skills-react-hook-form-zod))。
- 嵌套路径:`register('user.address.street')`;动态列表:`useFieldArray`(`fields`/`append`/`remove`/`move`/`insert`,key 用 `field.id` 而非 index)(来源:[LobeHub skill](https://lobehub.com/skills/jezweb-claude-skills-react-hook-form-zod)、[terrierscript 指南](https://terrierscript.com/react/39/))。
- 条件字段:用 `watch('x')` 驱动 `v-if`/条件渲染,组件层面控制(来源:[terrierscript 指南](https://terrierscript.com/react/39/))。

#### 校验

- 内置规则(required/pattern/min 等)+ **resolver 委托外部 schema**:`@hookform/resolvers` 提供 zod/yup/valibot 等 20+ 适配器,并支持 **Standard Schema 通用适配器 `standardSchemaResolver`**(接受任何 StandardSchemaV1 兼容 schema;`raw` 选项控制返回解析后值还是原始输入;`criteriaMode: firstError|all`)(来源:[deepwiki resolvers](https://deepwiki.com/react-hook-form/resolvers/4.1-basic-form-validation)、[deepwiki Standard Schema Resolver](https://deepwiki.com/react-hook-form/resolvers/3.4-typebox-and-arktype-resolvers))。
- 校验时机:`useForm({ mode: 'onSubmit'|'onBlur'|'onChange'|'onTouched'|'all', reValidateMode })`;异步校验(如用户名唯一)用 resolver/rule 返回 Promise;`setError` 把服务端错误挂到字段(来源:[LobeHub skill](https://lobehub.com/skills/jezweb-claude-skills-react-hook-form-zod)、[React Hook Form Guide](https://tomodahinata.com/en/blog/react-hook-form))。

#### 状态与性能

- `formState` 是 **Proxy 订阅对象**:读取才订阅(必须先解构再读取,否则不更新);`isDirty` / `dirtyFields` / `touchedFields` / `isSubmitted` / `isSubmitting` / `isValidating` / `isValid` / `submitCount` / `errors` / `isLoading`(异步 defaultValues)等(来源:[react-hook-form.com/docs/useform/formstate](https://react-hook-form.com/docs/useform/formstate))。
- 渲染隔离:`useWatch`/`useFormState` 做局部订阅,避免整表单重渲染(来源:[React Hook Form Guide](https://tomodahinata.com/en/blog/react-hook-form))。

#### 集成

- `defaultValues`(建议全部提供,否则 isDirty 失真)、`values`、`reset`、异步 defaultValues(编辑表单加载)、`shouldUnregister`(多步表单卸载即移除字段)(来源:[react-hook-form.com](https://react-hook-form.com/docs/useform/formstate)、[LobeHub skill](https://lobehub.com/skills/jezweb-claude-skills-react-hook-form-zod))。

#### 表单设计/可视化构建器

- 无官方设计器。schema 仅用于校验,不做自动渲染。

#### Schema 互操作

- 通过 resolver 消费 Zod/Yup/Valibot/Standard Schema(单来源真相:一份 schema 同时产出类型、校验、错误文案)(来源:[React Hook Form Guide](https://tomodahinata.com/en/blog/react-hook-form)、[nerdleveltech 教程](https://nerdleveltech.com/react-hook-form-zod-resolver-tutorial))。

#### 可访问性与表单 UX

- 文档建议自行实现 a11y 三件套:`aria-invalid` + `aria-describedby` + `role="alert"`(WCAG 3.3.1);库本身不自动接线(来源:[chora-base 文档](https://github.com/liminalcommons/chora-base/blob/main/docs/skilled-awareness/react-form-validation/troubleshooting/AGENTS.md)、[React Hook Form Guide](https://tomodahinata.com/en/blog/react-hook-form))。

#### 许可

- MIT(来源:[npm-compare](https://npm-compare.com/final-form,formik,react-hook-form))。

---

### 2.3 VeeValidate(Vue)

- 官方文档:[vee-validate.logaretm.com](https://vee-validate.logaretm.com/v5/guide/composition-api/getting-started/),MIT(来源:[npm @vee-validate/rules](https://www.npmjs.com/package/@vee-validate/rules))。v4.15.x 为稳定版,v5.0.0-beta.1(来源:[secure.software npm 页面](https://secure.software/npm/packages/vee-validate/5.0.0-beta.1))。

#### 表单模型

- 组合式:`useForm`(建表单上下文、收集子字段、聚合 errors/validity/touched/dirty)+ `useField(path, rules)` + `useFieldArray` + `useFormContext`;组件式:`<Form>` / `<Field>` / `<FieldArray>` / `<ErrorMessage>`(renderless),两者可混用(来源:[getting-started](https://vee-validate.logaretm.com/v5/guide/composition-api/getting-started/)、[tessl 4.15.0 文档](https://tessl.io/registry/tessl/npm-vee-validate/4.15.0/files/docs/index.md))。
- 字段路径字符串,支持嵌套/数组路径(`useFieldArray`);`defineField('email')` 返回 `[valueModel, attrs]` 绑定输入(来源:[getting-started](https://vee-validate.logaretm.com/v5/guide/composition-api/getting-started/))。
- 定位:「优化构建字段和表单,而非值」,UI 无关、零侵入(来源:[getting-started](https://vee-validate.logaretm.com/v5/guide/composition-api/getting-started/))。

#### 校验

- 一等公民支持 **Standard Schema**(zod/valibot/yup 等);`@vee-validate/rules` 提供 Laravel 风格全局规则(required/email/min/confirmed 等 25+);字段级或表单级规则(`validationSchema` 选项)(来源:[getting-started](https://vee-validate.logaretm.com/v5/guide/composition-api/getting-started/)、[npm @vee-validate/rules](https://www.npmjs.com/package/@vee-validate/rules))。
- 类型化 schema:`@vee-validate/yup` / `@vee-validate/zod` 的 `toTypedSchema`,区分 input/output 类型,自动拾取 schema default 值、支持 yup transform(提交前 cast)(来源:[Typed Schemas](https://vee-validate.logaretm.com/v4/guide/composition-api/typed-schema/))。
- 触发时机:默认在 model 更新时积极校验,可 `validateOnModelUpdate` 关闭改懒校验(来源:[getting-started](https://vee-validate.logaretm.com/v5/guide/composition-api/getting-started/))。

#### 状态与性能

- 聚合字段 valid/invalid/touched/dirty/validated/pending 等 meta;`isSubmitting`;底层基于 Vue 响应式,字段级状态天然隔离(来源:[tessl 4.15.0](https://tessl.io/registry/tessl/npm-vee-validate/4.15.0/files/docs/index.md)、[getting-started](https://vee-validate.logaretm.com/v5/guide/composition-api/getting-started/))。

#### 集成

- 与任意 UI 库集成:Field 作用域插槽 `v-slot="{ field, errors }"` 拿绑定与错误,自行接 shadcn-vue 等组件(来源:[vue.shadcn.org.cn](https://vue.shadcn.org.cn/docs/forms/vee-validate))。

#### 表单设计/可视化构建器

- 无设计器。

#### Schema 互操作

- Standard Schema / yup / zod / joi 等(来源:[getting-started](https://vee-validate.logaretm.com/v5/guide/composition-api/getting-started/))。

#### 可访问性

- 通过 `errors`/`field` 手动接 `aria-invalid`;`<ErrorMessage>` 组件输出错误文案(来源:[vue.shadcn.org.cn](https://vue.shadcn.org.cn/docs/forms/vee-validate))。

#### 许可

- MIT(来源:[npm @vee-validate/rules](https://www.npmjs.com/package/@vee-validate/rules))。

---

### 2.4 TanStack Form(框架无关,headless)

- 仓库:[github.com/TanStack/form](https://github.com/TanStack/form),MIT;`@tanstack/vue-form` 当前 1.33.4(2026-08 发布),核心 `@tanstack/form-core` + `@tanstack/vue-store`(来源:[npm @tanstack/vue-form](https://www.npmjs.com/package/@tanstack/vue-form)、[npm.io](https://npm.io/package/@tanstack/vue-form/dependency))。框架无关:React/Vue/Solid/Svelte/Angular/Lit 绑定共享同一 form-core(来源:[hivebook wiki](https://hivebook.wiki/wiki/tanstack-form-v1-32-headless-framework-agnostic-type-safe-form-library-for-react-vue-solid-svelte-angular-lit-useform-field-render-props-subscribe-standard-schema-zod-valibot-arktype-async-validation-field-arrays-devtools))。

#### 表单模型

- `useForm()`(Vue 绑定)创建实例;`form.Field`(render-props 风格,`#default="{ field, state }"`)逐字段声明;`field.handleChange` / `handleBlur`;`form.Subscribe` 选择性子订阅(来源:[tanstack vue standard-schema 示例](https://tanstack.com/form/latest/docs/framework/vue/examples/standard-schema)、[hivebook](https://hivebook.wiki/wiki/tanstack-form-v1-32-...))。
- 嵌套对象 defaultValues;字段数组 `FieldArray`(来源:[hivebook 特性列表](https://hivebook.wiki/wiki/tanstack-form-v1-32-...),具体 API 细节未逐一核实)。

#### 校验

- 校验时机完全可控:`validators` 里 `onChange` / `onBlur` / `onSubmit` / `onMount` + 各自的 `*Async` 变体;字段级 + 表单级校验独立运行;异步校验支持 `AbortSignal` 取消在途请求 + 防抖(`*AsyncDebounceMs`)(来源:[tanstack validation 指南](https://tanstack.com/form/latest/docs/framework/vue/guides/validation)、[hivebook](https://hivebook.wiki/wiki/tanstack-form-v1-32-...))。
- 原生支持 **Standard Schema 规范**(Zod/Valibot/ArkType/Effect Schema 直接传 `validators`)(来源:[tanstack validation](https://tanstack.com/form/latest/docs/framework/vue/guides/validation)、[Vue Standard Schema 示例](https://tanstack.com/form/latest/docs/framework/vue/examples/standard-schema))。
- 错误:`field.state.meta.errors`(数组)+ `errorMap`(按触发时机分桶)(来源:[tanstack validation](https://tanstack.com/form/latest/docs/framework/vue/guides/validation))。

#### 状态与性能

- 每个字段有独立 `field.state`,meta 含 `isTouched` / `isDirty` / `isPristine` / `isBlurred` / `isDefaultValue`(持久型 dirty 语义,可组合出非持久 dirty)(来源:[tanstack basic-concepts](https://tanstack.com/form/latest/docs/framework/svelte/guides/basic-concepts.md))。
- 精确更新/批量更新/选择性订阅(form.Subscribe selector)实现零多余重渲染;`canSubmit` / `isSubmitting`(来源:[hivebook](https://hivebook.wiki/wiki/tanstack-form-v1-32-...)、[vue 示例](https://tanstack.com/form/latest/docs/framework/vue/examples/standard-schema))。

#### 集成

- 纯 headless,UI 由你掌控(如 shadcn-vue 对接,`:model-value` + `@blur`/`@input` 手动接线)(来源:[shadcn-vue TanStack Form](https://www.shadcn-vue.com/docs/forms/tanstack-form))。

#### 表单设计/可视化构建器

- 无;devtools 有 `@tanstack/form-devtools`(来源:[hivebook](https://hivebook.wiki/wiki/tanstack-form-v1-32-...))。

#### Schema 互操作

- Standard Schema 仅用于校验,不做 schema→UI 自动渲染;无 JSON Schema 协议层(来源:[tanstack validation](https://tanstack.com/form/latest/docs/framework/vue/guides/validation))。

#### 可访问性

- 示例用 `role="alert"` + meta.isValid 控制;ARIA 自行接线(来源:[tanstack validation](https://tanstack.com/form/latest/docs/framework/vue/guides/validation)、[shadcn-vue](https://www.shadcn-vue.com/docs/forms/tanstack-form))。

#### 许可

- MIT(来源:[npm @tanstack/vue-form](https://www.npmjs.com/package/@tanstack/vue-form)、[GitHub TanStack/form](https://github.com/TanStack/form))。

---

### 2.5 Ant Design Form + @ant-design/pro-components ProForm

#### Ant Design Form

- 官方文档:[ant.design/components/form-cn](https://ant.design/components/form-cn/);底层基于 `rc-field-form`;MIT(来源:[GitHub ant-design/ant-design-pro LICENSE](https://github.com/ant-design/ant-design-pro/blob/master/LICENSE))。
- **表单模型**:`Form` + `Form.Item name={...}`(v4 起去掉 `Form.create`/`getFieldDecorator`,改为数据域内置 + `Form.useForm()` 命令式;嵌套路径用数组 `['user','name']` 或点路径;`Form.List` 做动态列表;`noStyle` 去样式)(来源:[ant.design](https://ant.design/components/form-cn/)、[4x 迁移指南](https://4x.ant.design/components/form/v3-cn))。
- **联动/条件**:`Form.Item dependencies`(依赖字段变化自动重算/重验)、`shouldUpdate`(render props 订阅表单值变化)、`Form.Item` 内 render props 做条件显隐;`useWatch` 局部订阅单字段;`Form.useWatch`(来源:[ant.design](https://ant.design/components/form-cn/)、[4x 迁移指南](https://4x.ant.design/components/form/v3-cn)、[CSDN 联动验证](https://blog.csdn.net/gitblog_01055/article/details/152103383))。
- **校验**:`rules`(内置 required/type/pattern/min/max/enum + `validator` 函数,validator 返回 Promise;跨字段 validator 通过 `({ getFieldValue })` 取其他字段值);`validateTrigger`(改校验时机)/`validateFirst`(短路)/`validateDebounce`(防抖);`warningOnly` 非阻塞校验;`onFinish` 仅在通过后触发;`validateFields`/`scrollToField`(错误定位);`setFields`/`setFieldValue`(来源:[ant.design](https://ant.design/components/form-cn/)、[4x 迁移指南](https://4x.ant.design/components/form/v3-cn))。
- **状态与性能**:v4 起增量更新,仅更新受影响字段;`MemoInput` 记忆化避免无关重渲染;`dependencies` 与 `shouldUpdate` 不可混用(有告警)(来源:[4x 迁移指南](https://4x.ant.design/components/form/v3-cn)、[CSDN](https://blog.csdn.net/gitblog_01055/article/details/152103383))。
- **可访问性**:Form.Item 自带 label/help/error 展示与校验状态(validateStatus),`scrollToField` 聚焦错误。

#### ProForm(@ant-design/pro-components)

- 官方文档:[procomponents.ant.design/components/form](https://procomponents.ant.design/components/form?locale=en-US);定位「在原生 Form 上加语法糖与布局,覆盖分步/Modal/Drawer/查询/轻量筛选等场景」(来源:[procomponents.ant.design](https://procomponents.ant.design/components/form?locale=en-US))。
- 提供一批 `ProFormText` / `ProFormSelect` / `ProFormDatePicker` 等字段组件;`ProFormDependency`(声明依赖并 diff,render props 取值);`ProFormList`(动态列表);`ProFormGroup`;`ProFormFieldSet`(来源:[npm @antdv-next1/pro-form(社区 Vue 移植,字段清单可参考)](https://www.npmjs.com/package/@antdv-next1/pro-form)、[mintlify ProForm API](https://mintlify.wiki/ant-design/pro-components/api/pro-form))。
- 数据转换:`convertValue`(取值前置转换,如 `a,b`→数组、字符串→Moment)、`transform`(提交时转换,可展开成多字段,如 `[a,b]`→`{a,b}`)(来源:[procomponents.ant.design](https://procomponents.ant.design/components/form?locale=en-US)、[next-procomponents](https://next-procomponents.ant.design/en-US/components/form/))。
- 其它默认行为:`onFinish` 支持 Promise 自动 loading;`request` 远程加载 initialValues;`dateFormatter` 统一日期格式;`syncToUrl` 同步查询参数;`autoFocusFirstInput`;`omitNil`(来源:[mintlify ProForm API](https://mintlify.wiki/ant-design/pro-components/api/pro-form)、[next-procomponents](https://next-procomponents.ant.design/en-US/components/form/))。
- **Schema 驱动**:提供 `SchemaForm` 组件(基于 columns 配置生成表单,文档导航见 [pro-components schema-form](https://pro-components.antdigital.dev/en-US/components/schema-form));注意其为**配置数组驱动**,并非标准 JSON Schema 协议。
- 许可:pro-components 属 ant-design 组织,MIT(来源:[ant-design-pro LICENSE](https://github.com/ant-design/ant-design-pro/blob/master/LICENSE))。注意 `@antdv-next1/pro-form` 是社区 Vue3 移植(周下载量很低,未验证其成熟度)。

---

### 2.6 Element Plus Form

- 官方文档:[cn.element-plus.org/zh-CN/component/form](https://cn.element-plus.org/zh-CN/component/form);MIT(来源:[GitHub LICENSE](https://github.com/element-plus/element-plus/blob/dev/LICENSE))。
- **表单模型**:`el-form`(`:model`、`:rules`、`inline`、`label-position`、`size` 继承)+ `el-form-item`(`prop` 关联字段);`ref` 上 `validate()`/`resetFields()`/`clearValidate()`/`scrollToField()`(来源:[官方文档](https://cn.element-plus.org/zh-CN/component/form))。
- **校验**:rules 走 **async-validator**([github.com/yiminghe/async-validator](https://github.com/yiminghe/async-validator));`trigger` 控制 blur/change/input;自定义 `validator(rule, value, callback)`(必须调用 callback);数字校验需 `v-model.number`;类型校验 type: string/number/boolean/array/object/date/url/email/enum 等(来源:[官方文档](https://cn.element-plus.org/zh-CN/component/form)、[CSDN async-validator 集成](https://blog.csdn.net/gitblog_00505/article/details/150969775))。
- **状态与性能**:受控于 `:model`(开发者自持 reactive 数据);错误状态 `el-form-item` 自动高亮 + 展示 message;无字段级订阅/渲染隔离(全量响应式)。
- **联动/条件**:组件层面用 `v-model` 值 + `v-if` 实现;跨字段校验在 validator 内读其他字段(来源:[CSDN](https://blog.csdn.net/gitblog_00505/article/details/150969775))。
- **Schema 互操作**:无 JSON Schema;仅 async-validator 规则对象。
- **设计器**:无官方设计器;第三方 form-create 提供基于 Element 的设计器(见 2.9)。
- **许可**:MIT。

---

### 2.7 Naive UI Form

- 官方文档:[naiveui.com/zh-CN/os-theme/components/form](https://www.naiveui.com/zh-CN/os-theme/components/form);MIT(来源:[GitHub naive-ui](https://github.com/tusen-ai/naive-ui)(许可为 MIT;未单独抓取 LICENSE 页面,若需精确引用请复核))。
- **表单模型**:`n-form`(`:model`、`:rules`)+ `n-form-item`(`path` 关联字段);`n-form-item-gi` 栅格化;容器-项目-控件三层结构;`FormInst.validate(callback)`、`FormInst.scrollToField(path)`、`FormItemInst.validate({ trigger })`(来源:[CSDN Naive UI 表单实践](https://blog.csdn.net/gitblog_00429/article/details/151730554)、[CSDN 全攻略](https://blog.csdn.net/gitblog_00235/article/details/152874022))。
- **校验**:`FormRules = Record<string, FormItemRule[]>`;`FormItemRule.validator(rule, value)` 返回 `boolean | Error`(可 async,返回 Promise);`trigger` 支持 `['input','blur']`;`level: 'warning'` 非阻断警告;动态数组字段用 `path="tags[0]"`(来源:[CSDN](https://blog.csdn.net/gitblog_00429/article/details/151730554)、[CSDN 全攻略](https://blog.csdn.net/gitblog_00235/article/details/152874022))。
- **设计器**:无官方;form-create 提供 naive-ui 版(来源:[form-create naive-ui 校验文档](https://www.form-create.com/v3/naive-ui/validation))。

---

### 2.8 Final Form / Formik(React,可选)

- **Final Form**(`final-form` + `react-final-form`,MIT):订阅制,表单状态放在 React 之外的独立 JS 对象,`form.subscribe(...)` 只订阅关心的状态(`values`/`dirty`/`valid`),`registerField` 订阅单个字段;`react-final-form` 是其薄 React 封装(Observer 模式,`<FormSpy/>` 拿局部状态);数组用 `final-form-arrays` 的 `FieldArray`(来源:[react-final-form README](https://github.com/Harendranathv/react-final-form)、[final-form 订阅示例](https://final-form.org/docs/react-final-form/examples/subscriptions)、[npm-compare](https://npm-compare.com/final-form,formik,react-hook-form))。
- **Formik**(Apache-2.0):表单状态放 React 组件 state(受控输入),`useFormik` / `<Formik>`;`validationSchema`(Yup)+ `validate` 函数;`errors`/`touched`/`dirty`/`isValid`/`isSubmitting`;数组用 `<FieldArray>`;validateOnChange/validateOnBlur 可配置(来源:[npm-compare](https://npm-compare.com/final-form,formik,react-hook-form))。
- 两者均为「校验器函数/Yup schema」而非 schema 驱动渲染;React 侧已基本被 RHF 取代(RHF 周下载 ~5750 万 vs Formik ~458 万 vs final-form ~72 万,来源:[npm-compare](https://npm-compare.com/final-form,formik,react-hook-form))。

---

### 2.9 表单可视化设计器 与 Standard Schema 规范

#### Formily Designable / @formily-design/formily-designer

- 基础框架 **Designable**(github.com/alibaba/designable,MIT):低代码/无代码 builder 引擎(拖拽、大纲树、属性面板、多视图、撤销重做),但**最后实质提交为 2022-04、发布 v0.5.19(2021-08),已基本停滞**(来源:[GitHub alibaba/designable](https://github.com/alibaba/designable))。
- Formily 表单设计器(官方 docs/guide/form-builder.zh-CN.md)基于 Designable,内置输入/布局/自增(ArrayCards/ArrayTable)/展示组件分组;社区封装 `@formily-design/formily-designer`(React + antd,提供 `FormilyDesigner` + `SchemaFormView`(创建/编辑/详情/只读 + 远程数据源/API 提交))(来源:[npm @formily-design/formily-designer](https://www.npmjs.com/package/@formily-design/formily-designer)、[CSDN 设计器介绍](https://blog.csdn.net/gitblog_01096/article/details/153241594))。

#### form-create-designer(FcDesigner)

- Vue2/Vue3 拖拽式表单设计器,**MIT**(2021-present xaboy);内置 30+ 常用组件(输入/布局/自增/展示),支持 JSON 规则生成、事件配置、样式配置、表格布局、子表单、多语言、撤销重做、多端预览;输出 `@form-create` 的 JSON rule,由 `@form-create/element-ui` / `@form-create/naive-ui` 等渲染(来源:[npm @cg-devcenter/form-create.designer](https://www.npmjs.com/package/@cg-devcenter/form-create.designer)、[GitHub form-create-designer release](https://github.com/xaboy/form-create-designer/releases/tag/v1.1.0))。
- 官方还开源了 **AI 表单助理 form-create-assistant**(自然语言生成/修改表单规则)(来源:[npm @cg-devcenter/form-create.designer](https://www.npmjs.com/package/@cg-devcenter/form-create.designer))。
- form-create 的 rule 是**自定义 JSON rule**(`{type:'input', field, title, validate:[...]}`,校验仍基于 async-validator 规则字段),**不是标准 JSON Schema**(来源:[form-create naive-ui 校验文档](https://www.form-create.com/v3/naive-ui/validation))。
- 「部分付费」的说法未在调研到的一手来源中得到证实(核心与设计器均为 MIT),标注为**未验证**。

#### Standard Schema v1(关键行业规范)

- 由 Zod / Valibot / ArkType 的作者共同设计,纯 TypeScript 接口 `StandardSchemaV1`(`~standard.version/vendor/validate/types`),错误统一为 `Issue { message, path }`,零运行时依赖;Zod ≥3.24 / Valibot ≥1.0 / ArkType ≥2.0 / Effect Schema v3.13+(经适配器)已实现(来源:[standardschema.dev/schema](https://standardschema.dev/schema)、[CSDN 标准模式教程](https://blog.csdn.net/gitblog_00679/article/details/146720954))。
- 已被 RHF(resolver)、VeeValidate、TanStack Form 原生消费(来源:[deepwiki resolvers](https://deepwiki.com/react-hook-form/resolvers/3.4-typebox-and-arktype-resolvers)、[vee-validate getting-started](https://vee-validate.logaretm.com/v5/guide/composition-api/getting-started/)、[tanstack validation](https://tanstack.com/form/latest/docs/framework/vue/guides/validation))。

---

## 3. 能力对比总表

| 维度                     | Formily                                     | React Hook Form                                   | VeeValidate                           | TanStack Form                               | AntD Form + ProForm                            | Element Plus               | Naive UI                     |
| ------------------------ | ------------------------------------------- | ------------------------------------------------- | ------------------------------------- | ------------------------------------------- | ---------------------------------------------- | -------------------------- | ---------------------------- |
| 范式                     | 模型式(MVVM)+ 组件 + **Schema 驱动**        | hook 式(register/Controller)                      | 组合式 + 组件(renderless)             | hook 式 + render-props(headless)            | 组件式(Form.Item)+ 命令式 useForm              | 组件式(el-form)            | 组件式(n-form)               |
| 字段注册                 | Field/ArrayField/ObjectField/VoidField 模型 | register/Controller/useFieldArray                 | useField/defineField/useFieldArray    | form.Field / FieldArray                     | Form.Item name / Form.List                     | el-form-item prop          | n-form-item path             |
| 嵌套/数组                | ObjectField + ArrayField(ArrayCards/Table)  | `a.b.c` 路径 + useFieldArray                      | 路径 + useFieldArray                  | 嵌套 defaultValues + FieldArray             | 数组路径 + Form.List                           | 手动 v-for                 | path `a[0].b` + v-for        |
| 条件字段                 | `x-reactions`/reactions/effects             | watch + v-if(组件级)                              | computed + v-if                       | 自订阅 field.state.value                    | dependencies/shouldUpdate/render props         | v-model + v-if             | v-model + v-if               |
| 内置校验                 | 内置 20+ 规则 + 自定义                      | 内置规则 + resolver                               | 全局规则(@vee-validate/rules)+ schema | validators 函数 + Standard Schema           | rules(async-validator 风格,自定义 validator)   | async-validator            | FormItemRule(boolean/Error)  |
| 外部 schema              | 自研 JSON-Schema(+x-)                       | Zod/Yup/Valibot/Standard Schema                   | zod/yup/joi/Standard Schema           | Zod/Valibot/ArkType/Effect(Standard Schema) | 无(规则对象)/ProForm 配置数组                  | 无                         | 无                           |
| 校验时机                 | validateFirst / 字段级                      | mode(onSubmit/onBlur/onChange/all)+reValidateMode | validateOnModelUpdate/onBlur/onInput  | onChange/onBlur/onSubmit/onMount + Async    | validateTrigger/validateFirst/validateDebounce | trigger(blur/change/input) | trigger(blur/input)          |
| 异步校验                 | 支持                                        | resolver Promise / setError                       | 支持(Promise rule)                    | Async 变体 + AbortSignal 取消               | validator Promise                              | callback / Promise         | async validator              |
| 性能策略                 | 响应式依赖追踪、按需渲染                    | 非受控 + formState Proxy 订阅                     | Vue 响应式字段级                      | form-core store + 选择订阅                  | 增量更新 + MemoInput                           | 全量响应式                 | 全量响应式                   |
| dirty/touched/submitting | 模型内建                                    | 全(Proxy 订阅)                                    | 有(meta 聚合)                         | 有(meta: isTouched/isDirty/...)             | 部分(isFieldsTouched 等)                       | 无(dirty 需自算)           | 无(自算)                     |
| 错误聚焦                 | decorator 处理                              | 无(自行 scroll)                                   | 无                                    | 无                                          | scrollToField                                  | scrollToField              | scrollToField                |
| Schema 驱动渲染          | **是**(JSON Schema→SchemaField)             | 否(仅校验)                                        | 否(仅校验)                            | 否(仅校验)                                  | 部分(ProForm 配置数组 SchemaForm)              | 否                         | 否                           |
| 可视化设计器             | Designable(已停滞)/社区 @formily-design     | 无                                                | 无                                    | 无(仅 devtools)                             | 无官方(form-create 有 antdv 版)                | 无官方(form-create 有)     | 无官方(form-create 有)       |
| 许可                     | MIT                                         | MIT                                               | MIT                                   | MIT                                         | MIT                                            | MIT                        | MIT(未单独复核 LICENSE 文件) |
| 维护活跃度               | 中(React 活跃、Vue 低)                      | 高                                                | 高(v5 beta 中)                        | 高                                          | 高                                             | 高                         | 中                           |

---

## 4. 共性与差距(对 `@soybeanjs/form` 的启示)

### 4.1 成熟表单引擎的共性(可视为「默认底线」)

1. **字段级注册 + 路径模型**:无论范式如何,都提供字符串/数组路径定位嵌套对象与数组字段(RHF `a.b.c`、AntD `['user','name']`、VeeValidate path、TanStack form.Field name)。`@soybeanjs/form` 的 nested paths 已覆盖此项。
2. **完整的表单生命周期状态**:dirty / touched / errors / submitting / validating / isValid 是标配;其中 dirty 语义分「持久型」(TanStack、Angular、Vue FormKit)与「非持久型」(RHF/Formik/Final Form,回退默认值即变干净)两类,需明确选择(来源:[tanstack basic-concepts](https://tanstack.com/form/latest/docs/framework/svelte/guides/basic-concepts.md))。
3. **多触发时机校验 + 短路/防抖**:RHF `mode`/`reValidateMode`、AntD `validateTrigger/validateFirst/validateDebounce`、TanStack 生命周期 validators、Formily `validateFirst` 等。`@soybeanjs/form` 的 validateMode/reValidateMode 与主流对齐。
4. **外部 schema 校验成为默认路径**:Standard Schema 已打通 Zod/Valibot/ArkType/Effect;RHF/VeeValidate/TanStack 都原生接入,「写一份 schema 同时获得类型 + 校验 + 错误文案」是社区共识(来源:[standardschema.dev](https://standardschema.dev/schema))。**建议 `@soybeanjs/form` 继续以 Standard Schema 为一等校验接口,并考虑提供 raw/parsed 双结果(参考 RHF resolver 的 raw 选项)**。
5. **服务端错误回填**:RHF `setError`、AntD `setFields`,用于服务端校验回写字段。
6. **错误定位 / 焦点管理**:AntD/Element/Naive 都提供 `scrollToField`/`scrollToField`(错误聚焦);headless 系(RHF/TanStack)留白——这是可做差异化的 UX 增值点。
7. **许可**:MIT 生态为主,`@soybeanjs/form` 保持 MIT 无兼容障碍。

### 4.2 Vue 3 生态的差距与机会(对 `@soybeanjs/form` 的定位建议)

1. **「协议驱动渲染」是最大空白**:Formily 是唯一完整实现「schema 描述 → 自动渲染 + 声明式联动(x-reactions)+ 命令式 effects」的 Vue 方案,但其 Vue 侧长期低活跃、依赖自研 JSON-Schema 方言(x-* 扩展)、设计器停滞。VeeValidate / TanStack Form / Element Plus / Naive UI 都只把 schema 用于校验。`@soybeanjs/form` 可以在**标准 JSON Schema / 自定义 ISchema 之上做 schema 驱动渲染层**,这是「比 TanStack Form 更进一步」的差异化定位。
2. **headless 引擎 + schema 层分离**:TanStack Form 证明了「form-core(框架无关)+ 各框架绑定」的架构在 Vue 3 可行且被接受。`@soybeanjs/form` 可参考此分层:逻辑/状态留在 headless,UI 由 @vean/ui 提供,渲染层由 schema 驱动,符合本项目 headless-first 的一贯约束。
3. **声明式联动语言(x-reactions 式)价值高**:Formily 的 `when/fulfill` 声明式联动(显隐/必填/禁用随依赖字段变化)是企业级表单高频诉求;RHF/AntD 依赖手写 watch/effects。`@soybeanjs/form` 若能提供「声明式联动 + 命令式 fallback」将显著降低复杂表单心智成本。
4. **可视化设计器仍缺位**:Vue 侧开源且活跃的只有 form-create-designer(MIT);Formily Designable 已停滞。若 `@soybeanjs/form` 的 schema 协议足够稳定,后续可考虑轻量 schema 编辑/预览工具或与 form-create 类设计器互转,但建议**先做协议与渲染,再做设计器**。
5. **类型化 schema 体验(toTypedSchema 模式)**:VeeValidate 的 `@vee-validate/zod` `toTypedSchema` 区分 input/output 类型、从 schema 自动拾取默认值/提交前 transform,是值得对齐的 DX 细节(来源:[vee-validate Typed Schemas](https://vee-validate.logaretm.com/v4/guide/composition-api/typed-schema/))。
6. **ProForm 式「配置数组/columns 驱动 + 布局默认行为」可作为轻量形态**:ProForm 的 `SchemaForm`(columns 配置)、`convertValue`/`transform` 数据转换、`dateFormatter`、`request` 远程加载、`syncToUrl` 等「默认好用」行为,可作为 `@soybeanjs/form` 高级形态的功能清单参考(来源:[next-procomponents](https://next-procomponents.ant.design/en-US/components/form/))。

### 4.3 风险提示

- Formily 的 schema 方言(x-reactions 等)虽强大,但**不兼容标准 JSON Schema 校验器**(其校验走自研 validator);`@soybeanjs/form` 若同时要「schema 驱动渲染 + Standard Schema 校验」,需设计好「UI 协议」与「校验协议」两层(建议:UI 渲染用自有 schema 扩展,校验统一走 Standard Schema)。
- 未验证项:`@antdv-next1/pro-form`(社区 Vue 移植)成熟度、form-create 是否存在付费层、Naive UI LICENSE 文件原文,后续如需引用请复核。

---

## 5. 参考来源

### Formily

- [GitHub alibaba/formily(README、MIT、v2.3.7)](https://github.com/alibaba/formily)
- [Formily Vue 官方文档](https://vue.formilyjs.org/)
- [Formily Vue 快速开始](https://vue.formilyjs.org/#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)
- [Formily Vue 介绍(架构/概念)](https://vue.formilyjs.org/guide/)
- [deepwiki alibaba/formily(架构分层、x- 扩展协议)](https://deepwiki.com/alibaba/formily)
- [npm @formily-design/formily-designer](https://www.npmjs.com/package/@formily-design/formily-designer)
- [GitHub alibaba/designable(MIT、停滞状态)](https://github.com/alibaba/designable)

### React Hook Form

- [React Hook Form 官方 docs(useForm/formState)](https://react-hook-form.com/docs/useform/formstate)
- [deepwiki @hookform/resolvers Basic Form Validation](https://deepwiki.com/react-hook-form/resolvers/4.1-basic-form-validation)
- [deepwiki @hookform/resolvers Standard Schema Resolver](https://deepwiki.com/react-hook-form/resolvers/3.4-typebox-and-arktype-resolvers)

### VeeValidate

- [VeeValidate v5 Composition API Getting Started](https://vee-validate.logaretm.com/v5/guide/composition-api/getting-started/)
- [VeeValidate v4 Typed Schemas(zod/yup toTypedSchema)](https://vee-validate.logaretm.com/v4/guide/composition-api/typed-schema/)
- [npm @vee-validate/rules(MIT、全局规则)](https://www.npmjs.com/package/@vee-validate/rules)

### TanStack Form

- [TanStack Form Vue Validation Guide](https://tanstack.com/form/latest/docs/framework/vue/guides/validation)
- [TanStack Form Vue Standard Schema 示例](https://tanstack.com/form/latest/docs/framework/vue/examples/standard-schema)
- [TanStack Form Basic Concepts(meta 状态语义)](https://tanstack.com/form/latest/docs/framework/svelte/guides/basic-concepts.md)
- [npm @tanstack/vue-form(MIT、1.33.4)](https://www.npmjs.com/package/@tanstack/vue-form)
- [GitHub TanStack/form(MIT)](https://github.com/TanStack/form)

### Ant Design / ProComponents

- [Ant Design Form 官方文档](https://ant.design/components/form-cn/)
- [Ant Design Form v3→v4 迁移指南](https://4x.ant.design/components/form/v3-cn)
- [ProForm 官方文档](https://procomponents.ant.design/components/form?locale=en-US)
- [ProForm(英文,convertValue/transform)](https://next-procomponents.ant.design/en-US/components/form/)
- [ProComponents Schema Form](https://pro-components.antdigital.dev/en-US/components/schema-form)
- [npm @antdv-next1/pro-form(社区 Vue 移植,字段清单)](https://www.npmjs.com/package/@antdv-next1/pro-form)
- [GitHub ant-design-pro LICENSE(MIT)](https://github.com/ant-design/ant-design-pro/blob/master/LICENSE)

### Element Plus / Naive UI

- [Element Plus Form 官方文档](https://cn.element-plus.org/zh-CN/component/form)
- [async-validator(GitHub)](https://github.com/yiminghe/async-validator)
- [Element Plus LICENSE(MIT)](https://github.com/element-plus/element-plus/blob/dev/LICENSE)
- [Naive UI Form 官方文档](https://www.naiveui.com/zh-CN/os-theme/components/form)

### Final Form / Formik

- [react-final-form(GitHub,订阅制)](https://github.com/Harendranathv/react-final-form)
- [Final Form Subscriptions 示例](https://final-form.org/docs/react-final-form/examples/subscriptions)
- [npm-compare: final-form vs formik vs react-hook-form(下载量/许可)](https://npm-compare.com/final-form,formik,react-hook-form)

### form-create / 设计器

- [npm @cg-devcenter/form-create.designer(MIT、FcDesigner)](https://www.npmjs.com/package/@cg-devcenter/form-create.designer)
- [GitHub form-create-designer(v1.1.0 release)](https://github.com/xaboy/form-create-designer/releases/tag/v1.1.0)
- [form-create naive-ui 校验规则文档(rule 结构)](https://www.form-create.com/v3/naive-ui/validation)

### Standard Schema

- [Standard Schema 官方规范](https://standardschema.dev/schema)
- [Zod 官方文档](https://v3.zod.dev/)
