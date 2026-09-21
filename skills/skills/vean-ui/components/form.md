# Form

Source URL: https://veanui.com/components/form
Markdown URL: https://veanui.com/components/form.md
Category: Forms
Description: A form composition layer for building validated forms with an Aria core and styled wrappers. The useForm composable is backed by the TanStack Form engine (@tanstack/vue-form) for field-level subscriptions, field arrays, and the submit lifecycle, accepts any Standard Schema validator (Zod, Valibot, ArkType, Yup, …), and returns a context with SFormField / SFormFieldArray used to render the form. Fields register through slots, so any VeanUI input (SInput, SSelect, SCheckbox, SSwitch, SRadioGroup, …) or a plain custom control works without a per-control API.

## Overview

A form composition layer for building validated forms with an Aria core and styled wrappers. The `useForm` composable is backed by the **TanStack Form engine** (`@tanstack/vue-form`) — field-level subscriptions, field arrays, and the submit lifecycle come from the engine — and accepts any **Standard Schema** validator (Zod, Valibot, ArkType, Yup, …). It returns a context object with `SFormField` / `SFormFieldArray` used to render the form. Fields register through slots, so any VeanUI input (`SInput`, `SSelect`, `SCheckbox`, `SSwitch`, `SRadioGroup`, …) or a plain custom control works without a per-control API.

## Usage

Usage examples for form are rendered on the site.

## Features

- 📜 Schema validation — pass any Standard Schema validator directly (Zod, Valibot, ArkType, Yup); the library has no runtime dependency on `@standard-schema/spec`. The form values type is inferred from the schema, or from `defaultValues` when the schema is omitted
- 🏎️ TanStack engine — field-level subscriptions, array fields, and the submit lifecycle (`isSubmitting` / `isSubmitted` / `submissionAttempts`) are powered by `@tanstack/vue-form`; the full `FormApi` is exposed as `form` for advanced usage (`Subscribe`, `setFieldValue`, `pushFieldValue`, …)
- ✅ Field-level rules — per-field `validate` accepts a sync or async function or a Standard Schema validator, merged with schema errors by the engine; pass it through a Ref / ComputedRef to swap rules reactively
- 🔁 Validate timing — `validateMode` sets when the schema and field-level validators run (`blur` | `change` | `submit`), `validateOnMounted` validates on mount; validators are registered on the engine's async slots, so each validation cause runs them exactly once and async Standard Schemas are supported
- 📦 Field arrays — `append` / `prepend` / `remove` / `insert` / `swap` / `move` / `update` / `replace` with nested path registration (`social[0].name`, TanStack canonical format)
- 🧩 Aria/styled split — `useForm`/`FormCompact` in `@vean/aria` (zero styles); `SForm*` wrappers inject `formVariants` classes (6 slots: field/fieldArray/label/control/description/error); the error enter/leave animation lives in the UI layer
- ♿ Accessible by default — label `<label :for>` association, `aria-invalid` on error, `aria-describedby` linking description + error to the control
- 🎨 Composable layout — `label` / `control` / `description` / `error` slots plus `*Props` passthrough; `SFormFieldBase` for custom rows
- 🧰 Control-agnostic — fields receive `model-value` + a11y attributes via slot forwarding, so any value-aware control integrates

## Component family

- `useForm` (styled) — the entry composable; returns a context with `form` (TanStack `FormApi`), `state`, `isSubmitting`, `handleSubmit`/`handleReset`, plus the bound `SFormField` / `SFormFieldArray` components
- `SForm` / `FormCompact` (Aria) — the `<form>` element owner; forwards `orientation`/`fieldProps`/`fieldArrayProps`/`labelProps`/`controlProps`/`descriptionProps`/`errorProps` to descendants via context
- `SFormField` / `FormFieldCompact` (Aria) — registers one field by `name`; owns the field's error/meta and renders label + description + control + error
- `SFormFieldArray` / `FormFieldArrayCompact` (Aria) — registers a field array; default slot receives `fields`/`append`/`prepend`/`remove`/`insert`/`swap`/`move`/`update`/`replace`
- `SFormFieldBase` / `FormFieldBaseCompact` (Aria) — layout wrapper for custom rows; provides `formFieldId` / `ariaDescribedBy` / `ariaInvalid` to its slot
- `FormField` / `FormLabel` / `FormControl` / `FormDescription` / `FormError` (Aria) — low-level primitives used internally by the compact (also exported for custom compositions)
- Core engine — `@tanstack/vue-form` (`FormApi` + Vue `Field` / `Subscribe` / `useSelector`); the former `useHeadlessForm` / `useFormState` / `useFieldArray` self-built engine was retired in v0.50.0

## Demos

Interactive demos for form are rendered on the site.

- 01 Basic — schema-driven form (Zod) with radio/checkbox/switch/select and a nested field array
- 02 Horizontal — horizontal `orientation` layout
- 03 Schema — Zod schema validation with required/min rules
- 04 Rules — field-level `validate` rules next to the schema
- 05 Async — async field-level validation (e.g. uniqueness check)
- 06 Array — dynamic list with append/remove/move controls
- 07 Disabled — field-level `disabled` on input/select/checkbox

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (10): Form, FormCompact, FormControl, FormDescription, FormError, FormField, FormFieldArrayCompact, FormFieldBaseCompact, FormFieldCompact, FormLabel.

### Form

#### Props

Properties for the FormCompact component.

- `class`: Additional class names applied to the form element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<FormUi>`; optional)
- `fieldProps`: No description. (type `FormFieldProps`; optional)
- `fieldArrayProps`: No description. (type `FormFieldProps`; optional)
- `orientation`: Orientation of the form field. (type `DataOrientation`; default `'vertical'`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `FormDescriptionProps`; optional)
- `labelProps`: Properties forwarded to the label element. (type `FormLabelProps`; optional)
- `controlProps`: Properties forwarded to the control element. (type `FormControlProps`; optional)
- `errorProps`: Properties forwarded to the error element. (type `FormErrorProps`; optional)

### FormCompact

#### Props

Properties for the FormCompact component.

- `fieldProps`: No description. (type `FormFieldProps`; optional)
- `fieldArrayProps`: No description. (type `FormFieldProps`; optional)
- `orientation`: Orientation of the form field. (type `DataOrientation`; default `'vertical'`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `FormDescriptionProps`; optional)
- `labelProps`: Properties forwarded to the label element. (type `FormLabelProps`; optional)
- `controlProps`: Properties forwarded to the control element. (type `FormControlProps`; optional)
- `errorProps`: Properties forwarded to the error element. (type `FormErrorProps`; optional)

### FormControl

- No documented props, emits, slots, or slot props were available.

### FormDescription

- No documented props, emits, slots, or slot props were available.

### FormError

- No documented props, emits, slots, or slot props were available.

### FormField

#### Props

Properties for the FormField component.

- `error`: Error. (type `string`; optional)
- `isFieldArray`: Whether the field is an array. (type `boolean`; optional)

#### Slots

Slots for the FormField component.

- `default`: Custom content for the default slot. (type `((props: FormFieldState<any, any>) => any) | undefined`)
- `label`: Custom content for the label slot. (type `((props: FormFieldState<any, any>) => any) | undefined`)
- `description`: Custom content for the description slot. (type `((props: FormFieldState<any, any>) => any) | undefined`)
- `error`: Custom content for the error slot. (type `((props: { error: string | undefined; errorProps: FormErrorProps; }) => any) | undefined`)

### FormFieldArrayCompact

#### Slots

Slots for the FormFieldArrayCompact component.

- `default`: Custom content for the default slot. (type `((props: FormFieldArrayStates<Values, Name>) => any) | undefined`)
- `label`: Custom content for the label slot. (type `((props: FormFieldArrayStates<Values, Name>) => any) | undefined`)
- `description`: Custom content for the description slot. (type `((props: FormFieldArrayStates<Values, Name>) => any) | undefined`)
- `error`: Custom content for the error slot. (type `((props: { error: string | undefined; errorProps: FormErrorProps; }) => any) | undefined`)

### FormFieldBaseCompact

#### Props

Properties for the FormFieldBaseCompact component.

- `error`: Error. (type `string`; optional)
- `isFieldArray`: Whether the field is an array. (type `boolean`; optional)
- `orientation`: Orientation of the form field. (type `DataOrientation`; default `'vertical'`; optional)
- `label`: Label text rendered by the component. (type `string`; optional)
- `description`: Description text rendered by the component. (type `string`; optional)
- `labelProps`: Properties forwarded to the label element. (type `FormLabelProps`; optional)
- `controlProps`: Properties forwarded to the control element. (type `FormControlProps`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `FormDescriptionProps`; optional)
- `errorProps`: Properties forwarded to the error element. (type `FormErrorProps`; optional)

#### Slots

Slots for the FormFieldBaseCompact component.

- `default`: Custom content for the default slot. (type `(() => any) | undefined`)
- `label`: Custom content for the label slot. (type `(() => any) | undefined`)
- `description`: Custom content for the description slot. (type `(() => any) | undefined`)
- `error`: Custom content for the error slot; falls back to a plain FormError. (type `((props: { error: string | undefined; errorProps: FormErrorProps; }) => any) | undefined`)

### FormFieldCompact

#### Props

Properties for the FormFieldCompact component.

- `name`: The name of the form field, used for registration and value retrieval. (type `Name`; required)
- `isFieldArray`: Whether the field is an array. (type `boolean`; optional)
- `orientation`: Orientation of the form field. (type `DataOrientation`; default `'vertical'`; optional)
- `label`: Label text rendered by the component. (type `string`; optional)
- `description`: Description text rendered by the component. (type `string`; optional)
- `labelProps`: Properties forwarded to the label element. (type `FormLabelProps`; optional)
- `controlProps`: Properties forwarded to the control element. (type `FormControlProps`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `FormDescriptionProps`; optional)
- `errorProps`: Properties forwarded to the error element. (type `FormErrorProps`; optional)
- `validate`: Field-level validator. May be a sync or async function, a Standard Schema validator, or a Ref / ComputedRef of either for reactive rebinding. (type `FormFieldValidateSource<DeepValue<Values, Name>>`; optional)

#### Slots

Slots for the FormFieldCompact component.

- `default`: Custom content for the default slot. (type `((props: FormFieldState<Values, Name>) => any) | undefined`)
- `label`: Custom content for the label slot. (type `((props: FormFieldState<Values, Name>) => any) | undefined`)
- `description`: Custom content for the description slot. (type `((props: FormFieldState<Values, Name>) => any) | undefined`)
- `error`: Custom content for the error slot. (type `((props: { error: string | undefined; errorProps: FormErrorProps; }) => any) | undefined`)

### FormLabel

#### Props

Properties for the FormLabel component.

- `for`: The id of the element the label is associated with. (type `string`; optional)

## Notes

### Architecture and benchmark differences

`useForm` wraps TanStack's `useForm`: the schema is registered as a form-level validator and each field-level `validate` as a field validator, and the engine owns values, field meta, error distribution by path, and the submit lifecycle. `validateMode` maps onto a TanStack validator timing (`onChange` / `onBlur` / `onSubmit`); the schema is registered on the async slots, which also accept sync returns, so each validator runs exactly once per validation cause and async Standard Schemas work. Submit-cause field slots are always attached so `handleSubmit` awaits field validation. `useFieldArray` exposes mutation helpers built on the engine's array operations (`pushFieldValue`, `insertFieldValue`, `removeFieldValue`, `swapFieldValues`, `moveFieldValues`, `replaceFieldValue`). `FormFieldBaseCompact` merges `fieldProps`/`labelProps`/`controlProps`/`descriptionProps`/`errorProps` from the form context and injects a11y state (`aria-invalid`, `aria-describedby`) into the control slot; the error enter/leave height-collapse animation is composed in the UI layer. Most benchmark libraries couple the schema validator to a framework-specific rule object; the Standard Schema interface plus the Aria/styled split on top of a mainstream engine are the differentiators.

| Capability                          | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | React Hook Form |
| :---------------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :-------------: |
| Aria/styled split                   |   ✅   |     —      |      —       |    —    |    —     |        —        |
| Standard Schema (Zod/Valibot…)      |   ✅   |     ⚠️     |      —       |   ✅    |    —     |       ✅        |
| Field-level sync/async rules        |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |       ✅        |
| `validateMode`                      |   ✅   |     ⚠️     |      ✅      |    —    |    ✅    |        —        |
| Field array (append/remove/move)    |   ✅   |     ✅     |      —       |   ✅    |    —     |       ✅        |
| Nested path registration            |   ✅   |     ✅     |      —       |    —    |    —     |       ✅        |
| Submitting state (`isSubmitting`)   |   ✅   |     —      |      —       |   ✅    |    —     |       ✅        |
| `aria-invalid` + `aria-describedby` |   ✅   |     —      |      —       |   ✅    |    —     |        —        |
| Per-part slots + `*Props`           |   ✅   |     ⚠️     |      —       |    —    |    —     |        —        |

`⚠️` = partial (Ant Design covers most rules via `rules`/`validateTrigger` but has no Standard Schema; its `required`/`colon`/`labelAlign`/`labelWidth`/`layout` are style-level conveniences that VeanUI keeps out of the core).

### Migration from v0.4x (`useHeadlessForm` → TanStack Form)

v0.50.0 replaces the self-built `useHeadlessForm` engine with `@tanstack/vue-form`. The component surface (`SForm` / `SFormField` / `SFormFieldArray` / `SFormFieldBase`, label/description/error wiring, a11y attributes) is unchanged; the hook surface changed:

| v0.4x                                                                                                      | v0.50.0                                                                                                                                                                                                           |
| :--------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useForm(options, Field, FieldArray)` returning a tuple                                                    | `useForm(options)` returning a context object; styled components come back as `SFormField` / `SFormFieldArray` properties                                                                                         |
| `initialValues`                                                                                            | renamed to `defaultValues` (TanStack-native naming); reset restores them                                                                                                                                          |
| `onSubmit(values, helper)`                                                                                 | `onSubmit(values)` — the `FormSubmitHelper` was removed; TanStack owns the submitting lifecycle                                                                                                                   |
| `initialErrors` / `initialTouched` / `resetForm(nextState)`                                                | removed; use `form.setFieldMeta` / `form.reset()` from the exposed TanStack `FormApi`                                                                                                                             |
| `formState.values` / `errors` / `touched` refs                                                             | the `state` snapshot on the `useForm` return was removed; read reactive state via `form.useSelector(state => …)` / `form.Subscribe` (the raw `form.state` snapshot still lives on the exposed TanStack `FormApi`) |
| `setValues` / `setFieldValue` / `setFieldTouched` / `getFieldValue` / `validateForm` / `validateField`     | TanStack `FormApi` methods on `form`: `setFieldValue`, `getFieldValue`, `validate`, `resetField`, …                                                                                                               |
| `reValidateMode`                                                                                           | removed; with the default `submit` mode errors refresh on every submit — use `validateMode: 'change'` for live re-validation                                                                                      |
| field-level `reset` callback option                                                                        | removed; `handleReset` restores `defaultValues` and field values re-sync through the engine                                                                                                                       |
| `useField(name)` returning `Ref<FormFieldState>`                                                           | `useField(name)` returning a computed of `{ name, value, meta: { dirty, error, touched }, handleChange, onBlur }`                                                                                                 |
| `useFieldArray(name)` returning `{ fields, append, prepend, remove, swap, move, insert, update, replace }` | same shape; `fields` entries are `{ key, name, value }`                                                                                                                                                           |
| Field-array nested paths `social.0.name`                                                                   | TanStack canonical format `social[0].name` (array segments bracketed)                                                                                                                                             |
| `errors` keyed by dotted paths                                                                             | `onInvalid` errors (and `form.state.fieldMeta`) are keyed by the canonical TanStack path (bracketed array segments)                                                                                               |

### Cautions

- `useForm` returns a context object — destructure by name: `const { handleSubmit, SFormField, SFormFieldArray, isSubmitting } = useForm({...})`.
- For reactive form-state reads use `form.useSelector(state => …)`; `form.state` itself is a TanStack Store snapshot without Vue reactivity.
- Validation timing: the `validateMode` timing applies statically; with the default `submit` mode errors appear after a submit attempt and refresh on each submit — set `validateMode: 'change'` for live re-validation. Validation runs through the engine's async slots, so results settle an async tick after the triggering event.
- When the schema reports issues without a field path (e.g. cross-field refinements), `onInvalid` errors expose them under the `_form` key.
- Advanced TanStack `FormOptions` can be passed declaratively via `formOptions` (e.g. `asyncDebounceMs`, `canSubmitWhenInvalid`, `listeners`); the wrapper-owned fields (`defaultValues` / `validators` / `onSubmit` / `onSubmitInvalid`) are excluded and always win.
- Array item errors are stored under bracketed keys (`emails[0]`) and do not bubble to the array root — validate the whole array (e.g. `min(1)`) at the array level, or render per-item errors with nested `SFormField`s using the bracketed path.
- With Zod v4, `z.number()` does not coerce string values — a text input reports `"Invalid input: expected number"`. Use `z.coerce.number()` (or parse the value) when the control is an `<input type="text">`.
- The control slot is value-agnostic: fields forward `model-value` (and `aria-invalid`/`aria-describedby`). Custom controls must accept and emit `modelValue`.
- The form element itself renders only `data-vean-form`/`data-orientation` — validation styles live on the field/control/error parts, so style it with the `SForm` `ui`/`class` props.
- Field-level `validate` merges with the schema in the engine's error map — pass a function (return `undefined` for valid) or a Standard Schema validator; a Ref / ComputedRef source rebinds rules reactively.
- Disabling is control-level: `disabled` on the input blocks interaction but the field still validates on submit unless you also gate the value.

## FAQ

### How do I switch between Zod and Valibot?

You don't — pass the schema directly. Standard Schema validators are accepted as-is: `useForm({ schema: zodSchema })` or `useForm({ schema: valibotSchema })` behave identically.

### How do I validate on input instead of on submit?

Set `validateMode: 'change'` (or `'blur'`). The timing applies statically from the first interaction — the "validate live" pattern; with the default `submit` mode errors appear after submit attempts and refresh on each submit.

### How do I build a dynamic list of fields?

Use `SFormFieldArray`:

```vue
<template #default="{ fields, append, remove, move }">
  <div v-for="(field, index) in fields" :key="index">
    <SFormField :name="`${field.name}[${index}].name`" label="Name">
      <SInput />
    </SFormField>
    <SButtonIcon icon="lucide:minus" @click="remove(index)" />
  </div>
  <SButtonIcon icon="lucide:plus" @click="append({ name: '', url: '' })" />
</template>
```

### How do I show a loading state while submitting?

`isSubmitting` flips to `true` during the async `onSubmit` and back after it resolves — disable the submit button or show a spinner:

```vue
<SButton type="submit" :loading="isSubmitting">Submit</SButton>
```

### Why does my number input report "Invalid input: expected number"?

The input value is a string. With Zod v4 use `z.coerce.number()` (then `.min(...)`), or write a field-level `validate` that parses first.

### How do I reset the form to initial values?

Bind `on-reset` on `SForm` to `handleReset` (returned by `useForm`). Reset restores `defaultValues`, clears errors/touched, and keeps the field values in sync with the controls.
